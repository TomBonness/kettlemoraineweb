import { type ReactNode } from 'react'
import { SiteShell } from '../components/SiteShell'
import { productCatalog, routes } from '../content/catalog'
import { useReveal } from '../lib/reveal'

const navigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

function Reveal({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>()
  return <div className="revealSection" ref={ref}>{children}</div>
}

export function NotFoundPage() {
  return (
    <SiteShell currentPath="" navigation={navigation}>
      <Reveal>
        <section className="section notFound" aria-labelledby="not-found-title">
          <div className="sectionInner">
            <p className="notFoundIndex" aria-hidden="true">404 — off the map</p>
            <h1 id="not-found-title">Page not found.</h1>
            <p>The page you asked for is not in the lab.</p>
            <a className="button buttonPrimary" href={routes.home}>Back to home</a>
          </div>
        </section>
      </Reveal>
    </SiteShell>
  )
}
