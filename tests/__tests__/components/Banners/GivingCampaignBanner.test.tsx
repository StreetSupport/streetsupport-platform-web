import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GivingCampaignBanner from '@/components/Banners/GivingCampaignBanner';
import { GivingCampaignProps } from '@/types/banners';

// Mock Next.js Image and Link components
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    return <img {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, ...props }: any) {
    return <a {...props}>{children}</a>;
  };
});

// Mock window.gtag for analytics testing
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  value: mockGtag,
  writable: true
});

describe('GivingCampaignBanner', () => {
  const mockProps: GivingCampaignProps = {
    templateType: 'giving-campaign',
    title: 'Support Homeless Services',
    description: 'Help us provide essential services to people experiencing homelessness.',
    ctaButtons: [
      { label: 'Donate Now', url: '/donate', variant: 'primary' }
    ],
    background: {
      type: 'solid',
      value: '#1f2937'
    },
    textColour: 'white',
    layoutStyle: 'full-width',
    trackingContext: 'test-campaign'
  };

  beforeEach(() => {
    mockGtag.mockClear();
  });

  it('should render basic banner content', () => {
    render(<GivingCampaignBanner {...mockProps} />);
    
    expect(screen.getByText('Support Homeless Services')).toBeInTheDocument();
    expect(screen.getByText('Help us provide essential services to people experiencing homelessness.')).toBeInTheDocument();
    expect(screen.getByText('Donate Now')).toBeInTheDocument();
  });

  it('should render with subtitle when provided', () => {
    const props = { ...mockProps, subtitle: 'Emergency Campaign' };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('Emergency Campaign')).toBeInTheDocument();
  });

  it('should render logo when provided', () => {
    const props = {
      ...mockProps,
      logo: {
        url: '/logo.png',
        alt: 'Campaign Logo',
        width: 200,
        height: 60
      }
    };
    render(<GivingCampaignBanner {...props} />);
    
    const logo = screen.getByAltText('Campaign Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('should render donation goal progress', () => {
    const props = {
      ...mockProps,
      donationGoal: {
        target: 10000,
        current: 2500,
        currency: 'GBP'
      }
    };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('£2,500 raised')).toBeInTheDocument();
    expect(screen.getByText('of £10,000 goal')).toBeInTheDocument();
    expect(screen.getByText('25% funded • 75% to go')).toBeInTheDocument();
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
  });

  it('should render urgency indicators', () => {
    const props = {
      ...mockProps,
      urgencyLevel: 'critical' as const,
      badgeText: 'Limited Time'
    };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('Limited Time')).toBeInTheDocument();
    expect(screen.getByText('🚨 Critical')).toBeInTheDocument();
  });

  it('should render campaign end date', () => {
    const props = {
      ...mockProps,
      campaignEndDate: '2024-12-31T23:59:59Z'
    };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('Campaign ends:')).toBeInTheDocument();
    expect(screen.getByText(/Tuesday.*31.*December.*2024/)).toBeInTheDocument();
  });

  it('should render date range when showDates is true', () => {
    const props = {
      ...mockProps,
      showDates: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('01/01/2024 - 31/12/2024')).toBeInTheDocument();
  });

  it('should render multiple CTA buttons', () => {
    const props = {
      ...mockProps,
      ctaButtons: [
        { label: 'Donate Now', url: '/donate', variant: 'primary' as const },
        { label: 'Learn More', url: '/about', variant: 'secondary' as const }
      ]
    };
    render(<GivingCampaignBanner {...props} />);
    
    expect(screen.getByText('Donate Now')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('should render external link with icon', () => {
    const props = {
      ...mockProps,
      ctaButtons: [
        { label: 'External Link', url: 'https://external.com', external: true }
      ]
    };
    render(<GivingCampaignBanner {...props} />);
    
    const link = screen.getByText('External Link').closest('a');
    expect(link).toHaveAttribute('href', 'https://external.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render image in split layout', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'split' as const,
      image: {
        url: '/campaign-image.jpg',
        alt: 'Campaign Image',
        width: 600,
        height: 400
      }
    };
    render(<GivingCampaignBanner {...props} />);
    
    const image = screen.getByAltText('Campaign Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/campaign-image.jpg');
  });

  it('should render video in split layout', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'split' as const,
      video: {
        url: '/campaign-video.mp4',
        title: 'Campaign Video',
        poster: '/video-poster.jpg',
        captions: '/captions.vtt'
      }
    };
    render(<GivingCampaignBanner {...props} />);
    
    const video = screen.getByLabelText('Campaign Video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/campaign-video.mp4');
    expect(video).toHaveAttribute('poster', '/video-poster.jpg');
  });

  it('should render accent graphic', () => {
    const props = {
      ...mockProps,
      accentGraphic: {
        url: '/accent.svg',
        alt: 'Accent Graphic',
        position: 'top-right' as const,
        opacity: 0.8
      }
    };
    render(<GivingCampaignBanner {...props} />);
    
    const accent = screen.getByAltText('Accent Graphic');
    expect(accent).toBeInTheDocument();
    expect(accent).toHaveAttribute('src', '/accent.svg');
  });

  it('should render background overlay', () => {
    const props = {
      ...mockProps,
      background: {
        ...mockProps.background,
        overlay: {
          colour: '#000000',
          opacity: 0.5
        }
      }
    };
    const { container } = render(<GivingCampaignBanner {...props} />);
    
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });

  it('should track analytics on CTA click', () => {
    render(<GivingCampaignBanner {...mockProps} />);
    
    const button = screen.getByText('Donate Now');
    fireEvent.click(button);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'giving_campaign_cta_click', {
      campaign_title: 'Support Homeless Services',
      button_label: 'Donate Now',
      button_position: 1,
      tracking_context: 'test-campaign'
    });
  });

  it('should handle different layout styles', () => {
    const { rerender, container } = render(<GivingCampaignBanner {...mockProps} layoutStyle="full-width" />);
    const layoutContainer = container.querySelector('.text-center');
    expect(layoutContainer).toBeInTheDocument();
    
    rerender(<GivingCampaignBanner {...mockProps} layoutStyle="split" />);
    const splitContainer = container.querySelector('.grid.md\\:grid-cols-2');
    expect(splitContainer).toBeInTheDocument();
  });

  it('should handle different text colours', () => {
    const { rerender } = render(<GivingCampaignBanner {...mockProps} textColour="white" />);
    expect(screen.getByRole('banner')).toHaveClass('text-white');
    
    rerender(<GivingCampaignBanner {...mockProps} textColour="black" />);
    expect(screen.getByRole('banner')).toHaveClass('text-gray-900');
  });

  it('should handle different background types', () => {
    const { rerender } = render(
      <GivingCampaignBanner 
        {...mockProps} 
        background={{ type: 'solid', value: '#ff0000' }} 
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-gray-900');
    
    rerender(
      <GivingCampaignBanner 
        {...mockProps} 
        background={{ type: 'gradient', value: 'linear-gradient(45deg, red, blue)' }} 
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-gradient-to-r');
    
    rerender(
      <GivingCampaignBanner 
        {...mockProps} 
        background={{ type: 'image', value: '/bg-image.jpg' }} 
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-cover');
  });

  it('should apply custom className', () => {
    render(<GivingCampaignBanner {...mockProps} className="custom-banner" />);
    expect(screen.getByRole('banner')).toHaveClass('custom-banner');
  });

  it('should have proper accessibility attributes', () => {
    render(<GivingCampaignBanner {...mockProps} />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-labelledby', 'giving-campaign-title');
    
    const title = screen.getByText('Support Homeless Services');
    expect(title).toHaveAttribute('id', 'giving-campaign-title');
  });
});