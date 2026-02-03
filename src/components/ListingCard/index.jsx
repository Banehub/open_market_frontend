import { Link } from 'react-router-dom'
import VerifiedBadge from '../VerifiedBadge'
import styles from './index.module.css'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image'

function ListingCard({ id, title, price, image, seller, verified }) {
  return (
    <Link to={`/listing/${id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image || PLACEHOLDER_IMAGE} alt={title || 'Listing'} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>R{Number(price ?? 0).toLocaleString()}</span>
          <div className={styles.seller}>
            <span className={styles.sellerName}>{seller}</span>
            {verified && <VerifiedBadge />}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ListingCard

