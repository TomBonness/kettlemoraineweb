import { useRef, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import hero640Avif from '../assets/product/generated/hero-640.avif'
import hero1024Avif from '../assets/product/generated/hero-1024.avif'
import hero1536Avif from '../assets/product/generated/hero-1536.avif'
import hero640Webp from '../assets/product/generated/hero-640.webp'
import hero1024Webp from '../assets/product/generated/hero-1024.webp'
import hero1536Webp from '../assets/product/generated/hero-1536.webp'
import { headings, hero, productCopy } from '../content/product'
import styles from './HeroProduct.module.css'


export function HeroProduct() {
  const visualRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return

    const visual = visualRef.current
    if (!visual) return
    const bounds = visual.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    visual.style.setProperty('--image-x', `${x * 10}px`)
    visual.style.setProperty('--image-y', `${y * 7}px`)
    visual.style.setProperty('--image-rotate', `${x * 1.2}deg`)
  }

  function resetPointer() {
    const visual = visualRef.current
    if (!visual) return
    visual.style.removeProperty('--image-x')
    visual.style.removeProperty('--image-y')
    visual.style.removeProperty('--image-rotate')
  }

  return (
    <section className={styles.hero} id="overview" aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-title">{headings.hero}</h1>
        <p className={styles.description}>{hero.description}</p>
        <div className={styles.actions}>
          <a className="button buttonPrimary" href="#waitlist">
            {hero.primaryCta}
          </a>
          <a className="button buttonQuiet" href="#design">
            {hero.secondaryCta}
          </a>
        </div>
      </div>

      <div
        className={styles.visualStage}
        ref={visualRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className={styles.halo} aria-hidden="true" />
        <picture className={styles.productPicture}>
          <source
            type="image/avif"
            srcSet={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`}
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <source
            type="image/webp"
            srcSet={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`}
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <img
            src={hero1024Webp}
            width="1536"
            height="1536"
            fetchPriority="high"
            decoding="async"
            alt={productCopy.heroAlt}
          />
        </picture>
        <p className={styles.renderCaption}>
          <strong>{productCopy.heroCaptionTitle}</strong>
          <span>{productCopy.heroCaptionBody}</span>
        </p>
      </div>
    </section>
  )
}
