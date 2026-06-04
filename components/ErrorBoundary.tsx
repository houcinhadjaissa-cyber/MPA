"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[MPA Error Boundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    try {
      const keysToPreserve = ["mpa_groq_api_key", "mpa_prompt_history", "mpa_projects"];
      const preserved: Record<string, string> = {};
      for (const k of keysToPreserve) {
        const v = localStorage.getItem(k);
        if (v) preserved[k] = v;
      }
      localStorage.clear();
      for (const [k, v] of Object.entries(preserved)) {
        localStorage.setItem(k, v);
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0A0A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              width: "100%",
              background: "#1C1C1E",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#30D158",
                fontSize: "10px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              MPA Terminal
            </p>
            <h2 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              Session Recovery
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              The terminal encountered an unexpected error.
              Your API key and prompt history are preserved.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "0.75rem",
                  fontSize: "11px",
                  color: "#F87171",
                  textAlign: "left",
                  overflowX: "auto",
                  marginBottom: "1.5rem",
                  maxHeight: 120,
                  overflow: "auto",
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              style={{
                padding: "0.75rem 2rem",
                background: "#30D158",
                color: "#000",
                border: "none",
                borderRadius: 10,
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "0.875rem",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Restart Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
