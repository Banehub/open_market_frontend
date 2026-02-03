import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './index.module.css'

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          OpenMarket
        </Link>
        <div className={styles.links}>
          <Link to="/marketplace" className={styles.link}>Marketplace</Link>
          {isAuthenticated && (
            <>
              <Link to="/create-listing" className={styles.link}>Sell</Link>
              <Link to="/profile" className={styles.link}>Profile</Link>
              <span className={styles.userName}>{user?.username}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link to="/login" className={styles.link}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

