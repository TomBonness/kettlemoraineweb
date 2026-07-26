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
        <div className="sectionInner notFoundInner">
          <div className="notFoundHeading">
            <p className="eyebrow">Kettle Moraine Research Labs</p>
            <h1 id="not-found-title">Page not found.</h1>
          </div>
          <div className="notFoundBody">
            <p>The page you asked for is not in the lab.</p>
            <a className="button buttonPrimary" href={routes.home}>Back to home <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
