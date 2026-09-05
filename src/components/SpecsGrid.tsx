import { headings, marketingRenders, specs } from '../content/openMicro'
import styles from './SpecsGrid.module.css'

export function SpecsGrid() {
  return (
    <section className={styles.section} id="specs" aria-labelledby="specs-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>04 / Design specification</p>
            <h2 id="specs-title">{headings.specifications}</h2>
          </div>
          <p className={styles.disclosure}>
            Current design targets.
            <br />
            Height and component stack remain unresolved.
          </p>
        </div>

        <div className={styles.layout}>
          <figure className={styles.overheadStudy}>
            <div className={styles.studyLabel}>
              <span>Open Micro / Overhead study</span>
              <span>01: Top</span>
            </div>
            <img
              {...marketingRenders.top}
              sizes="(min-width: 1280px) 533px, (min-width: 1000px) 45vw, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Concept visualization of a design in development. Materials and illumination are
              art-directed; this is not an engineering drawing.
            </figcaption>
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
