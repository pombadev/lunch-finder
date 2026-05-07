import { renderHook, act } from '@testing-library/react'
import { useGeolocation } from './useGeolocation'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  }

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      geolocation: mockGeolocation
    })
  })

  it('should return coordinates when permission is granted', async () => {
    const mockPosition = {
      coords: {
        latitude: 51.5074,
        longitude: 0.1278,
      }
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      result.current.getLocation()
    })

    expect(result.current.location).toEqual({
      lat: 51.5074,
      lng: 0.1278
    })
    expect(result.current.error).toBeNull()
  })

  it('should return error when permission is denied', async () => {
    const mockError = {
      message: 'User denied geolocation'
    }

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      result.current.getLocation()
    })

    expect(result.current.location).toBeNull()
    expect(result.current.error).toBe('User denied geolocation')
  })
})
