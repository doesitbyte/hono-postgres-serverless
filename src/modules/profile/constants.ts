import type { activityLevelValues, goalValues } from "./types";

export const ACTIVITY_MULTIPLIERS: Record<
  (typeof activityLevelValues)[number],
  number
> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const GOAL_CALORIE_ADJUSTMENTS: Record<
  (typeof goalValues)[number],
  number
> = {
  fat_loss: -500,
  maintain: 0,
  build_muscle: 300,
};

export const PROTEIN_PER_KG: Record<(typeof goalValues)[number], number> = {
  fat_loss: 2.0,
  maintain: 1.6,
  build_muscle: 1.9,
};

export const FAT_PER_KG: Record<(typeof goalValues)[number], number> = {
  fat_loss: 0.8,
  maintain: 0.9,
  build_muscle: 1.0,
};
