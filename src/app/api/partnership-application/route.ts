import { NextRequest, NextResponse } from 'next/server';
import { PartnershipApplicationSchema } from '@/schemas/partnershipApplicationSchema';
import {
  sendPartnershipApplicationEmails,
  type PartnershipApplicationEmailData,
} from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = PartnershipApplicationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Prepare email data
    const emailData: PartnershipApplicationEmailData = {
      OrganisationName: data.OrganisationName,
      CharityOrCompanyNumber: data.CharityOrCompanyNumber || 'Not provided',
      Website: data.Website || 'Not provided',
      LocationsOfOperation: data.LocationsOfOperation.join(', '),
      ShortDescription: data.ShortDescription,
      WhyInterested: data.WhyInterested,
      ContactFullName: data.ContactFullName,
      ContactJobTitle: data.ContactJobTitle || 'Not provided',
      ContactEmail: data.ContactEmail,
      ContactPhone: data.ContactPhone || 'Not provided',
      SubmittedAt: new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Europe/London',
      }),
    };

    // Send emails
    const emailResult = await sendPartnershipApplicationEmails(emailData);

    if (!emailResult.success) {
      console.error('Failed to send partnership application emails:', emailResult.error);
      // Still return success to user as the application was received
      // Log the error for investigation
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Partnership application submitted successfully',
        applicationId: `PA-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing partnership application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your application. Please try again.',
      },
      { status: 500 }
    );
  }
}
