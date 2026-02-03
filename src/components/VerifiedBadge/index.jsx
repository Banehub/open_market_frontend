import styles from './index.module.css'

function VerifiedBadge({ label = 'Verified Seller' }) {
  return (
    <span className={styles.badge} title={label}>
      ✓ {label}
    </span>
  )
}

export default VerifiedBadge

