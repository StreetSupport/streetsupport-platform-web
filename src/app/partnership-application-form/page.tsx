'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { PartnershipApplicationSchema, type PartnershipApplicationFormData } from '@/schemas/partnershipApplicationSchema';
import { ZodError } from 'zod';

interface Location {
  id: string;
  name: string;
  slug: string;
}

export default function PartnershipApplicationFormPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<PartnershipApplicationFormData>({
    OrganisationName: '',
    CharityOrCompanyNumber: '',
    Website: '',
    LocationsOfOperation: [],
    ShortDescription: '',
    WhyInterested: '',
    ContactFullName: '',
    ContactJobTitle: '',
    ContactEmail: '',
    ContactPhone: '',
    ConsentToContact: false,
    UnderstandsExpressionOfInterest: false,
  });

  // Fetch locations on mount
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        if (data.status === 'success') {
          // Sort locations by name
          const sortedLocations = [...data.data].sort((a, b) => 
            a.name.localeCompare(b.name)
          );
          setLocations(sortedLocations);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocations();
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle multi-select for locations
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      LocationsOfOperation: selectedOptions,
    }));

    if (validationErrors.LocationsOfOperation) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.LocationsOfOperation;
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setValidationErrors({});

    try {
      // Validate form data
      const validatedData = PartnershipApplicationSchema.parse(formData);

      // Submit to API
      const response = await fetch('/api/partnership-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application');
      }

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        OrganisationName: '',
        CharityOrCompanyNumber: '',
        Website: '',
        LocationsOfOperation: [],
        ShortDescription: '',
        WhyInterested: '',
        ContactFullName: '',
        ContactJobTitle: '',
        ContactEmail: '',
        ContactPhone: '',
        ConsentToContact: false,
        UnderstandsExpressionOfInterest: false,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message
  if (submitSuccess) {
    return (
      <>
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { label: 'Partnership Application', current: true },
          ]}
        />
        <div className="content-container px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-brand-b/10 border border-brand-b rounded-lg p-8">
              <svg
                className="w-16 h-16 text-brand-b mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="heading-2 text-brand-b mb-4">Application submitted</h1>
              <p className="text-body mb-6">
                Thank you for your interest in joining the Street Support Network partnership model.
                We have sent you a confirmation email with a copy of your application.
              </p>
              <p className="text-body mb-6">
                Our Managing Director will review your application and be in touch to discuss next steps.
              </p>
              <Link href="/" className="btn-base btn-primary btn-md">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { label: 'Partnership Application', current: true },
        ]}
      />

      <div className="content-container px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2">Partnership Application</h1>
          <p className="text-lead">
            If you are interested in joining the Street Support Network partnership model, you can use this form to tell us about your organisation.
          </p>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="bg-brand-g/10 border border-brand-g text-brand-g rounded-lg p-4 mb-6">
            <p className="font-medium">Error submitting application</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          {/* Organisation Details Section */}
          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">
              Organisation details
            </h2>

            {/* Organisation Name */}
            <div className="mb-6">
              <label htmlFor="OrganisationName" className="block font-semibold text-brand-k mb-2">
                Organisation Name <span className="text-brand-g">*</span>
              </label>
              <input
                type="text"
                id="OrganisationName"
                name="OrganisationName"
                value={formData.OrganisationName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
                  validationErrors.OrganisationName
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="Enter your organisation name"
              />
              {validationErrors.OrganisationName && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.OrganisationName}</p>
              )}
            </div>

            {/* Charity/Company Number */}
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-brand-q rounded-md hover:border-brand-f focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors"
                placeholder="e.g., 1234567"
              />
            </div>

            {/* Website */}
            <div className="mb-6">
              <label htmlFor="Website" className="block font-semibold text-brand-k mb-2">
                Website
              </label>
              <input
                type="url"
                id="Website"
                name="Website"
                value={formData.Website}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
                  validationErrors.Website
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="https://www.example.org"
              />
              {validationErrors.Website && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.Website}</p>
              )}
            </div>

            {/* Location of Organisation */}
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
                  onChange={handleLocationChange}
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors min-h-[150px] ${
                    validationErrors.LocationsOfOperation
                      ? 'border-brand-g'
                      : 'border-brand-q hover:border-brand-f'
                  }`}
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
              {validationErrors.LocationsOfOperation && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.LocationsOfOperation}</p>
              )}
            </div>

            {/* Short Description */}
            <div className="mb-6">
              <label htmlFor="ShortDescription" className="block font-semibold text-brand-k mb-2">
                Short Description of Your Work <span className="text-brand-g">*</span>
              </label>
              <textarea
                id="ShortDescription"
                name="ShortDescription"
                value={formData.ShortDescription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors resize-y ${
                  validationErrors.ShortDescription
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="Tell us about your organisation and the work you do..."
              />
              {validationErrors.ShortDescription && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.ShortDescription}</p>
              )}
            </div>

            {/* Why Interested */}
            <div className="mb-6">
              <label htmlFor="WhyInterested" className="block font-semibold text-brand-k mb-2">
                Why You&apos;re Interested in Joining the Street Support Network{' '}
                <span className="text-brand-g">*</span>
              </label>
              <textarea
                id="WhyInterested"
                name="WhyInterested"
                value={formData.WhyInterested}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors resize-y ${
                  validationErrors.WhyInterested
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="What interests you about joining our partnership model?"
              />
              {validationErrors.WhyInterested && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.WhyInterested}</p>
              )}
            </div>
          </div>

          {/* Main Contact Section */}
          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Main contact</h2>

            {/* Contact Full Name */}
            <div className="mb-6">
              <label htmlFor="ContactFullName" className="block font-semibold text-brand-k mb-2">
                Full Name <span className="text-brand-g">*</span>
              </label>
              <input
                type="text"
                id="ContactFullName"
                name="ContactFullName"
                value={formData.ContactFullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
                  validationErrors.ContactFullName
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="Your full name"
              />
              {validationErrors.ContactFullName && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.ContactFullName}</p>
              )}
            </div>

            {/* Job Title */}
            <div className="mb-6">
              <label htmlFor="ContactJobTitle" className="block font-semibold text-brand-k mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="ContactJobTitle"
                name="ContactJobTitle"
                value={formData.ContactJobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-brand-q rounded-md hover:border-brand-f focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors"
                placeholder="Your job title"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="ContactEmail" className="block font-semibold text-brand-k mb-2">
                Email Address <span className="text-brand-g">*</span>
              </label>
              <input
                type="email"
                id="ContactEmail"
                name="ContactEmail"
                value={formData.ContactEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
                  validationErrors.ContactEmail
                    ? 'border-brand-g'
                    : 'border-brand-q hover:border-brand-f'
                }`}
                placeholder="your.email@example.org"
              />
              {validationErrors.ContactEmail && (
                <p className="text-brand-g text-sm mt-1">{validationErrors.ContactEmail}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label htmlFor="ContactPhone" className="block font-semibold text-brand-k mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="ContactPhone"
                name="ContactPhone"
                value={formData.ContactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-brand-q rounded-md hover:border-brand-f focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors"
                placeholder="07xxx xxxxxx"
              />
            </div>
          </div>

          {/* Consent Section */}
          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">
              Consent and agreement
            </h2>

            {/* Consent to Contact */}
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="ConsentToContact"
                  checked={formData.ConsentToContact}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 rounded border-2 border-brand-f text-brand-a focus:ring-brand-a cursor-pointer"
                />
                <span className="text-brand-k">
                  I consent to being contacted by Street Support Network regarding this application.{' '}
                  <span className="text-brand-g">*</span>
                </span>
              </label>
              {validationErrors.ConsentToContact && (
                <p className="text-brand-g text-sm mt-1 ml-8">{validationErrors.ConsentToContact}</p>
              )}
            </div>

            {/* Understands Expression of Interest */}
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="UnderstandsExpressionOfInterest"
                  checked={formData.UnderstandsExpressionOfInterest}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 rounded border-2 border-brand-f text-brand-a focus:ring-brand-a cursor-pointer"
                />
                <span className="text-brand-k">
                  I understand that this is an expression of interest and does not guarantee
                  inclusion. <span className="text-brand-g">*</span>
                </span>
              </label>
              {validationErrors.UnderstandsExpressionOfInterest && (
                <p className="text-brand-g text-sm mt-1 ml-8">
                  {validationErrors.UnderstandsExpressionOfInterest}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-brand-q">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-base btn-primary btn-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>
      </div>
    </>
  );
}
