import { headings, productCopy, specs } from '../content/openMicro'
import styles from './SpecsGrid.module.css'

export function SpecsGrid() {
  return (
    <section className="section" id="specs" aria-labelledby="specs-title">
      <div className="sectionInner">
        <div className={styles.heading}>
          <div>
            <p className="eyebrow">{productCopy.specsEyebrow}</p>
            <h2 id="specs-title">{headings.specifications}</h2>
          </div>
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
