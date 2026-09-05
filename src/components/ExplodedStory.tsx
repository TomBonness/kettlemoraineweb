import { explodedLayers, headings, marketingRenders, productCopy } from '../content/openMicro'
import styles from './ExplodedStory.module.css'

export function ExplodedStory() {
  return (
    <section className={styles.story} id="design" aria-labelledby="design-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="design-title">{headings.design}</h2>
          <p className={styles.lead}>{productCopy.designLead}</p>
        </header>

        <figure className={styles.construction}>
          <div className={styles.assembly}>
            <img
              {...marketingRenders.exploded}
              sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 900px) calc(100vw - 96px), (max-width: 1280px) 48vw, 580px"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className={styles.layerDetails}>
            <ol
              className={styles.layers}
              role="list"
              aria-label="Construction, from keycaps to base"
            >
              {explodedLayers.map((layer) => (
                <li key={layer.title}>
                  <h3>{layer.title}</h3>
                  <p>{layer.body}</p>
                </li>
              ))}
            </ol>
          </figcaption>
        </figure>

        <figure className={styles.materialStudy}>
          <figcaption>
            <h3>A quiet contrast.</h3>
            <p>
              Textured dark PBT, matte solder mask, and small gold-colored ENIG contacts. A
              restrained palette, with contrast where your hands meet the controls.
            </p>
          </figcaption>
          <img
            {...marketingRenders.detail}
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1280px) 58vw, 690px"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <p className={styles.studyNote}>
          Concept and material studies, not manufactured or qualified hardware. Surface finishes and
          light are art-directed. The current design is not safe to fabricate or assemble.
        </p>
      </div>
    </section>
  )
}
