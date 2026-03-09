"use client";

import * as Sentry from "@sentry/nextjs";
import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error): void {
    Sentry.captureException(error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-6" role="alert">
          <h2 className="text-xl font-bold text-rose-900 mb-2">Data Unavailable</h2>
          <p className="text-sm leading-relaxed text-rose-700">
            Unable to load housing data. Please try refreshing the page.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
