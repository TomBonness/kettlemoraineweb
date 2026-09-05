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
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function CompanyHomePage() {
  const [openMicro, inference, lavtype] = productCatalog

  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <section className={styles.hero} aria-labelledby="company-heading">
        <div className={styles.heroGrid} aria-hidden="true" />
        <img
          className={styles.heroArtwork}
          src="/brand/contours.svg"
          width="1200"
          height="1000"
          alt=""
        />
        <div className={styles.heroInner}>
          <div className={styles.heroTopline}>
            <span>Kettle Moraine / Research Labs</span>
            <span>Independent by design</span>
          </div>

          <div className={styles.heroTitle}>
            <h1 id="company-heading" aria-label="Tools for clearer work.">
              <span aria-hidden="true">Tools for</span>
              <span aria-hidden="true">clearer work.</span>
            </h1>
          </div>

          <div className={styles.heroFooter}>
            <p className={styles.heroStatement}>
              We design focused, open hardware and software for people who want to understand and
              shape the tools they use.
            </p>
            <nav className={styles.productRail} aria-label="Featured products">
              {productCatalog.map((product, index) => (
                <a href={product.path} key={product.id}>
                  <small>
                    0{index + 1} / {product.category}
                  </small>
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
            <div>
              <p className="sectionEyebrow">01 / From the lab</p>
              <h2 id="products-heading">
                <span>Clearer work.</span>
                <span>In every form.</span>
              </h2>
            </div>
            <p>
              Focused hardware, software, and inference. Built to keep the person using it in
              control.
            </p>
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
                <span className={styles.productEyebrow}>01 / {openMicro.category}</span>
                <h3>{openMicro.name}</h3>
                <p className={styles.productSummary}>{openMicro.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Controls</dt>
                    <dd>15</dd>
                  </div>
                  <div>
                    <dt>Connection</dt>
                    <dd>USB-C + Bluetooth</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore Open Micro <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.inferenceFeature}`}
              href={inference.path}
              aria-label={`Explore ${inference.name}`}
            >
              <div className={styles.inferenceMedia}>
                <img
                  src="/products/inference/token-lens.svg"
                  width="1200"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  alt=""
                />
                <div className={styles.inferenceMetric} aria-hidden="true">
                  <span>1,000</span>
                  <small>tokens / second</small>
                </div>
                <div className={styles.inferenceCaption}>
                  <span>GLM-5.3-Flash</span>
                  <span>Inference target</span>
                </div>
              </div>
              <div className={styles.featureCopy}>
                <span className={styles.productEyebrow}>02 / {inference.category}</span>
                <h3>{inference.name}</h3>
                <p className={styles.productSummary}>{inference.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Model</dt>
                    <dd>GLM-5.3-Flash</dd>
                  </div>
                  <div>
                    <dt>Access</dt>
                    <dd>Inference API</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore 1,000 TPS <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.lavtypeFeature}`}
              href={lavtype.path}
              aria-label={`Explore ${lavtype.name}`}
            >
              <div className={styles.featureCopy}>
                <span className={styles.productEyebrow}>03 / {lavtype.category}</span>
                <h3>{lavtype.name}</h3>
                <p className={styles.productSummary}>{lavtype.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Recognition</dt>
                    <dd>Local</dd>
                  </div>
                  <div>
                    <dt>Platforms</dt>
                    <dd>macOS + X11 Linux</dd>
                  </div>
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

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.principlesInner}>
          <div className={styles.principlesIntro}>
            <div>
              <p className="sectionEyebrow">02 / How we think</p>
              <h2 id="principles-title">
                Small lab.
                <br />
                <em>Long view.</em>
              </h2>
            </div>
            <p>
              Good tools earn their place. Not by doing everything, but by making the things that
              matter feel a little more natural.
            </p>
          </div>
          <div className={styles.principleGrid}>
            <article>
              <span>01</span>
              <h3>Less in the way.</h3>
              <p>
                A physical control. A held shortcut. A faster response. We look for the small
                moments where a better tool makes a real difference.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>More in your hands.</h3>
              <p>
                Open hardware, local software, and open-weight models. Tools should invite
                understanding, not get in the way of it.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Considered all the way through.</h3>
              <p>
                From the enclosure to the interface, the details belong to the same idea: technology
                that respects the person using it.
              </p>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
