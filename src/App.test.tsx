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
      expect.arrayContaining([
        '/products/open-micro',
        '/products/cinference-engine',
        '/products/lavtype',
        '/products/cinmux',
      ]),
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
      '/pending',
    )
  })

  it.each(['/products/cinference-engine', '/products/cinference-engine/'])(
    'renders Cinference Engine at %s',
    (path) => {
      renderPath(path)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Cinference Engine' }),
      ).toBeInTheDocument()
      expect(document.title).toBe('Cinference Engine — Kettle Moraine Research Labs')
      expect(screen.getAllByRole('link', { name: 'Get the installer' })[0]).toHaveAttribute(
        'href',
        '/pending',
      )
      expect(screen.getByRole('link', { name: 'View source' })).toHaveAttribute('href', '/pending')
    },
  )

  it.each(['/products/lavtype', '/products/lavtype/'])('renders Lavtype at %s', (path) => {
    renderPath(path)

    expect(screen.getByRole('heading', { level: 1, name: 'Lavtype' })).toBeInTheDocument()
    expect(document.title).toBe('Lavtype — Kettle Moraine Research Labs')
    expect(screen.getAllByRole('link', { name: 'Download Lavtype' })[0]).toHaveAttribute(
      'href',
      '/pending',
    )
    expect(screen.getAllByRole('link', { name: 'View source' })[0]).toHaveAttribute(
      'href',
      '/pending',
    )
  })

  it.each(['/products/cinmux', '/products/cinmux/'])('renders Cinmux at %s', (path) => {
    renderPath(path)

    expect(screen.getByRole('heading', { level: 1, name: 'Cinmux' })).toBeInTheDocument()
    expect(document.title).toBe('Cinmux — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Install Cinmux' })).toHaveAttribute('href', '#install')
    expect(screen.getByRole('link', { name: 'View source' })).toHaveAttribute('href', '/pending')
  })

  it.each(['/pending', '/pending/'])('renders the public access pending page at %s', (path) => {
    renderPath(path)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Public access pending.' }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Public access pending — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Go back' })).toHaveAttribute('href', '/')
  })

  it('renders the branded not-found fallback for unknown paths', () => {
    renderPath('/not-a-product')

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found.' })).toBeInTheDocument()
    expect(document.title).toBe('Page not found — Kettle Moraine Research Labs')
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
