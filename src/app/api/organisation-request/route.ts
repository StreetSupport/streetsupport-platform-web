import { NextRequest, NextResponse } from 'next/server';
import { OrganisationRequestSchema } from '@/schemas/organisationRequestSchema';
import {
  sendOrganisationRequestEmails,
  type OrganisationRequestEmailData,
} from '@/utils/emailService';
import { getCategories } from '@/app/api/categories/helper';

interface CategoryLookup {
  [key: string]: {
    name: string;
    subCategories: { [key: string]: string };
  };
}

/**
 * Build a lookup map from category/subcategory keys to names
 */
async function buildCategoryLookup(): Promise<CategoryLookup> {
  const categories = await getCategories();
  const lookup: CategoryLookup = {};
  
  for (const cat of categories) {
    lookup[cat.key] = {
      name: cat.name,
      subCategories: {},
    };
    for (const sub of cat.subCategories) {
      lookup[cat.key].subCategories[sub.key] = sub.name;
    }
  }
  
  return lookup;
}

/**
 * Format services into HTML for email
 */
function formatServicesHtml(
  services: Array<{
    ServiceTitle: string;
    ServiceDescription: string;
    ServiceCategory: string;
    ServiceSubcategory: string;
    Address: string;
    IsOpen247: boolean;
    OpeningTimes: Array<{ Day: string; StartTime: string; EndTime: string }>;
    ContactEmail?: string;
    ContactPhone?: string;
  }>,
  categoryLookup: CategoryLookup
): string {
  return services
    .map((service, index) => {
      // Get category and subcategory names from lookup
      const categoryName = categoryLookup[service.ServiceCategory]?.name || service.ServiceCategory;
      const subcategoryName = categoryLookup[service.ServiceCategory]?.subCategories[service.ServiceSubcategory] || service.ServiceSubcategory;

      // Format opening times or show "Open 24/7"
      const openingTimesHtml = service.IsOpen247
        ? '<span style="color: #38ae8e; font-weight: 600;">Open 24/7</span>'
        : service.OpeningTimes.map((t) => `${t.Day}: ${t.StartTime} - ${t.EndTime}`).join('<br>');

      return `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #38ae8e;">
        <h4 style="margin: 0 0 10px 0; color: #48484a; font-size: 16px;">
          ${index + 1}. ${service.ServiceTitle}
        </h4>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #29272a;">
          ${service.ServiceDescription}
        </p>
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0; color: #8d8d8d; width: 35%;">Category:</td>
            <td style="padding: 4px 0; color: #29272a;">${categoryName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #8d8d8d;">Subcategory:</td>
            <td style="padding: 4px 0; color: #29272a;">${subcategoryName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #8d8d8d;">Address:</td>
            <td style="padding: 4px 0; color: #29272a;">${service.Address}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #8d8d8d; vertical-align: top;">Availability:</td>
            <td style="padding: 4px 0; color: #29272a;">
              ${openingTimesHtml}
            </td>
          </tr>
          ${
            service.ContactEmail
              ? `<tr><td style="padding: 4px 0; color: #8d8d8d;">Contact Email:</td><td style="padding: 4px 0; color: #29272a;"><a href="mailto:${service.ContactEmail}" style="color: #38ae8e;">${service.ContactEmail}</a></td></tr>`
              : ''
          }
          ${
            service.ContactPhone
              ? `<tr><td style="padding: 4px 0; color: #8d8d8d;">Contact Phone:</td><td style="padding: 4px 0; color: #29272a;">${service.ContactPhone}</td></tr>`
              : ''
          }
        </table>
      </div>
    `;
    })
    .join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = OrganisationRequestSchema.safeParse(body);

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

    // Build category lookup for name resolution
    const categoryLookup = await buildCategoryLookup();

    // Prepare email data
    const emailData: OrganisationRequestEmailData = {
      OrganisationName: data.OrganisationName,
      Description: data.Description || 'Not provided',
      OrganisationEmail: data.OrganisationEmail,
      OrganisationPhone: data.OrganisationPhone || 'Not provided',
      Website: data.Website || 'Not provided',
      LocationsServed: data.LocationsServed.join(', '),
      ContactFullName: data.ContactFullName,
      ContactEmail: data.ContactEmail,
      ServicesHtml: formatServicesHtml(data.Services, categoryLookup),
      SubmittedAt: new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Europe/London',
      }),
    };

    // Send emails
    const emailResult = await sendOrganisationRequestEmails(emailData);

    if (!emailResult.success) {
      console.error('Failed to send organisation request emails:', emailResult.error);
      // Still return success to user as the request was received
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Organisation request submitted successfully',
        requestId: `OR-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing organisation request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}
