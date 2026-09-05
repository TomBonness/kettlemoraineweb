import { useEffect } from 'react'
import { routeMetadata } from './lib/pageMetadata'
import { applyRouteMetadata } from './lib/metadata'
import { resolveRoute } from './lib/routes'
import { CompanyHomePage } from './pages/CompanyHomePage'
import { InferencePage } from './pages/InferencePage'
import { LavtypePage } from './pages/LavtypePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OpenMicroPage } from './pages/OpenMicroPage'

function App() {
  const route = resolveRoute(window.location.pathname)

  useEffect(() => {
    const metadata = routeMetadata[route]
    applyRouteMetadata(
      route === 'not-found' ? { ...metadata, path: window.location.pathname } : metadata,
    )
  }, [route])

  switch (route) {
    case 'home':
      return <CompanyHomePage />
    case 'open-micro':
      return <OpenMicroPage />
    case 'inference':
      return <InferencePage />
    case 'lavtype':
      return <LavtypePage />
    default:
      return <NotFoundPage />
  }
}

export default App
