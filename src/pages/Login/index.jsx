import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import styles from './index.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.data?.message || err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.login}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>Welcome back to OpenMarket</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={styles.button} disabled={submitting}>
                {submitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className={styles.footer}>
              Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
