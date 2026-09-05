import { headings, marketingRenders, specs } from '../content/openMicro'
import styles from './SpecsGrid.module.css'

export function SpecsGrid() {
  return (
    <section className={styles.section} id="specs" aria-labelledby="specs-title">
      <div className={styles.inner}>
        <h2 className={styles.heading} id="specs-title">{headings.specifications}</h2>

        <div className={styles.layout}>
          <figure className={styles.overheadStudy}>
            <img
              {...marketingRenders.top}
              sizes="(min-width: 1280px) 533px, (min-width: 1000px) 45vw, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <dl className={styles.grid}>
            {specs.map(([term, description]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
