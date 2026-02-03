import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import ListingCard from '../../components/ListingCard'
import AdPlaceholder from '../../components/AdPlaceholder'
import Footer from '../../components/Footer'
import { getListings } from '../../api'
import styles from './index.module.css'

function Marketplace() {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('newest')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['All', 'Electronics', 'Fashion', 'Furniture', 'Sports', 'Entertainment', 'Books']

  useEffect(() => {
    setLoading(true)
    getListings({
      search: searchQuery || undefined,
      category: selectedCategory && selectedCategory !== 'All' ? selectedCategory : undefined,
      sort: sortBy,
    })
      .then((data) => {
        const list = data?.list ?? (Array.isArray(data) ? data : [])
        setListings(list)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [searchQuery, selectedCategory, sortBy])

  const filteredListings = useMemo(() => {
    let result = [...listings]
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    return result
  }, [listings, sortBy])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const listingsWithAds = useMemo(() => {
    const result = []
    const chunkSize = 6
    for (let i = 0; i < filteredListings.length; i += chunkSize) {
      const chunk = filteredListings.slice(i, i + chunkSize)
      result.push({ type: 'listings', items: chunk })
      if (i + chunkSize < filteredListings.length) result.push({ type: 'ad' })
    }
    return result
  }, [filteredListings])

  return (
    <div className={styles.marketplace}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Marketplace</h1>
          <div className={styles.filters}>
            <div className={styles.searchSection}>
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <label htmlFor="category" className={styles.label}>Category</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label htmlFor="sort" className={styles.label}>Sort By</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.select}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!loading && !error && filteredListings.length === 0 && (
            <div className={styles.empty}>
              <p>No listings found</p>
            </div>
          )}
          {!loading && !error && filteredListings.length > 0 && (
            <div className={styles.listingsContainer}>
              {listingsWithAds.map((item, index) => {
                if (item.type === 'ad') {
                  return <AdPlaceholder key={`ad-${index}`} />
                }
                return (
                  <div key={`listings-${index}`} className={styles.listingsGrid}>
                    {item.items.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        image={listing.images?.[0]}
                        seller={listing.seller?.username || 'Unknown'}
                        verified={listing.seller?.verified || false}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Marketplace
