import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import { describe, it, expect } from 'vitest'

describe('Header', () => {
  it('should render the title', () => {
    render(<Header />)
    expect(screen.getByText('Where\'s my lunch?')).toBeInTheDocument()
  })

  it('should have neobrutalist styling classes', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('neobrutal-header')
  })
})
