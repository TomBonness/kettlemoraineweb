import { routes } from '../content/catalog'

export type RouteId =
  | 'home'
  | 'open-micro'
  | 'inference'
  | 'lavtype'
  | 'cinmux'
  | 'pending'
  | 'not-found'

export function resolveRoute(pathname: string): RouteId {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '') || '/'

  switch (normalizedPath) {
    case routes.home:
      return 'home'
    case routes.openMicro:
      return 'open-micro'
    case routes.inference:
      return 'inference'
    case routes.lavtype:
      return 'lavtype'
    case routes.cinmux:
      return 'cinmux'
    case routes.pending:
      return 'pending'
    default:
      return 'not-found'
  }
}
