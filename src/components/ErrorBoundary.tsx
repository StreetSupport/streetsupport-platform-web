'use client';

import React, { Component, ReactNode } from 'react';

export type ErrorType = 'location' | 'services' | 'network' | 'generic';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRetry?: () => void;
  errorType?: ErrorType;
  showRetry?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount >= 3) {
      return; // Max retry attempts reached
    }

    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined,
      retryCount: prevState.retryCount + 1 
    }));

    // Call custom retry handler if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    // Auto-retry with exponential backoff for network errors
    if (this.props.errorType === 'network' && this.state.retryCount < 2) {
      const delay = Math.pow(2, this.state.retryCount) * 1000; // 1s, 2s, 4s
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, delay);
    }
  };

  getErrorMessage(): { title: string; message: string; actionText: string } {
    const { errorType } = this.props;
    const { error, retryCount } = this.state;

    switch (errorType) {
      case 'location':
        return {
          title: 'Location Error',
          message: 'We\'re having trouble accessing your location. You can still browse services by entering your postcode.',
          actionText: 'Try Again'
        };
      case 'services':
        return {
          title: 'Services Error',
          message: 'We couldn\'t load the services right now. Please check your connection and try again.',
          actionText: 'Retry'
        };
      case 'network':
        return {
          title: 'Connection Error',
          message: retryCount > 0 
            ? `Connection failed (attempt ${retryCount + 1}/3). Please check your internet connection.`
            : 'We\'re having trouble connecting. Please check your internet connection.',
          actionText: 'Retry'
        };
      default:
        return {
          title: 'Something went wrong',
          message: error?.message || 'An unexpected error occurred. Please try refreshing the page.',
          actionText: 'Refresh Page'
        };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, message, actionText } = this.getErrorMessage();
      const { showRetry = true } = this.props;
      const maxRetriesReached = this.state.retryCount >= 3;

      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">{title}</h3>
              <p className="mt-1 text-sm text-red-700">{message}</p>
              
              {maxRetriesReached && (
                <p className="mt-2 text-xs text-red-600">
                  Maximum retry attempts reached. Please refresh the page or try again later.
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {showRetry && !maxRetriesReached && (
                  <button
                    onClick={this.handleRetry}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`${actionText} (${3 - this.state.retryCount} attempts remaining)`}
                  >
                    {actionText}
                  </button>
                )}
                
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Refresh Page
                </button>

                {this.props.errorType === 'location' && (
                  <button
                    onClick={() => {
                      // Navigate to browse all services
                      window.location.href = '/find-help?browse=all';
                    }}
                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Browse All Services
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;