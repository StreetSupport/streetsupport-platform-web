import { z } from 'zod';

/**
 * Opening time schema
 */
const OpeningTimeSchema = z.object({
  Day: z.string().min(1, 'Day is required'),
  StartTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
  EndTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
});

/**
 * Opening time schema that allows empty values (for when IsOpen247 is true)
 */
const OpeningTimeSchemaOptional = z.object({
  Day: z.string(),
  StartTime: z.string(),
  EndTime: z.string(),
});

/**
 * Service listing schema
 */
const ServiceListingSchema = z.object({
  ServiceTitle: z
    .string()
    .min(1, 'Service title is required')
    .max(200, 'Service title must be less than 200 characters'),

  ServiceDescription: z
    .string()
    .min(10, 'Service description is required (minimum 10 characters)')
    .max(2000, 'Service description must be less than 2000 characters'),

  ServiceCategory: z.string().min(1, 'Service category is required'),

  ServiceSubcategory: z.string().min(1, 'Service subcategory is required'),

  Address: z
    .string()
    .min(5, 'Address is required (minimum 5 characters)')
    .max(500, 'Address must be less than 500 characters'),

  IsOpen247: z.boolean(),

  OpeningTimes: z.array(OpeningTimeSchemaOptional),

  ContactEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  ContactPhone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
}).superRefine((data, ctx) => {
  // If IsOpen247 is false, validate opening times
  if (!data.IsOpen247) {
    // Check if there's at least one opening time
    if (data.OpeningTimes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one opening time is required when not open 24/7',
        path: ['OpeningTimes'],
      });
      return;
    }

    // Validate each opening time
    data.OpeningTimes.forEach((time, index) => {
      if (!time.Day || time.Day.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Day is required',
          path: ['OpeningTimes', index, 'Day'],
        });
      }
      if (!time.StartTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time.StartTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time must be in HH:MM format',
          path: ['OpeningTimes', index, 'StartTime'],
        });
      }
      if (!time.EndTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time.EndTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time must be in HH:MM format',
          path: ['OpeningTimes', index, 'EndTime'],
        });
      }
    });
  }
});

/**
 * Zod validation schema for Organisation Request Form
 */
export const OrganisationRequestSchema = z.object({
  // Organisation Details
  OrganisationName: z
    .string()
    .min(1, 'Organisation name is required')
    .max(200, 'Organisation name must be less than 200 characters'),

  Description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  OrganisationEmail: z
    .string()
    .min(1, 'Organisation email is required')
    .email('Please enter a valid email address'),

  OrganisationPhone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),

  Website: z
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .optional()
    .or(z.literal('')),

  LocationsServed: z
    .array(z.string())
    .min(1, 'At least one location is required'),

  // Contact Person
  ContactFullName: z
    .string()
    .min(1, 'Contact name is required')
    .max(100, 'Name must be less than 100 characters'),

  ContactEmail: z
    .string()
    .min(1, 'Contact email is required')
    .email('Please enter a valid email address'),

  // Service Listings
  Services: z
    .array(ServiceListingSchema)
    .min(1, 'At least one service is required'),

  // Agreement
  ConfirmsAccuracy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must confirm the information is accurate',
    }),
});

export type OrganisationRequestFormData = z.infer<typeof OrganisationRequestSchema>;
export type ServiceListingFormData = z.infer<typeof ServiceListingSchema>;
export type OpeningTimeFormData = z.infer<typeof OpeningTimeSchema>;

/**
 * Validate organisation request data
 */
export function validateOrganisationRequest(data: unknown): {
  success: boolean;
  data?: OrganisationRequestFormData;
  errors?: z.ZodError;
} {
  const result = OrganisationRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
