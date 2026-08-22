import { useRef, type PointerEvent, type ReactNode } from 'react'
import hero640Avif from '../assets/product/generated/hero-640.avif'
import hero1024Avif from '../assets/product/generated/hero-1024.avif'
import hero1536Avif from '../assets/product/generated/hero-1536.avif'
import hero640Webp from '../assets/product/generated/hero-640.webp'
import hero1024Webp from '../assets/product/generated/hero-1024.webp'
import hero1536Webp from '../assets/product/generated/hero-1536.webp'
import { SiteShell } from '../components/SiteShell'
import { VoiceTrace } from '../components/VoiceTrace'
import { productCatalog, routes } from '../content/catalog'
import { productCopy } from '../content/openMicro'
import { useReveal } from '../lib/reveal'
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

function Reveal({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>()
  return <div className="revealSection" ref={ref}>{children}</div>
}

export function CompanyHomePage() {
  const [openMicro, lavtype] = productCatalog
  const heroCopyRef = useRef<HTMLDivElement>(null)

  function handleHeroPointer(event: PointerEvent<HTMLElement>) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) return

    const el = heroCopyRef.current
    if (!el) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    el.style.setProperty('--copy-x', `${x * 10}px`)
    el.style.setProperty('--copy-y', `${y * 7}px`)
  }

  function resetHeroPointer() {
    const el = heroCopyRef.current
    if (!el) return
    el.style.removeProperty('--copy-x')
    el.style.removeProperty('--copy-y')
  }

  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <section
        className={styles.hero}
        aria-labelledby="company-heading"
        onPointerMove={handleHeroPointer}
        onPointerLeave={resetHeroPointer}
      >
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCrosshair} aria-hidden="true"><span /></div>
        <div className={styles.heroInner} ref={heroCopyRef}>

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
                  <strong>{product.name}</strong>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <Reveal>
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
            <a
              className={`${styles.feature} ${styles.openMicroFeature}`}
              href={openMicro.path}
              aria-label={`Explore ${openMicro.name}`}
            >
              <div className={styles.openMicroMedia}>
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`}
                    sizes="(max-width: 767px) 100vw, 68vw"
                  />
                  <source
                    type="image/webp"
                    srcSet={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`}
                    sizes="(max-width: 767px) 100vw, 68vw"
                  />
                  <img
                    src={hero1024Webp}
                    width="1024"
                    height="768"
                    loading="eager"
                    decoding="async"
                    alt={productCopy.heroAlt}
                  />
                </picture>
                <div className={styles.mediaIndex} aria-hidden="true">
                  <span>Open hardware + software</span>
                  <span>Revision 0.1</span>
                </div>
              </div>
              <div className={styles.featureCopy}>
                <h3>{openMicro.name}</h3>
                <p className={styles.productSummary}>{openMicro.summary}</p>
                <dl className={styles.productFacts}>
                  <div><dt>Controls</dt><dd>15</dd></div>
                  <div><dt>Connection</dt><dd>USB-C + Bluetooth</dd></div>
                </dl>
                <span className={styles.productLink}>
                  Explore Open Micro <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.lavtypeFeature}`}
              href={lavtype.path}
              aria-label={`Explore ${lavtype.name}`}
            >
              <div className={styles.featureCopy}>
                <h3>{lavtype.name}</h3>
                <p className={styles.productSummary}>{lavtype.summary}</p>
                <dl className={styles.productFacts}>
                  <div><dt>Recognition</dt><dd>Local</dd></div>
                  <div><dt>Platforms</dt><dd>macOS + X11 Linux</dd></div>
                </dl>
                <span className={styles.productLink}>
                  Explore Lavtype <span aria-hidden="true">↗</span>
                </span>
              </div>
              <div className={styles.lavtypeMedia}>
                <VoiceTrace compact />
              </div>
            </a>
          </div>
        </div>
      </section>
      </Reveal>
    </SiteShell>
  )
}
