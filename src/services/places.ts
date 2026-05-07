import { calculateDistance } from '../utils/distance'

export interface Restaurant {
  id: string
  name: string
  address: string
  rating?: number
  openNow?: boolean
  lat: number
  lng: number
  distance: number
}

interface PlacesResponse {
  places: Array<{
    id: string
    displayName: { text: string }
    formattedAddress: string
    rating?: number
    currentOpeningHours?: { openNow: boolean }
    location: { latitude: number, longitude: number }
  }>
}

export async function fetchNearbyRestaurants({ lat, lng }: { lat: number, lng: number }): Promise<Restaurant[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''
  const url = 'https://places.googleapis.com/v1/places:searchText'
  const allPlaces: PlacesResponse['places'] = []
  let pageToken: string | undefined

  // Fetch up to 3 pages (60 results max)
  for (let page = 0; page < 3; page++) {
    const body: Record<string, unknown> = {
      textQuery: 'restaurants',
      pageSize: 20,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 1000.0
        }
      }
    }

    if (pageToken) {
      body.pageToken = pageToken
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.currentOpeningHours,places.location,nextPageToken'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data: PlacesResponse & { nextPageToken?: string } = await response.json()

    if (data.places) {
      allPlaces.push(...data.places)
    }

    if (!data.nextPageToken) break
    pageToken = data.nextPageToken
  }

  if (allPlaces.length === 0) return []

  return allPlaces.map(place => ({
    id: place.id,
    name: place.displayName.text,
    address: place.formattedAddress,
    rating: place.rating,
    openNow: place.currentOpeningHours?.openNow,
    lat: place.location.latitude,
    lng: place.location.longitude,
    distance: Math.round(calculateDistance({ lat, lng }, { lat: place.location.latitude, lng: place.location.longitude }))
  }))
}

