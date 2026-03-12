"use client";

import { Component, type ReactNode } from "react";
import { FunnelProvider } from "@/context/FunnelContext";
import FunnelContainer from "@/components/funnel/FunnelContainer";
import BackgroundEffects from "@/components/ui/BackgroundEffects";

interface ErrorBoundaryState {
  hasError: boolean;
}

class FunnelErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Funnel] Rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 text-center">
          <h1 className="font-display text-2xl text-text-primary">
            Etwas ist schiefgelaufen
          </h1>
          <p className="max-w-md text-text-muted">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es
            erneut.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Erneut versuchen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function FunnelPage() {
  return (
    <FunnelErrorBoundary>
      <FunnelProvider>
        <main className="min-h-dvh bg-background">
          <BackgroundEffects />
          <FunnelContainer />
        </main>
      </FunnelProvider>
    </FunnelErrorBoundary>
  );
}
