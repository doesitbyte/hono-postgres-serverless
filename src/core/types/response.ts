import { z } from "@hono/zod-openapi";

export const responseMeta = z.object({
  timestamp: z.iso.datetime(),
});

export const paginationMeta = z.object({
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

export const paginatedResponseMeta = responseMeta.extend({
  pagination: paginationMeta,
});

export const apiError = z.object({
  code: z.string(),
  message: z.string(),
});

export const successEnvelope = <Schema extends z.ZodType>(data: Schema) =>
  z.object({
    success: z.literal(true),
    data,
    error: z.null(),
    meta: responseMeta,
  });

export const errorEnvelope = <Schema extends z.ZodType>(error: Schema) =>
  z.object({
    success: z.literal(false),
    data: z.null(),
    error,
    meta: responseMeta,
  });

export const paginatedSuccessEnvelope = <Schema extends z.ZodType>(
  data: Schema
) =>
  z.object({
    success: z.literal(true),
    data,
    error: z.null(),
    meta: paginatedResponseMeta,
  });

export type ResponseMeta = z.infer<typeof responseMeta>;
export type PaginationMeta = z.infer<typeof paginationMeta>;
export type PaginatedResponseMeta = z.infer<typeof paginatedResponseMeta>;
export type ApiError = z.infer<typeof apiError>;

export type PaginatedSuccessEnvelope<Data> = {
  success: true;
  data: Data;
  error: null;
  meta: PaginatedResponseMeta;
};

export type SuccessEnvelope<Data> = {
  success: true;
  data: Data;
  error: null;
  meta: ResponseMeta;
};

export type ErrorEnvelope<Error extends ApiError = ApiError> = {
  success: false;
  data: null;
  error: Error;
  meta: ResponseMeta;
};

export type ApiEnvelope<Data, Error extends ApiError = ApiError> =
  | SuccessEnvelope<Data>
  | ErrorEnvelope<Error>;

const createResponseMeta = (): ResponseMeta => ({
  timestamp: new Date().toISOString(),
});

export const createSuccessEnvelope = <Data>(
  data: Data
): SuccessEnvelope<Data> => ({
  success: true,
  data,
  error: null,
  meta: createResponseMeta(),
});

export const createErrorEnvelope = <Error extends ApiError>(
  error: Error
): ErrorEnvelope<Error> => ({
  success: false,
  data: null,
  error,
  meta: createResponseMeta(),
});

export const createPaginatedSuccessEnvelope = <Data>(
  data: Data,
  pagination: PaginationMeta
): PaginatedSuccessEnvelope<Data> => ({
  success: true,
  data,
  error: null,
  meta: { ...createResponseMeta(), pagination },
});
