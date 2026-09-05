import { headings, specs } from '../content/openMicro'
import styles from './SpecsGrid.module.css'

export function SpecsGrid() {
  return (
    <section className={styles.section} id="specs" aria-labelledby="specs-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>04 / Technical specification</p>
            <h2 id="specs-title">{headings.specifications}</h2>
          </div>
          <p className={styles.disclosure}>
            Revision 0.1
            <br />A compact surface. An open architecture.
          </p>
        </div>

        <dl className={styles.grid}>
          {specs.map(([term, description]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
