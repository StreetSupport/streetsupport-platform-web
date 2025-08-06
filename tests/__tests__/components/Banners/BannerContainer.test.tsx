import React from 'react';
import { render, screen, act } from '@testing-library/react';
import BannerContainer, { useBanners } from '@/components/Banners/BannerContainer';
import { AnyBannerProps, GivingCampaignProps, PartnershipCharterProps, ResourceProjectProps } from '@/types/banners';

// Mock the individual banner components
jest.mock('@/components/Banners/GivingCampaignBanner', () => {
  return function MockGivingCampaignBanner({ title, className }: any) {
    return <div data-testid="giving-campaign-banner" className={className}>{title}</div>;
  };
});

jest.mock('@/components/Banners/PartnershipCharterBanner', () => {
  return function MockPartnershipCharterBanner({ title, className }: any) {
    return <div data-testid="partnership-charter-banner" className={className}>{title}</div>;
  };
});

jest.mock('@/components/Banners/ResourceProjectBanner', () => {
  return function MockResourceProjectBanner({ title, className }: any) {
    return <div data-testid="resource-project-banner" className={className}>{title}</div>;
  };
});

// Mock validation utility
jest.mock('@/utils/bannerUtils', () => ({
  validateBannerProps: jest.fn().mockReturnValue({ isValid: true, errors: [] })
}));

describe('BannerContainer', () => {
  const mockGivingCampaign: GivingCampaignProps = {
    id: '1',
    templateType: 'giving-campaign',
    title: 'Support Campaign',
    ctaButtons: [{ label: 'Donate', url: '/donate' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width',
    isActive: true,
    priority: 2
  };

  const mockPartnershipCharter: PartnershipCharterProps = {
    id: '2',
    templateType: 'partnership-charter',
    title: 'Join Charter',
    ctaButtons: [{ label: 'Sign', url: '/sign' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width',
    isActive: true,
    priority: 3
  };

  const mockResourceProject: ResourceProjectProps = {
    id: '3',
    templateType: 'resource-project',
    title: 'Download Guide',
    ctaButtons: [{ label: 'Download', url: '/guide' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width',
    isActive: true,
    priority: 1
  };

  const mockBanners: AnyBannerProps[] = [
    mockGivingCampaign,
    mockPartnershipCharter,
    mockResourceProject
  ];

  beforeEach(() => {
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockClear();
    validateBannerProps.mockReturnValue({ isValid: true, errors: [] });
  });

  it('should render all active banners', () => {
    render(<BannerContainer banners={mockBanners} />);
    
    expect(screen.getByTestId('giving-campaign-banner')).toBeInTheDocument();
    expect(screen.getByTestId('partnership-charter-banner')).toBeInTheDocument();
    expect(screen.getByTestId('resource-project-banner')).toBeInTheDocument();
  });

  it('should sort banners by priority (highest first)', () => {
    const { container } = render(<BannerContainer banners={mockBanners} />);
    
    const bannerContainer = container.querySelector('.banner-container');
    const banners = bannerContainer?.querySelectorAll('[data-testid]');
    
    expect(banners).toBeTruthy();
    // Should be sorted by priority: Partnership (3), Giving (2), Resource (1)
    expect(banners![0]).toHaveAttribute('data-testid', 'partnership-charter-banner');
    expect(banners![1]).toHaveAttribute('data-testid', 'giving-campaign-banner');
    expect(banners![2]).toHaveAttribute('data-testid', 'resource-project-banner');
  });

  it('should filter out inactive banners', () => {
    const bannersWithInactive = [
      { ...mockGivingCampaign, isActive: false },
      mockPartnershipCharter,
      mockResourceProject
    ];

    render(<BannerContainer banners={bannersWithInactive} />);
    
    expect(screen.queryByTestId('giving-campaign-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('partnership-charter-banner')).toBeInTheDocument();
    expect(screen.getByTestId('resource-project-banner')).toBeInTheDocument();
  });

  it('should filter by location slug', () => {
    const bannersWithLocations = [
      { ...mockGivingCampaign, locationSlug: 'manchester' },
      { ...mockPartnershipCharter, locationSlug: 'birmingham' },
      { ...mockResourceProject, locationSlug: 'manchester' }
    ];

    render(<BannerContainer banners={bannersWithLocations} locationSlug="manchester" />);
    
    expect(screen.getByTestId('giving-campaign-banner')).toBeInTheDocument();
    expect(screen.queryByTestId('partnership-charter-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('resource-project-banner')).toBeInTheDocument();
  });

  it('should limit number of displayed banners', () => {
    const { container } = render(<BannerContainer banners={mockBanners} maxDisplay={2} />);
    
    const bannerContainer = container.querySelector('.banner-container');
    const banners = bannerContainer?.querySelectorAll('[data-testid]');
    
    expect(banners).toHaveLength(2);
  });

  it('should handle validation errors', () => {
    const onBannerError = jest.fn();
    const { validateBannerProps } = require('@/utils/bannerUtils');
    
    validateBannerProps.mockReturnValue({
      isValid: false,
      errors: ['Title is required', 'CTA buttons are required']
    });

    render(<BannerContainer banners={[mockGivingCampaign]} onBannerError={onBannerError} />);
    
    expect(onBannerError).toHaveBeenCalledWith(
      'Banner validation failed: Title is required, CTA buttons are required',
      '1'
    );
  });

  it('should handle unknown template types', () => {
    const onBannerError = jest.fn();
    const unknownBanner = {
      ...mockGivingCampaign,
      templateType: 'unknown-type' as any
    };

    render(<BannerContainer banners={[unknownBanner]} onBannerError={onBannerError} />);
    
    expect(onBannerError).toHaveBeenCalledWith(
      'Unknown banner template type: unknown-type',
      '1'
    );
  });

  it('should apply CSS classes correctly', () => {
    render(<BannerContainer banners={[mockGivingCampaign]} className="custom-container" />);
    
    const banner = screen.getByTestId('giving-campaign-banner');
    expect(banner).toHaveClass('banner-giving-campaign');
    expect(banner).toHaveClass('custom-container');
  });

  it('should render nothing when no active banners', () => {
    const inactiveBanners = [
      { ...mockGivingCampaign, isActive: false },
      { ...mockPartnershipCharter, isActive: false }
    ];

    const { container } = render(<BannerContainer banners={inactiveBanners} />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle empty banner array', () => {
    const { container } = render(<BannerContainer banners={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should sort banners without priority by ID', () => {
    const bannersWithoutPriority = [
      { ...mockGivingCampaign, id: 'c', priority: undefined },
      { ...mockPartnershipCharter, id: 'a', priority: undefined },
      { ...mockResourceProject, id: 'b', priority: undefined }
    ];

    const { container } = render(<BannerContainer banners={bannersWithoutPriority} />);
    
    const bannerContainer = container.querySelector('.banner-container');
    const banners = bannerContainer?.querySelectorAll('[data-testid]');
    
    expect(banners).toBeTruthy();
    // Should be sorted by ID: a, b, c
    expect(banners![0]).toHaveAttribute('data-testid', 'partnership-charter-banner');
    expect(banners![1]).toHaveAttribute('data-testid', 'resource-project-banner');
    expect(banners![2]).toHaveAttribute('data-testid', 'giving-campaign-banner');
  });
});

// Test the useBanners hook
describe('useBanners Hook', () => {
  function TestComponent({ locationSlug }: { locationSlug: string }) {
    const { banners, loading, error, addBanner, updateBanner, deleteBanner, toggleBannerVisibility } = useBanners(locationSlug);
    
    const handleAddBanner = async () => {
      try {
        await addBanner(mockGivingCampaign);
      } catch (err) {
        // Error is handled in the hook
      }
    };
    
    // Use the first banner's ID if available
    const firstBannerId = banners.length > 0 ? banners[0].id || '1' : '1';
    
    return (
      <div>
        <div data-testid="loading">{loading.toString()}</div>
        <div data-testid="error">{error || 'no-error'}</div>
        <div data-testid="banner-count">{banners.length}</div>
        <button onClick={handleAddBanner}>Add Banner</button>
        <button onClick={() => updateBanner(firstBannerId, { title: 'Updated Title' })}>Update Banner</button>
        <button onClick={() => deleteBanner(firstBannerId)}>Delete Banner</button>
        <button onClick={() => toggleBannerVisibility(firstBannerId)}>Toggle Banner</button>
      </div>
    );
  }

  const mockGivingCampaign: GivingCampaignProps = {
    id: '1',
    templateType: 'giving-campaign',
    title: 'Test Campaign',
    ctaButtons: [{ label: 'Test', url: '/test' }],
    background: { type: 'solid', value: '#000' },
    textColour: 'white',
    layoutStyle: 'full-width'
  };

  it('should initialize with empty state', () => {
    render(<TestComponent locationSlug="manchester" />);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(screen.getByTestId('banner-count')).toHaveTextContent('0');
  });

  it('should add banner', () => {
    // Reset validation mock to return valid
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockReturnValue({ isValid: true, errors: [] });
    
    render(<TestComponent locationSlug="manchester" />);
    
    const addButton = screen.getByText('Add Banner');
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('banner-count')).toHaveTextContent('1');
  });

  it('should validate banner before adding', async () => {
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockReturnValue({
      isValid: false,
      errors: ['Invalid banner']
    });

    render(<TestComponent locationSlug="manchester" />);
    
    const addButton = screen.getByText('Add Banner');
    
    await act(async () => {
      addButton.click();
    });
    
    // Banner should not be added due to validation error
    expect(screen.getByTestId('banner-count')).toHaveTextContent('0');
  });

  it('should update banner', () => {
    // Reset validation mock to return valid
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockReturnValue({ isValid: true, errors: [] });
    
    render(<TestComponent locationSlug="manchester" />);
    
    // First add a banner
    const addButton = screen.getByText('Add Banner');
    act(() => {
      addButton.click();
    });
    
    // Then update it
    const updateButton = screen.getByText('Update Banner');
    act(() => {
      updateButton.click();
    });
    
    // Banner should still exist (count should remain 1)
    expect(screen.getByTestId('banner-count')).toHaveTextContent('1');
  });

  it('should delete banner', () => {
    // Reset validation mock to return valid
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockReturnValue({ isValid: true, errors: [] });
    
    render(<TestComponent locationSlug="manchester" />);
    
    // First add a banner
    const addButton = screen.getByText('Add Banner');
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByTestId('banner-count')).toHaveTextContent('1');
    
    // Then delete it
    const deleteButton = screen.getByText('Delete Banner');
    act(() => {
      deleteButton.click();
    });
    
    expect(screen.getByTestId('banner-count')).toHaveTextContent('0');
  });

  it('should toggle banner visibility', () => {
    // Reset validation mock to return valid
    const { validateBannerProps } = require('@/utils/bannerUtils');
    validateBannerProps.mockReturnValue({ isValid: true, errors: [] });
    
    render(<TestComponent locationSlug="manchester" />);
    
    // First add a banner
    const addButton = screen.getByText('Add Banner');
    act(() => {
      addButton.click();
    });
    
    // Then toggle its visibility
    const toggleButton = screen.getByText('Toggle Banner');
    act(() => {
      toggleButton.click();
    });
    
    // Banner should still exist in the array
    expect(screen.getByTestId('banner-count')).toHaveTextContent('1');
  });
});