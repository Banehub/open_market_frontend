import styles from './index.module.css'

function RatingStars({ rating, size = 'medium' }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={styles.container}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className={`${styles.star} ${styles.full}`}>★</span>
      ))}
      {hasHalfStar && <span className={`${styles.star} ${styles.half}`}>★</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className={`${styles.star} ${styles.empty}`}>★</span>
      ))}
      <span className={styles.rating}>{rating.toFixed(1)}</span>
    </div>
  )
}

export default RatingStars

