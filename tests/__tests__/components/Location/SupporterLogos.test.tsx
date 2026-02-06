import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SupporterLogos from '@/components/Location/SupporterLogos';

// Mock Next.js Image and Link components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock supporters data for fetch API
const mockSupportersData: Record<string, any[]> = {
  manchester: [
    {
      name: 'holy-name-manchester',
      displayName: 'Holy Name Manchester',
      logoPath: '/assets/img/location-logos/manchester-logos/holy-name-manchester.png',
      url: '/about/our-sponsors/#partner-holy-name'
    },
    {
      name: 'cityco',
      displayName: 'CityCo',
      logoPath: '/assets/img/location-logos/manchester-logos/cityco.png',
      url: '/about/our-sponsors/#partner-cityco'
    },
    {
      name: 'shelter',
      displayName: 'Shelter',
      logoPath: null,
      url: '/about/our-sponsors/#partner-shelter'
    }
  ],
  leeds: [
    {
      name: 'supportchange',
      displayName: 'Supportchange',
      logoPath: '/assets/img/location-logos/leeds-logos/supportchange.png',
      url: 'https://www.youtube.com/watch?v=u6pIRdr3_7Q'
    },
    {
      name: 'leedscouncil',
      displayName: 'Leedscouncil',
      logoPath: '/assets/img/location-logos/leeds-logos/leedscouncil.png',
      url: 'https://www.leeds.gov.uk/'
    }
  ],
  'empty-location': [],
  'no-logos': [
    {
      name: 'supporter-without-logo',
      displayName: 'Supporter Without Logo',
      logoPath: null,
      url: 'https://example.com'
    }
  ]
};

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn().mockImplementation((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    const match = url.match(/\/api\/locations\/(.+)\/logos/);
    const locationSlug = match ? match[1] : '';
    const data = mockSupportersData[locationSlug] || [];

    return Promise.resolve({
      ok: true,
      json: async () => ({
        status: 'success',
        data
      })
    } as Response);
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SupporterLogos', () => {
  it('should render section with supporters when location has supporters with logos', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    await waitFor(() => expect(screen.getByText('Supported by…')).toBeInTheDocument());
    expect(screen.getByText('We work in partnership with these organisations to provide support and services in the local area.')).toBeInTheDocument();
  });

  it('should display logos for supporters with logo paths', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    // Should show supporters with logos
    expect(await screen.findByAltText('Holy Name Manchester')).toBeInTheDocument();
    expect(await screen.findByAltText('CityCo')).toBeInTheDocument();
    
    // Should not show supporters without logos
    expect(screen.queryByAltText('Shelter')).not.toBeInTheDocument();
  });

  it('should render correct number of supporter logos', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    const images = await screen.findAllByRole('img');
    expect(images).toHaveLength(2); // Only supporters with logoPath
  });

  it('should create proper links for supporters with valid URLs', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    // Internal link (no target)
    const internalLink = await screen.findByLabelText('Visit Holy Name Manchester website');
    expect(internalLink).toHaveAttribute('href', '/about/our-sponsors/#partner-holy-name');
    expect(internalLink).not.toHaveAttribute('target');
    expect(internalLink).not.toHaveAttribute('rel');
    
    // Internal link with hash
    const hashLink = await screen.findByLabelText('Visit CityCo website');
    expect(hashLink).toHaveAttribute('href', '/about/our-sponsors/#partner-cityco');
  });

  it('should create external links with proper attributes', async () => {
    render(<SupporterLogos locationSlug="leeds" />);
    
    // External link (with target and rel)
    const externalLink = await screen.findByLabelText('Visit Supportchange website');
    expect(externalLink).toHaveAttribute('href', 'https://www.youtube.com/watch?v=u6pIRdr3_7Q');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render images with correct src and alt attributes', async () => {
    render(<SupporterLogos locationSlug="leeds" />);
    
    const image1 = await screen.findByAltText('Supportchange');
    expect(image1).toHaveAttribute('src', '/assets/img/location-logos/leeds-logos/supportchange.png');
    
    const image2 = await screen.findByAltText('Leedscouncil');
    expect(image2).toHaveAttribute('src', '/assets/img/location-logos/leeds-logos/leedscouncil.png');
  });

  it('should render nothing when location has no supporters', async () => {
    const { container } = render(<SupporterLogos locationSlug="empty-location" />);
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it('should render nothing when location has no supporters with logos', async () => {
    const { container } = render(<SupporterLogos locationSlug="no-logos" />);
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it('should render nothing when location does not exist in data', async () => {
    const { container } = render(<SupporterLogos locationSlug="nonexistent-location" />);
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it('should apply responsive grid classes', async () => {
    const { container } = render(<SupporterLogos locationSlug="manchester" />);
    
    await waitFor(() => {
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass(
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2', 
        'md:grid-cols-3',
        'lg:grid-cols-4',
        'xl:grid-cols-5'
      );
    });
  });

  it('should apply custom className', async () => {
    const { container } = render(<SupporterLogos locationSlug="manchester" className="custom-supporters" />);
    
    await waitFor(() => {
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-supporters');
    });
  });

  it('should have proper accessibility attributes', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    // Section should have proper heading structure
    const heading = await screen.findByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Supported by…');
    
    // Links should have proper aria-labels
    expect(await screen.findByLabelText('Visit Holy Name Manchester website')).toBeInTheDocument();
    expect(await screen.findByLabelText('Visit CityCo website')).toBeInTheDocument();
  });

  it('should include screen reader context', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    // Should have hidden content for screen readers
    const srContent = await screen.findByText(/This section displays logos of 2 organisations/);
    expect(srContent).toBeInTheDocument();
    expect(srContent.closest('div')).toHaveClass('sr-only');
  });

  it('should render with correct section styling', async () => {
    const { container } = render(<SupporterLogos locationSlug="manchester" />);
    
    await waitFor(() => {
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-12', 'bg-gray-50');
      
      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
    });
  });

  it('should handle supporters with hash URLs correctly', async () => {
    render(<SupporterLogos locationSlug="manchester" />);
    
    // URLs with # should not be treated as external
    const hashLink = await screen.findByLabelText('Visit CityCo website');
    expect(hashLink).not.toHaveAttribute('target');
    expect(hashLink).not.toHaveAttribute('rel');
  });

  it('should render tooltip structure for logos', async () => {
    const { container } = render(<SupporterLogos locationSlug="manchester" />);
    
    await waitFor(() => {
      // Check for tooltip elements (though they're hidden by default)
      const tooltips = container.querySelectorAll('.absolute.-bottom-8');
      expect(tooltips.length).toBeGreaterThan(0);
      
      // Verify tooltip content
      expect(container.textContent).toContain('Holy Name Manchester');
      expect(container.textContent).toContain('CityCo');
    });
  });

  it('should apply proper image styling and loading attributes', async () => {
    render(<SupporterLogos locationSlug="leeds" />);
    
    const images = await screen.findAllByRole('img');
    
    images.forEach(img => {
      expect(img).toHaveClass('object-contain', 'max-w-full', 'max-h-full');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('width', '200');
      expect(img).toHaveAttribute('height', '120');
    });
  });

  it('should handle SVG images correctly', async () => {
    // Test that images have proper attributes
    render(<SupporterLogos locationSlug="leeds" />);
    
    const images = await screen.findAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // All images should have lazy loading
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });
});