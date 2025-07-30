'use client';

import React, { Component, ReactNode } from 'react';

export type ErrorType = 'location' | 'services' | 'network' | 'generic';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  errorType?: ErrorType;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }



  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }


  getErrorMessage(): { title: string; message: string } {
    const { errorType } = this.props;

    switch (errorType) {
      case 'location':
        return {
          title: 'Location Error',
          message: 'We\'re having trouble accessing your location. You can still browse services by entering your postcode.'
        };
      case 'services':
        return {
          title: 'Services Error',
          message: 'We couldn\'t load the services right now. Please check your connection and try again.'
        };
      case 'network':
        return {
          title: 'Connection Error',
          message: 'We\'re having trouble connecting. Please check your internet connection.'
        };
      default:
        return {
          title: 'Something went wrong',
          message: 'An unexpected error occurred. Please try refreshing the page.'
        };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, message } = this.getErrorMessage();

      return (
        <div className="bg-red-50 border border-brand-g rounded-md p-4 m-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-brand-g" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-small font-medium text-brand-g">{title}</h3>
              <p className="mt-1 text-small text-brand-g">{message}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-base btn-neutral btn-sm"
                  data-testid="refresh-button"
                >
                  Refresh Page
                </button>
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