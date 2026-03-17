import { ZodError, type ZodSchema } from "zod";

/**
 * Validate data against a Zod schema.
 * Returns { data } on success or { error } on failure.
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown,
):
  | { data: T; error?: never }
  | { data?: never; error: Record<string, string[]> } {
  try {
    const parsed = schema.parse(data);
    return { data: parsed };
  } catch (err) {
    if (err instanceof ZodError) {
      const details: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const path = issue.path.join(".") || "_root";
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return { error: details };
    }
    throw err;
  }
}
