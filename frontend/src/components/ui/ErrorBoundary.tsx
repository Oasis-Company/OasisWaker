import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Swiss Style ErrorBoundary.
 *
 * - Default fallback: black border, red 2px top accent bar, error message, Retry button.
 * - Retry resets the boundary state so children re-render.
 * - Optional `onError` callback for logging.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="border border-swiss-black p-lg bg-swiss-white"
          role="alert"
          aria-live="assertive"
        >
          {/* Red accent bar */}
          <div className="w-8 h-0.5 bg-swiss-red mb-md" />

          <p className="text-h3 text-swiss-black mb-sm">Something went wrong</p>
          <p className="text-caption text-swiss-gray-500 mb-lg">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleRetry}
            className="bg-swiss-black text-swiss-white text-body-bold px-md py-sm hover:bg-swiss-gray-700 transition-colors"
            aria-label="Retry loading"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}