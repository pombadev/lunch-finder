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
  googleMapsUri?: string
  googleMapsLinks?: {
    directionsUri?: string
    placeUri?: string
    reviewsUri?: string
    photosUri?: string
  }
}

interface PlacesResponse {
  places: Array<{
    id: string
    displayName: { text: string }
    formattedAddress: string
    rating?: number
    currentOpeningHours?: { openNow: boolean }
    location: { latitude: number, longitude: number }
    googleMapsUri?: string
    googleMapsLinks?: {
      directionsUri?: string
      placeUri?: string
      reviewsUri?: string
      photosUri?: string
    }
  }>
}

const FIELD_MASKS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.currentOpeningHours',
  'places.location',
  'places.googleMapsLinks',
  'places.googleMapsUri'
]

export async function fetchNearbyRestaurants(
  { lat, lng }: { lat: number, lng: number }
): Promise<Restaurant[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''
  const url = 'https://places.googleapis.com/v1/places:searchNearby'

  const body: Record<string, unknown> = {
    includedTypes: [
      'restaurant',
      'cafe',
      'coffee_shop',
      'bakery',
      'bar',
      'fast_food_restaurant',
      'pizza_restaurant',
      'sandwich_shop',
      'ice_cream_shop',
      'meal_delivery',
      'meal_takeaway',
      'seafood_restaurant',
      'steak_house',
      'sushi_restaurant',
      'american_restaurant',
      'asian_restaurant',
      'barbecue_restaurant',
      'breakfast_restaurant',
      'brunch_restaurant',
      'chinese_restaurant',
      'french_restaurant',
      'greek_restaurant',
      'hamburger_restaurant',
      'indian_restaurant',
      'italian_restaurant',
      'japanese_restaurant',
      'korean_restaurant',
      'mexican_restaurant',
      'middle_eastern_restaurant',
      'spanish_restaurant',
      'thai_restaurant',
      'vietnamese_restaurant',
      'vegan_restaurant',
      'vegetarian_restaurant',
      'bistro',
      'diner',
      'gastropub',
      'food_court',
      'dessert_restaurant',
      'juice_shop',
      'coffee_roastery',
      'coffee_stand',
      'deli',
      'dessert_shop',
      'donut_shop',
      'family_restaurant',
      'fine_dining_restaurant',
      'buffet_restaurant',
      'cafeteria',
      'bar_and_grill'
    ],
    rankPreference: 'DISTANCE',
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 1000.0
      }
    }
  }



  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASKS.join(','),
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  const data: PlacesResponse = await response.json()
  const places = data.places || []

  return places.map(place => ({
    id: place.id,
    name: place.displayName.text,
    address: place.formattedAddress,
    rating: place.rating,
    openNow: place.currentOpeningHours?.openNow,
    lat: place.location.latitude,
    lng: place.location.longitude,
    distance: Math.round(calculateDistance({ lat, lng }, { lat: place.location.latitude, lng: place.location.longitude })),
    googleMapsUri: place.googleMapsUri,
    googleMapsLinks: place.googleMapsLinks
  }))
}

