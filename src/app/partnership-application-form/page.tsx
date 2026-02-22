'use client';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FormSuccessMessage from '@/components/forms/FormSuccessMessage';
import PartnershipFormFields from '@/components/forms/PartnershipFormFields';
import { usePartnershipForm } from '@/hooks/usePartnershipForm';

const breadcrumbs = [
  { href: '/', label: 'Home' },
  { label: 'Partnership Application', current: true },
];

export default function PartnershipApplicationFormPage() {
  const form = usePartnershipForm();

  if (form.isSuccess) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <FormSuccessMessage
          title="Application submitted"
          message="Thank you for your interest in joining the Street Support Network partnership model. We have sent you a confirmation email with a copy of your application."
          secondaryMessage="Our Managing Director will review your application and be in touch to discuss next steps."
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="content-container px-6 py-12">
        <div className="mb-8">
          <h1 className="heading-2">Partnership Application</h1>
          <p className="text-lead">
            If you are interested in joining the Street Support Network partnership model, you can
            use this form to tell us about your organisation.
          </p>
        </div>

        {form.submitError && (
          <div className="bg-brand-g/10 border border-brand-g text-brand-g rounded-lg p-4 mb-6">
            <p className="font-medium">Error submitting application</p>
            <p className="text-sm">{form.submitError}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="max-w-2xl">
          <PartnershipFormFields
            formData={form.formData}
            errors={form.errors}
            locations={form.locations}
            isLoading={form.isLoading}
            isSubmitting={form.isSubmitting}
            onChange={form.handleChange}
            onLocationChange={form.handleLocationChange}
          />
        </form>
      </div>
    </>
  );
}
