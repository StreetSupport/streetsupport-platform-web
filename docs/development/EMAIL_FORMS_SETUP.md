# Email Forms Setup Guide

This document describes how to set up the Partnership Application and Organisation Request forms with SendGrid email integration.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Email Addresses
FROM_EMAIL=info@streetsupport.net
PARTNERSHIP_APPLICATION_ADMIN_EMAIL=admin@streetsupport.net  # Admin email for partnership applications
ORGANISATION_REQUEST_ADMIN_EMAIL=admin@streetsupport.net     # Admin email for organisation requests

# SendGrid Template IDs (create templates in SendGrid Dashboard)
SENDGRID_PARTNERSHIP_APPLICATION_TEMPLATE_ID=d-xxxxxxxxxxxxx
SENDGRID_ORGANISATION_REQUEST_TEMPLATE_ID=d-xxxxxxxxxxxxx
```

## SendGrid Template Setup

### 1. Partnership Application Template

1. Go to SendGrid Dashboard → Email API → Dynamic Templates
2. Create a new Dynamic Template
3. Copy the HTML from `/src/templates/partnership-application-email.html`
4. Save and copy the Template ID to `SENDGRID_PARTNERSHIP_APPLICATION_TEMPLATE_ID`

**Template Variables:**
- `{{OrganisationName}}` - Organisation name
- `{{CharityOrCompanyNumber}}` - Charity/Company number
- `{{Website}}` - Organisation website
- `{{LocationsOfOperation}}` - Comma-separated locations
- `{{ShortDescription}}` - Description of their work
- `{{WhyInterested}}` - Why they want to join
- `{{ContactFullName}}` - Contact name
- `{{ContactJobTitle}}` - Contact job title
- `{{ContactEmail}}` - Contact email
- `{{ContactPhone}}` - Contact phone
- `{{SubmittedAt}}` - Submission timestamp
- `{{is_admin_copy}}` - Boolean for admin vs applicant email

### 2. Organisation Request Template

1. Create another Dynamic Template
2. Copy the HTML from `/src/templates/organisation-request-email.html`
3. Save and copy the Template ID to `SENDGRID_ORGANISATION_REQUEST_TEMPLATE_ID`

**Template Variables:**
- `{{OrganisationName}}` - Organisation name
- `{{Description}}` - Organisation description
- `{{OrganisationEmail}}` - Organisation email
- `{{OrganisationPhone}}` - Organisation phone
- `{{Website}}` - Organisation website
- `{{LocationsServed}}` - Comma-separated locations
- `{{ContactFullName}}` - Contact name
- `{{ContactEmail}}` - Contact email
- `{{ServicesHtml}}` - HTML formatted services list including category name, subcategory name, availability (either "Open 24/7" or detailed opening times), address and per-service contact details. Use `{{{ServicesHtml}}}` for raw HTML.
- `{{SubmittedAt}}` - Submission timestamp
- `{{is_admin_copy}}` - Boolean for admin vs requester email

**Availability & opening times behaviour (IsOpen247):**
- Each service in the Organisation Request form has an `Open 24/7` toggle (`IsOpen247`).
- If `IsOpen247` is **true** for a service:
  - The form hides the opening times inputs for that service.
  - The email shows **"Open 24/7"** in the Availability row and does **not** list individual opening times.
- If `IsOpen247` is **false** for a service:
  - At least one opening time (day + start/end) is required and validated.
  - The email shows a line per opening time (e.g. `Monday: 09:00 - 17:00`).

## Form Pages

- **Partnership Application**: `/partnership-application-form`
- **Organisation Request**: `/organisation-request-form`

## File Structure

```
streetsupport-platform-web/src/
├── app/
│   ├── api/
│   │   ├── partnership-application/
│   │   │   └── route.ts          # API endpoint for partnership applications
│   │   └── organisation-request/
│   │       └── route.ts          # API endpoint for organisation requests
│   ├── partnership-application-form/
│   │   └── page.tsx              # Partnership application form page
│   └── organisation-request-form/
│       └── page.tsx              # Organisation request form page
├── schemas/
│   ├── partnershipApplicationSchema.ts   # Zod validation schema
│   └── organisationRequestSchema.ts      # Zod validation schema
├── templates/
│   ├── partnership-application-email.html # Email template (copy to SendGrid)
│   └── organisation-request-email.html    # Email template (copy to SendGrid)
├── types/
│   ├── partnershipApplication.ts  # TypeScript interfaces
│   └── organisationRequest.ts     # TypeScript interfaces
└── utils/
    └── emailService.ts            # Reusable SendGrid email utility
```

## Installation

Run the following command to install new dependencies:

```bash
cd streetsupport-platform-web
npm install
```

New packages added:
- `zod` - Form validation
- `@sendgrid/mail` - SendGrid email sending

## Testing

1. Ensure all environment variables are set
2. Start the development server: `npm run dev`
3. Visit `/partnership-application-form` to test the partnership form
4. Visit `/organisation-request-form` to test the organisation request form
5. Submit forms and check:
   - Admin email receives notification
   - Applicant/requester receives confirmation copy

## Email Flow

1. User fills out form on the website
2. Client-side Zod validation runs on submit
3. Form data is sent to API route
4. Server-side Zod validation runs
5. Email data is prepared
6. Single email is sent via SendGrid with CC functionality:
   - **Partnership Application**: 
     - Sent to `PARTNERSHIP_APPLICATION_ADMIN_EMAIL`
     - CC to applicant's `ContactEmail` (if provided) for their records
   - **Organisation Request**:
     - Sent to `ORGANISATION_REQUEST_ADMIN_EMAIL`
     - CC to requester's `ContactEmail` (if provided) for their records
7. Success response returned to client

## Customization

### Changing Admin Emails
- Update `PARTNERSHIP_APPLICATION_ADMIN_EMAIL` to change where partnership applications are sent
- Update `ORGANISATION_REQUEST_ADMIN_EMAIL` to change where organisation requests are sent
- These can be the same email address or different addresses for different teams

### Adding New Form Types
1. Create interface in `/types/`
2. Create Zod schema in `/schemas/`
3. Create email template in `/templates/`
4. Create form page in `/app/`
5. Create API route in `/app/api/`
6. Add email sending function to `/utils/emailService.ts`
