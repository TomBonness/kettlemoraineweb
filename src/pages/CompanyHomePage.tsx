import { SiteShell } from '../components/SiteShell'
import { VoiceTrace } from '../components/VoiceTrace'
import { productCatalog, routes } from '../content/catalog'
import openMicroHome from '../assets/product/marketing/open-micro-home-960.webp'
import openMicroHomeLarge from '../assets/product/marketing/open-micro-home-1600.webp'
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
          <div className={styles.heroTitle}>
            <h1 id="company-heading" aria-label="You have work to do.">
              <span aria-hidden="true">You have</span>
              <span aria-hidden="true">work to do.</span>
            </h1>
          </div>

          <div className={styles.heroFooter}>
            <p className={styles.heroStatement}>
              We’re building hardware, software, and hosted inference for people who would rather be
              making something than managing their computer.
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

      <section className={styles.products} id="products" aria-labelledby="products-heading">
        <div className={styles.productsInner}>
          <header className={styles.productsIntro}>
            <div>
              <h2 id="products-heading">
                <span>Here’s where</span>
                <span>we’re starting.</span>
              </h2>
            </div>
            <p>
              We’re starting with the actions you repeat, the words you want to write, and the
              time spent waiting for an answer.
            </p>
          </header>

          <div className={styles.featureStack}>
            <a
              className={`${styles.feature} ${styles.openMicroFeature}`}
              href={openMicro.path}
              aria-label={`Explore ${openMicro.name}`}
            >
              <div className={styles.openMicroMedia}>
                <img
                  src={openMicroHome}
                  srcSet={`${openMicroHome} 960w, ${openMicroHomeLarge} 1600w`}
                  width="1600"
                  height="1131"
                  alt="Art-directed concept visualization of Open Micro with twelve dark keys, a push encoder, and a softly illuminated frosted wall"
                  sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1050px) calc(100vw - 96px), (max-width: 1280px) 65vw, 780px"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.featureCopy}>
                <h3>{openMicro.name}</h3>
                <p className={styles.productSummary}>{openMicro.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Controls</dt>
                    <dd>12 keys + encoder + touch</dd>
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
                  <small>tokens per second target</small>
                </div>
              </div>
              <div className={styles.featureCopy}>
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
              <h2 id="principles-title">
                The work
                <br />
                <em>comes first.</em>
              </h2>
            </div>
            <p>
              We want a computer to feel like a tool you know, not a collection of systems you have
              to keep happy. That’s a big ambition. We’re taking it one useful piece at a time.
            </p>
          </div>
          <div className={styles.principleGrid}>
            <article>
              <h3>Start with what gets in the way.</h3>
              <p>
                The extra click, the copied transcript, the wait for an answer. Those are small
                interruptions until they fill your day.
              </p>
            </article>
            <article>
              <h3>Leave room for the owner.</h3>
              <p>
                We publish Open Micro’s designs and Lavtype’s source code. You can read them,
                change them, and take the work in a direction we didn’t plan.
              </p>
            </article>
            <article>
              <h3>Say what’s ready.</h3>
              <p>
                A concept isn’t a finished product. A performance target isn’t a benchmark. We’ll
                make those distinctions clear, along with where each tool runs and what it needs
                from you.
              </p>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
