import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Home() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [dbStatus, setDbStatus] = useState('checking')

  useEffect(() => {
    checkApiStatus()
    checkDbStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('/api/health')
      setApiStatus('connected')
    } catch (error) {
      setApiStatus('disconnected')
      console.error('API connection failed:', error)
    }
  }

  const checkDbStatus = async () => {
    try {
      const response = await axios.get('/api/health/db')
      setDbStatus('connected')
    } catch (error) {
      setDbStatus('disconnected')
      console.error('Database connection failed:', error)
    }
  }

  return (
    <div style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>AI Customer Support Agent</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>System Status</h2>
        <div style={{ marginTop: '1rem' }}>
          <p>
            <strong>Frontend:</strong> ✅ Running
          </p>
          <p>
            <strong>Backend API:</strong>{' '}
            <span style={{ color: apiStatus === 'connected' ? 'green' : 'red' }}>
              {apiStatus === 'checking' ? '⏳ Checking...' : apiStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </p>
          <p>
            <strong>Firebase Database:</strong>{' '}
            <span style={{ color: dbStatus === 'connected' ? 'green' : 'red' }}>
              {dbStatus === 'checking' ? '⏳ Checking...' : dbStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '2rem'
      }}>
        <h3>Phase Status</h3>
        <ul style={{ marginTop: '1rem' }}>
          <li>✅ Frontend (React + Vite) running</li>
          <li>✅ Backend (Express) setup</li>
          <li>✅ Firebase / Firestore connection configured</li>
          <li>✅ Google authentication routes configured</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link to="/login">
          <button type="button">Sign in with Google</button>
        </Link>
        <Link to="/dashboard">
          <button type="button">Open Dashboard</button>
        </Link>
      </div>

      <div style={{ color: '#666', fontSize: '0.9rem' }}>
        <p><strong>Phase 2 checklist:</strong></p>
        <p style={{ marginTop: '0.5rem' }}>Authentication is complete when:</p>
        <ul>
          <li>Google login succeeds</li>
          <li>Dashboard is protected without a token</li>
          <li>Logout clears session and returns to login</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
