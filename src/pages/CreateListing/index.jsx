import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { createListing, uploadImages } from '../../api'
import styles from './index.module.css'

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif'
const MAX_FILES = 10
const MAX_SIZE_MB = 5

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function CreateListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const categories = ['Electronics', 'Fashion', 'Furniture', 'Sports', 'Entertainment', 'Books']

  const addFiles = (newFiles) => {
    const fileList = Array.from(newFiles || []).filter((f) => f.type.startsWith('image/'))
    const combined = [...files, ...fileList].slice(0, MAX_FILES)
    setFiles(combined)
    combined.forEach((file, i) => {
      if (previews[i]) URL.revokeObjectURL(previews[i])
    })
    const newPreviews = combined.map((f) => URL.createObjectURL(f))
    setPreviews(newPreviews)
  }

  const removeFile = (index) => {
    if (previews[index]) URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    if (!files.length) {
      setError('Please add at least one image (drag & drop or tap to choose from your device).')
      setSubmitting(false)
      return
    }
    try {
      let imageUrls = []
      try {
        const uploaded = await uploadImages(files)
        if (uploaded && uploaded.length > 0) imageUrls = uploaded
      } catch (_) {
        // Backend may not have /upload; use base64
      }
      if (imageUrls.length === 0) {
        const base64 = await Promise.all(files.map((f) => fileToDataUrl(f)))
        imageUrls = base64
      }
      await createListing({
        title,
        price: Number(price),
        category,
        description,
        images: imageUrls,
      })
      setSuccess(true)
      setTimeout(() => navigate('/marketplace'), 2000)
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.createListing}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Create New Listing</h1>
          {success && (
            <div className={styles.success}>
              Listing created successfully! Redirecting to marketplace...
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Enter listing title"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Price (R)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Photos</label>
              <div
                className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${previews.length ? styles.hasFiles : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_IMAGES}
                  multiple
                  onChange={handleFileInputChange}
                  className={styles.hiddenInput}
                  aria-label="Choose images"
                />
                <div className={styles.dropZoneContent}>
                  <span className={styles.dropZoneIcon}>📷</span>
                  <p className={styles.dropZoneText}>
                    Drag & drop images here, or <strong>tap to choose</strong> from your device
                  </p>
                  <p className={styles.dropZoneHint}>
                    JPEG, PNG, WebP, GIF · Up to {MAX_FILES} images · Max {MAX_SIZE_MB}MB each
                  </p>
                </div>
              </div>
              {previews.length > 0 && (
                <div className={styles.previewGrid}>
                  {previews.map((url, index) => (
                    <div key={index} className={styles.previewWrap}>
                      <img src={url} alt={`Preview ${index + 1}`} className={styles.previewImg} />
                      <button
                        type="button"
                        className={styles.previewRemove}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(index)
                        }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                placeholder="Describe your item..."
                rows="6"
                required
              />
            </div>
            <button type="submit" className={styles.publishButton} disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CreateListing
