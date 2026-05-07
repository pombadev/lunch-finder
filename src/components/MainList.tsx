import { useState, useEffect, useMemo } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { fetchNearbyRestaurants, type Restaurant } from '../services/places'
import { RestaurantCard } from './RestaurantCard'

const INITIAL_SHOW_COUNT = 5
type SortOption = 'distance' | 'rating'

export function MainList() {
  const { location, error: geoError, getLocation } = useGeolocation()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [surpriseMe, setSurpriseMe] = useState(false)
  const [surprisePick, setSurprisePick] = useState<Restaurant | null>(null)

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>('distance')
  const [showCount, setShowCount] = useState(INITIAL_SHOW_COUNT)

  useEffect(() => {
    async function getRestaurants() {
      if (!location) return
      setLoading(true)
      setApiError(null)
      try {
        const data = await fetchNearbyRestaurants(location)
        setRestaurants(data)
        if (surpriseMe && data.length > 0) {
          setSurprisePick(data[Math.floor(Math.random() * data.length)])
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    getRestaurants()
  }, [location, surpriseMe])

  const sortedRestaurants = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance
      } else {
        return (b.rating || 0) - (a.rating || 0) // Highest rating first
      }
    })
  }, [restaurants, sortBy])

  const visibleRestaurants = sortedRestaurants.slice(0, showCount)

  return (
    <div>
      {!location && !geoError && (
        <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setSurpriseMe(false); getLocation() }} style={{ fontSize: '1.5rem' }}>
            FIND LUNCH
          </button>
          <button
            onClick={() => { setSurpriseMe(true); getLocation() }}
            style={{ fontSize: '1.5rem', backgroundColor: 'var(--accent)', color: 'white' }}
          >
            SURPRISE ME
          </button>
        </div>
      )}

      {geoError && (
        <div className="card" style={{ backgroundColor: 'var(--accent)', color: 'white', marginBottom: '1rem' }}>
          <p>ERROR: {geoError}</p>
          <button onClick={getLocation} style={{ marginTop: '1rem', backgroundColor: 'white', color: 'black' }}>
            TRY AGAIN
          </button>
        </div>
      )}

      {location && (
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Controls</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="sortBy" style={{ fontWeight: 'bold' }}>Sort By:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  padding: '0.3rem',
                  border: '2px solid black',
                  fontFamily: 'inherit',
                  fontWeight: 'bold',
                  backgroundColor: 'white'
                }}
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>SEARCHING...</h2>
        </div>
      )}

      {apiError && (
        <div className="card" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
          <p>API ERROR: {apiError}</p>
        </div>
      )}

      {!loading && surpriseMe && surprisePick && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2>YOUR PICK</h2>
          </div>
          <RestaurantCard restaurant={surprisePick} />
          <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => {
              if (restaurants.length > 0) {
                setSurprisePick(restaurants[Math.floor(Math.random() * restaurants.length)])
              }
            }}>
              PICK AGAIN
            </button>
            <button onClick={() => setSurpriseMe(false)}>
              VIEW ALL
            </button>
          </div>
        </div>
      )}

      {!loading && !surpriseMe && visibleRestaurants.length > 0 && (
        <div>
          {visibleRestaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}

          {visibleRestaurants.length < sortedRestaurants.length && (
            <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
              <button onClick={() => setShowCount(prev => prev + INITIAL_SHOW_COUNT)}>
                SHOW MORE
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && location && sortedRestaurants.length === 0 && !apiError && (
        <div className="card">
          <p>No restaurants found nearby. Maybe try a different spot?</p>
        </div>
      )}
    </div>
  )
}
