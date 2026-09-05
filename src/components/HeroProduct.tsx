import { headings, hero, marketingRenders } from '../content/openMicro'
import styles from './HeroProduct.module.css'

export function HeroProduct() {
  return (
    <section className={styles.hero} id="overview" aria-labelledby="hero-title">
      <div className={styles.inner}>
        <h1 className={styles.title} id="hero-title">
          {headings.hero}
        </h1>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <p className={styles.statement}>{hero.statement}</p>
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
          </figure>
        </div>
      </div>
    </section>
  )
}
