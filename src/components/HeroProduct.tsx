import { useRef, type PointerEvent } from 'react'
import drawingTop640Avif from '../assets/product/generated/drawing-top-640.avif'
import drawingTop1024Avif from '../assets/product/generated/drawing-top-1024.avif'
import drawingTop640Webp from '../assets/product/generated/drawing-top-640.webp'
import drawingTop1024Webp from '../assets/product/generated/drawing-top-1024.webp'
import { brandCopy, headings, hero, productCopy } from '../content/openMicro'
import styles from './HeroProduct.module.css'


export function HeroProduct() {
  const visualRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) return

    const visual = visualRef.current
    if (!visual) return
    const bounds = visual.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    visual.style.setProperty('--image-x', `${x * 9}px`)
    visual.style.setProperty('--image-y', `${y * 6}px`)
  }

  function resetPointer() {
    const visual = visualRef.current
    if (!visual) return
    visual.style.removeProperty('--image-x')
    visual.style.removeProperty('--image-y')
  }

  return (
    <section className={styles.hero} id="overview" aria-labelledby="hero-title">
      <div
        className={styles.artwork}
        ref={visualRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <picture>
          <source
            type="image/avif"
            srcSet={`${drawingTop640Avif} 640w, ${drawingTop1024Avif} 1024w`}
            sizes="(min-width: 1500px) 1440px, (max-width: 700px) 100vw, calc(100vw - 64px)"
          />
          <source
            type="image/webp"
            srcSet={`${drawingTop640Webp} 640w, ${drawingTop1024Webp} 1024w`}
            sizes="(min-width: 1500px) 1440px, (max-width: 700px) 100vw, calc(100vw - 64px)"
          />
          <img
            className={styles.productBackdrop}
            src={drawingTop1024Webp}
            width="1024"
            height="1024"
            fetchPriority="high"
            decoding="async"
            alt={productCopy.heroAlt}
          />
        </picture>
        <div className={styles.wash} aria-hidden="true" />
        <div className={styles.grid} aria-hidden="true" />
        <img
          className={styles.brandLogo}
          src="/brand/kettle-moraine-wordmark.png"
          width="1440"
          height="374"
          alt={brandCopy.name}
        />
        <p className={styles.desktopKicker}>{hero.indexLabel}</p>
        <div className={styles.crosshair} aria-hidden="true">
          <span />
        </div>
        <div className={styles.copy}>
          <h1 id="hero-title">{headings.hero}</h1>
          <span className={styles.accentRule} aria-hidden="true" />
          <p className={styles.productType}>{hero.eyebrow}</p>
          <p className={styles.description}>{hero.description}</p>
        </div>
      </div>

      <div className={styles.actionRail}>
        <p>{hero.indexLabel}</p>
        <div className={styles.actions}>
          <a className="button buttonPrimary" href="#waitlist">
            {hero.primaryCta}
          </a>
          <a className="button buttonQuiet" href="#design">
            {hero.secondaryCta}
          </a>
        </div>
      </div>
      <p className={styles.visualizationCredit}>{productCopy.visualizationCredit}</p>
    </section>
  )
}
