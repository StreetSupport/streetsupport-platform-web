import { render, screen, fireEvent } from '@testing-library/react';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

// Mock window.open
const mockWindowOpen = jest.fn();

// Mock location and title values
const mockTitle = 'Test Organisation Page';

describe('OrganisationFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.open
    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true,
      configurable: true,
    });
    
    // Mock document.title
    Object.defineProperty(document, 'title', {
      value: mockTitle,
      writable: true,
      configurable: true,
    });
  });

  it('shows social share links', () => {
    render(<OrganisationFooter />);
    expect(screen.getByText(/Share this page:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share on Bluesky/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Share on Facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Share on X/i })).toBeInTheDocument();
  });

  it('opens Bluesky share window when Bluesky button is clicked', () => {
    render(<OrganisationFooter />);
    
    const blueskyButton = screen.getByRole('button', { name: /Share on Bluesky/i });
    fireEvent.click(blueskyButton);
    
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://bsky.app/intent/compose?text='),
      'blank',
      'width=600,height=300'
    );
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
  });

  it('generates correct Facebook share URL', () => {
    render(<OrganisationFooter />);
    
    const facebookLink = screen.getByRole('link', { name: /Share on Facebook/i });
    expect(facebookLink).toHaveAttribute('href', expect.stringContaining('https://www.facebook.com/sharer/sharer.php?u='));
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('generates correct X (Twitter) share URL', () => {
    render(<OrganisationFooter />);
    
    const twitterLink = screen.getByRole('link', { name: /Share on X/i });
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('https://twitter.com/intent/tweet?text='));
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('uses current URL and title for sharing when available', () => {
    render(<OrganisationFooter />);
    
    const blueskyButton = screen.getByRole('button', { name: /Share on Bluesky/i });
    fireEvent.click(blueskyButton);
    
    // Check that the window.open was called with the correct structure
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://bsky.app/intent/compose?text='),
      'blank',
      'width=600,height=300'
    );
    
    // Check that the call includes the title and some URL
    const callArgs = mockWindowOpen.mock.calls[0][0];
    expect(callArgs).toContain('Test%20Organisation%20Page');
    expect(callArgs).toContain('Help%20is%20out%20there');
    expect(callArgs).toContain('Street%20Support%20Network');
  });

  it('handles case when window is not available', () => {
    // Temporarily mock window as undefined
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    expect(() => {
      render(<OrganisationFooter />);
    }).not.toThrow();
    
    // Verify that the component renders without window
    expect(screen.getByText(/Information provided by Street Support/i)).toBeInTheDocument();
    
    // Restore window
    global.window = originalWindow;
  });
  

});