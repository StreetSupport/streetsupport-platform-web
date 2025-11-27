import { z } from 'zod';

/**
 * Zod validation schema for Partnership Application Form
 */
export const PartnershipApplicationSchema = z.object({
  // Organisation Details
  OrganisationName: z
    .string()
    .min(1, 'Organisation name is required')
    .max(50, 'Organisation name must be less than 50 characters'),

  CharityOrCompanyNumber: z
    .string()
    .max(50, 'Charity/Company number must be less than 50 characters')
    .optional()
    .or(z.literal('')),

  Website: z
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .optional()
    .or(z.literal('')),

  LocationsOfOperation: z
    .array(z.string())
    .min(1, 'At least one location is required'),

  ShortDescription: z
    .string()
    .min(10, 'Please provide a brief description of your work (minimum 10 characters)')
    .max(2000, 'Description must be less than 2000 characters'),

  WhyInterested: z
    .string()
    .min(10, 'Please explain why you are interested (minimum 10 characters)')
    .max(2000, 'Response must be less than 2000 characters'),

  // Main Contact
  ContactFullName: z
    .string()
    .min(1, 'Contact name is required')
    .max(100, 'Name must be less than 100 characters'),

  ContactJobTitle: z
    .string()
    .max(100, 'Job title must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  ContactEmail: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),

  ContactPhone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),

  // Consent
  ConsentToContact: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must consent to being contacted to submit this application',
    }),

  UnderstandsExpressionOfInterest: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must acknowledge this is an expression of interest',
    }),
});

export type PartnershipApplicationFormData = z.infer<typeof PartnershipApplicationSchema>;

/**
 * Validate partnership application data
 */
export function validatePartnershipApplication(data: unknown): {
  success: boolean;
  data?: PartnershipApplicationFormData;
  errors?: z.ZodError;
} {
  const result = PartnershipApplicationSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
