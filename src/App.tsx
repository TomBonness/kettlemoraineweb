import { useEffect } from 'react'
import { routes } from './content/catalog'
import { applyRouteMetadata } from './lib/metadata'
import { resolveRoute, type RouteId } from './lib/routes'
import { CompanyHomePage } from './pages/CompanyHomePage'
import { LavtypePage } from './pages/LavtypePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OpenMicroPage } from './pages/OpenMicroPage'

const routeMetadata: Record<RouteId, { path: string; title: string; description: string; image: string }> = {
  home: {
    path: routes.home,
    title: 'Kettle Moraine Research Labs — Tools for clearer work',
    description: 'Kettle Moraine Research Labs makes focused, open hardware and software, including Open Micro and Lavtype.',
    image: '/kettle-moraine-social.png',
  },
  'open-micro': {
    path: routes.openMicro,
    title: 'Open Micro — Kettle Moraine Research Labs',
    description: 'An open-source control surface designed to put everyday actions within easy reach.',
    image: '/open-micro-og.png',
  },
  lavtype: {
    path: routes.lavtype,
    title: 'Lavtype — Kettle Moraine Research Labs',
    description: 'Local push-to-talk dictation for macOS and Linux: hold a shortcut, speak, release, and type the final transcript into the focused app.',
    image: '/lavtype-social.png',
  },
  'not-found': {
    path: routes.home,
    title: 'Page not found — Kettle Moraine Research Labs',
    description: 'The page you asked for is not in the lab.',
    image: '/kettle-moraine-social.png',
  },
}

function App() {
  const route = resolveRoute(window.location.pathname)

  useEffect(() => {
    const metadata = routeMetadata[route]
    applyRouteMetadata(route === 'not-found' ? { ...metadata, path: window.location.pathname } : metadata)
  }, [route])

  switch (route) {
    case 'home':
      return <CompanyHomePage />
    case 'open-micro':
      return <OpenMicroPage />
    case 'lavtype':
      return <LavtypePage />
    default:
      return <NotFoundPage />
  }
}

export default App
