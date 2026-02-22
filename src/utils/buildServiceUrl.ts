export function buildOrganisationUrl(
  orgSlug: string,
  location: { lat?: number; lng?: number; radius?: number } | null,
  searchParams?: URLSearchParams
): string {
  if (!orgSlug) return '#';
  const params = new URLSearchParams();
  if (location?.lat && location?.lng) {
    params.set('lat', location.lat.toString());
    params.set('lng', location.lng.toString());
    if (location.radius) {
      params.set('radius', location.radius.toString());
    }
  }
  searchParams?.forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });
  const query = params.toString();
  return `/find-help/organisation/${orgSlug}${query ? `?${query}` : ''}`;
}
