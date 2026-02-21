import { useState, useEffect } from 'react';
import {
  PartnershipApplicationSchema,
  type PartnershipApplicationFormData,
} from '@/schemas/partnershipApplicationSchema';
import { ZodError } from 'zod';

interface Location {
  id: string;
  name: string;
  slug: string;
}

const INITIAL_FORM_DATA: PartnershipApplicationFormData = {
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
};

export interface UsePartnershipFormReturn {
  formData: PartnershipApplicationFormData;
  errors: Record<string, string>;
  locations: Location[];
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePartnershipForm(): UsePartnershipFormReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PartnershipApplicationFormData>({
    ...INITIAL_FORM_DATA,
  });

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        if (data.status === 'success') {
          const sortedLocations = [...data.data].sort(
            (a: Location, b: Location) => a.name.localeCompare(b.name)
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

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    clearError(name);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      LocationsOfOperation: selectedOptions,
    }));
    clearError('LocationsOfOperation');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    try {
      const validatedData = PartnershipApplicationSchema.parse(formData);
      const response = await fetch('/api/partnership-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application');
      }
      setIsSuccess(true);
      setFormData({ ...INITIAL_FORM_DATA });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    locations,
    isLoading,
    isSubmitting,
    isSuccess,
    submitError,
    handleChange,
    handleLocationChange,
    handleSubmit,
  };
}
