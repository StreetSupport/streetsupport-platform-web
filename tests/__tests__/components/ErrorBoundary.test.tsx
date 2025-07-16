import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow = false, errorMessage = 'Test error' }: { shouldThrow?: boolean; errorMessage?: string }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

// Mock window.location.reload
const mockReload = jest.fn();
delete (window as any).location;
(window as any).location = {
  reload: mockReload,
  href: ''
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders default error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} errorMessage="Custom error" />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Custom error' }),
      expect.any(Object)
    );
  });

  it('refreshes page when refresh button is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /refresh page/i }));
    expect(mockReload).toHaveBeenCalled();
  });

  describe('Location error type', () => {
    it('renders location-specific error message', () => {
      render(
        <ErrorBoundary errorType="location">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Location Error')).toBeInTheDocument();
      expect(screen.getByText(/having trouble accessing your location/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /browse all services/i })).toBeInTheDocument();
    });

    it('navigates to browse all services when button is clicked', () => {
      render(
        <ErrorBoundary errorType="location">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: /browse all services/i }));
      expect(window.location.href).toBe('/find-help?browse=all');
    });
  });

  describe('Services error type', () => {
    it('renders services-specific error message', () => {
      render(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Services Error')).toBeInTheDocument();
      expect(screen.getByText(/couldn't load the services/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Network error type', () => {
    it('renders network-specific error message', () => {
      render(
        <ErrorBoundary errorType="network">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByText(/having trouble connecting/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('shows retry count in network error message', () => {
      const { rerender } = render(
        <ErrorBoundary errorType="network">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Trigger error
      rerender(
        <ErrorBoundary errorType="network">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Click retry to increment count
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));

      // Trigger error again
      rerender(
        <ErrorBoundary errorType="network">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/attempt 2\/3/)).toBeInTheDocument();
    });
  });

  describe('Retry functionality', () => {
    it('calls onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();
      
      render(
        <ErrorBoundary onRetry={onRetry} errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(onRetry).toHaveBeenCalled();
    });

    it('resets error state when retry is clicked', async () => {
      const { rerender } = render(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Services Error')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /retry/i }));

      // Rerender with no error
      rerender(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      await waitFor(() => {
        expect(screen.getByText('No error')).toBeInTheDocument();
      });
    });

    it('disables retry after maximum attempts', () => {
      const { rerender } = render(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Trigger error and retry 3 times
      for (let i = 0; i < 3; i++) {
        rerender(
          <ErrorBoundary errorType="services">
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );

        const retryButton = screen.queryByRole('button', { name: /retry/i });
        if (retryButton) {
          fireEvent.click(retryButton);
        }
      }

      // After 3 retries, retry button should be disabled
      rerender(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
      expect(screen.getByText(/maximum retry attempts reached/i)).toBeInTheDocument();
    });

    it('hides retry button when showRetry is false', () => {
      render(
        <ErrorBoundary showRetry={false} errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toBeInTheDocument();
    });

    it('has proper aria-label for retry button with attempts remaining', () => {
      render(
        <ErrorBoundary errorType="services">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /retry.*3 attempts remaining/i });
      expect(retryButton).toBeInTheDocument();
    });
  });
});