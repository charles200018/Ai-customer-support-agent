import '../styles/theme.css'

import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';
import React from 'react';

export function Login() {
  const navigate = useNavigate();
  const { login, error, user } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div
      data-testid="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}
    >
      <div
        data-testid="login-container"
        style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-deep)',
          padding: '3.5rem 2.5rem',
          minWidth: 380,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          data-testid="login-heading"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'var(--gold)',
            fontSize: '2.5rem',
            marginBottom: '0.5em',
            letterSpacing: '0.01em',
          }}
        >
          AI Customer Support Agent
        </h1>
        <p
          data-testid="login-subheading"
          style={{
            color: 'var(--gold-light)',
            fontFamily: 'DM Sans, Arial, sans-serif',
            fontSize: '1.2rem',
            marginBottom: '2.5em',
          }}
        >
          Sign in to continue
        </p>

        {error && (
          <div
            data-testid="login-error"
            style={{
              background: '#2a1818',
              color: '#e6b8b8',
              borderRadius: 8,
              padding: '0.75em 1em',
              marginBottom: '1.5em',
              fontSize: '1em',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2.5em' }}>
          {clientId ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
              data-testid="login-google-btn"
            />
          ) : (
            <div
              data-testid="login-missing-client-id"
              style={{
                background: '#2a1818',
                color: '#e6b8b8',
                borderRadius: 8,
                padding: '0.75em 1em',
                marginBottom: '1.5em',
                fontSize: '1em',
              }}
            >
              Missing VITE_GOOGLE_CLIENT_ID. Add it in your environment file.
            </div>
          )}
        </div>

        <p
          data-testid="login-google-only"
          style={{
            color: 'var(--gold)',
            fontFamily: 'DM Sans, Arial, sans-serif',
            fontSize: '1em',
            opacity: 0.7,
          }}
        >
          Only Google authentication is supported.
        </p>
      </div>
    </div>
  );
}
