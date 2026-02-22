import type {
  ServiceListingFormData,
  OpeningTimeFormData,
} from '@/schemas/organisationRequestSchema';

interface Category {
  key: string;
  name: string;
  subCategories: { key: string; name: string }[];
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

interface ServiceFieldSetProps {
  services: ServiceListingFormData[];
  categories: Category[];
  errors: Record<string, string>;
  serviceRefs: React.RefObject<Map<number, HTMLInputElement>>;
  openingTimeRefs: React.RefObject<Map<string, HTMLSelectElement>>;
  addOpeningTimeRefs: React.RefObject<Map<number, HTMLButtonElement>>;
  addServiceButtonRef: React.RefObject<HTMLButtonElement | null>;
  onServiceChange: (
    idx: number,
    field: keyof ServiceListingFormData,
    value: ServiceListingFormData[keyof ServiceListingFormData]
  ) => void;
  onCategoryChange: (idx: number, category: string) => void;
  onOpeningTimeChange: (
    serviceIdx: number,
    timeIdx: number,
    field: keyof OpeningTimeFormData,
    value: string
  ) => void;
  onAddOpeningTime: (serviceIdx: number) => void;
  onCloneOpeningTime: (serviceIdx: number, timeIdx: number) => void;
  onRemoveOpeningTime: (serviceIdx: number, timeIdx: number) => void;
  onAddService: () => void;
  onRemoveService: (idx: number) => void;
  getSubcategories: (categoryKey: string) => { key: string; name: string }[];
}

const inputClass = (error?: string) =>
  `w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a/20 focus:border-brand-a transition-colors ${
    error ? 'border-brand-g' : 'border-brand-q hover:border-brand-f'
  }`;

function OpeningTimeRow({
  serviceIdx,
  timeIdx,
  time,
  errors,
  canRemove,
  openingTimeRefs,
  onTimeChange,
  onClone,
  onRemove,
}: {
  serviceIdx: number;
  timeIdx: number;
  time: OpeningTimeFormData;
  errors: Record<string, string>;
  canRemove: boolean;
  openingTimeRefs: React.RefObject<Map<string, HTMLSelectElement>>;
  onTimeChange: (field: keyof OpeningTimeFormData, value: string) => void;
  onClone: () => void;
  onRemove: () => void;
}) {
  const dayError = errors[`Services.${serviceIdx}.OpeningTimes.${timeIdx}.Day`];
  const startError = errors[`Services.${serviceIdx}.OpeningTimes.${timeIdx}.StartTime`];
  const endError = errors[`Services.${serviceIdx}.OpeningTimes.${timeIdx}.EndTime`];

  return (
    <div className="mb-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          id={`service-${serviceIdx}-opening-${timeIdx}-day`}
          ref={(el) => {
            if (el) openingTimeRefs.current.set(`${serviceIdx}-${timeIdx}`, el);
          }}
          aria-label={`Opening time ${timeIdx + 1} day`}
          value={time.Day}
          onChange={(e) => onTimeChange('Day', e.target.value)}
          className={`px-3 py-2 border-2 rounded-md ${dayError ? 'border-brand-g' : 'border-brand-q'}`}
        >
          <option value="">Day</option>
          {DAYS_OF_WEEK.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="time"
          id={`service-${serviceIdx}-opening-${timeIdx}-start`}
          aria-label={`Opening time ${timeIdx + 1} start time`}
          step="60"
          value={time.StartTime}
          onChange={(e) => onTimeChange('StartTime', e.target.value)}
          className={`px-3 py-2 border-2 rounded-md ${startError ? 'border-brand-g' : 'border-brand-q'}`}
        />
        <span aria-hidden="true">to</span>
        <input
          type="time"
          id={`service-${serviceIdx}-opening-${timeIdx}-end`}
          aria-label={`Opening time ${timeIdx + 1} end time`}
          step="60"
          value={time.EndTime}
          onChange={(e) => onTimeChange('EndTime', e.target.value)}
          className={`px-3 py-2 border-2 rounded-md ${endError ? 'border-brand-g' : 'border-brand-q'}`}
        />
        <button
          type="button"
          onClick={onClone}
          className="text-brand-a text-sm px-2 py-1 border border-brand-a rounded hover:bg-brand-a/10"
          title="Clone this time"
          aria-label={`Copy opening time ${timeIdx + 1}`}
        >
          Copy
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-brand-g text-sm px-2 py-1"
            aria-label={`Remove opening time ${timeIdx + 1}`}
          >
            x
          </button>
        )}
      </div>
      {(dayError || startError || endError) && (
        <p className="text-brand-g text-sm mt-1" role="alert">
          {dayError || startError || endError}
        </p>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  serviceIdx,
  totalServices,
  categories,
  errors,
  serviceRefs,
  openingTimeRefs,
  addOpeningTimeRefs,
  onServiceChange,
  onCategoryChange,
  onOpeningTimeChange,
  onAddOpeningTime,
  onCloneOpeningTime,
  onRemoveOpeningTime,
  onRemoveService,
  getSubcategories,
}: {
  service: ServiceListingFormData;
  serviceIdx: number;
  totalServices: number;
  categories: Category[];
  errors: Record<string, string>;
  serviceRefs: React.RefObject<Map<number, HTMLInputElement>>;
  openingTimeRefs: React.RefObject<Map<string, HTMLSelectElement>>;
  addOpeningTimeRefs: React.RefObject<Map<number, HTMLButtonElement>>;
  onServiceChange: (
    field: keyof ServiceListingFormData,
    value: ServiceListingFormData[keyof ServiceListingFormData]
  ) => void;
  onCategoryChange: (category: string) => void;
  onOpeningTimeChange: (
    timeIdx: number,
    field: keyof OpeningTimeFormData,
    value: string
  ) => void;
  onAddOpeningTime: () => void;
  onCloneOpeningTime: (timeIdx: number) => void;
  onRemoveOpeningTime: (timeIdx: number) => void;
  onRemoveService: () => void;
  getSubcategories: (categoryKey: string) => { key: string; name: string }[];
}) {
  return (
    <div className="bg-brand-q/50 rounded-lg p-6 mb-6 border border-brand-q">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Service {serviceIdx + 1}</h3>
        {totalServices > 1 && (
          <button
            type="button"
            onClick={onRemoveService}
            className="text-brand-g text-sm"
            aria-label={`Remove service ${serviceIdx + 1}`}
          >
            Remove
          </button>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`service-${serviceIdx}-title`}
          className="block font-semibold text-brand-k mb-2"
        >
          Title <span className="text-brand-g">*</span>
        </label>
        <input
          type="text"
          id={`service-${serviceIdx}-title`}
          ref={(el) => {
            if (el) serviceRefs.current.set(serviceIdx, el);
          }}
          value={service.ServiceTitle}
          onChange={(e) => onServiceChange('ServiceTitle', e.target.value)}
          className={inputClass(errors[`Services.${serviceIdx}.ServiceTitle`])}
        />
        {errors[`Services.${serviceIdx}.ServiceTitle`] && (
          <p className="text-brand-g text-sm mt-1">
            {errors[`Services.${serviceIdx}.ServiceTitle`]}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`service-${serviceIdx}-description`}
          className="block font-semibold text-brand-k mb-2"
        >
          Description <span className="text-brand-g">*</span>
        </label>
        <textarea
          id={`service-${serviceIdx}-description`}
          value={service.ServiceDescription}
          onChange={(e) => onServiceChange('ServiceDescription', e.target.value)}
          rows={3}
          className={inputClass(errors[`Services.${serviceIdx}.ServiceDescription`])}
        />
        {errors[`Services.${serviceIdx}.ServiceDescription`] && (
          <p className="text-brand-g text-sm mt-1">
            {errors[`Services.${serviceIdx}.ServiceDescription`]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor={`service-${serviceIdx}-category`}
            className="block font-semibold text-brand-k mb-2"
          >
            Category <span className="text-brand-g">*</span>
          </label>
          <select
            id={`service-${serviceIdx}-category`}
            value={service.ServiceCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={inputClass(errors[`Services.${serviceIdx}.ServiceCategory`])}
          >
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={`service-${serviceIdx}-subcategory`}
            className="block font-semibold text-brand-k mb-2"
          >
            Subcategory <span className="text-brand-g">*</span>
          </label>
          <select
            id={`service-${serviceIdx}-subcategory`}
            value={service.ServiceSubcategory}
            onChange={(e) => onServiceChange('ServiceSubcategory', e.target.value)}
            disabled={!service.ServiceCategory}
            className={inputClass(errors[`Services.${serviceIdx}.ServiceSubcategory`])}
          >
            <option value="">Select</option>
            {getSubcategories(service.ServiceCategory).map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor={`service-${serviceIdx}-address`}
          className="block font-semibold text-brand-k mb-2"
        >
          Address <span className="text-brand-g">*</span>
        </label>
        <input
          type="text"
          id={`service-${serviceIdx}-address`}
          value={service.Address}
          onChange={(e) => onServiceChange('Address', e.target.value)}
          className={inputClass(errors[`Services.${serviceIdx}.Address`])}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            id={`service-${serviceIdx}-open247`}
            checked={service.IsOpen247}
            onChange={(e) => onServiceChange('IsOpen247', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-2 border-brand-f"
          />
          <label
            htmlFor={`service-${serviceIdx}-open247`}
            className="font-semibold text-brand-k cursor-pointer"
          >
            Open 24/7
          </label>
        </div>
      </div>

      {!service.IsOpen247 && (
        <div
          className="mb-4"
          role="group"
          aria-labelledby={`service-${serviceIdx}-opening-times-label`}
        >
          <span
            id={`service-${serviceIdx}-opening-times-label`}
            className="block font-semibold text-brand-k mb-2"
          >
            Opening Times <span className="text-brand-g">*</span>
          </span>
          {service.OpeningTimes.map((t, tIdx) => (
            <OpeningTimeRow
              key={tIdx}
              serviceIdx={serviceIdx}
              timeIdx={tIdx}
              time={t}
              errors={errors}
              canRemove={service.OpeningTimes.length > 1}
              openingTimeRefs={openingTimeRefs}
              onTimeChange={(field, value) => onOpeningTimeChange(tIdx, field, value)}
              onClone={() => onCloneOpeningTime(tIdx)}
              onRemove={() => onRemoveOpeningTime(tIdx)}
            />
          ))}
          <button
            type="button"
            ref={(el) => {
              if (el) addOpeningTimeRefs.current.set(serviceIdx, el);
            }}
            onClick={onAddOpeningTime}
            className="text-brand-a text-sm font-medium mt-2"
          >
            + Add time
          </button>
          {errors[`Services.${serviceIdx}.OpeningTimes`] && (
            <p className="text-brand-g text-sm mt-1">
              {errors[`Services.${serviceIdx}.OpeningTimes`]}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`service-${serviceIdx}-contact-email`}
            className="block font-semibold text-brand-k mb-2"
          >
            Contact Email
          </label>
          <input
            type="email"
            id={`service-${serviceIdx}-contact-email`}
            value={service.ContactEmail}
            onChange={(e) => onServiceChange('ContactEmail', e.target.value)}
            className={inputClass()}
          />
        </div>
        <div>
          <label
            htmlFor={`service-${serviceIdx}-contact-phone`}
            className="block font-semibold text-brand-k mb-2"
          >
            Contact Phone
          </label>
          <input
            type="tel"
            id={`service-${serviceIdx}-contact-phone`}
            value={service.ContactPhone}
            onChange={(e) => onServiceChange('ContactPhone', e.target.value)}
            className={inputClass()}
          />
        </div>
      </div>
    </div>
  );
}

export default function ServiceFieldSet({
  services,
  categories,
  errors,
  serviceRefs,
  openingTimeRefs,
  addOpeningTimeRefs,
  addServiceButtonRef,
  onServiceChange,
  onCategoryChange,
  onOpeningTimeChange,
  onAddOpeningTime,
  onCloneOpeningTime,
  onRemoveOpeningTime,
  onAddService,
  onRemoveService,
  getSubcategories,
}: ServiceFieldSetProps) {
  return (
    <div className="mb-8">
      <h2 className="heading-4 mb-4 pb-2 border-b border-brand-q">Services</h2>
      {services.map((svc, sIdx) => (
        <ServiceCard
          key={sIdx}
          service={svc}
          serviceIdx={sIdx}
          totalServices={services.length}
          categories={categories}
          errors={errors}
          serviceRefs={serviceRefs}
          openingTimeRefs={openingTimeRefs}
          addOpeningTimeRefs={addOpeningTimeRefs}
          onServiceChange={(field, value) => onServiceChange(sIdx, field, value)}
          onCategoryChange={(cat) => onCategoryChange(sIdx, cat)}
          onOpeningTimeChange={(tIdx, field, value) =>
            onOpeningTimeChange(sIdx, tIdx, field, value)
          }
          onAddOpeningTime={() => onAddOpeningTime(sIdx)}
          onCloneOpeningTime={(tIdx) => onCloneOpeningTime(sIdx, tIdx)}
          onRemoveOpeningTime={(tIdx) => onRemoveOpeningTime(sIdx, tIdx)}
          onRemoveService={() => onRemoveService(sIdx)}
          getSubcategories={getSubcategories}
        />
      ))}
      <button
        type="button"
        ref={addServiceButtonRef}
        onClick={onAddService}
        className="btn-base btn-secondary btn-md"
      >
        + Add Another Service
      </button>
    </div>
  );
}
