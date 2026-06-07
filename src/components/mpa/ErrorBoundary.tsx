"use client";

import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[MPA ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white px-6 text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-xl font-bold font-mono text-white">MPA Terminal crashed</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <p className="text-gray-600 text-xs font-mono">
              Your sessions are saved in localStorage and will be restored.
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00ff88] text-black font-bold font-mono hover:bg-[#00e57a] transition-colors"
          >
            <RefreshCw size={14} /> Reload MPA Terminal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
