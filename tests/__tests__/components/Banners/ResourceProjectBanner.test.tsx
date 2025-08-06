import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceProjectBanner from '@/components/Banners/ResourceProjectBanner';
import { ResourceProjectProps } from '@/types/banners';

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

describe('ResourceProjectBanner', () => {
  const mockProps: ResourceProjectProps = {
    templateType: 'resource-project',
    title: 'Homelessness User Guide',
    description: 'Comprehensive guide for organisations working with people experiencing homelessness.',
    ctaButtons: [
      { label: 'Download Guide', url: '/guide.pdf', variant: 'primary', external: true }
    ],
    background: {
      type: 'solid',
      value: '#1f2937'
    },
    textColour: 'white',
    layoutStyle: 'full-width',
    trackingContext: 'test-resource'
  };

  beforeEach(() => {
    mockGtag.mockClear();
  });

  it('should render basic banner content', () => {
    render(<ResourceProjectBanner {...mockProps} />);
    
    expect(screen.getByText('Homelessness User Guide')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive guide for organisations working with people experiencing homelessness.')).toBeInTheDocument();
    expect(screen.getByText('Download Guide')).toBeInTheDocument();
  });

  it('should render resource type badges', () => {
    const resourceTypes: Array<{ type: any; label: string; icon: string }> = [
      { type: 'guide', label: 'User Guide', icon: '📖' },
      { type: 'toolkit', label: 'Toolkit', icon: '🧰' },
      { type: 'research', label: 'Research', icon: '📊' },
      { type: 'training', label: 'Training Material', icon: '🎓' },
      { type: 'event', label: 'Event', icon: '📅' }
    ];

    resourceTypes.forEach(({ type, label, icon }) => {
      const { unmount } = render(
        <ResourceProjectBanner {...mockProps} resourceType={type} />
      );
      expect(screen.getByText(`${icon} ${label}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render file type badge', () => {
    const props = { ...mockProps, fileType: 'PDF' };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('📄 PDF')).toBeInTheDocument();
  });

  it('should render file type icons correctly', () => {
    const fileTypes: Array<{ type: string; icon: string }> = [
      { type: 'pdf', icon: '📄' },
      { type: 'doc', icon: '📝' },
      { type: 'xls', icon: '📊' },
      { type: 'ppt', icon: '📽️' },
      { type: 'zip', icon: '🗜️' },
      { type: 'mp4', icon: '🎥' },
      { type: 'mp3', icon: '🎵' }
    ];

    fileTypes.forEach(({ type, icon }) => {
      const { unmount, container } = render(
        <ResourceProjectBanner {...mockProps} fileType={type} />
      );
      // Use a more flexible text matcher to find the span containing both icon and text
      const fileTypeSpan = container.querySelector('span.font-mono');
      expect(fileTypeSpan).toBeInTheDocument();
      expect(fileTypeSpan).toHaveTextContent(`${icon} ${type.toLowerCase()}`);
      unmount();
    });
  });

  it('should render download count stat', () => {
    const props = { ...mockProps, downloadCount: 1234 };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Downloads')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should render file size stat with different formats', () => {
    // Test pre-formatted file size
    const { rerender } = render(
      <ResourceProjectBanner {...mockProps} fileSize="2.5 MB" />
    );
    expect(screen.getByText('File Size')).toBeInTheDocument();
    expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    
    // Test bytes conversion
    rerender(<ResourceProjectBanner {...mockProps} fileSize="1048576" />);
    expect(screen.getByText('1 MB')).toBeInTheDocument();
    
    // Test KB conversion
    rerender(<ResourceProjectBanner {...mockProps} fileSize="2048" />);
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  it('should render last updated date', () => {
    const props = { ...mockProps, lastUpdated: '2024-06-15T10:30:00Z' };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
    expect(screen.getByText(/15 Jun 2024/)).toBeInTheDocument();
  });

  it('should render all resource stats together', () => {
    const props = {
      ...mockProps,
      downloadCount: 500,
      fileSize: '3.2 MB',
      lastUpdated: '2024-01-15T09:00:00Z'
    };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Downloads')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('File Size')).toBeInTheDocument();
    expect(screen.getByText('3.2 MB')).toBeInTheDocument();
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
    expect(screen.getByText(/15 Jan 2024/)).toBeInTheDocument();
  });

  it('should render date range when showDates is true', () => {
    const props = {
      ...mockProps,
      showDates: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Available: 01/01/2024 - 31/12/2024')).toBeInTheDocument();
  });

  it('should render subtitle and badge text', () => {
    const props = {
      ...mockProps,
      subtitle: 'Essential Resources',
      badgeText: 'Updated'
    };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Essential Resources')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('should render download button with download icon', () => {
    render(<ResourceProjectBanner {...mockProps} />);
    
    const downloadButton = screen.getByText('Download Guide');
    expect(downloadButton).toBeInTheDocument();
    
    // Check for download icon SVG
    const svg = downloadButton.closest('a')?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render multiple CTA buttons with appropriate icons', () => {
    const props = {
      ...mockProps,
      ctaButtons: [
        { label: 'Download PDF', url: '/guide.pdf', variant: 'primary' as const, external: true },
        { label: 'View Online', url: '/guide', variant: 'secondary' as const },
        { label: 'External Link', url: 'https://external.com', variant: 'outline' as const, external: true }
      ]
    };
    render(<ResourceProjectBanner {...props} />);
    
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('View Online')).toBeInTheDocument();
    expect(screen.getByText('External Link')).toBeInTheDocument();
  });

  it('should render resource metadata descriptions', () => {
    const metadataTests = [
      {
        type: 'guide',
        heading: 'About This User Guide',
        text: 'This user guide provides step-by-step instructions and best practices to help you get the most out of Street Support Network services.'
      },
      {
        type: 'toolkit',
        heading: 'About This Toolkit',
        text: 'This comprehensive toolkit includes templates, resources, and guidance to support your work in tackling homelessness.'
      },
      {
        type: 'research',
        heading: 'About This Research',
        text: 'This research document presents evidence-based insights and data to inform policy and practice in homelessness support.'
      },
      {
        type: 'training',
        heading: 'About This Training Material',
        text: 'This training material provides educational content to enhance understanding and skills in homelessness support work.'
      },
      {
        type: 'event',
        heading: 'About This Event',
        text: 'This event brings together professionals and volunteers to share knowledge, network, and collaborate on homelessness solutions.'
      }
    ];

    metadataTests.forEach(({ type, heading, text }) => {
      const { unmount } = render(
        <ResourceProjectBanner {...mockProps} resourceType={type as any} />
      );
      expect(screen.getByText(heading)).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
      unmount();
    });
  });

  it('should track analytics on CTA click', () => {
    const props = { ...mockProps, resourceType: 'guide' as const };
    render(<ResourceProjectBanner {...props} />);
    
    const button = screen.getByText('Download Guide');
    fireEvent.click(button);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'resource_project_cta_click', {
      resource_type: 'guide',
      resource_title: 'Homelessness User Guide',
      button_label: 'Download Guide',
      button_position: 1,
      tracking_context: 'test-resource'
    });
  });

  it('should track file downloads separately', () => {
    // Need downloadCount defined to trigger file_download event
    const props = { ...mockProps, downloadCount: 100 };
    render(<ResourceProjectBanner {...props} />);
    
    const button = screen.getByText('Download Guide');
    fireEvent.click(button);
    
    // Should trigger two analytics calls
    expect(mockGtag).toHaveBeenCalledTimes(2);
    
    // First call should be the main CTA click
    expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'resource_project_cta_click', {
      resource_type: 'unknown',
      resource_title: 'Homelessness User Guide',
      button_label: 'Download Guide',
      button_position: 1,
      tracking_context: 'test-resource'
    });
    
    // Second call should be the file download
    expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'file_download', {
      file_name: 'Homelessness User Guide',
      file_type: 'unknown',
      resource_type: 'unknown'
    });
  });

  it('should track file downloads with file type', () => {
    // Need downloadCount defined to trigger file_download event
    const props = { ...mockProps, fileType: 'PDF', resourceType: 'guide' as const, downloadCount: 100 };
    render(<ResourceProjectBanner {...props} />);
    
    const button = screen.getByText('Download Guide');
    fireEvent.click(button);
    
    // Should trigger two analytics calls
    expect(mockGtag).toHaveBeenCalledTimes(2);
    
    // First call should be the main CTA click
    expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'resource_project_cta_click', {
      resource_type: 'guide',
      resource_title: 'Homelessness User Guide',
      button_label: 'Download Guide',
      button_position: 1,
      tracking_context: 'test-resource'
    });
    
    // Second call should be the file download
    expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'file_download', {
      file_name: 'Homelessness User Guide',
      file_type: 'PDF',
      resource_type: 'guide'
    });
  });

  it('should render logo when provided', () => {
    const props = {
      ...mockProps,
      logo: {
        url: '/resource-logo.png',
        alt: 'Resource Logo',
        width: 200,
        height: 60
      }
    };
    render(<ResourceProjectBanner {...props} />);
    
    const logo = screen.getByAltText('Resource Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/resource-logo.png');
  });

  it('should render image in split layout', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'split' as const,
      image: {
        url: '/resource-image.jpg',
        alt: 'Resource Image',
        width: 600,
        height: 400
      }
    };
    render(<ResourceProjectBanner {...props} />);
    
    const image = screen.getByAltText('Resource Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/resource-image.jpg');
  });

  it('should render video in full-width layout', () => {
    const props = {
      ...mockProps,
      layoutStyle: 'full-width' as const,
      video: {
        url: '/resource-video.mp4',
        title: 'Resource Overview Video',
        poster: '/video-poster.jpg',
        captions: '/captions.vtt'
      }
    };
    render(<ResourceProjectBanner {...props} />);
    
    const video = screen.getByLabelText('Resource Overview Video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/resource-video.mp4');
    expect(video).toHaveAttribute('poster', '/video-poster.jpg');
  });

  it('should add download attribute to download links', () => {
    render(<ResourceProjectBanner {...mockProps} />);
    
    const downloadLink = screen.getByText('Download Guide').closest('a');
    expect(downloadLink).toHaveAttribute('download');
  });

  it('should handle different background types', () => {
    const { rerender } = render(
      <ResourceProjectBanner 
        {...mockProps} 
        background={{ type: 'gradient', value: 'linear-gradient(45deg, blue, green)' }} 
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-gradient-to-r');
    
    rerender(
      <ResourceProjectBanner 
        {...mockProps} 
        background={{ type: 'image', value: '/bg-image.jpg' }} 
      />
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-cover');
  });

  it('should apply custom className', () => {
    render(<ResourceProjectBanner {...mockProps} className="custom-resource" />);
    expect(screen.getByRole('banner')).toHaveClass('custom-resource');
  });

  it('should have proper accessibility attributes', () => {
    render(<ResourceProjectBanner {...mockProps} />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-labelledby', 'resource-project-title');
    
    const title = screen.getByText('Homelessness User Guide');
    expect(title).toHaveAttribute('id', 'resource-project-title');
  });

  it('should render accent graphic with positioning', () => {
    const props = {
      ...mockProps,
      accentGraphic: {
        url: '/accent.svg',
        alt: 'Resource Accent',
        position: 'center' as const,
        opacity: 0.3
      }
    };
    render(<ResourceProjectBanner {...props} />);
    
    const accent = screen.getByAltText('Resource Accent');
    expect(accent).toBeInTheDocument();
    expect(accent).toHaveAttribute('src', '/accent.svg');
  });
});