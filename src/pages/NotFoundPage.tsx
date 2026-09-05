import { SiteShell } from '../components/SiteShell'
import { productCatalog, routes } from '../content/catalog'

const navigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function NotFoundPage() {
  return (
    <SiteShell currentPath="" navigation={navigation}>
      <section className="section notFound" aria-labelledby="not-found-title">
        <div className="notFoundArtwork" aria-hidden="true">
          <img src="/brand/contours.svg" width="1200" height="1000" alt="" />
          <span>404</span>
        </div>
        <div className="sectionInner">
          <h1 id="not-found-title">Page not found.</h1>
          <p>The page you asked for is not in the lab.</p>
          <a className="button buttonPrimary" href={routes.home}>
            Back to home
          </a>
        </div>
      </section>
    </SiteShell>
  )
}
