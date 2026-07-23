import { render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    disconnect() {}
  })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

function renderPath(path: string) {
  window.history.replaceState({}, '', path)
  render(<App />)
}

describe('page routing', () => {
  it('renders the company homepage with both product choices', () => {
    renderPath('/')

    expect(screen.getByRole('heading', { level: 1, name: 'Tools for clearer work.' })).toBeInTheDocument()
    expect(document.title).toBe('Kettle Moraine Research Labs — Tools for clearer work')
    expect(screen.getByRole('link', { name: 'Explore Open Micro' })).toHaveAttribute('href', '/products/open-micro')
    expect(screen.getByRole('link', { name: 'Explore Lavtype' })).toHaveAttribute('href', '/products/lavtype')
  })

  it.each(['/products/open-micro', '/products/open-micro/'])('renders Open Micro at %s', (path) => {
    renderPath(path)

    expect(screen.getByRole('heading', { level: 1, name: 'Open Micro' })).toBeInTheDocument()
    expect(document.title).toBe('Open Micro — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Get updates' })).toHaveAttribute('href', '/products/open-micro#waitlist')
    expect(screen.getByRole('link', { name: 'View Open Micro source' })).toHaveAttribute('href', 'https://github.com/TomBonness/open-micro')
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
    expect(screen.getByText('The page you asked for is not in the lab.')).toBeInTheDocument()
    expect(document.title).toBe('Page not found — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
