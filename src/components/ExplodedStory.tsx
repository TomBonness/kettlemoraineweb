import exploded640Avif from '../assets/product/generated/exploded-640.avif'
import exploded1024Avif from '../assets/product/generated/exploded-1024.avif'
import exploded1536Avif from '../assets/product/generated/exploded-1536.avif'
import exploded640Webp from '../assets/product/generated/exploded-640.webp'
import exploded1024Webp from '../assets/product/generated/exploded-1024.webp'
import exploded1536Webp from '../assets/product/generated/exploded-1536.webp'
import rear640Avif from '../assets/product/generated/rear-640.avif'
import rear1024Avif from '../assets/product/generated/rear-1024.avif'
import rear1536Avif from '../assets/product/generated/rear-1536.avif'
import rear640Webp from '../assets/product/generated/rear-640.webp'
import rear1024Webp from '../assets/product/generated/rear-1024.webp'
import rear1536Webp from '../assets/product/generated/rear-1536.webp'
import { explodedLayers, headings, productCopy } from '../content/product'
import styles from './ExplodedStory.module.css'

export function ExplodedStory() {
  return (
    <section className={styles.story} id="design" aria-labelledby="design-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className="eyebrow eyebrowDark">{productCopy.designEyebrow}</p>
          <h2 id="design-title">{headings.design}</h2>
          <p className="sectionLead sectionLeadDark">{productCopy.designLead}</p>
        </header>

        <div className={styles.visualGrid}>
          <figure className={`${styles.render} ${styles.explodedRender}`}>
            <div className={styles.renderImage}>
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${exploded640Avif} 640w, ${exploded1024Avif} 1024w, ${exploded1536Avif} 1536w`}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${exploded640Webp} 640w, ${exploded1024Webp} 1024w, ${exploded1536Webp} 1536w`}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <img
                  src={exploded1024Webp}
                  width="1536"
                  height="1536"
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
                  srcSet={`${rear640Avif} 640w, ${rear1024Avif} 1024w, ${rear1536Avif} 1536w`}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${rear640Webp} 640w, ${rear1024Webp} 1024w, ${rear1536Webp} 1536w`}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <img
                  src={rear1024Webp}
                  width="1536"
                  height="1536"
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
