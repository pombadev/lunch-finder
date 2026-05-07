interface Point {
  lat: number
  lng: number
}

/**
 * Calculates the Haversine distance between two points in meters.
 */
export function calculateDistance(p1: Point, p2: Point): number {
  if (p1.lat === p2.lat && p1.lng === p2.lng) return 0

  const R = 6371e3 // Earth radius in meters
  const phi1 = (p1.lat * Math.PI) / 180
  const phi2 = (p2.lat * Math.PI) / 180
  const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180
  const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
