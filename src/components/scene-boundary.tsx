"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class SceneBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D scene failed to render", error, info.componentStack);
  }
  render() {
    if (this.state.hasError)
      return (
        <div className="grid h-full place-items-center rounded-2xl border border-[var(--line)] bg-[#0b101b] p-8 text-center text-sm text-[var(--muted)]">
          No se pudo cargar la experiencia 3D.
          <br />
          <a
            className="mt-3 inline-block text-[var(--mint)] underline"
            href="/portfolio"
          >
            Continuar con el portafolio clásico
          </a>
        </div>
      );
    return this.props.children;
  }
}
