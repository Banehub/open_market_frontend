import { Link } from 'react-router-dom'
import styles from './index.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.title}>OpenMarket</h3>
          <p className={styles.description}>
            Your trusted marketplace for buying and selling.
          </p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.heading}>Quick Links</h4>
          <Link to="/marketplace" className={styles.link}>Marketplace</Link>
          <Link to="/create-listing" className={styles.link}>Sell</Link>
          <Link to="/profile" className={styles.link}>Profile</Link>
        </div>
        <div className={styles.section}>
          <h4 className={styles.heading}>Support</h4>
          <Link to="/settings" className={styles.link}>Settings</Link>
          <a href="#" className={styles.link}>Help Center</a>
          <a href="#" className={styles.link}>Contact Us</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2024 OpenMarket. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

