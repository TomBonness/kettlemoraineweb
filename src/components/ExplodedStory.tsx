import drawingEnclosure640Avif from '../assets/product/generated/drawing-enclosure-640.avif'
import drawingEnclosure1024Avif from '../assets/product/generated/drawing-enclosure-1024.avif'
import drawingEnclosure640Webp from '../assets/product/generated/drawing-enclosure-640.webp'
import drawingEnclosure1024Webp from '../assets/product/generated/drawing-enclosure-1024.webp'
import drawingExploded640Avif from '../assets/product/generated/drawing-exploded-640.avif'
import drawingExploded1024Avif from '../assets/product/generated/drawing-exploded-1024.avif'
import drawingExploded640Webp from '../assets/product/generated/drawing-exploded-640.webp'
import drawingExploded1024Webp from '../assets/product/generated/drawing-exploded-1024.webp'
import { explodedLayers, headings, productCopy } from '../content/openMicro'
import styles from './ExplodedStory.module.css'

export function ExplodedStory() {
  return (
    <section className={styles.story} id="design" aria-labelledby="design-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className="eyebrow">{productCopy.designEyebrow}</p>
          <h2 id="design-title">{headings.design}</h2>
          <p className="sectionLead">{productCopy.designLead}</p>
        </header>

        <div className={styles.visualGrid}>
          <figure className={`${styles.render} ${styles.explodedRender}`}>
            <div className={styles.renderImage}>
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${drawingExploded640Avif} 640w, ${drawingExploded1024Avif} 1024w`}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 58vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${drawingExploded640Webp} 640w, ${drawingExploded1024Webp} 1024w`}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 58vw"
                />
                <img
                  src={drawingExploded1024Webp}
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  alt={productCopy.explodedAlt}
                />
              </picture>
            </div>
            <figcaption>
              <strong>{productCopy.explodedRenderTitle}</strong>
              <span>{productCopy.explodedRenderBody}</span>
            </figcaption>
          </figure>

          <figure className={`${styles.render} ${styles.enclosureRender}`}>
            <div className={styles.renderImage}>
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${drawingEnclosure640Avif} 640w, ${drawingEnclosure1024Avif} 1024w`}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 42vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${drawingEnclosure640Webp} 640w, ${drawingEnclosure1024Webp} 1024w`}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 42vw"
                />
                <img
                  src={drawingEnclosure1024Webp}
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  alt={productCopy.enclosureAlt}
                />
              </picture>
            </div>
            <figcaption>
              <strong>{productCopy.enclosureRenderTitle}</strong>
              <span>{productCopy.enclosureRenderBody}</span>
            </figcaption>
          </figure>
        </div>

        <ol className={styles.layers}>
          {explodedLayers.map((layer) => (
            <li key={layer.label}>
              <span>{layer.label}</span>
              <div>
                <small>{layer.title}</small>
                <strong>{layer.value}</strong>
                <p>{layer.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
