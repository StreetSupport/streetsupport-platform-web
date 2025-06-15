import { render } from '@testing-library/react';
import HomepageMap from '@/components/Homepage/HomepageMap';

jest.mock('@/components/MapComponent/GoogleMap', () => (props: any) => {
  (globalThis as any).googleMapProps = props;
  return <div data-testid="map" />;
});

jest.mock('@/data/locations.json', () => [
  { key: 'public', name: 'Public', latitude: 53, longitude: -2, isPublic: true },
  { key: 'private', name: 'Private', latitude: 54, longitude: -3, isPublic: false },
]);

describe('HomepageMap', () => {
  it('passes only public locations to GoogleMap', () => {
    render(<HomepageMap />);
    const markers = (globalThis as any).googleMapProps.markers;
    expect(markers).toHaveLength(1);
    expect(markers[0]).toMatchObject({
      id: 'public',
      lat: 53,
      lng: -2,
      title: 'Public',
      link: '/public',
    });
  });

  it('uses fixed map centre', () => {
    render(<HomepageMap />);
    expect((globalThis as any).googleMapProps.center).toEqual({
      lat: 53.4098,
      lng: -2.1576,
    });
  });
});
