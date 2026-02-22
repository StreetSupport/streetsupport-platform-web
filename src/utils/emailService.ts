import sgMail from '@sendgrid/mail';
import { env } from '@/config/env';

// Initialise SendGrid lazily on first use
let sgInitialised = false;
function ensureSgInit() {
  if (sgInitialised) return;
  const key = env.sendgrid.apiKey();
  if (key) {
    sgMail.setApiKey(key);
    sgInitialised = true;
  }
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
    if (!env.sendgrid.apiKey()) {
      console.error('SendGrid API key not configured');
      return {
        success: false,
        message: 'Email service not configured',
        error: 'SENDGRID_API_KEY not set',
      };
    }

    ensureSgInit();

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
      from: env.sendgrid.fromEmail(),
      templateId: templateId,
      dynamicTemplateData: dynamicTemplateData,
    };

    // Add CC if provided
    if (ccEmail) {
      msg.cc = ccEmail;
    }

    await sgMail.send(msg);
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
    env.sendgrid.partnershipTemplateId(),
    env.email.partnershipAdmin(),
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
    env.sendgrid.organisationRequestTemplateId(),
    env.email.organisationRequestAdmin(),
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
  return env.email.partnershipAdmin();
}

export function getOrganisationRequestAdminEmail(): string {
  return env.email.organisationRequestAdmin();
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return Boolean(env.sendgrid.apiKey());
}
