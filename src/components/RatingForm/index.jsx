import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './index.module.css'

function RatingForm({ type, targetId, targetName, onSubmit, onCancel }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    
    setSubmitting(true)
    // In a real app, you'd submit to backend
    if (onSubmit) {
      await onSubmit({
        type, // 'product' or 'seller'
        targetId,
        rating,
        comment,
        fromUserId: user?.id,
        fromUsername: user?.username || 'Anonymous',
      })
    }
    setSubmitting(false)
    setRating(0)
    setComment('')
    if (onCancel) onCancel()
  }

  return (
    <div className={styles.ratingForm}>
      <h3 className={styles.title}>
        Rate this {type === 'product' ? 'Product' : 'Seller'}
      </h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.ratingInput}>
          <label className={styles.label}>Rating *</label>
          <div className={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.starButton} ${
                  star <= (hoveredRating || rating) ? styles.active : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className={styles.ratingText}>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="comment" className={styles.label}>Review (Optional)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
            placeholder={`Share your experience with this ${type === 'product' ? 'product' : 'seller'}...`}
            rows="4"
          />
        </div>
        <div className={styles.actions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RatingForm

