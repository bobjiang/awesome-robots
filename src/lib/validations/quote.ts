import { z } from "zod";

/**
 * Quote form validation schema (T3 pattern)
 * Validates all form inputs before submission to FormBold
 */
export const quoteFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  product: z.string().min(1, "Product is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").optional(),
});

/**
 * Infer TypeScript type from Zod schema
 */
export type QuoteFormData = z.infer<typeof quoteFormSchema>;

/**
 * Validate quote form data
 * Returns an object with field-specific error messages
 */
export function validateQuoteForm(data: unknown): {
  success: boolean;
  errors?: Record<string, string>;
  data?: QuoteFormData;
} {
  const result = quoteFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      errors[issue.path[0] as string] = issue.message;
    }
  });

  return { success: false, errors };
}
