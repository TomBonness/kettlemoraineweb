import drawingTop640Avif from '../assets/product/generated/drawing-top-640.avif'
import drawingTop1024Avif from '../assets/product/generated/drawing-top-1024.avif'
import drawingTop640Webp from '../assets/product/generated/drawing-top-640.webp'
import drawingTop1024Webp from '../assets/product/generated/drawing-top-1024.webp'
import { SiteShell } from '../components/SiteShell'
import { VoiceTrace } from '../components/VoiceTrace'
import { productCatalog, routes } from '../content/catalog'
import { productCopy } from '../content/openMicro'
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function CompanyHomePage() {
  const [openMicro, lavtype] = productCatalog

  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <section className={styles.hero} aria-labelledby="company-heading">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCrosshair} aria-hidden="true"><span /></div>
        <div className={styles.heroInner}>
          <header className={styles.heroTopline}>
            <p>Independent product lab</p>
          </header>

          <div className={styles.heroTitle}>
            <h1 id="company-heading" aria-label="Tools for clearer work.">
              <span aria-hidden="true">Tools for</span>
              <span aria-hidden="true">clearer work.</span>
            </h1>
          </div>

          <div className={styles.heroFooter}>
            <p className={styles.heroStatement}>
              We design focused, open hardware and software for people who want to understand and shape the tools they use.
            </p>
            <nav className={styles.productRail} aria-label="Featured products">
              {productCatalog.map((product) => (
                <a href={product.path} key={product.id}>
                  <span>{product.category}</span>
                  <strong>{product.name}</strong>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className={styles.products} id="products" aria-labelledby="products-heading">
        <div className={styles.productsInner}>
          <header className={styles.productsIntro}>
            <h2 id="products-heading">
              <span>Physical controls.</span>
              <span>Local software.</span>
            </h2>
            <p>Two focused products, each built to keep the person using it in control.</p>
          </header>

          <div className={styles.featureStack}>
            <article className={`${styles.feature} ${styles.openMicroFeature}`}>
              <div className={styles.openMicroMedia}>
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${drawingTop640Avif} 640w, ${drawingTop1024Avif} 1024w`}
                    sizes="(max-width: 767px) 100vw, 68vw"
                  />
                  <source
                    type="image/webp"
                    srcSet={`${drawingTop640Webp} 640w, ${drawingTop1024Webp} 1024w`}
                    sizes="(max-width: 767px) 100vw, 68vw"
                  />
                  <img
                    src={drawingTop1024Webp}
                    width="1024"
                    height="1024"
                    loading="eager"
                    decoding="async"
                    alt={productCopy.topAlt}
                  />
                </picture>
                <div className={styles.mediaIndex} aria-hidden="true">
                  <span>Open hardware + software</span>
                  <span>Revision 0.1</span>
                </div>
              </div>
              <div className={styles.featureCopy}>
                <p className={styles.productCategory}>{openMicro.category}</p>
                <h3>{openMicro.name}</h3>
                <p className={styles.productSummary}>{openMicro.summary}</p>
                <dl className={styles.productFacts}>
                  <div><dt>Controls</dt><dd>15</dd></div>
                  <div><dt>Connection</dt><dd>USB-C + Bluetooth</dd></div>
                </dl>
                <a className={styles.productLink} href={openMicro.path}>
                  Explore Open Micro <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>

            <article className={`${styles.feature} ${styles.lavtypeFeature}`}>
              <div className={styles.featureCopy}>
                <p className={styles.productCategory}>{lavtype.category}</p>
                <h3>{lavtype.name}</h3>
                <p className={styles.productSummary}>{lavtype.summary}</p>
                <dl className={styles.productFacts}>
                  <div><dt>Recognition</dt><dd>Local</dd></div>
                  <div><dt>Platforms</dt><dd>macOS + X11 Linux</dd></div>
                </dl>
                <a className={styles.productLink} href={lavtype.path}>
                  Explore Lavtype <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className={styles.lavtypeMedia}>
                <VoiceTrace compact />
              </div>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
