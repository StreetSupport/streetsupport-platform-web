import { Loader } from '@googlemaps/js-api-loader';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

/**
 * Loads the Google Maps JS API using the provided API key.
 * Note: .load() is marked deprecated in the types but still works in practice.
 */
export const loadGoogleMaps = async () => {
  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places'],
  });

  return loader.load();
};
