import { render, screen } from '@testing-library/react'
import { RestaurantCard } from './RestaurantCard'
import { describe, it, expect } from 'vitest'

describe('RestaurantCard', () => {
  const mockRestaurant = {
    id: '1',
    name: 'Taco Bell',
    address: '456 Taco Rd',
    rating: 3.8,
    openNow: true,
    lat: 34.0,
    lng: -118.0,
    distance: 100
  }

  it('should render restaurant details', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    expect(screen.getByText('Taco Bell')).toBeInTheDocument()
    expect(screen.getByText('456 Taco Rd')).toBeInTheDocument()
    expect(screen.getByText('Rating: 3.8')).toBeInTheDocument()
    expect(screen.getByText('OPEN NOW')).toBeInTheDocument()
  })

  it('should show CLOSED if openNow is false', () => {
    render(<RestaurantCard restaurant={{ ...mockRestaurant, openNow: false }} />)
    expect(screen.getByText('CLOSED')).toBeInTheDocument()
  })

  it('should have a MORE INFO link that performs a Google Search', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    const link = screen.getByRole('link', { name: /more info/i })
    expect(link).toHaveAttribute('href', 'https://www.google.com/search?q=Taco%20Bell%20456%20Taco%20Rd')
  })
})
