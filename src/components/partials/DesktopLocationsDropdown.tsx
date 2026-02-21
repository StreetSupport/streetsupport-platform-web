import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

interface DesktopLocationsDropdownProps {
  groupedLocations: Record<string, Location[]>;
  sortedLocations: Location[];
  focusedLocationIndex: number;
  locationsDropdownRef: React.RefObject<HTMLDivElement | null>;
  locationLinksRef: React.RefObject<Map<number, HTMLAnchorElement>>;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLocationClick: () => void;
}

export default function DesktopLocationsDropdown({
  groupedLocations,
  sortedLocations,
  focusedLocationIndex,
  locationsDropdownRef,
  locationLinksRef,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onLocationClick,
}: DesktopLocationsDropdownProps) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[650px] z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={locationsDropdownRef}
        id="locations-dropdown"
        className="bg-white border border-brand-f rounded-md shadow-lg p-4"
        role="menu"
        aria-labelledby="locations-button"
        onKeyDown={onKeyDown}
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(groupedLocations).map(([groupName, groupLocations]) => {
            const groupId = `locations-group-${groupName.toLowerCase().replace('-', '')}`;
            return (
              <div
                key={groupName}
                className="space-y-2"
                role="group"
                aria-labelledby={groupId}
              >
                <h3
                  id={groupId}
                  className="text-xs font-semibold text-brand-f uppercase tracking-wide border-b border-brand-q pb-1"
                >
                  {groupName}
                </h3>
                <ul className="space-y-1" aria-label={`Locations ${groupName}`}>
                  {groupLocations.map((location) => {
                    const globalIndex = sortedLocations.findIndex(loc => loc.id === location.id);
                    const isFocused = globalIndex === focusedLocationIndex;
                    return (
                      <li key={location.id}>
                        <Link
                          href={`/${location.slug}`}
                          ref={(el) => {
                            if (el) {
                              locationLinksRef.current?.set(globalIndex, el);
                            }
                          }}
                          className={`block px-2 py-1 text-sm !text-black hover:bg-brand-i hover:text-brand-k transition-colors duration-200 rounded focus:ring-2 focus:ring-brand-a focus:outline-none ${
                            isFocused ? 'bg-brand-i text-brand-k ring-2 ring-brand-a outline-none' : ''
                          }`}
                          onClick={onLocationClick}
                          role="menuitem"
                          tabIndex={isFocused ? 0 : -1}
                          aria-current={isFocused ? 'true' : undefined}
                        >
                          {location.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
