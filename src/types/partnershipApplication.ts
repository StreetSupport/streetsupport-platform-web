/**
 * Partnership Application Form Interface
 * Used for organisations interested in joining the Street Support Network partnership model
 */

export interface IPartnershipApplication {
  // Organisation Details
  OrganisationName: string;
  CharityOrCompanyNumber?: string;
  Website?: string;
  LocationsOfOperation: string[];
  ShortDescription: string;
  WhyInterested: string;

  // Main Contact
  ContactFullName: string;
  ContactJobTitle?: string;
  ContactEmail: string;
  ContactPhone?: string;

  // Consent
  ConsentToContact: boolean;
  UnderstandsExpressionOfInterest: boolean;

  // Metadata (set server-side)
  SubmittedAt?: Date;
}

/**
 * Partnership Application API Response
 */
export interface IPartnershipApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}
