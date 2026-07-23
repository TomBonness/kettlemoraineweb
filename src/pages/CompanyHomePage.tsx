import hero640Avif from '../assets/product/generated/hero-640.avif'
import hero1024Avif from '../assets/product/generated/hero-1024.avif'
import hero1536Avif from '../assets/product/generated/hero-1536.avif'
import hero640Webp from '../assets/product/generated/hero-640.webp'
import hero1024Webp from '../assets/product/generated/hero-1024.webp'
import hero1536Webp from '../assets/product/generated/hero-1536.webp'
import { ProductPanel } from '../components/ProductPanel'
import { SiteShell } from '../components/SiteShell'
import { VoiceTrace } from '../components/VoiceTrace'
import { productCatalog, routes } from '../content/catalog'
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function CompanyHomePage() {
  const [openMicro, lavtype] = productCatalog

  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <section className={`section ${styles.masthead}`} aria-labelledby="company-heading">
        <div className="sectionInner">
          <p className="eyebrow">Kettle Moraine Research Labs</p>
          <div className={styles.mastheadRow}>
            <h1 id="company-heading">Tools for clearer work.</h1>
            <p>
              We design focused, open hardware and software for people who want to understand and shape the tools they use.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${styles.products}`} id="products" aria-label="Products">
        <div className={`sectionInner ${styles.productGrid}`}>
          <ProductPanel
            product={openMicro}
            media={(
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />
                <img
                  className={styles.openMicroImage}
                  src={hero1024Webp}
                  width="1536"
                  height="1536"
                  loading="eager"
                  decoding="async"
                  alt="Silver Open Micro control surface with twelve keys, a dial, five-way control, and touch surface"
                />
              </picture>
            )}
          />
          <ProductPanel product={lavtype} media={<VoiceTrace compact />} />
        </div>
      </section>
    </SiteShell>
  )
}
