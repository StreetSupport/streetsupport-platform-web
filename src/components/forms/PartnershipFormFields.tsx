import type { PartnershipApplicationFormData } from '@/schemas/partnershipApplicationSchema';

interface Location {
  id: string;
  name: string;
  slug: string;
}

interface PartnershipFormFieldsProps {
  formData: PartnershipApplicationFormData;
  errors: Record<string, string>;
  locations: Location[];
  isLoading: boolean;
  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const inputClass = (error?: string) =>
  `w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
    error ? 'border-brand-g' : 'border-brand-q hover:border-brand-f'
  }`;

const inputClassPlain =
  'w-full px-4 py-3 border-2 border-brand-q rounded-md hover:border-brand-f focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors';

export default function PartnershipFormFields({
  formData,
  errors,
  locations,
  isLoading,
  isSubmitting,
  onChange,
  onLocationChange,
}: PartnershipFormFieldsProps) {
  return (
    <>
      <div className="mb-8">
        <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Organisation details</h2>

        <div className="mb-6">
          <label htmlFor="OrganisationName" className="block font-semibold text-brand-k mb-2">
            Organisation Name <span className="text-brand-g">*</span>
          </label>
          <input
            type="text"
            id="OrganisationName"
            name="OrganisationName"
            value={formData.OrganisationName}
            onChange={onChange}
            className={inputClass(errors.OrganisationName)}
            placeholder="Enter your organisation name"
          />
          {errors.OrganisationName && (
            <p className="text-brand-g text-sm mt-1">{errors.OrganisationName}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="CharityOrCompanyNumber"
            className="block font-semibold text-brand-k mb-2"
          >
            Registered Charity Number or Company Number
          </label>
          <input
            type="text"
            id="CharityOrCompanyNumber"
            name="CharityOrCompanyNumber"
            value={formData.CharityOrCompanyNumber}
            onChange={onChange}
            className={inputClassPlain}
            placeholder="e.g., 1234567"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="Website" className="block font-semibold text-brand-k mb-2">
            Website
          </label>
          <input
            type="url"
            id="Website"
            name="Website"
            value={formData.Website}
            onChange={onChange}
            className={inputClass(errors.Website)}
            placeholder="https://www.example.org"
          />
          {errors.Website && <p className="text-brand-g text-sm mt-1">{errors.Website}</p>}
        </div>

        <div className="mb-6">
          <label
            htmlFor="LocationsOfOperation"
            className="block font-semibold text-brand-k mb-2"
          >
            Location of Organisation <span className="text-brand-g">*</span>
          </label>
          <p className="text-sm text-brand-f mb-2">
            Hold Ctrl (Cmd on Mac) to select multiple locations
          </p>
          {isLoading ? (
            <div className="w-full px-4 py-3 border-2 border-brand-q rounded-md bg-brand-q">
              Loading locations...
            </div>
          ) : (
            <select
              id="LocationsOfOperation"
              name="LocationsOfOperation"
              multiple
              value={formData.LocationsOfOperation}
              onChange={onLocationChange}
              className={`${inputClass(errors.LocationsOfOperation)} min-h-[150px]`}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          )}
          {errors.LocationsOfOperation && (
            <p className="text-brand-g text-sm mt-1">{errors.LocationsOfOperation}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="ShortDescription" className="block font-semibold text-brand-k mb-2">
            Short Description of Your Work <span className="text-brand-g">*</span>
          </label>
          <textarea
            id="ShortDescription"
            name="ShortDescription"
            value={formData.ShortDescription}
            onChange={onChange}
            rows={4}
            className={`${inputClass(errors.ShortDescription)} resize-y`}
            placeholder="Tell us about your organisation and the work you do..."
          />
          {errors.ShortDescription && (
            <p className="text-brand-g text-sm mt-1">{errors.ShortDescription}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="WhyInterested" className="block font-semibold text-brand-k mb-2">
            Why You&apos;re Interested in Joining the Street Support Network{' '}
            <span className="text-brand-g">*</span>
          </label>
          <textarea
            id="WhyInterested"
            name="WhyInterested"
            value={formData.WhyInterested}
            onChange={onChange}
            rows={4}
            className={`${inputClass(errors.WhyInterested)} resize-y`}
            placeholder="What interests you about joining our partnership model?"
          />
          {errors.WhyInterested && (
            <p className="text-brand-g text-sm mt-1">{errors.WhyInterested}</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Main contact</h2>

        <div className="mb-6">
          <label htmlFor="ContactFullName" className="block font-semibold text-brand-k mb-2">
            Full Name <span className="text-brand-g">*</span>
          </label>
          <input
            type="text"
            id="ContactFullName"
            name="ContactFullName"
            value={formData.ContactFullName}
            onChange={onChange}
            className={inputClass(errors.ContactFullName)}
            placeholder="Your full name"
          />
          {errors.ContactFullName && (
            <p className="text-brand-g text-sm mt-1">{errors.ContactFullName}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="ContactJobTitle" className="block font-semibold text-brand-k mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="ContactJobTitle"
            name="ContactJobTitle"
            value={formData.ContactJobTitle}
            onChange={onChange}
            className={inputClassPlain}
            placeholder="Your job title"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="ContactEmail" className="block font-semibold text-brand-k mb-2">
            Email Address <span className="text-brand-g">*</span>
          </label>
          <input
            type="email"
            id="ContactEmail"
            name="ContactEmail"
            value={formData.ContactEmail}
            onChange={onChange}
            className={inputClass(errors.ContactEmail)}
            placeholder="your.email@example.org"
          />
          {errors.ContactEmail && (
            <p className="text-brand-g text-sm mt-1">{errors.ContactEmail}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="ContactPhone" className="block font-semibold text-brand-k mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="ContactPhone"
            name="ContactPhone"
            value={formData.ContactPhone}
            onChange={onChange}
            className={inputClassPlain}
            placeholder="07xxx xxxxxx"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Consent and agreement</h2>

        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="ConsentToContact"
              checked={formData.ConsentToContact}
              onChange={onChange}
              className="mt-1 w-5 h-5 rounded border-2 border-brand-f text-brand-a focus:ring-brand-a cursor-pointer"
            />
            <span className="text-brand-k">
              I consent to being contacted by Street Support Network regarding this application.{' '}
              <span className="text-brand-g">*</span>
            </span>
          </label>
          {errors.ConsentToContact && (
            <p className="text-brand-g text-sm mt-1 ml-8">{errors.ConsentToContact}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="UnderstandsExpressionOfInterest"
              checked={formData.UnderstandsExpressionOfInterest}
              onChange={onChange}
              className="mt-1 w-5 h-5 rounded border-2 border-brand-f text-brand-a focus:ring-brand-a cursor-pointer"
            />
            <span className="text-brand-k">
              I understand that this is an expression of interest and does not guarantee
              inclusion. <span className="text-brand-g">*</span>
            </span>
          </label>
          {errors.UnderstandsExpressionOfInterest && (
            <p className="text-brand-g text-sm mt-1 ml-8">
              {errors.UnderstandsExpressionOfInterest}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-brand-q">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-base btn-primary btn-lg w-full sm:w-auto disabled:bg-brand-f disabled:text-brand-l disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
        <p className="text-sm text-brand-f mt-4">
          By submitting this form, you will receive a confirmation email with a copy of your
          application. Our Managing Director will review your application and respond directly
          with next steps.
        </p>
      </div>
    </>
  );
}
