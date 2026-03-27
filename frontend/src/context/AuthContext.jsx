import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // Verify token is still valid
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        }
        setLoading(false)
      } catch (err) {
        console.error('Auth verification failed:', err)
        if (err.response?.status === 401) {
          // Token invalid/expired: clear token and user
          localStorage.removeItem('authToken')
          setUser(null)
        } else {
          // Server error: keep token, show transient error
          setError('Unable to verify session. Please try again later.')
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (googleToken) => {
    try {
      setError(null)
      const response = await axios.post('/api/auth/login', { googleToken })
      if (!response.data || !response.data.token || !response.data.user) {
        setError('Login failed: Invalid server response')
        return null
      }
      const { token, user: rawUser } = response.data
      // Sanitize user object
      const safeUser = {
        id: String(rawUser.id || rawUser.userId || ''),
        email: String(rawUser.email || ''),
        name: String(rawUser.name || ''),
        picture_url: typeof rawUser.picture_url === 'string' ? rawUser.picture_url : '',
        created_at: String(rawUser.created_at || rawUser.createdAt || ''),
        role: rawUser.role ? String(rawUser.role) : (rawUser.isAdmin ? 'Admin' : 'User')
      }
      localStorage.setItem('authToken', token)
      setUser(safeUser)
      return safeUser
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please try again or contact support.'
      setError(message)
      return null
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (err) {
      console.error('Logout API error:', err)
    } finally {
      localStorage.removeItem('authToken')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
