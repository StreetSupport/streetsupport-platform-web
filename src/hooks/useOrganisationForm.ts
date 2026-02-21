import { useState, useEffect, useRef, useCallback } from 'react';
import {
  OrganisationRequestSchema,
  type OrganisationRequestFormData,
  type ServiceListingFormData,
  type OpeningTimeFormData,
} from '@/schemas/organisationRequestSchema';
import { ZodError } from 'zod';

interface Location {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

const emptyOpeningTime: OpeningTimeFormData = { Day: '', StartTime: '', EndTime: '' };

const emptyService: ServiceListingFormData = {
  ServiceTitle: '',
  ServiceDescription: '',
  ServiceCategory: '',
  ServiceSubcategory: '',
  Address: '',
  IsOpen247: false,
  OpeningTimes: [{ ...emptyOpeningTime }],
  ContactEmail: '',
  ContactPhone: '',
};

const INITIAL_FORM_DATA: OrganisationRequestFormData = {
  OrganisationName: '',
  Description: '',
  OrganisationEmail: '',
  OrganisationPhone: '',
  Website: '',
  LocationsServed: [],
  ContactFullName: '',
  ContactEmail: '',
  Services: [{ ...emptyService }],
  ConfirmsAccuracy: false,
};

export interface UseOrganisationFormReturn {
  formData: OrganisationRequestFormData;
  errors: Record<string, string>;
  locations: Location[];
  categories: Category[];
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: string | null;
  announcement: string;
  serviceRefs: React.RefObject<Map<number, HTMLInputElement>>;
  openingTimeRefs: React.RefObject<Map<string, HTMLSelectElement>>;
  addServiceButtonRef: React.RefObject<HTMLButtonElement | null>;
  addOpeningTimeRefs: React.RefObject<Map<number, HTMLButtonElement>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleServiceChange: (
    idx: number,
    field: keyof ServiceListingFormData,
    value: ServiceListingFormData[keyof ServiceListingFormData]
  ) => void;
  handleCategoryChange: (idx: number, category: string) => void;
  handleOpeningTimeChange: (
    serviceIdx: number,
    timeIdx: number,
    field: keyof OpeningTimeFormData,
    value: string
  ) => void;
  addOpeningTime: (serviceIdx: number) => void;
  cloneOpeningTime: (serviceIdx: number, timeIdx: number) => void;
  removeOpeningTime: (serviceIdx: number, timeIdx: number) => void;
  addService: () => void;
  removeService: (idx: number) => void;
  getSubcategories: (categoryKey: string) => { key: string; name: string }[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useOrganisationForm(): UseOrganisationFormReturn {
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OrganisationRequestFormData>({
    ...INITIAL_FORM_DATA,
    Services: [{ ...emptyService, OpeningTimes: [{ ...emptyOpeningTime }] }],
  });
  const [announcement, setAnnouncement] = useState('');

  const serviceRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  const openingTimeRefs = useRef<Map<string, HTMLSelectElement>>(new Map());
  const addServiceButtonRef = useRef<HTMLButtonElement>(null);
  const addOpeningTimeRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [locRes, catRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/categories'),
        ]);
        const [locData, catData] = await Promise.all([locRes.json(), catRes.json()]);
        if (locData.status === 'success') {
          const sortedLocations = [...locData.data].sort((a: Location, b: Location) =>
            a.name.localeCompare(b.name)
          );
          setLocations(sortedLocations);
        }
        if (catData.status === 'success') {
          const sortedCategories = [...catData.data]
            .sort((a: Category, b: Category) => a.name.localeCompare(b.name))
            .map((cat: Category) => ({
              ...cat,
              subCategories: [...cat.subCategories].sort((a, b) => a.name.localeCompare(b.name)),
            }));
          setCategories(sortedCategories);
        }
      } catch (e) {
        console.error('Error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
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
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    clearError(name);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, LocationsServed: selected }));
    clearError('LocationsServed');
  };

  const handleServiceChange = (
    idx: number,
    field: keyof ServiceListingFormData,
    value: ServiceListingFormData[keyof ServiceListingFormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
    clearError(`Services.${idx}.${field}`);
  };

  const handleCategoryChange = (idx: number, cat: string) => {
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, i) =>
        i === idx ? { ...s, ServiceCategory: cat, ServiceSubcategory: '' } : s
      ),
    }));
  };

  const handleOpeningTimeChange = (
    sIdx: number,
    tIdx: number,
    field: keyof OpeningTimeFormData,
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, si) =>
        si === sIdx
          ? {
              ...s,
              OpeningTimes: s.OpeningTimes.map((t, ti) =>
                ti === tIdx ? { ...t, [field]: val } : t
              ),
            }
          : s
      ),
    }));
  };

  const addOpeningTime = (idx: number) => {
    const newTimeIdx = formData.Services[idx].OpeningTimes.length;
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, i) =>
        i === idx ? { ...s, OpeningTimes: [...s.OpeningTimes, { ...emptyOpeningTime }] } : s
      ),
    }));
    announce(`Opening time ${newTimeIdx + 1} added`);
    setTimeout(() => {
      openingTimeRefs.current.get(`${idx}-${newTimeIdx}`)?.focus();
    }, 0);
  };

  const cloneOpeningTime = (sIdx: number, tIdx: number) => {
    const newTimeIdx = formData.Services[sIdx].OpeningTimes.length;
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, si) =>
        si === sIdx
          ? { ...s, OpeningTimes: [...s.OpeningTimes, { ...s.OpeningTimes[tIdx] }] }
          : s
      ),
    }));
    announce(`Opening time ${tIdx + 1} copied`);
    setTimeout(() => {
      openingTimeRefs.current.get(`${sIdx}-${newTimeIdx}`)?.focus();
    }, 0);
  };

  const removeOpeningTime = (sIdx: number, tIdx: number) => {
    const remainingCount = formData.Services[sIdx].OpeningTimes.length - 1;
    setFormData((prev) => ({
      ...prev,
      Services: prev.Services.map((s, si) =>
        si === sIdx
          ? { ...s, OpeningTimes: s.OpeningTimes.filter((_, ti) => ti !== tIdx) }
          : s
      ),
    }));
    announce(`Opening time ${tIdx + 1} removed`);
    setTimeout(() => {
      if (tIdx > 0) {
        openingTimeRefs.current.get(`${sIdx}-${tIdx - 1}`)?.focus();
      } else if (remainingCount > 0) {
        openingTimeRefs.current.get(`${sIdx}-0`)?.focus();
      } else {
        addOpeningTimeRefs.current.get(sIdx)?.focus();
      }
    }, 0);
  };

  const addService = () => {
    const newServiceIdx = formData.Services.length;
    setFormData((prev) => ({
      ...prev,
      Services: [
        ...prev.Services,
        { ...emptyService, OpeningTimes: [{ ...emptyOpeningTime }] },
      ],
    }));
    announce(`Service ${newServiceIdx + 1} added`);
    setTimeout(() => {
      serviceRefs.current.get(newServiceIdx)?.focus();
    }, 0);
  };

  const removeService = (idx: number) => {
    if (formData.Services.length > 1) {
      setFormData((prev) => ({
        ...prev,
        Services: prev.Services.filter((_, i) => i !== idx),
      }));
      announce(`Service ${idx + 1} removed`);
      setTimeout(() => {
        if (idx > 0) {
          serviceRefs.current.get(idx - 1)?.focus();
        } else {
          serviceRefs.current.get(0)?.focus();
        }
      }, 0);
    }
  };

  const getSubcategories = (key: string) =>
    categories.find((c) => c.key === key)?.subCategories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    try {
      const validated = OrganisationRequestSchema.parse(formData);
      const res = await fetch('/api/organisation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to submit');
      setIsSuccess(true);
      setFormData({
        ...INITIAL_FORM_DATA,
        Services: [{ ...emptyService, OpeningTimes: [{ ...emptyOpeningTime }] }],
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path.join('.')] = e.message;
        });
        setErrors(fieldErrors);
      } else if (err instanceof Error) {
        setSubmitError(err.message);
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
    categories,
    isLoading,
    isSubmitting,
    isSuccess,
    submitError,
    announcement,
    serviceRefs,
    openingTimeRefs,
    addServiceButtonRef,
    addOpeningTimeRefs,
    handleChange,
    handleLocationChange,
    handleServiceChange,
    handleCategoryChange,
    handleOpeningTimeChange,
    addOpeningTime,
    cloneOpeningTime,
    removeOpeningTime,
    addService,
    removeService,
    getSubcategories,
    handleSubmit,
  };
}
