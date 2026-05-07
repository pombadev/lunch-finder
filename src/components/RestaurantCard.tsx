import type { Restaurant } from '../services/places'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {

  return (
    <article className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{restaurant.name}</h2>
      <p style={{ marginBottom: '0.5rem' }}>{restaurant.address}</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{
          backgroundColor: 'var(--primary)',
          padding: '0.2rem 0.5rem',
          border: '2px solid black'
        }}>
          Rating: {restaurant.rating || 'N/A'}
        </span>
        <span style={{
          backgroundColor: '#ffffff',
          padding: '0.2rem 0.5rem',
          border: '2px solid black'
        }}>
          Distance: {restaurant.distance}m
        </span>
        <span style={{
          backgroundColor: restaurant.openNow ? '#4ade80' : 'var(--accent)',
          padding: '0.2rem 0.5rem',
          border: '2px solid black',
          color: restaurant.openNow ? 'black' : 'white'
        }}>
          {restaurant.openNow ? 'OPEN NOW' : 'CLOSED'}
        </span>
      </div>
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: 'var(--text)',
          color: 'white',
          padding: '0.5rem 1rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          border: 'var(--border)',
          boxShadow: 'var(--shadow)'
        }}
      >
        MORE INFO
      </a>
    </article>
  )
}
