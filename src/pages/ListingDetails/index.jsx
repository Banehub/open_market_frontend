import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import SellerCard from '../../components/SellerCard'
import RatingStars from '../../components/RatingStars'
import RatingForm from '../../components/RatingForm'
import RatingList from '../../components/RatingList'
import Footer from '../../components/Footer'
import {
  getListingById,
  getRatingsByProduct,
  getRatingsBySeller,
  checkRatedProduct,
  checkRatedSeller,
  createRating,
} from '../../api'
import styles from './index.module.css'

function getAverageRating(ratingsList) {
  if (!ratingsList?.length) return 0
  const sum = ratingsList.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / ratingsList.length
}

function ListingDetails() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [showProductRatingForm, setShowProductRatingForm] = useState(false)
  const [showSellerRatingForm, setShowSellerRatingForm] = useState(false)
  const [listing, setListing] = useState(null)
  const [seller, setSeller] = useState(null)
  const [productRatings, setProductRatings] = useState([])
  const [sellerRatings, setSellerRatings] = useState([])
  const [hasRatedProduct, setHasRatedProduct] = useState(null)
  const [hasRatedSeller, setHasRatedSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getListingById(id),
      getRatingsByProduct(id),
    ])
      .then(([listingData, productRatingsData]) => {
        setListing(listingData)
        setProductRatings(Array.isArray(productRatingsData) ? productRatingsData : [])
        const sellerId = listingData?.sellerId || listingData?.seller?.id
        if (sellerId) {
          return getRatingsBySeller(sellerId).then((r) => {
            setSellerRatings(Array.isArray(r) ? r : [])
            setSeller(listingData?.seller || { id: sellerId })
            return listingData
          })
        }
        setSeller(listingData?.seller || null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!listing) return
    const s = listing.seller || (listing.sellerId && { id: listing.sellerId })
    setSeller(s)
    if (s?.id) {
      getRatingsBySeller(s.id)
        .then((r) => setSellerRatings(Array.isArray(r) ? r : []))
        .catch(() => {})
    }
  }, [listing])

  useEffect(() => {
    if (!user || !listing) return
    const sellerId = listing.seller?.id || listing.sellerId
    Promise.all([
      checkRatedProduct(user.id, id).catch(() => null),
      sellerId ? checkRatedSeller(user.id, sellerId).catch(() => null) : null,
    ]).then(([product, sellerR]) => {
      setHasRatedProduct(product || null)
      setHasRatedSeller(sellerR || null)
    })
  }, [user, listing, id])

  const productRating = getAverageRating(productRatings)
  const sellerRatingNum = seller?.rating ?? getAverageRating(sellerRatings)

  const handleProductRatingSubmit = async (ratingData) => {
    try {
      const newRating = await createRating({
        type: 'product',
        productId: id,
        rating: ratingData.rating,
        comment: ratingData.comment,
      })
      setProductRatings((prev) => [...prev, { ...newRating, fromUsername: user?.username }])
      setShowProductRatingForm(false)
      setHasRatedProduct(newRating)
    } catch (err) {
      alert(err.data?.message || err.message || 'Failed to submit rating')
    }
  }

  const handleSellerRatingSubmit = async (ratingData) => {
    const sellerId = listing?.seller?.id || listing?.sellerId
    if (!sellerId) return
    try {
      const newRating = await createRating({
        type: 'seller',
        toUserId: sellerId,
        rating: ratingData.rating,
        comment: ratingData.comment,
      })
      setSellerRatings((prev) => [...prev, { ...newRating, fromUsername: user?.username }])
      setShowSellerRatingForm(false)
      setHasRatedSeller(newRating)
    } catch (err) {
      alert(err.data?.message || err.message || 'Failed to submit rating')
    }
  }

  if (loading) return <div className={styles.listingDetails}><Navigation /><main className={styles.main}><div className={styles.container}><p>Loading...</p></div></main><Footer /></div>
  if (error || !listing) return <div className={styles.listingDetails}><Navigation /><main className={styles.main}><div className={styles.container}><p>{error || 'Listing not found'}</p></div></main><Footer /></div>

  const sellerInfo = listing.seller || seller || {}

  return (
    <div className={styles.listingDetails}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.imageSection}>
              <div className={styles.imageGallery}>
                <img src={listing.images?.[0]} alt={listing.title} className={styles.mainImage} />
                {listing.images?.length > 1 && (
                  <div className={styles.thumbnailGrid}>
                    {listing.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.title} ${index + 2}`}
                        className={styles.thumbnail}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.infoSection}>
              <div className={styles.header}>
                <h1 className={styles.title}>{listing.title}</h1>
                <div className={styles.price}>R{Number(listing.price).toLocaleString()}</div>
              </div>
              <div className={styles.category}>
                <span className={styles.categoryTag}>{listing.category}</span>
              </div>
              <div className={styles.sellerSection}>
                <SellerCard username={sellerInfo.username} rating={sellerRatingNum} verified={sellerInfo.verified} />
              </div>
              <div className={styles.description}>
                <h2 className={styles.descriptionTitle}>Description</h2>
                <p className={styles.descriptionText}>{listing.description}</p>
              </div>
              <div className={styles.ratings}>
                <h3 className={styles.ratingsTitle}>Product Ratings</h3>
                <div className={styles.ratingsSummary}>
                  <RatingStars rating={productRating} />
                  <span className={styles.ratingsCount}>({productRatings.length} reviews)</span>
                </div>
                {isAuthenticated && !hasRatedProduct && (
                  <button
                    onClick={() => setShowProductRatingForm(!showProductRatingForm)}
                    className={styles.rateButton}
                  >
                    {showProductRatingForm ? 'Cancel Rating' : 'Rate this Product'}
                  </button>
                )}
                {showProductRatingForm && (
                  <RatingForm
                    type="product"
                    targetId={id}
                    targetName={listing.title}
                    onSubmit={handleProductRatingSubmit}
                    onCancel={() => setShowProductRatingForm(false)}
                  />
                )}
                <RatingList ratings={productRatings} type="product" />
              </div>
              <div className={styles.ratings}>
                <h3 className={styles.ratingsTitle}>Seller Ratings</h3>
                <div className={styles.ratingsSummary}>
                  <RatingStars rating={sellerRatingNum} />
                  <span className={styles.ratingsCount}>({sellerRatings.length} reviews)</span>
                </div>
                {isAuthenticated && !hasRatedSeller && sellerInfo.id && user?.id !== sellerInfo.id && (
                  <button
                    onClick={() => setShowSellerRatingForm(!showSellerRatingForm)}
                    className={styles.rateButton}
                  >
                    {showSellerRatingForm ? 'Cancel Rating' : 'Rate this Seller'}
                  </button>
                )}
                {showSellerRatingForm && (
                  <RatingForm
                    type="seller"
                    targetId={sellerInfo.id}
                    targetName={sellerInfo.username}
                    onSubmit={handleSellerRatingSubmit}
                    onCancel={() => setShowSellerRatingForm(false)}
                  />
                )}
                <RatingList ratings={sellerRatings} type="seller" />
              </div>
              <button className={styles.contactButton}>
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ListingDetails
