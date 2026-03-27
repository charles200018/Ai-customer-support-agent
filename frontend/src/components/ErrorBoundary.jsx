import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-testid="error-page"
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}
        >
          <div
            data-testid="error-container"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-deep)', padding: '3.5rem 2.5rem', minWidth: 380, maxWidth: 420, width: '100%', textAlign: 'center' }}
          >
            <h1
              data-testid="error-heading"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '0.5em', letterSpacing: '0.01em' }}
            >Something went wrong</h1>
            <p
              data-testid="error-subheading"
              style={{ color: 'var(--gold-light)', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '1.2rem', marginBottom: '2.5em' }}
            >
              Sorry, an unexpected error occurred. Please try refreshing the page.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
