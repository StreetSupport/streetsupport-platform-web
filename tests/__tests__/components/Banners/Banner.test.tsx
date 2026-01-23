import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from '@/components/Banners/Banner';
import { BannerProps } from '@/types/banners';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    const { priority, ...rest } = props;
    return <img {...rest} data-priority={priority ? 'true' : undefined} />;
  },
}));

describe('Banner', () => {
  const baseBanner: BannerProps = {
    id: 'test-1',
    title: 'Test Banner Title',
    description: 'Test banner description',
    mediaType: 'image',
    ctaButtons: [],
    background: { type: 'solid', value: '#38ae8e' },
    textColour: 'white',
    layoutStyle: 'split'
  };

  it('should render banner title', () => {
    render(<Banner {...baseBanner} />);
    expect(screen.getByText('Test Banner Title')).toBeInTheDocument();
  });

  it('should render banner description', () => {
    render(<Banner {...baseBanner} />);
    expect(screen.getByText('Test banner description')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(<Banner {...baseBanner} subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should render image when mediaType is image', () => {
    const bannerWithImage: BannerProps = {
      ...baseBanner,
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 800,
        height: 450
      }
    };
    render(<Banner {...bannerWithImage} />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  it('should render YouTube embed when mediaType is youtube', () => {
    const bannerWithYoutube: BannerProps = {
      ...baseBanner,
      mediaType: 'youtube',
      youtubeUrl: 'https://www.youtube.com/watch?v=abc123'
    };
    render(<Banner {...bannerWithYoutube} />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toBe('https://www.youtube.com/embed/abc123');
  });

  it('should handle youtu.be URLs', () => {
    const bannerWithShortUrl: BannerProps = {
      ...baseBanner,
      mediaType: 'youtube',
      youtubeUrl: 'https://youtu.be/xyz789'
    };
    render(<Banner {...bannerWithShortUrl} />);
    const iframe = document.querySelector('iframe');
    expect(iframe?.src).toBe('https://www.youtube.com/embed/xyz789');
  });

  it('should render CTA buttons', () => {
    const bannerWithCTAs: BannerProps = {
      ...baseBanner,
      ctaButtons: [
        { label: 'Primary Button', url: '/primary', variant: 'primary' },
        { label: 'Secondary Button', url: '/secondary', variant: 'secondary' }
      ]
    };
    render(<Banner {...bannerWithCTAs} />);
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
  });

  it('should mark external links with target _blank', () => {
    const bannerWithExternalLink: BannerProps = {
      ...baseBanner,
      ctaButtons: [
        { label: 'External Link', url: 'https://example.com', variant: 'primary', external: true }
      ]
    };
    render(<Banner {...bannerWithExternalLink} />);
    const link = screen.getByText('External Link').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render logo when provided', () => {
    const bannerWithLogo: BannerProps = {
      ...baseBanner,
      logo: {
        url: 'https://example.com/logo.png',
        alt: 'Test logo',
        width: 150,
        height: 50
      }
    };
    render(<Banner {...bannerWithLogo} />);
    expect(screen.getByAltText('Test logo')).toBeInTheDocument();
  });

  it('should apply split layout classes', () => {
    render(<Banner {...baseBanner} layoutStyle="split" />);
    const container = document.querySelector('.page-container');
    expect(container?.querySelector('.grid.md\\:grid-cols-2')).toBeInTheDocument();
  });

  it('should apply full-width layout classes', () => {
    render(<Banner {...baseBanner} layoutStyle="full-width" />);
    const container = document.querySelector('.page-container');
    expect(container?.querySelector('.text-center')).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(<Banner {...baseBanner} />);
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('aria-labelledby', 'banner-title-test-1');
  });
});
