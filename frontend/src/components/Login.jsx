import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export function Login() {
  const navigate = useNavigate()
  const { login, error, user } = useAuth()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse.credential)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>AI Customer Support Agent</h1>
        <p className="login-subtitle">Sign in to continue</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="google-login-wrapper">
          {clientId ? (
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                theme="outline"
                size="large"
              />
            </GoogleOAuthProvider>
          ) : (
            <div className="error-message">
              Missing VITE_GOOGLE_CLIENT_ID. Add it in your environment file.
            </div>
          )}
        </div>

        <p className="login-footer">
          Only Google authentication is supported.
        </p>
      </div>
    </div>
  )
}
