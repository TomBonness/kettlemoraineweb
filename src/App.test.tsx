import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderPath(path: string) {
  window.history.replaceState({}, '', path)
  render(<App />)
}

describe('page routing', () => {
  it('links from the homepage to each product', () => {
    renderPath('/')

    const destinations = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(destinations).toEqual(
      expect.arrayContaining(['/products/open-micro', '/products/1000-tps', '/products/lavtype']),
    )
  })

  it.each(['/products/open-micro', '/products/open-micro/'])('renders Open Micro at %s', (path) => {
    renderPath(path)

    expect(screen.getByRole('heading', { level: 1, name: 'Open Micro' })).toBeInTheDocument()
    expect(document.title).toBe('Open Micro — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Get updates' })).toHaveAttribute(
      'href',
      '/products/open-micro#waitlist',
    )
    expect(screen.getByRole('link', { name: 'View Open Micro source' })).toHaveAttribute(
      'href',
      'https://github.com/TomBonness/open-micro',
    )
  })

  it.each(['/products/lavtype', '/products/lavtype/'])('renders Lavtype at %s', (path) => {
    renderPath(path)

    expect(screen.getByRole('heading', { level: 1, name: 'Lavtype' })).toBeInTheDocument()
    expect(document.title).toBe('Lavtype — Kettle Moraine Research Labs')
    expect(screen.getAllByRole('link', { name: 'Download Lavtype' })[0]).toHaveAttribute(
      'href',
      'https://github.com/TomBonness/lavtype/releases/latest',
    )
    expect(screen.getAllByRole('link', { name: 'View source' })[0]).toHaveAttribute(
      'href',
      'https://github.com/TomBonness/lavtype',
    )
  })

  it('renders the branded not-found fallback for unknown paths', () => {
    renderPath('/not-a-product')

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found.' })).toBeInTheDocument()
    expect(document.title).toBe('Page not found — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
