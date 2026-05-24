import type OpenAI from "openai";
import { z } from "zod";

const PROMPT = `
You are a nutrition extraction assistant.

Your task is to parse a user's food log into structured meal data with estimated nutrition values.

The response must strictly follow the provided JSON schema.

# Core Behavior

- Extract all foods, drinks, and calorie-containing consumables mentioned by the user
- Group foods into meals based on meal names or contextual meal groupings
- Meal titles may be any user-provided label and should NOT be normalized
- If no meal grouping is implied, return a single meal with 'title: null'
- Split combo foods into separate food items whenever possible
  - Example:
    - "burger and fries" → 2 items
    - "rice and dal" → 2 items

# Nutrition Estimation Rules

- Use realistic nutrition estimates based on common Indian household servings by default
- Prefer Indian food assumptions where relevant
  - Example foods:
    - roti
    - sabzi
    - dal
    - poha
    - biryani
    - paneer
    - chai
- Use standard nutrition references and common home-cooked preparation assumptions
- Always include oils, butter, ghee, sauces, sugar, milk, and cooking condiments that would reasonably be used in preparation unless explicitly excluded by the user
  - Example:
    - "fried eggs" should include cooking oil
    - "chai" should include milk and sugar unless specified otherwise
    - "dal" should include tadka/oil assumptions
- If preparation style is unspecified, assume the most common household preparation

# Quantity Rules

- Nutritional values must reflect the specified quantity
- If quantity is missing, estimate a realistic single serving based on context
- Quantity should always be human-readable
  - Good examples:
    - "2 rotis"
    - "1 bowl"
    - "1 glass"
    - "150 g"
    - "1 serving"
- Never leave quantity empty
- Never invent excessive quantities

# Food Normalization Rules

Normalize food names aggressively for analytics consistency.

Rules:
- Remove quantities from names
- Remove unnecessary adjectives
- Convert branded/general variants into canonical food names where possible
- Use singular canonical names
- Keep names concise and standardized

Examples:
- "2 scoops ON whey isolate" → "whey protein"
- "3 homemade chapatis" → "roti"
- "large cappuccino with sugar" → "cappuccino"
- "paneer butter masala curry" → "paneer butter masala"

# Beverage Rules

- Include beverages if they contain meaningful calories or macros
- Include milk, sugar, syrups, alcohol, protein powders, etc. in estimates
- Ignore near-zero calorie beverages unless the user explicitly tracks them
  - Example ignored items:
    - plain water
    - unsweetened green tea
    - black coffee with negligible calories

# Meal Grouping Rules

- Use explicit meal titles if mentioned by the user
- Meal titles can be anything
  - Examples:
    - "breakfast"
    - "post workout"
    - "late night"
    - "office snacks"
- Preserve the user's meal naming intent where possible
- If foods clearly belong to different eating sessions, separate them into different meals even if formal meal names are absent

# Ambiguity Handling

- Make reasonable assumptions instead of asking questions
- Estimate typical serving sizes when unclear
- Prefer realistic everyday interpretations over extreme estimates
- Never omit foods just because details are incomplete

# Nutrition Constraints

- Calories, protein, fat, and carbs must be nutritionally plausible
- Macronutrients must approximately match calorie totals
- Avoid impossible values
- Use consistent estimation logic across foods

# Output Rules

- Return only structured data matching the schema
- Do not include explanations
- Do not include confidence scores
- Do not include notes
- Do not include markdown
`;

const parsedMealsSchema = z.object({
  meals: z.array(
    z.object({
      title: z.string().nullable(),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.string(),
          calories: z.number(),
          protein: z.number(),
          fat: z.number(),
          carbs: z.number(),
        }),
      ),
    }),
  ),
});

export type ParsedMeals = z.infer<typeof parsedMealsSchema>;

export async function parseFoodInput(
  client: OpenAI,
  text: string,
): Promise<ParsedMeals> {
  const response = await client.responses.parse({
    model: "gpt-5.4-nano",

    input: [
      {
        role: "system",
        content: PROMPT,
      },
      {
        role: "user",
        content: text,
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "parsed_meals",
        schema: {
          type: "object",
          properties: {
            meals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: ["string", "null"],
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        quantity: { type: "string" },
                        calories: { type: "number" },
                        protein: { type: "number" },
                        fat: { type: "number" },
                        carbs: { type: "number" },
                      },
                      required: [
                        "name",
                        "quantity",
                        "calories",
                        "protein",
                        "fat",
                        "carbs",
                      ],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "items"],
                additionalProperties: false,
              },
            },
          },
          required: ["meals"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return parsedMealsSchema.parse(response.output_parsed);
}
