import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingStars from '../../components/RatingStars'
import ListingsGrid from '../../components/ListingsGrid'
import Footer from '../../components/Footer'
import { getListingsBySeller, getRatingsBySeller } from '../../api'
import styles from './index.module.css'

function Profile() {
  const { user, isAuthenticated } = useAuth()
  const [userListings, setUserListings] = useState([])
  const [ratingCount, setRatingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      getListingsBySeller(user.id),
      getRatingsBySeller(user.id),
    ])
      .then(([listingsData, ratingsData]) => {
        const list = Array.isArray(listingsData) ? listingsData : listingsData?.list || []
        setUserListings(list.map((l) => ({ ...l, seller: user })))
        setRatingCount(Array.isArray(ratingsData) ? ratingsData.length : 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const currentUser = user || { username: 'Guest', verified: false, rating: 0, id: '' }

  return (
    <div className={styles.profile}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <h1 className={styles.username}>{currentUser.username}</h1>
              {currentUser.verified && <VerifiedBadge />}
            </div>
            <div className={styles.verificationStatus}>
              <h2 className={styles.statusTitle}>Verification Status</h2>
              {currentUser.verified ? (
                <div className={styles.verified}>
                  <span className={styles.statusText}>✓ Verified Seller</span>
                </div>
              ) : (
                <div className={styles.unverified}>
                  <span className={styles.statusText}>Not Verified</span>
                  <p className={styles.verificationInfo}>
                    Get verified to help stop fraud and theft. Verification requires full identity information
                    to create a safer marketplace for everyone.
                  </p>
                  <Link to="/get-verified" className={styles.verifyButton}>
                    Get Verified (R15/month)
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.ratingsSection}>
            <h2 className={styles.sectionTitle}>My Ratings</h2>
            <div className={styles.ratingsCard}>
              <RatingStars rating={currentUser.rating || 0} />
              <span className={styles.ratingValue}>{(currentUser.rating || 0).toFixed(1)}</span>
              <span className={styles.ratingCount}>({ratingCount} reviews)</span>
            </div>
          </div>
          <div className={styles.listingsSection}>
            <h2 className={styles.sectionTitle}>My Listings ({userListings.length})</h2>
            {loading && <p className={styles.loading}>Loading...</p>}
            {!loading && <ListingsGrid listings={userListings} />}
          </div>
          <div className={styles.subscriptionSection}>
            <h2 className={styles.sectionTitle}>Subscription</h2>
            <div className={styles.subscriptionCard}>
              <h3 className={styles.subscriptionTitle}>Verified Seller Plan</h3>
              <p className={styles.subscriptionPrice}>R15/month</p>
              <ul className={styles.benefits}>
                <li>✓ Verified Badge</li>
                <li>✓ Increased Trust</li>
                <li>✓ Priority Listing (Coming Soon)</li>
              </ul>
              {currentUser.verified ? (
                <button className={styles.manageButton}>Manage Subscription</button>
              ) : (
                <Link to="/get-verified" className={styles.subscribeButton}>
                  Subscribe Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
