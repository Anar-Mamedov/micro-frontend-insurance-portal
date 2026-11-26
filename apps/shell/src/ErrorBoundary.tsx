import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  fallback: (error: Error) => ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
  children: ReactNode
}

type State = { error: Error | null }

/**
 * Catches render errors and failed lazy imports in its subtree. React still needs a class for this;
 * there is no hook equivalent of getDerivedStateFromError.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info)
  }

  override render(): ReactNode {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children
  }
}
