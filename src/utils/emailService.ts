import sgMail from '@sendgrid/mail';

// Environment configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@streetsupport.net';
const PARTNERSHIP_APPLICATION_ADMIN_EMAIL = process.env.PARTNERSHIP_APPLICATION_ADMIN_EMAIL || 'admin@streetsupport.net';
const ORGANISATION_REQUEST_ADMIN_EMAIL = process.env.ORGANISATION_REQUEST_ADMIN_EMAIL || 'admin@streetsupport.net';

// Template IDs from environment variables
const PARTNERSHIP_APPLICATION_TEMPLATE_ID = process.env.SENDGRID_PARTNERSHIP_APPLICATION_TEMPLATE_ID || '';
const ORGANISATION_REQUEST_TEMPLATE_ID = process.env.SENDGRID_ORGANISATION_REQUEST_TEMPLATE_ID || '';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Email sending result interface
 */
export interface EmailResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Generic email sending function using SendGrid templates
 * @param templateId - SendGrid template ID
 * @param toEmail - Recipient email address
 * @param dynamicTemplateData - Data to populate the template
 * @param subject - Email subject (for fallback/logging)
 * @param ccEmail - Optional CC email address
 */
export async function sendTemplateEmail(
  templateId: string,
  toEmail: string,
  dynamicTemplateData: Record<string, unknown>,
  subject: string,
  ccEmail?: string
): Promise<EmailResult> {
  try {
    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return {
        success: false,
        message: 'Email service not configured',
        error: 'SENDGRID_API_KEY not set',
      };
    }

    if (!templateId) {
      console.error(`SendGrid template ID not configured for: ${subject}`);
      return {
        success: false,
        message: 'Email template not configured',
        error: 'Template ID not set',
      };
    }

    const msg: {
      to: string;
      from: string;
      templateId: string;
      dynamicTemplateData: Record<string, unknown>;
      cc?: string;
    } = {
      to: toEmail,
      from: FROM_EMAIL,
      templateId: templateId,
      dynamicTemplateData: dynamicTemplateData,
    };

    // Add CC if provided
    if (ccEmail) {
      msg.cc = ccEmail;
    }

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${toEmail}${ccEmail ? ` (CC: ${ccEmail})` : ''}: ${subject}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error sending email to ${toEmail}:`, errorMessage);
    return {
      success: false,
      message: 'Failed to send email',
      error: errorMessage,
    };
  }
}


/**
 * Partnership Application Email Data
 */
export interface PartnershipApplicationEmailData {
  OrganisationName: string;
  CharityOrCompanyNumber: string;
  Website: string;
  LocationsOfOperation: string;
  ShortDescription: string;
  WhyInterested: string;
  ContactFullName: string;
  ContactJobTitle: string;
  ContactEmail: string;
  ContactPhone: string;
  SubmittedAt: string;
}

/**
 * Send Partnership Application notification email
 * Sends to admin with optional CC to applicant
 * @param applicationData - The partnership application data
 */
export async function sendPartnershipApplicationEmails(
  applicationData: PartnershipApplicationEmailData
): Promise<EmailResult> {
  return await sendTemplateEmail(
    PARTNERSHIP_APPLICATION_TEMPLATE_ID,
    PARTNERSHIP_APPLICATION_ADMIN_EMAIL,
    {
      ...applicationData,
      is_admin_copy: true,
    },
    'New Partnership Application',
    applicationData.ContactEmail || undefined
  );
}

/**
 * Organisation Request Email Data
 */
export interface OrganisationRequestEmailData {
  OrganisationName: string;
  Description: string;
  OrganisationEmail: string;
  OrganisationPhone: string;
  Website: string;
  LocationsServed: string;
  ContactFullName: string;
  ContactEmail: string;
  ServicesHtml: string;
  SubmittedAt: string;
}

/**
 * Send Organisation Request notification email
 * Sends to admin with optional CC to requester
 * @param requestData - The organisation request data
 */
export async function sendOrganisationRequestEmails(
  requestData: OrganisationRequestEmailData
): Promise<EmailResult> {
  return await sendTemplateEmail(
    ORGANISATION_REQUEST_TEMPLATE_ID,
    ORGANISATION_REQUEST_ADMIN_EMAIL,
    {
      ...requestData,
      is_admin_copy: true,
    },
    'New Organisation Request',
    requestData.ContactEmail || undefined
  );
}

/**
 * Get configured admin emails
 */
export function getPartnershipApplicationAdminEmail(): string {
  return PARTNERSHIP_APPLICATION_ADMIN_EMAIL;
}

export function getOrganisationRequestAdminEmail(): string {
  return ORGANISATION_REQUEST_ADMIN_EMAIL;
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return Boolean(SENDGRID_API_KEY);
}
