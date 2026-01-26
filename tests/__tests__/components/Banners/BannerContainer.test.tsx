import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerContainer from '@/components/Banners/BannerContainer';
import { BannerProps } from '@/types/banners';

jest.mock('@/components/Banners/Banner', () => {
  return function MockBanner({ title, className }: { title: string; className?: string }) {
    return <div data-testid="banner" className={className}>{title}</div>;
  };
});

describe('BannerContainer', () => {
  const mockBanners: BannerProps[] = [
    {
      id: '1',
      title: 'First Banner',
      mediaType: 'image',
      ctaButtons: [{ label: 'Click', url: '/click' }],
      background: { type: 'solid', value: '#000' },
      textColour: 'white',
      layoutStyle: 'split'
    },
    {
      id: '2',
      title: 'Second Banner',
      mediaType: 'youtube',
      youtubeUrl: 'https://youtube.com/watch?v=abc123',
      ctaButtons: [],
      background: { type: 'gradient', value: 'linear-gradient(#000, #fff)' },
      textColour: 'white',
      layoutStyle: 'full-width'
    }
  ];

  it('should render all banners', () => {
    render(<BannerContainer banners={mockBanners} />);

    expect(screen.getByText('First Banner')).toBeInTheDocument();
    expect(screen.getByText('Second Banner')).toBeInTheDocument();
  });

  it('should apply custom className to banners', () => {
    render(<BannerContainer banners={mockBanners} className="custom-class" />);

    const banners = screen.getAllByTestId('banner');
    banners.forEach(banner => {
      expect(banner).toHaveClass('custom-class');
    });
  });

  it('should return null when banners array is empty', () => {
    const { container } = render(<BannerContainer banners={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render banners in order', () => {
    render(<BannerContainer banners={mockBanners} />);

    const banners = screen.getAllByTestId('banner');
    expect(banners[0]).toHaveTextContent('First Banner');
    expect(banners[1]).toHaveTextContent('Second Banner');
  });
});
