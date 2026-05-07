import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MainList } from './MainList'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as geolocationHook from '../hooks/useGeolocation'
import * as placesService from '../services/places'

vi.mock('../hooks/useGeolocation')
vi.mock('../services/places')

describe('MainList', () => {
  const mockGetLocation = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(geolocationHook.useGeolocation).mockReturnValue({
      location: null,
      error: null,
      getLocation: mockGetLocation
    })
  })

  it('should show initial state with find button', () => {
    render(<MainList />)
    expect(screen.getByRole('button', { name: /find lunch/i })).toBeInTheDocument()
  })

  it('should sort by rating when selected', async () => {
    vi.mocked(geolocationHook.useGeolocation).mockReturnValue({
      location: { lat: 51.5, lng: 0.1 },
      error: null,
      getLocation: mockGetLocation
    })

    const mockRestaurants = [
      { id: '1', name: 'Low Rating', distance: 100, rating: 2, address: '123 St', lat: 51.5, lng: 0.1, openNow: true },
      { id: '2', name: 'High Rating', distance: 200, rating: 5, address: '456 St', lat: 51.5, lng: 0.1, openNow: true }
    ]
    vi.mocked(placesService.fetchNearbyRestaurants).mockResolvedValue(mockRestaurants)

    render(<MainList />)

    await waitFor(() => {
      const names = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
      expect(names[0]).toBe('Low Rating') // Default sort is distance
    })

    const sortSelect = screen.getByLabelText(/sort by/i)
    fireEvent.change(sortSelect, { target: { value: 'rating' } })

    const names = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(names[0]).toBe('High Rating')
  })

  it('should handle "Show More" functionality', async () => {
    vi.mocked(geolocationHook.useGeolocation).mockReturnValue({
      location: { lat: 51.5, lng: 0.1 },
      error: null,
      getLocation: mockGetLocation
    })

    const mockRestaurants = Array.from({ length: 12 }, (_, i) => ({
      id: `${i}`,
      name: `Place ${i}`,
      address: 'Addr',
      lat: 51.5,
      lng: 0.1,
      openNow: true,
      distance: 100 * i,
      rating: 4
    }))
    vi.mocked(placesService.fetchNearbyRestaurants).mockResolvedValue(mockRestaurants)

    render(<MainList />)

    await waitFor(() => {
      expect(screen.getByText('Place 0')).toBeInTheDocument()
      expect(screen.getByText('Place 4')).toBeInTheDocument()
      expect(screen.queryByText('Place 5')).not.toBeInTheDocument()
    })

    const showMoreBtn = screen.getByRole('button', { name: /show more/i })
    fireEvent.click(showMoreBtn)

    expect(screen.getByText('Place 5')).toBeInTheDocument()
    expect(screen.getByText('Place 9')).toBeInTheDocument()
    expect(screen.queryByText('Place 10')).not.toBeInTheDocument()
  })
})
