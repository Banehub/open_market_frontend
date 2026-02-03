import RatingStars from '../RatingStars'
import styles from './index.module.css'

function RatingList({ ratings, type = 'seller' }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No ratings yet. Be the first to rate this {type === 'product' ? 'product' : 'seller'}!</p>
      </div>
    )
  }

  return (
    <div className={styles.ratingList}>
      {ratings.map((rating) => (
        <div key={rating.id} className={styles.ratingItem}>
          <div className={styles.ratingHeader}>
            <div className={styles.userInfo}>
              <span className={styles.username}>{rating.fromUsername || 'Anonymous'}</span>
              <RatingStars rating={rating.rating} />
            </div>
            <span className={styles.date}>
              {rating.date ? new Date(rating.date).toLocaleDateString() : 'Recently'}
            </span>
          </div>
          {rating.comment && (
            <p className={styles.comment}>{rating.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default RatingList

