'use client';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FormSuccessMessage from '@/components/forms/FormSuccessMessage';
import ServiceFieldSet from '@/components/forms/ServiceFieldSet';
import { useOrganisationForm } from '@/hooks/useOrganisationForm';

const breadcrumbs = [
  { href: '/', label: 'Home' },
  { label: 'Organisation Request', current: true },
];

const inputClass = (err?: string) =>
  `w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${err ? 'border-brand-g' : 'border-brand-q hover:border-brand-f'}`;

export default function OrganisationRequestFormPage() {
  const form = useOrganisationForm();

  if (form.isSuccess) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <FormSuccessMessage
          title="Request submitted"
          message="Thank you for requesting to list your organisation. We have sent you a confirmation email."
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="content-container px-6 py-12">
        <div className="mb-8">
          <h1 className="heading-2">Organisation Request</h1>
          <p className="text-lead">
            If your organisation provides services to people experiencing homelessness and you would
            like to be listed on Street Support, you can use this form to tell us about your
            services.
          </p>
        </div>

        {form.submitError && (
          <div className="bg-brand-g/10 border border-brand-g text-brand-g rounded-lg p-4 mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{form.submitError}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="max-w-3xl">
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {form.announcement}
          </div>

          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Organisation details</h2>

            <div className="mb-6">
              <label htmlFor="organisation-name" className="block font-semibold text-brand-k mb-2">
                Organisation Name <span className="text-brand-g">*</span>
              </label>
              <input
                type="text"
                id="organisation-name"
                name="OrganisationName"
                value={form.formData.OrganisationName}
                onChange={form.handleChange}
                className={inputClass(form.errors.OrganisationName)}
                placeholder="Organisation name"
              />
              {form.errors.OrganisationName && (
                <p className="text-brand-g text-sm mt-1">{form.errors.OrganisationName}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="organisation-description"
                className="block font-semibold text-brand-k mb-2"
              >
                Description
              </label>
              <textarea
                id="organisation-description"
                name="Description"
                value={form.formData.Description}
                onChange={form.handleChange}
                rows={3}
                className={inputClass()}
                placeholder="Brief description..."
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="organisation-email"
                className="block font-semibold text-brand-k mb-2"
              >
                Organisation Email <span className="text-brand-g">*</span>
              </label>
              <input
                type="email"
                id="organisation-email"
                name="OrganisationEmail"
                value={form.formData.OrganisationEmail}
                onChange={form.handleChange}
                className={inputClass(form.errors.OrganisationEmail)}
                placeholder="info@org.org"
              />
              {form.errors.OrganisationEmail && (
                <p className="text-brand-g text-sm mt-1">{form.errors.OrganisationEmail}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="organisation-phone"
                className="block font-semibold text-brand-k mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="organisation-phone"
                name="OrganisationPhone"
                value={form.formData.OrganisationPhone}
                onChange={form.handleChange}
                className={inputClass()}
                placeholder="0xxx xxx xxxx"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="organisation-website"
                className="block font-semibold text-brand-k mb-2"
              >
                Website
              </label>
              <input
                type="url"
                id="organisation-website"
                name="Website"
                value={form.formData.Website}
                onChange={form.handleChange}
                className={inputClass(form.errors.Website)}
                placeholder="https://..."
              />
              {form.errors.Website && (
                <p className="text-brand-g text-sm mt-1">{form.errors.Website}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="locations-served" className="block font-semibold text-brand-k mb-2">
                Locations Served <span className="text-brand-g">*</span>
              </label>
              <p id="locations-served-hint" className="text-sm text-brand-f mb-2">
                Hold Ctrl/Cmd for multiple
              </p>
              {form.isLoading ? (
                <div className="px-4 py-3 border-2 border-brand-q rounded-md bg-brand-q">
                  Loading...
                </div>
              ) : (
                <select
                  id="locations-served"
                  multiple
                  value={form.formData.LocationsServed}
                  onChange={form.handleLocationChange}
                  aria-describedby="locations-served-hint"
                  className={`${inputClass(form.errors.LocationsServed)} min-h-[150px]`}
                >
                  {form.locations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              )}
              {form.errors.LocationsServed && (
                <p className="text-brand-g text-sm mt-1">{form.errors.LocationsServed}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Contact person</h2>

            <div className="mb-6">
              <label htmlFor="contact-full-name" className="block font-semibold text-brand-k mb-2">
                Full Name <span className="text-brand-g">*</span>
              </label>
              <input
                type="text"
                id="contact-full-name"
                name="ContactFullName"
                value={form.formData.ContactFullName}
                onChange={form.handleChange}
                className={inputClass(form.errors.ContactFullName)}
                placeholder="Your name"
              />
              {form.errors.ContactFullName && (
                <p className="text-brand-g text-sm mt-1">{form.errors.ContactFullName}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="contact-email" className="block font-semibold text-brand-k mb-2">
                Email <span className="text-brand-g">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="ContactEmail"
                value={form.formData.ContactEmail}
                onChange={form.handleChange}
                className={inputClass(form.errors.ContactEmail)}
                placeholder="email@org.org"
              />
              {form.errors.ContactEmail && (
                <p className="text-brand-g text-sm mt-1">{form.errors.ContactEmail}</p>
              )}
            </div>
          </div>

          <ServiceFieldSet
            services={form.formData.Services}
            categories={form.categories}
            errors={form.errors}
            serviceRefs={form.serviceRefs}
            openingTimeRefs={form.openingTimeRefs}
            addOpeningTimeRefs={form.addOpeningTimeRefs}
            addServiceButtonRef={form.addServiceButtonRef}
            onServiceChange={form.handleServiceChange}
            onCategoryChange={form.handleCategoryChange}
            onOpeningTimeChange={form.handleOpeningTimeChange}
            onAddOpeningTime={form.addOpeningTime}
            onCloneOpeningTime={form.cloneOpeningTime}
            onRemoveOpeningTime={form.removeOpeningTime}
            onAddService={form.addService}
            onRemoveService={form.removeService}
            getSubcategories={form.getSubcategories}
          />

          <div className="mb-8">
            <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Agreement</h2>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirms-accuracy"
                name="ConfirmsAccuracy"
                checked={form.formData.ConfirmsAccuracy}
                onChange={form.handleChange}
                className="mt-1 w-5 h-5 rounded border-2 border-brand-f"
              />
              <label htmlFor="confirms-accuracy" className="cursor-pointer">
                I confirm the information is accurate and understand the listing will be reviewed.{' '}
                <span className="text-brand-g">*</span>
              </label>
            </div>
            {form.errors.ConfirmsAccuracy && (
              <p className="text-brand-g text-sm mt-1 ml-8">{form.errors.ConfirmsAccuracy}</p>
            )}
          </div>

          <div className="pt-6 border-t border-brand-q">
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="btn-base btn-primary btn-lg w-full sm:w-auto disabled:bg-brand-f disabled:text-brand-l disabled:cursor-not-allowed"
            >
              {form.isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <p className="text-sm text-brand-f mt-4">
              You will receive a confirmation email. Our team will review and be in touch.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
