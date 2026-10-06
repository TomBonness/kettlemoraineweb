import { NotFoundStage } from '../components/NotFoundStage'
import { ProductHero } from '../components/ProductHero'
import { SiteShell } from '../components/SiteShell'
import { productCatalog, routes } from '../content/catalog'
import styles from './NotFoundPage.module.css'

const navigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function NotFoundPage() {
  return (
    <SiteShell currentPath="" navigation={navigation}>
      <div className={styles.page}>
        <ProductHero
          title="Page not found."
          titleId="not-found-title"
          statement={
            <>
              That address doesn’t lead <em>to a page here.</em>
            </>
          }
          lead="The link may be old, or the address may have a typo. Everything we’re building is one click away."
          primary={{ label: 'Back to home', href: routes.home }}
          secondary={{ label: 'See the products', href: `${routes.home}#products` }}
          baseline={['Kettle Moraine Research Labs', 'Error 404']}
        >
          <NotFoundStage />
        </ProductHero>
      </div>
    </SiteShell>
  )
}
