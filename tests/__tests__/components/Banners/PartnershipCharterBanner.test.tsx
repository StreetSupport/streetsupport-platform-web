import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PartnershipCharterBanner from '@/components/Banners/PartnershipCharterBanner';
import { PartnershipCharterProps } from '@/types/banners';

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

describe('PartnershipCharterBanner', () => {
  const mockProps: PartnershipCharterProps = {
    templateType: 'partnership-charter',
    title: 'Join Our Homeless Charter',
    description: 'Work with us to end rough sleeping through coordinated action.',
    ctaButtons: [
      { label: 'Sign the Charter', url: '/charter/sign', variant: 'primary' }
    ],
    background: {
      type: 'solid',
      value: '#1f2937'
    },
    textColour: 'white',
    layoutStyle: 'full-width',
    trackingContext: 'test-charter'
  };

  beforeEach(() => {
    mockGtag.mockClear();
  });

  it('should render basic banner content', () => {
    render(<PartnershipCharterBanner {...mockProps} />);
    
    expect(screen.getByText('Join Our Homeless Charter')).toBeInTheDocument();
    expect(screen.getByText('Work with us to end rough sleeping through coordinated action.')).toBeInTheDocument();
    expect(screen.getByText('Sign the Charter')).toBeInTheDocument();
  });

  it('should render charter type badge', () => {
    const props = { ...mockProps, charterType: 'homeless-charter' as const };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('📋 Homeless Charter')).toBeInTheDocument();
  });

  it('should render all charter type variants', () => {
    const charterTypes: Array<{ type: any; label: string; icon: string }> = [
      { type: 'homeless-charter', label: 'Homeless Charter', icon: '📋' },
      { type: 'real-change', label: 'Real Change Campaign', icon: '💰' },
      { type: 'alternative-giving', label: 'Alternative Giving', icon: '🎁' },
      { type: 'partnership', label: 'Partnership Initiative', icon: '🤝' }
    ];

    charterTypes.forEach(({ type, label, icon }) => {
      const { unmount } = render(
        <PartnershipCharterBanner {...mockProps} charterType={type} />
      );
      expect(screen.getByText(`${icon} ${label}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render signatory count', () => {
    const props = { ...mockProps, signatoriesCount: 42 };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Signatories')).toBeInTheDocument();
    expect(screen.getByText('Organisations have signed up')).toBeInTheDocument();
  });

  it('should handle singular signatory count', () => {
    const props = { ...mockProps, signatoriesCount: 1 };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Signatory')).toBeInTheDocument();
    expect(screen.getByText('Organisation has signed up')).toBeInTheDocument();
  });

  it('should render partner logos', () => {
    const props = {
      ...mockProps,
      partnerLogos: [
        { url: '/partner1.png', alt: 'Partner 1', width: 80, height: 50 },
        { url: '/partner2.png', alt: 'Partner 2', width: 80, height: 50 },
        { url: '/partner3.png', alt: 'Partner 3', width: 80, height: 50 }
      ]
    };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('In partnership with:')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 1')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 2')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 3')).toBeInTheDocument();
  });

  it('should render charter commitment statements', () => {
    const commitments = [
      {
        type: 'homeless-charter',
        text: "We're committed to working together to end rough sleeping and prevent homelessness in our community through coordinated, evidence-based approaches."
      },
      {
        type: 'real-change',
        text: "We believe in supporting people to make real, lasting changes to their lives through dignified giving and comprehensive support services."
      },
      {
        type: 'alternative-giving',
        text: "We're dedicated to channelling generosity towards sustainable solutions that address the root causes of homelessness."
      },
      {
        type: 'partnership',
        text: "We're working in partnership to create lasting change and improve outcomes for people experiencing homelessness."
      }
    ];

    commitments.forEach(({ type, text }) => {
      const { unmount } = render(
        <PartnershipCharterBanner {...mockProps} charterType={type as any} />
      );
      expect(screen.getByText('Our Commitment')).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render badge text', () => {
    const props = { ...mockProps, badgeText: 'New Initiative' };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('New Initiative')).toBeInTheDocument();
  });

  it('should render date range when startDate and endDate are provided', () => {
    const props = {
      ...mockProps,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('01/01/2024 - 31/12/2024')).toBeInTheDocument();
  });

  it('should render logo when provided', () => {
    const props = {
      ...mockProps,
      logo: {
        url: '/charter-logo.png',
        alt: 'Charter Logo',
        width: 200,
        height: 60
      }
    };
    render(<PartnershipCharterBanner {...props} />);
    
    const logo = screen.getByAltText('Charter Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/charter-logo.png');
  });

  it('should render image in split layout', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'split' as const,
      image: {
        url: '/charter-image.jpg',
        alt: 'Charter Image',
        width: 600,
        height: 400
      }
    };
    render(<PartnershipCharterBanner {...props} />);
    
    const image = screen.getByAltText('Charter Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/charter-image.jpg');
  });

  it('should render video with captions', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'split' as const,
      video: {
        url: '/charter-video.mp4',
        title: 'Charter Explanation Video',
        poster: '/video-poster.jpg',
        captions: '/captions.vtt'
      }
    };
    render(<PartnershipCharterBanner {...props} />);
    
    const video = screen.getByLabelText('Charter Explanation Video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/charter-video.mp4');
    expect(video).toHaveAttribute('poster', '/video-poster.jpg');
    
    const track = video.querySelector('track');
    expect(track).toHaveAttribute('src', '/captions.vtt');
    expect(track).toHaveAttribute('srcLang', 'en');
  });

  it('should render multiple CTA buttons with different variants', () => {
    const props = {
      ...mockProps,
      ctaButtons: [
        { label: 'Sign Charter', url: '/sign', variant: 'primary' as const },
        { label: 'Learn More', url: '/info', variant: 'secondary' as const },
        { label: 'Download PDF', url: '/charter.pdf', variant: 'outline' as const, external: true }
      ]
    };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('Sign Charter')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    
    const externalLink = screen.getByText('Download PDF').closest('a');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should track analytics on CTA click', () => {
    const props = { ...mockProps, charterType: 'homeless-charter' as const };
    render(<PartnershipCharterBanner {...props} />);
    
    const button = screen.getByText('Sign the Charter');
    fireEvent.click(button);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'partnership_charter_cta_click', {
      charter_type: 'homeless-charter',
      charter_title: 'Join Our Homeless Charter',
      button_label: 'Sign the Charter',
      button_position: 1,
      tracking_context: 'test-charter'
    });
  });

  it('should render background overlay', () => {
    const props = {
      ...mockProps,
      background: {
        ...mockProps.background,
        overlay: {
          colour: '#000000',
          opacity: 0.6
        }
      }
    };
    const { container } = render(<PartnershipCharterBanner {...props} />);
    
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });

  it('should render accent graphic with custom positioning', () => {
    const props = {
      ...mockProps,
      accentGraphic: {
        url: '/accent.svg',
        alt: 'Partnership Accent',
        position: 'bottom-left' as const,
        opacity: 0.4
      }
    };
    render(<PartnershipCharterBanner {...props} />);
    
    const accent = screen.getByAltText('Partnership Accent');
    expect(accent).toBeInTheDocument();
    expect(accent).toHaveAttribute('src', '/accent.svg');
  });

  it('should handle different layout styles', () => {
    const { rerender, container } = render(<PartnershipCharterBanner {...mockProps} layoutStyle="full-width" />);
    const layoutContainer = container.querySelector('.text-center');
    expect(layoutContainer).toBeInTheDocument();
    
    rerender(<PartnershipCharterBanner {...mockProps} layoutStyle="card" />);
    const cardContainer = container.querySelector('.max-w-4xl.mx-auto.bg-white\\/10');
    expect(cardContainer).toBeInTheDocument();
  });

  it('should handle different text colours', () => {
    const { rerender } = render(<PartnershipCharterBanner {...mockProps} textColour="white" />);
    expect(screen.getByRole('banner')).toHaveClass('text-white');
    
    rerender(<PartnershipCharterBanner {...mockProps} textColour="black" />);
    expect(screen.getByRole('banner')).toHaveClass('text-gray-900');
  });

  it('should apply custom className', () => {
    render(<PartnershipCharterBanner {...mockProps} className="custom-charter" />);
    expect(screen.getByRole('banner')).toHaveClass('custom-charter');
  });

  it('should have proper accessibility attributes', () => {
    render(<PartnershipCharterBanner {...mockProps} />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-labelledby', 'partnership-charter-title');
    
    const title = screen.getByText('Join Our Homeless Charter');
    expect(title).toHaveAttribute('id', 'partnership-charter-title');
  });

  it('should render subtitle when provided', () => {
    const props = { ...mockProps, subtitle: 'Building Partnerships for Change' };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('Building Partnerships for Change')).toBeInTheDocument();
  });

  it('should format signatory count with locale formatting', () => {
    const props = { ...mockProps, signatoriesCount: 1234 };
    render(<PartnershipCharterBanner {...props} />);
    
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });
});