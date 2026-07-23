import { routes } from '../content/catalog'

export type RouteId = 'home' | 'open-micro' | 'lavtype' | 'not-found'

export function resolveRoute(pathname: string): RouteId {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '') || '/'

  switch (normalizedPath) {
    case routes.home:
      return 'home'
    case routes.openMicro:
      return 'open-micro'
    case routes.lavtype:
      return 'lavtype'
    default:
      return 'not-found'
  }
}
