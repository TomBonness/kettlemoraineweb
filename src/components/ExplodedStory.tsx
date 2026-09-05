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

        <div className={styles.visualGrid}>
          <figure className={styles.assembly}>
            <img
              {...marketingRenders.exploded}
              sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1280px) 52vw, 650px"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>{productCopy.explodedRenderTitle}</strong>
              <p>{productCopy.explodedRenderBody}</p>
            </figcaption>
          </figure>

          <div className={styles.materialStory}>
            <figure className={styles.detail}>
              <img
                {...marketingRenders.detail}
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1280px) 40vw, 490px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <strong>A quiet contrast.</strong>
                <p>
                  Textured dark PBT above matte solder mask. Small ENIG contacts against a dark
                  working surface. Anodized aluminum below a frosted polycarbonate wall, with
                  silicone at the desk. A study in touch, light, and restraint.
                </p>
              </figcaption>
            </figure>

            <ul className={styles.layers} aria-label="Material layers">
              {explodedLayers.map((layer) => (
                <li key={layer.title}>
                  <h3>
                    {layer.title} <span>/ {layer.value}</span>
                  </h3>
                  <p>{layer.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.studyNote}>
          Concept and material studies, not manufactured or qualified hardware. Surface finishes and
          light are art-directed. The current design is not safe to fabricate or assemble.
        </p>
      </div>
    </section>
  )
}
