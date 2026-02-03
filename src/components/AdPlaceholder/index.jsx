import styles from './index.module.css'

function AdPlaceholder({ text = 'Advertisement' }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.text}>{text}</span>
    </div>
  )
}

export default AdPlaceholder

