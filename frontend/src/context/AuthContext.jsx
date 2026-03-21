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
        localStorage.removeItem('authToken')
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (googleToken) => {
    try {
      setError(null)
      const response = await axios.post('/api/auth/login', {
        googleToken
      })
      
      const { token, user: userData } = response.data
      localStorage.setItem('authToken', token)
      setUser(userData)
      return userData
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
      throw err
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
