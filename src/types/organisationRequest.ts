/**
 * Organisation Request Form Interface
 * Used for new organisations requesting their services be listed on Street Support Network
 */

export interface IOpeningTime {
  Day: string; // e.g., "Monday", "Tuesday", etc.
  StartTime: string; // e.g., "09:00"
  EndTime: string; // e.g., "17:00"
}

export interface IServiceListing {
  ServiceTitle: string;
  ServiceDescription: string;
  ServiceCategory: string;
  ServiceSubcategory: string;
  Address: string;
  IsOpen247: boolean; // Indicates if the service is open 24/7; when true, opening times are optional and the email shows "Open 24/7" instead of individual times
  OpeningTimes: IOpeningTime[];
  ContactEmail?: string;
  ContactPhone?: string;
}

export interface IOrganisationRequest {
  // Organisation Details
  OrganisationName: string;
  Description?: string;
  OrganisationEmail: string;
  OrganisationPhone?: string;
  Website?: string;
  LocationsServed: string[];

  // Contact Person
  ContactFullName: string;
  ContactEmail: string;

  // Service Listings
  Services: IServiceListing[];

  // Agreement
  ConfirmsAccuracy: boolean;

  // Metadata (set server-side)
  SubmittedAt?: Date;
}

/**
 * Organisation Request API Response
 */
export interface IOrganisationRequestResponse {
  success: boolean;
  message: string;
  requestId?: string;
}
