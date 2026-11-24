import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary] Caught UI error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="fixed right-5 bottom-5 z-50 flex max-w-xs items-center gap-3 rounded-xl border border-[#C83E4D]/40 bg-[#FCFBF8]/95 px-4 py-3 text-xs text-[#171C28] shadow-xl backdrop-blur-md dark:border-[#F47292]/40 dark:bg-[#0F1629]/95 dark:text-[#EEF1F7]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {this.props.fallbackTitle ?? 'Assistant paused unexpectedly'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-1 inline-flex items-center gap-1 font-semibold text-[#C83E4D] hover:underline dark:text-[#FFA3BC]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>Reload panel</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
