import { Link } from 'react-router-dom'
import VerifiedBadge from '../VerifiedBadge'
import RatingStars from '../RatingStars'
import styles from './index.module.css'

function SellerCard({ username, rating, verified }) {
  return (
    <Link to={`/store/${username}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.username}>{username}</h3>
          {verified && <VerifiedBadge />}
        </div>
        <RatingStars rating={rating} />
      </div>
      <div className={styles.rating}>
        <span className={styles.ratingValue}>{rating}</span>
        <span className={styles.ratingLabel}>Seller Rating</span>
      </div>
    </Link>
  )
}

export default SellerCard

