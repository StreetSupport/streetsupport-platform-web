import BannerContainer from '@/components/Banners/BannerContainer';
import BannerWrapper from '@/components/Banners/BannerWrapper';
import { BannerProps } from '@/types/banners';

const mockBanners: BannerProps[] = [
  {
    id: 'mock-1',
    title: 'Support Street Support Network',
    description: 'Help us continue providing vital services to people experiencing homelessness across the UK. Your support makes a real difference to vulnerable people in our communities.',
    subtitle: 'Make a Difference Today',
    mediaType: 'image',
    image: {
      url: 'https://placekitten.com/800/450',
      alt: 'Placeholder image',
      width: 800,
      height: 450
    },
    layoutStyle: 'split',
    textColour: 'white',
    background: { type: 'solid', value: '#38ae8e' },
    ctaButtons: [
      { label: 'Donate Now', url: 'https://donate.streetsupport.net', variant: 'primary', external: true },
      { label: 'Learn More', url: '/about', variant: 'outline', external: false }
    ],
    isActive: true,
    priority: 1,
    locationSlug: 'testing-banners'
  },
  {
    id: 'mock-2',
    title: 'Watch Our Story',
    description: 'Learn about the impact we are making together in communities across the country.',
    mediaType: 'youtube',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    layoutStyle: 'full-width',
    textColour: 'white',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #5a497f 0%, #38ae8e 100%)' },
    ctaButtons: [
      { label: 'Get Involved', url: '/volunteer', variant: 'primary', external: false },
      { label: 'Watch More', url: '/videos', variant: 'secondary', external: false },
      { label: 'Share', url: '/share', variant: 'outline', external: false }
    ],
    isActive: true,
    priority: 2,
    locationSlug: 'testing-banners'
  },
  {
    id: 'mock-3',
    title: 'Winter Warmth Appeal',
    description: 'As temperatures drop, people sleeping rough need our help more than ever. This winter, we are working with local organisations to provide warm clothing, sleeping bags, and emergency shelter access.',
    subtitle: 'Help Keep People Safe',
    mediaType: 'image',
    image: {
      url: 'https://placekitten.com/900/500',
      alt: 'Winter appeal',
      width: 900,
      height: 500
    },
    layoutStyle: 'split',
    textColour: 'black',
    background: { type: 'solid', value: '#f5f5f5' },
    ctaButtons: [
      { label: 'Donate Warm Clothing', url: '/donate-items', variant: 'primary', external: false },
      { label: 'Find a Drop-off Point', url: '/locations', variant: 'secondary', external: false },
      { label: 'Learn More', url: '/winter-appeal', variant: 'outline', external: false }
    ],
    isActive: true,
    priority: 3,
    locationSlug: 'testing-banners'
  },
  {
    id: 'mock-4',
    title: 'Volunteer With Us',
    description: 'Join our network of volunteers making a difference.',
    mediaType: 'image',
    layoutStyle: 'full-width',
    textColour: 'white',
    background: { type: 'image', value: 'https://placekitten.com/1920/600' },
    ctaButtons: [
      { label: 'Find Opportunities', url: '/volunteer', variant: 'primary', external: false }
    ],
    isActive: true,
    priority: 4,
    locationSlug: 'testing-banners'
  }
];

export default function TestingBannersPage() {
  return (
    <main>
      <div className="bg-gray-100 p-4 mb-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Banner Visual Testing Page</h1>
          <p className="text-gray-600">
            This page displays banners for visual testing.
            Remove this page once testing is complete and database integration is confirmed.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 mb-4">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold text-blue-900">Database Banners</h2>
          <p className="text-blue-700 text-sm">
            Banners fetched from the database with LocationSlug: &quot;testing-banners&quot;
          </p>
        </div>
      </div>

      <BannerWrapper locationSlug="testing-banners" />

      <div className="bg-amber-50 p-4 my-4">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold text-amber-900">Mock Banners</h2>
          <p className="text-amber-700 text-sm">
            Hardcoded mock banners for visual testing of all variants
          </p>
        </div>
      </div>

      <BannerContainer banners={mockBanners} />
    </main>
  );
}
