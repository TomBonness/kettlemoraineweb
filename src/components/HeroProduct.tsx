import { useRef, type PointerEvent } from 'react'
import hero640Avif from '../assets/product/generated/hero-640.avif'
import hero1024Avif from '../assets/product/generated/hero-1024.avif'
import hero1536Avif from '../assets/product/generated/hero-1536.avif'
import hero640Webp from '../assets/product/generated/hero-640.webp'
import hero1024Webp from '../assets/product/generated/hero-1024.webp'
import hero1536Webp from '../assets/product/generated/hero-1536.webp'
import { headings, hero, productCopy } from '../content/openMicro'
import styles from './HeroProduct.module.css'

export function HeroProduct() {
  const visualRef = useRef<HTMLElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) return

    const visual = visualRef.current
    if (!visual) return
    const bounds = visual.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    visual.style.setProperty('--image-x', `${x * 3}px`)
    visual.style.setProperty('--image-y', `${y * 2}px`)
  }

  function resetPointer() {
    const visual = visualRef.current
    if (!visual) return
    visual.style.removeProperty('--image-x')
    visual.style.removeProperty('--image-y')
  }

  return (
    <section className={styles.hero} id="overview" aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.productType}>{hero.eyebrow}</p>
        <h1 id="hero-title">{headings.hero}</h1>
        <p className={styles.description}>{hero.description}</p>
        <div className={styles.actions}>
          <a className="button buttonPrimary" href="#waitlist">
            {hero.primaryCta} <span aria-hidden="true">↓</span>
          </a>
          <a className="button buttonQuiet" href="#design">
            {hero.secondaryCta} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className={styles.indexLabel}>{hero.indexLabel}</p>
      </div>

      <figure
        className={styles.artwork}
        ref={visualRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <picture>
          <source
            type="image/avif"
            srcSet={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`}
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 58vw"
          />
          <source
            type="image/webp"
            srcSet={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`}
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 64px), 58vw"
          />
          <img
            className={styles.productBackdrop}
            src={hero1024Webp}
            width="1536"
            height="1536"
            fetchPriority="high"
            decoding="async"
            alt={productCopy.heroAlt}
          />
        </picture>
        <figcaption>{productCopy.visualizationCredit}</figcaption>
      </figure>
    </section>
  )
}
