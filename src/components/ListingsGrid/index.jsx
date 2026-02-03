import ListingCard from '../ListingCard'
import styles from './index.module.css'

function ListingsGrid({ listings }) {
  if (!listings || listings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No listings found</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          price={listing.price}
          image={listing.images[0]}
          seller={listing.seller?.username || 'Unknown'}
          verified={listing.seller?.verified || false}
        />
      ))}
    </div>
  )
}

export default ListingsGrid

