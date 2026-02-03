import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getMe } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('openmarket_token')
    const savedUser = localStorage.getItem('openmarket_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      getMe()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem('openmarket_user', JSON.stringify(userData))
        })
        .catch(() => {
          localStorage.removeItem('openmarket_token')
          localStorage.removeItem('openmarket_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { user: userData, token } = await apiLogin(email, password)
    setUser(userData)
    localStorage.setItem('openmarket_token', token)
    localStorage.setItem('openmarket_user', JSON.stringify(userData))
    return userData
  }

  const register = async (body) => {
    const { user: userData, token } = await apiRegister(body)
    setUser(userData)
    localStorage.setItem('openmarket_token', token)
    localStorage.setItem('openmarket_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('openmarket_token')
    localStorage.removeItem('openmarket_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
