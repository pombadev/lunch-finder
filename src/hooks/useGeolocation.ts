import { useState, useCallback } from 'react'

export interface Location {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setError(null)
      },
      (error) => {
        setError(error.message)
        setLocation(null)
      }
    )
  }, [])

  return { location, error, getLocation }
}
