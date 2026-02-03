import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import ListingsGrid from '../../components/ListingsGrid'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingStars from '../../components/RatingStars'
import RatingForm from '../../components/RatingForm'
import RatingList from '../../components/RatingList'
import AdPlaceholder from '../../components/AdPlaceholder'
import Footer from '../../components/Footer'
import { getUserByUsername, getListingsBySeller, getRatingsBySeller, checkRatedSeller, createRating } from '../../api'
import styles from './index.module.css'

function getAverageRating(ratingsList) {
  if (!ratingsList?.length) return 0
  const sum = ratingsList.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / ratingsList.length
}

function Store() {
  const { username } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [seller, setSeller] = useState(null)
  const [sellerListings, setSellerListings] = useState([])
  const [sellerRatings, setSellerRatings] = useState([])
  const [hasRatedSeller, setHasRatedSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    getUserByUsername(username)
      .then((userData) => {
        setSeller(userData)
        return Promise.all([
          getListingsBySeller(userData.id),
          getRatingsBySeller(userData.id),
        ])
      })
      .then(([listingsData, ratingsData]) => {
        setSellerListings(Array.isArray(listingsData) ? listingsData : listingsData?.list || [])
        setSellerRatings(Array.isArray(ratingsData) ? ratingsData : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [username])

  useEffect(() => {
    if (seller?.id && sellerRatings.length >= 0 && user?.id) {
      checkRatedSeller(user.id, seller.id)
        .then((r) => setHasRatedSeller(r || null))
        .catch(() => setHasRatedSeller(null))
    }
  }, [seller?.id, user?.id])


  const averageRating = getAverageRating(sellerRatings) || seller?.rating || 0
  const isOwnStore = user && seller && user.id === seller.id

  const handleRatingSubmit = async (ratingData) => {
    if (!seller?.id) return
    try {
      const newRating = await createRating({
        type: 'seller',
        toUserId: seller.id,
        rating: ratingData.rating,
        comment: ratingData.comment,
      })
      setSellerRatings((prev) => [...prev, { ...newRating, fromUsername: user?.username }])
      setHasRatedSeller(newRating)
      setShowRatingForm(false)
    } catch (err) {
      alert(err.data?.message || err.message || 'Failed to submit rating')
    }
  }

  if (loading) return <div className={styles.store}><Navigation /><main className={styles.main}><div className={styles.container}><p>Loading...</p></div></main><Footer /></div>
  if (error || !seller) return <div className={styles.store}><Navigation /><main className={styles.main}><div className={styles.container}><p>{error || 'Store not found'}</p></div></main><Footer /></div>

  const listingsWithSeller = sellerListings.map((listing) => ({ ...listing, seller }))

  return (
    <div className={styles.store}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.storeInfo}>
              <h1 className={styles.storeName}>{seller.username}'s Store</h1>
              <div className={styles.badges}>
                {seller.verified && <VerifiedBadge />}
              </div>
            </div>
            <div className={styles.ratings}>
              <RatingStars rating={averageRating} />
              <span className={styles.ratingText}>
                {averageRating.toFixed(1)} out of 5.0 ({sellerRatings.length} reviews)
              </span>
            </div>
          </div>
          {isAuthenticated && !hasRatedSeller && !isOwnStore && (
            <div className={styles.ratingSection}>
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className={styles.rateButton}
              >
                {showRatingForm ? 'Cancel Rating' : 'Rate this Seller'}
              </button>
              {showRatingForm && (
                <RatingForm
                  type="seller"
                  targetId={seller.id}
                  targetName={seller.username}
                  onSubmit={handleRatingSubmit}
                  onCancel={() => setShowRatingForm(false)}
                />
              )}
            </div>
          )}
          <div className={styles.ratingsSection}>
            <h2 className={styles.sectionTitle}>Seller Reviews</h2>
            <RatingList ratings={sellerRatings} type="seller" />
          </div>
          <div className={styles.listingsSection}>
            <h2 className={styles.sectionTitle}>Listings ({listingsWithSeller.length})</h2>
            <ListingsGrid listings={listingsWithSeller} />
          </div>
          <AdPlaceholder />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Store
