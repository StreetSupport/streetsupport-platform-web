import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerContainer from '@/components/Banners/BannerContainer';
import { AnyBannerProps, GivingCampaignProps, PartnershipCharterProps, ResourceProjectProps } from '@/types/banners';

// Mock the individual banner components
jest.mock('@/components/Banners/GivingCampaignBanner', () => {
  return function MockGivingCampaignBanner({ title, className }: any) {
    return <div data-testid='giving-campaign-banner' className={className}>{title}</div>;
  };
});

jest.mock('@/components/Banners/PartnershipCharterBanner', () => {
  return function MockPartnershipCharterBanner({ title, className }: any) {
    return <div data-testid='partnership-charter-banner' className={className}>{title}</div>;
  };
});

jest.mock('@/components/Banners/ResourceProjectBanner', () => {
  return function MockResourceProjectBanner({ title, className }: any) {
    return <div data-testid='resource-project-banner' className={className}>{title}</div>;
  };
});

describe('BannerContainer', () => {
  const mockGivingCampaign: GivingCampaignProps = {
    id: '1',
    templateType: 'giving-campaign',
    title: 'Support Campaign',
    ctaButtons: [{ label: 'Donate', url: '/donate' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width'
  };

  const mockPartnershipCharter: PartnershipCharterProps = {
    id: '2',
    templateType: 'partnership-charter',
    title: 'Join Charter',
    ctaButtons: [{ label: 'Sign', url: '/sign' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width'
  };

  const mockResourceProject: ResourceProjectProps = {
    id: '3',
    templateType: 'resource-project',
    title: 'Download Guide',
    ctaButtons: [{ label: 'Download', url: '/guide' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width'
  };

  const mockBanners: AnyBannerProps[] = [
    mockGivingCampaign,
    mockPartnershipCharter,
    mockResourceProject
  ];

  it('should render all banners', () => {
    render(<BannerContainer banners={mockBanners} />);
    
    expect(screen.getByTestId('giving-campaign-banner')).toBeInTheDocument();
    expect(screen.getByTestId('partnership-charter-banner')).toBeInTheDocument();
    expect(screen.getByTestId('resource-project-banner')).toBeInTheDocument();
  });

  it('should apply CSS classes correctly', () => {
    render(<BannerContainer banners={[mockGivingCampaign]} className='custom-container' />);
    
    const banner = screen.getByTestId('giving-campaign-banner');
    expect(banner).toHaveClass('banner-giving-campaign');
    expect(banner).toHaveClass('custom-container');
  });

  it('should handle empty banner array', () => {
    const { container } = render(<BannerContainer banners={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
