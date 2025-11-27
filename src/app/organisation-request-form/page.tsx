'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import {
  OrganisationRequestSchema,
  type OrganisationRequestFormData,
  type ServiceListingFormData,
  type OpeningTimeFormData,
} from '@/schemas/organisationRequestSchema';
import { ZodError } from 'zod';

interface Location { id: string; name: string; slug: string; }
interface Category { key: string; name: string; subCategories: { key: string; name: string }[]; }

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const emptyOpeningTime: OpeningTimeFormData = { Day: '', StartTime: '', EndTime: '' };
const emptyService: ServiceListingFormData = {
  ServiceTitle: '', ServiceDescription: '', ServiceCategory: '', ServiceSubcategory: '',
  Address: '', IsOpen247: false, OpeningTimes: [{ ...emptyOpeningTime }], ContactEmail: '', ContactPhone: '',
};

export default function OrganisationRequestFormPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<OrganisationRequestFormData>({
    OrganisationName: '', Description: '', OrganisationEmail: '', OrganisationPhone: '',
    Website: '', LocationsServed: [], ContactFullName: '', ContactEmail: '',
    Services: [{ ...emptyService }], ConfirmsAccuracy: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [locRes, catRes] = await Promise.all([fetch('/api/locations'), fetch('/api/categories')]);
        const [locData, catData] = await Promise.all([locRes.json(), catRes.json()]);
        if (locData.status === 'success') {
          const sortedLocations = [...locData.data].sort((a, b) => a.name.localeCompare(b.name));
          setLocations(sortedLocations);
        }
        if (catData.status === 'success') {
          const sortedCategories = [...catData.data].sort((a, b) => a.name.localeCompare(b.name)).map(cat => ({
            ...cat,
            subCategories: [...cat.subCategories].sort((a, b) => a.name.localeCompare(b.name))
          }));
          setCategories(sortedCategories);
        }
      } catch (e) { console.error('Error:', e); }
      finally { setIsLoading(false); }
    }
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (validationErrors[name]) setValidationErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, o => o.value);
    setFormData(p => ({ ...p, LocationsServed: selected }));
    if (validationErrors.LocationsServed) setValidationErrors(p => { const n = { ...p }; delete n.LocationsServed; return n; });
  };

  const handleServiceChange = (idx: number, field: keyof ServiceListingFormData, value: ServiceListingFormData[keyof ServiceListingFormData]) => {
    setFormData(p => ({ ...p, Services: p.Services.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
    const ek = `Services.${idx}.${field}`;
    if (validationErrors[ek]) setValidationErrors(p => { const n = { ...p }; delete n[ek]; return n; });
  };

  const handleCategoryChange = (idx: number, cat: string) => {
    setFormData(p => ({ ...p, Services: p.Services.map((s, i) => i === idx ? { ...s, ServiceCategory: cat, ServiceSubcategory: '' } : s) }));
  };

  const handleOpeningTimeChange = (sIdx: number, tIdx: number, field: keyof OpeningTimeFormData, val: string) => {
    setFormData(p => ({
      ...p, Services: p.Services.map((s, si) => si === sIdx ? {
        ...s, OpeningTimes: s.OpeningTimes.map((t, ti) => ti === tIdx ? { ...t, [field]: val } : t)
      } : s)
    }));
  };

  const addOpeningTime = (idx: number) => {
    setFormData(p => ({ ...p, Services: p.Services.map((s, i) => i === idx ? { ...s, OpeningTimes: [...s.OpeningTimes, { ...emptyOpeningTime }] } : s) }));
  };

  const cloneOpeningTime = (sIdx: number, tIdx: number) => {
    setFormData(p => ({
      ...p,
      Services: p.Services.map((s, si) =>
        si === sIdx ? { ...s, OpeningTimes: [...s.OpeningTimes, { ...s.OpeningTimes[tIdx] }] } : s
      ),
    }));
  };

  const removeOpeningTime = (sIdx: number, tIdx: number) => {
    setFormData(p => ({ ...p, Services: p.Services.map((s, si) => si === sIdx ? { ...s, OpeningTimes: s.OpeningTimes.filter((_, ti) => ti !== tIdx) } : s) }));
  };

  const addService = () => setFormData(p => ({ ...p, Services: [...p.Services, { ...emptyService, OpeningTimes: [{ ...emptyOpeningTime }] }] }));
  const removeService = (idx: number) => { if (formData.Services.length > 1) setFormData(p => ({ ...p, Services: p.Services.filter((_, i) => i !== idx) })); };
  const getSubcategories = (key: string) => categories.find(c => c.key === key)?.subCategories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitError(null); setValidationErrors({});
    try {
      const validated = OrganisationRequestSchema.parse(formData);
      const res = await fetch('/api/organisation-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validated) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to submit');
      setSubmitSuccess(true);
      setFormData({ OrganisationName: '', Description: '', OrganisationEmail: '', OrganisationPhone: '', Website: '', LocationsServed: [], ContactFullName: '', ContactEmail: '', Services: [{ ...emptyService }], ConfirmsAccuracy: false });
    } catch (err) {
      if (err instanceof ZodError) { const errs: Record<string, string> = {}; err.errors.forEach(e => { errs[e.path.join('.')] = e.message; }); setValidationErrors(errs); }
      else if (err instanceof Error) setSubmitError(err.message);
      else setSubmitError('An unexpected error occurred');
    } finally { setIsSubmitting(false); }
  };

  if (submitSuccess) {
    return (
      <><Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Organisation Request', current: true }]} />
        <div className="content-container px-6 py-12"><div className="max-w-2xl mx-auto text-center">
          <div className="bg-brand-b/10 border border-brand-b rounded-lg p-8">
            <svg className="w-16 h-16 text-brand-b mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="heading-2 text-brand-b mb-4">Request Submitted!</h1>
            <p className="text-body mb-6">Thank you for requesting to list your organisation. We have sent you a confirmation email.</p>
            <Link href="/" className="btn-base btn-primary btn-md">Return to Homepage</Link>
          </div></div></div></>
    );
  }

  const inputClass = (err?: string) => `w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${err ? 'border-brand-g' : 'border-brand-q hover:border-brand-f'}`;

  return (
    <><Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Organisation Request', current: true }]} />
      <div className="content-container px-6 py-12">
        <div className="mb-8"><h1 className="heading-2">Organisation Request Form</h1><p className="text-lead">Want to list your organisation&apos;s services on Street Support Network? Complete this form.</p></div>
        {submitError && <div className="bg-brand-g/10 border border-brand-g text-brand-g rounded-lg p-4 mb-6"><p className="font-medium">Error</p><p className="text-sm">{submitError}</p></div>}
        
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="mb-8"><h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">🏢 Organisation Details</h2>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Organisation Name <span className="text-brand-g">*</span></label>
              <input type="text" name="OrganisationName" value={formData.OrganisationName} onChange={handleInputChange} className={inputClass(validationErrors.OrganisationName)} placeholder="Organisation name" />
              {validationErrors.OrganisationName && <p className="text-brand-g text-sm mt-1">{validationErrors.OrganisationName}</p>}</div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Description</label>
              <textarea name="Description" value={formData.Description} onChange={handleInputChange} rows={3} className={inputClass()} placeholder="Brief description..." /></div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Organisation Email <span className="text-brand-g">*</span></label>
              <input type="email" name="OrganisationEmail" value={formData.OrganisationEmail} onChange={handleInputChange} className={inputClass(validationErrors.OrganisationEmail)} placeholder="info@org.org" />
              {validationErrors.OrganisationEmail && <p className="text-brand-g text-sm mt-1">{validationErrors.OrganisationEmail}</p>}</div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Phone</label>
              <input type="tel" name="OrganisationPhone" value={formData.OrganisationPhone} onChange={handleInputChange} className={inputClass()} placeholder="0xxx xxx xxxx" /></div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Website</label>
              <input type="url" name="Website" value={formData.Website} onChange={handleInputChange} className={inputClass(validationErrors.Website)} placeholder="https://..." />
              {validationErrors.Website && <p className="text-brand-g text-sm mt-1">{validationErrors.Website}</p>}</div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Locations Served <span className="text-brand-g">*</span></label>
              <p className="text-sm text-brand-f mb-2">Hold Ctrl/Cmd for multiple</p>
              {isLoading ? <div className="px-4 py-3 border-2 border-brand-q rounded-md bg-brand-q">Loading...</div> :
                <select multiple value={formData.LocationsServed} onChange={handleLocationChange} className={`${inputClass(validationErrors.LocationsServed)} min-h-[150px]`}>
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>}
              {validationErrors.LocationsServed && <p className="text-brand-g text-sm mt-1">{validationErrors.LocationsServed}</p>}</div>
          </div>

          <div className="mb-8"><h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">👤 Contact Person</h2>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Full Name <span className="text-brand-g">*</span></label>
              <input type="text" name="ContactFullName" value={formData.ContactFullName} onChange={handleInputChange} className={inputClass(validationErrors.ContactFullName)} placeholder="Your name" />
              {validationErrors.ContactFullName && <p className="text-brand-g text-sm mt-1">{validationErrors.ContactFullName}</p>}</div>
            <div className="mb-6"><label className="block font-semibold text-brand-k mb-2">Email <span className="text-brand-g">*</span></label>
              <input type="email" name="ContactEmail" value={formData.ContactEmail} onChange={handleInputChange} className={inputClass(validationErrors.ContactEmail)} placeholder="email@org.org" />
              {validationErrors.ContactEmail && <p className="text-brand-g text-sm mt-1">{validationErrors.ContactEmail}</p>}</div>
          </div>

          <div className="mb-8"><h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">📋 Services</h2>
            {formData.Services.map((svc, sIdx) => (
              <div key={sIdx} className="bg-brand-q/50 rounded-lg p-6 mb-6 border border-brand-q">
                <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">Service {sIdx + 1}</h3>
                  {formData.Services.length > 1 && <button type="button" onClick={() => removeService(sIdx)} className="text-brand-g text-sm">Remove</button>}</div>
                <div className="mb-4"><label className="block font-semibold text-brand-k mb-2">Title <span className="text-brand-g">*</span></label>
                  <input type="text" value={svc.ServiceTitle} onChange={e => handleServiceChange(sIdx, 'ServiceTitle', e.target.value)} className={inputClass(validationErrors[`Services.${sIdx}.ServiceTitle`])} />
                  {validationErrors[`Services.${sIdx}.ServiceTitle`] && <p className="text-brand-g text-sm mt-1">{validationErrors[`Services.${sIdx}.ServiceTitle`]}</p>}</div>
                <div className="mb-4"><label className="block font-semibold text-brand-k mb-2">Description <span className="text-brand-g">*</span></label>
                  <textarea value={svc.ServiceDescription} onChange={e => handleServiceChange(sIdx, 'ServiceDescription', e.target.value)} rows={3} className={inputClass(validationErrors[`Services.${sIdx}.ServiceDescription`])} />
                  {validationErrors[`Services.${sIdx}.ServiceDescription`] && <p className="text-brand-g text-sm mt-1">{validationErrors[`Services.${sIdx}.ServiceDescription`]}</p>}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block font-semibold text-brand-k mb-2">Category <span className="text-brand-g">*</span></label>
                    <select value={svc.ServiceCategory} onChange={e => handleCategoryChange(sIdx, e.target.value)} className={inputClass(validationErrors[`Services.${sIdx}.ServiceCategory`])}>
                      <option value="">Select</option>{categories.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}</select></div>
                  <div><label className="block font-semibold text-brand-k mb-2">Subcategory <span className="text-brand-g">*</span></label>
                    <select value={svc.ServiceSubcategory} onChange={e => handleServiceChange(sIdx, 'ServiceSubcategory', e.target.value)} disabled={!svc.ServiceCategory} className={inputClass(validationErrors[`Services.${sIdx}.ServiceSubcategory`])}>
                      <option value="">Select</option>{getSubcategories(svc.ServiceCategory).map(s => <option key={s.key} value={s.key}>{s.name}</option>)}</select></div>
                </div>
                <div className="mb-4"><label className="block font-semibold text-brand-k mb-2">Address <span className="text-brand-g">*</span></label>
                  <input type="text" value={svc.Address} onChange={e => handleServiceChange(sIdx, 'Address', e.target.value)} className={inputClass(validationErrors[`Services.${sIdx}.Address`])} /></div>
                
                <div className="mb-4">
                  <label className="flex items-start gap-3 cursor-pointer mb-3">
                    <input 
                      type="checkbox" 
                      checked={svc.IsOpen247} 
                      onChange={e => handleServiceChange(sIdx, 'IsOpen247', e.target.checked)} 
                      className="mt-1 w-5 h-5 rounded border-2 border-brand-f" 
                    />
                    <span className="font-semibold text-brand-k">Open 24/7</span>
                  </label>
                </div>

                {!svc.IsOpen247 && (
                  <div className="mb-4">
                    <label className="block font-semibold text-brand-k mb-2">
                      Opening Times <span className="text-brand-g">*</span>
                    </label>
                    {svc.OpeningTimes.map((t, tIdx) => {
                      const dayError = validationErrors[`Services.${sIdx}.OpeningTimes.${tIdx}.Day`];
                      const startError = validationErrors[`Services.${sIdx}.OpeningTimes.${tIdx}.StartTime`];
                      const endError = validationErrors[`Services.${sIdx}.OpeningTimes.${tIdx}.EndTime`];
                      return (
                        <div key={tIdx} className="mb-3">
                          <div className="flex flex-wrap gap-2 items-center">
                            <select 
                              value={t.Day} 
                              onChange={e => handleOpeningTimeChange(sIdx, tIdx, 'Day', e.target.value)} 
                              className={`px-3 py-2 border-2 rounded-md ${dayError ? 'border-brand-g' : 'border-brand-q'}`}
                            >
                              <option value="">Day</option>{DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input 
                              type="time" 
                              step="60" 
                              value={t.StartTime} 
                              onChange={e => handleOpeningTimeChange(sIdx, tIdx, 'StartTime', e.target.value)} 
                              className={`px-3 py-2 border-2 rounded-md ${startError ? 'border-brand-g' : 'border-brand-q'}`} 
                            />
                            <span>to</span>
                            <input 
                              type="time" 
                              step="60" 
                              value={t.EndTime} 
                              onChange={e => handleOpeningTimeChange(sIdx, tIdx, 'EndTime', e.target.value)} 
                              className={`px-3 py-2 border-2 rounded-md ${endError ? 'border-brand-g' : 'border-brand-q'}`} 
                            />
                            <button type="button" onClick={() => cloneOpeningTime(sIdx, tIdx)} className="text-brand-a text-sm px-2 py-1 border border-brand-a rounded hover:bg-brand-a/10" title="Clone this time">
                              📋
                            </button>
                            {svc.OpeningTimes.length > 1 && (
                              <button type="button" onClick={() => removeOpeningTime(sIdx, tIdx)} className="text-brand-g text-sm px-2 py-1">
                                ×
                              </button>
                            )}
                          </div>
                          {(dayError || startError || endError) && (
                            <p className="text-brand-g text-sm mt-1">
                              {dayError || startError || endError}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => addOpeningTime(sIdx)} className="text-brand-a text-sm font-medium mt-2">
                      + Add time
                    </button>
                    {validationErrors[`Services.${sIdx}.OpeningTimes`] && (
                      <p className="text-brand-g text-sm mt-1">{validationErrors[`Services.${sIdx}.OpeningTimes`]}</p>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block font-semibold text-brand-k mb-2">Contact Email</label>
                    <input type="email" value={svc.ContactEmail} onChange={e => handleServiceChange(sIdx, 'ContactEmail', e.target.value)} className={inputClass()} /></div>
                  <div><label className="block font-semibold text-brand-k mb-2">Contact Phone</label>
                    <input type="tel" value={svc.ContactPhone} onChange={e => handleServiceChange(sIdx, 'ContactPhone', e.target.value)} className={inputClass()} /></div>
                </div>
              </div>))}
            <button type="button" onClick={addService} className="btn-base btn-secondary btn-md">+ Add Another Service</button>
          </div>

          <div className="mb-8"><h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">✅ Agreement</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="ConfirmsAccuracy" checked={formData.ConfirmsAccuracy} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-2 border-brand-f" />
              <span>I confirm the information is accurate and understand the listing will be reviewed. <span className="text-brand-g">*</span></span></label>
            {validationErrors.ConfirmsAccuracy && <p className="text-brand-g text-sm mt-1 ml-8">{validationErrors.ConfirmsAccuracy}</p>}
          </div>

          <div className="pt-6 border-t border-brand-q">
            <button type="submit" disabled={isSubmitting} className="btn-base btn-primary btn-lg w-full sm:w-auto disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            <p className="text-sm text-brand-f mt-4">You will receive a confirmation email. Our team will review and be in touch.</p>
          </div>
        </form>
      </div></>
  );
}
