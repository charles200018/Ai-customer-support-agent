import '../styles/theme.css'

import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--color-shadow)',
        padding: '3.5rem 2.5rem',
        minWidth: 380,
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          color: 'var(--color-accent)',
          fontSize: '2.5rem',
          marginBottom: '0.5em',
          letterSpacing: '0.01em',
        }}>
          AI Customer Support Agent
        </h1>
        <p style={{
          color: 'var(--color-pearl)',
          fontFamily: 'DM Sans, Arial, sans-serif',
          fontSize: '1.2rem',
          marginBottom: '2.5em',
        }}>
          Sign in to continue
        </p>

        {error && (
          <div style={{
            background: '#2a1818',
            color: '#e6b8b8',
            borderRadius: 8,
            padding: '0.75em 1em',
            marginBottom: '1.5em',
            fontSize: '1em',
          }}>
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
            />
          ) : (
            <div style={{
              background: '#2a1818',
              color: '#e6b8b8',
              borderRadius: 8,
              padding: '0.75em 1em',
              marginBottom: '1.5em',
              fontSize: '1em',
            }}>
              Missing VITE_GOOGLE_CLIENT_ID. Add it in your environment file.
            </div>
          )}
        </div>

        <p style={{
          color: 'var(--color-accent)',
          fontFamily: 'DM Sans, Arial, sans-serif',
          fontSize: '1em',
          opacity: 0.7,
        }}>
          Only Google authentication is supported.
        </p>
      </div>
    </div>
  );
}
