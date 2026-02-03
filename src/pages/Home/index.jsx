import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import ListingsGrid from '../../components/ListingsGrid'
import AdPlaceholder from '../../components/AdPlaceholder'
import Footer from '../../components/Footer'
import { getFeaturedListings } from '../../api'
import styles from './index.module.css'

function Home() {
  const { isAuthenticated, user } = useAuth()
  const [featuredListings, setFeaturedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getFeaturedListings(6)
      .then((data) => setFeaturedListings(Array.isArray(data) ? data : data?.list || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['Electronics', 'Fashion', 'Furniture', 'Sports', 'Entertainment', 'Books']

  const handleSearch = (query) => {
    window.location.href = `/marketplace?search=${encodeURIComponent(query)}`
  }

  return (
    <div className={styles.home}>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Find Everything You Need</h1>
            <p className={styles.heroSubtitle}>
              Buy and sell with trusted sellers in your community
            </p>
            <div className={styles.heroSearch}>
              <SearchBar onSearch={handleSearch} placeholder="Search for products, services, and more..." />
            </div>
          </div>
        </section>

        {isAuthenticated && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.welcomeBanner}>
                <h2 className={styles.welcomeTitle}>Welcome back, {user?.username}!</h2>
                <p className={styles.welcomeText}>Ready to sell? <a href="/create-listing" className={styles.createLink}>Create a new listing</a></p>
              </div>
              {!user?.verified && (
                <div className={styles.verificationBanner}>
                  <div className={styles.verificationContent}>
                    <div className={styles.verificationIcon}>
                      <i className="fa-regular fa-shield-halved"></i>
                    </div>
                    <h3 className={styles.verificationTitle}>Get Verified - Help Stop Fraud & Theft</h3>
                    <p className={styles.verificationText}>
                      Verification requires full identity information to create a safer marketplace.
                      Get your verified badge, enjoy ad-free browsing, and build trust with buyers.
                    </p>
                    <Link to="/get-verified" className={styles.verificationButton}>
                      Get Verified Now - R15/month
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Listings</h2>
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && <ListingsGrid listings={featuredListings} />}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <AdPlaceholder />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <div className={styles.categoryGrid}>
              {categories.map((category) => (
                <a
                  key={category}
                  href={`/marketplace?category=${encodeURIComponent(category)}`}
                  className={styles.categoryCard}
                >
                  <span className={styles.categoryName}>{category}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
