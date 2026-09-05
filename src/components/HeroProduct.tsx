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
  const visualRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    )
      return

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
      <div className={styles.inner}>
        <div className={styles.topline}>
          <p>{hero.eyebrow}</p>
          <span>Hardware / Rev. 0.1</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <h1 id="hero-title">{headings.hero}</h1>
            <p className={styles.statement}>
              A physical place
              <br />
              for digital work.
            </p>
            <p className={styles.description}>{hero.description}</p>
            <div className={styles.actions}>
              <a className="button buttonPrimary" href="#waitlist">
                {hero.primaryCta}
              </a>
              <a className={styles.textLink} href="#design">
                {hero.secondaryCta}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div
            className={styles.artwork}
            ref={visualRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
          >
            <picture>
              <source
                type="image/avif"
                srcSet={`${hero640Avif} 640w, ${hero1024Avif} 1024w, ${hero1536Avif} 1536w`}
                sizes="(max-width: 767px) 100vw, 65vw"
              />
              <source
                type="image/webp"
                srcSet={`${hero640Webp} 640w, ${hero1024Webp} 1024w, ${hero1536Webp} 1536w`}
                sizes="(max-width: 767px) 100vw, 65vw"
              />
              <img
                className={styles.productBackdrop}
                src={hero1024Webp}
                width="1024"
                height="768"
                fetchPriority="high"
                decoding="async"
                alt={productCopy.heroAlt}
              />
            </picture>
            <div className={styles.measure} aria-hidden="true">
              <span>96 mm</span>
            </div>
            <p className={styles.renderLabel}>MX hot-swap / Encoder / Five-way / Touch</p>
          </div>
        </div>
        <dl className={styles.baseline}>
          <div>
            <dt>Footprint</dt>
            <dd>96 × 96 mm</dd>
          </div>
          <div>
            <dt>Connection</dt>
            <dd>USB-C + Bluetooth</dd>
          </div>
          <div>
            <dt>Firmware</dt>
            <dd>ZMK + Studio</dd>
          </div>
          <div>
            <dt>Designed to be</dt>
            <dd>Open. All the way down.</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
