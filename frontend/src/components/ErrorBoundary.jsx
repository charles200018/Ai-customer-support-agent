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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
          <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: 'var(--radius)', boxShadow: 'var(--color-shadow)', padding: '3.5rem 2.5rem', minWidth: 380, maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-accent)', fontSize: '2.5rem', marginBottom: '0.5em', letterSpacing: '0.01em' }}>Something went wrong</h1>
            <p style={{ color: 'var(--color-pearl)', fontFamily: 'DM Sans, Arial, sans-serif', fontSize: '1.2rem', marginBottom: '2.5em' }}>
              Sorry, an unexpected error occurred. Please try refreshing the page.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
