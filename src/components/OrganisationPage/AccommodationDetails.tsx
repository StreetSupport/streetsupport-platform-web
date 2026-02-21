import type { AccommodationData } from '@/types';

interface Props {
  accommodationData: AccommodationData;
  accordionKey: string;
  expandedDescriptions: Record<string, boolean>;
  onToggleExpanded: (key: string) => void;
}

function ResidentCriteriaItem({ label, value }: { label: string; value: unknown }) {
  const isAccepted = value === true || value === 1;
  const isUnspecified = value === 2 || value === undefined || value === null;

  if (isUnspecified) {
    return <div className="text-brand-f">{label} (not specified)</div>;
  }

  return (
    <div className={isAccepted ? 'text-brand-b' : 'text-brand-g'}>
      {isAccepted ? '\u2713' : '\u2717'} {label}
    </div>
  );
}

function StatusIndicator({ positive, label }: { positive: boolean; label: string }) {
  return (
    <div className={positive ? 'text-brand-b' : 'text-brand-g'}>
      {positive ? '\u2713' : '\u2717'} {label}
    </div>
  );
}

export default function AccommodationDetails({
  accommodationData,
  accordionKey,
  expandedDescriptions,
  onToggleExpanded,
}: Props) {
  const descriptionKey = `${accordionKey}-description`;
  const isExpanded = expandedDescriptions[descriptionKey] || false;
  const description = accommodationData.description || accommodationData.synopsis || '';
  const shouldTruncate = description.length > 140;
  const truncatedDescription = shouldTruncate ? description.slice(0, 140) + '...' : description;
  const features = accommodationData.features || {} as AccommodationData['features'];

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-brand-k border-brand-q">
        Accommodation Information
      </h4>

      {(accommodationData.description || accommodationData.synopsis) && (
        <div className="mb-4">
          <div className="text-sm text-brand-l leading-relaxed">
            <p>
              {isExpanded || !shouldTruncate ? description : truncatedDescription}
              {shouldTruncate && (
                <button
                  onClick={() => onToggleExpanded(descriptionKey)}
                  className="ml-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded text-brand-a"
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Application & Contact */}
      <div className="rounded-lg p-4 bg-[#f0f9f7] border-l-4 border-l-brand-b">
        <h5 className="font-semibold mb-3 text-brand-k">How to Apply & Contact</h5>
        <div className="space-y-3">
          {accommodationData.referralNotes && (
            <div>
              <p className="font-medium text-sm mb-1 text-brand-k">Application Process:</p>
              <p className="text-sm p-3 rounded text-brand-l bg-brand-q">{accommodationData.referralNotes}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accommodationData.contact?.name && (
              <div>
                <p className="font-medium text-sm text-brand-k">Contact Person:</p>
                <p className="text-sm text-brand-l">{accommodationData.contact.name}</p>
              </div>
            )}
            {accommodationData.contact?.telephone && (
              <div>
                <p className="font-medium text-sm text-brand-k">Phone:</p>
                <p className="text-sm font-mono text-brand-l">{accommodationData.contact.telephone}</p>
              </div>
            )}
            {accommodationData.contact?.email && (
              <div>
                <p className="font-medium text-sm text-brand-k">Email:</p>
                <p className="text-sm text-brand-l">{accommodationData.contact.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cost & Meals */}
      <div className="rounded-lg p-4 bg-[#fef9e7] border-l-4 border-l-brand-j">
        <h5 className="font-semibold mb-3 text-brand-k">Cost & Meals</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm mb-1 text-brand-k">Weekly Cost:</p>
            <p className="text-lg font-bold text-brand-a">
              {accommodationData.price === '0' || !accommodationData.price ? 'Free' : `\u00A3${accommodationData.price}`}
            </p>
          </div>
          <div>
            <p className="font-medium text-sm mb-1 text-brand-k">Meals Included:</p>
            <p className="text-sm text-brand-l">
              {accommodationData.foodIncluded === 1 ? 'Yes' :
               accommodationData.foodIncluded === 0 ? 'No' : 'Not specified'}
            </p>
            {accommodationData.availabilityOfMeals && (
              <p className="text-xs mt-1 text-brand-f">{accommodationData.availabilityOfMeals}</p>
            )}
          </div>
          <div>
            <p className="font-medium text-sm mb-1 text-brand-k">Housing Benefit:</p>
            <p className="text-sm text-brand-l">
              {features.acceptsHousingBenefit === 1 ? 'Accepted' :
               features.acceptsHousingBenefit === 0 ? 'Not accepted' : 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Who Can Stay */}
      <div className="rounded-lg p-4 bg-[#f0f4ff] border-l-4 border-l-brand-h">
        <h5 className="font-semibold mb-3 text-brand-k">Who Can Stay</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <ResidentCriteriaItem label="Men" value={accommodationData.residentCriteria?.acceptsMen} />
          <ResidentCriteriaItem label="Women" value={accommodationData.residentCriteria?.acceptsWomen} />
          <ResidentCriteriaItem label="Couples" value={accommodationData.residentCriteria?.acceptsCouples} />
          <ResidentCriteriaItem label="Young People" value={accommodationData.residentCriteria?.acceptsYoungPeople} />
          <ResidentCriteriaItem label="Families" value={accommodationData.residentCriteria?.acceptsFamilies} />
          <ResidentCriteriaItem label="Benefits Claimants" value={accommodationData.residentCriteria?.acceptsBenefitsClaimants} />
        </div>
      </div>

      {/* Facilities & Features */}
      <div className="rounded-lg p-4 bg-[#faf9f7] border-l-4 border-l-brand-d">
        <h5 className="font-semibold mb-3 text-brand-k">Facilities & Features</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm mb-2 text-brand-k">Room Types:</p>
            <div className="space-y-1 text-sm">
              {features.hasSingleRooms === 1 && <StatusIndicator positive label="Single rooms available" />}
              {features.hasSingleRooms === 0 && <StatusIndicator positive={false} label="No single rooms" />}
              {features.hasSharedRooms === 1 && <StatusIndicator positive label="Shared rooms available" />}
              {features.hasSharedRooms === 0 && <StatusIndicator positive={false} label="No shared rooms" />}
              {features.hasSingleRooms !== 0 && features.hasSingleRooms !== 1 &&
               features.hasSharedRooms !== 0 && features.hasSharedRooms !== 1 && (
                <div className="text-brand-f">Room types not specified</div>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-brand-k">Facilities:</p>
            <div className="flex flex-wrap gap-1">
              {features.hasAccessToKitchen === 1 && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-brand-d text-white">Kitchen</span>
              )}
              {features.hasLaundryFacilities === 1 && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-brand-d text-white">Laundry</span>
              )}
              {features.hasLounge === 1 && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-brand-d text-white">Lounge</span>
              )}
              {features.hasShowerBathroomFacilities === 1 && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-brand-d text-white">Bathroom</span>
              )}
              {features.hasAccessToKitchen !== 1 && features.hasLaundryFacilities !== 1 &&
               features.hasLounge !== 1 && features.hasShowerBathroomFacilities !== 1 && (
                <span className="px-2 py-1 text-xs text-brand-f">Facilities not specified</span>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-brand-k">Accessibility & Policies:</p>
            <div className="space-y-1 text-sm">
              {features.hasDisabledAccess === 1 && <StatusIndicator positive label="Wheelchair accessible" />}
              {features.hasDisabledAccess === 0 && <StatusIndicator positive={false} label="Not wheelchair accessible" />}
              {features.acceptsPets === 1 && <StatusIndicator positive label="Pets allowed" />}
              {features.acceptsPets === 0 && <StatusIndicator positive={false} label="No pets allowed" />}
              {features.allowsVisitors === 1 && <StatusIndicator positive label="Visitors allowed" />}
              {features.allowsVisitors === 0 && <StatusIndicator positive={false} label="No visitors allowed" />}
              {features.hasDisabledAccess !== 0 && features.hasDisabledAccess !== 1 &&
               features.acceptsPets !== 0 && features.acceptsPets !== 1 &&
               features.allowsVisitors !== 0 && features.allowsVisitors !== 1 && (
                <div className="text-brand-f">Policies not specified</div>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-brand-k">Management:</p>
            <div className="text-sm">
              {features.hasOnSiteManager === 1 ? (
                <StatusIndicator positive label="On-site manager" />
              ) : features.hasOnSiteManager === 0 ? (
                <StatusIndicator positive={false} label="No on-site manager" />
              ) : (
                <div className="text-brand-f">Management not specified</div>
              )}
            </div>
          </div>
        </div>

        {features.additionalFeatures && (
          <div className="mt-3 pt-3 border-t border-brand-q">
            <p className="font-medium text-sm mb-1 text-brand-k">Additional Features:</p>
            <p className="text-sm p-2 rounded text-brand-l bg-brand-q">{features.additionalFeatures}</p>
          </div>
        )}
      </div>

      {/* Support Services */}
      {(accommodationData.support?.supportOffered?.length > 0 || accommodationData.support?.supportInfo) && (
        <div className="rounded-lg p-4 bg-[#f8f5ff] border-l-4 border-l-brand-h">
          <h5 className="font-semibold mb-3 text-brand-k">Support Services</h5>
          {accommodationData.support.supportOffered?.length > 0 && (
            <div className="mb-3">
              <p className="font-medium text-sm mb-2 text-brand-k">Support Available For:</p>
              <div className="flex flex-wrap gap-2">
                {accommodationData.support.supportOffered.map((support: string, index: number) => (
                  <span key={index} className="px-3 py-1 rounded text-sm font-medium bg-brand-h text-white">
                    {support === 'mental health' ? 'Mental Health' :
                     support === 'substances' ? 'Substance Abuse' :
                     support === 'alcohol' ? 'Alcohol Issues' :
                     support === 'domestic violence' ? 'Domestic Violence' :
                     support === 'physical health' ? 'Physical Health' :
                     support.charAt(0).toUpperCase() + support.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {accommodationData.support?.supportInfo && (
            <div>
              <p className="font-medium text-sm mb-1 text-brand-k">Support Details:</p>
              <p className="text-sm p-2 rounded text-brand-l bg-brand-q">{accommodationData.support.supportInfo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
