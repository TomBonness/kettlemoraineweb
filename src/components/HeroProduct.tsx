import { headings, hero, marketingRenders } from '../content/openMicro'
import styles from './HeroProduct.module.css'

export function HeroProduct() {
  return (
    <section className={styles.hero} id="overview" aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.topline}>
          <p>{hero.eyebrow}</p>
          <span className={styles.development}>In development</span>
        </div>
        <h1 className={styles.title} id="hero-title">
          {headings.hero}
        </h1>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <p className={styles.statement}>
              A physical place
              <br />
              for digital work.
            </p>
            <p className={styles.description}>{hero.description}</p>
            <div className={styles.actions}>
              <a className="button buttonPrimary" href="#waitlist">
                {hero.primaryCta}
                <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href="#design">
                {hero.secondaryCta}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <figure className={styles.artwork}>
            <div className={styles.renderFrame}>
              <img
                {...marketingRenders.transparent}
                sizes="(max-width: 767px) calc(120vw - 57.6px), (max-width: 1280px) 77vw, 948px"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption>Concept visualization / Art-directed materials & light</figcaption>
          </figure>
        </div>
        <dl className={styles.baseline}>
          <div>
            <dt>Footprint</dt>
            <dd>96 × 96 mm</dd>
          </div>
          <div>
            <dt>Connection</dt>
            <dd>USB-C + Bluetooth</dd>
          </div>
          <div>
            <dt>Open firmware</dt>
            <dd>ZMK + Studio</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
