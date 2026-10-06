import { useRef, useState, type CSSProperties } from 'react'
import { marketingRenders, productCopy, statusSignals } from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import styles from './MicroSignal.module.css'

/**
 * The night render with its wall light recolored for each planned status signal. A multiplied
 * color layer tints the white emitters; a screened glow layer carries the signal's behavior. The
 * signals cycle by themselves while on screen until the visitor picks one.
 */
export function MicroSignal() {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [active, setActive] = useState(1)

  useInterval(
    () => setActive((current) => (current + 1) % statusSignals.length),
    3600,
    inView && autoplay && !reduced,
  )

  const signal = statusSignals[active]

  return (
    <div
      className={styles.signal}
      ref={root}
      data-live={inView}
      style={{ '--signal': signal.color } as CSSProperties}
    >
      <figure className={styles.scene}>
        <div className={styles.frame}>
          <img
            {...marketingRenders.night}
            sizes="(max-width: 1280px) 92vw, 1184px"
            loading="lazy"
            decoding="async"
          />
          <span className={styles.tint} aria-hidden="true" />
          <span className={styles.glow} data-behavior={active} aria-hidden="true" />
        </div>
        <figcaption>
          <span className={styles.conceptTag}>{productCopy.conceptTag}</span>
          {productCopy.statusPrinciple}
        </figcaption>
      </figure>

      <fieldset className={styles.picker}>
        <legend className={styles.pickerLabel}>{productCopy.statusLegendLabel}</legend>
        {statusSignals.map((item, index) => (
          <label
            className={styles.option}
            data-active={index === active}
            style={{ '--swatch': item.color } as CSSProperties}
            key={item.name}
          >
            <input
              type="radio"
              name="open-micro-signal"
              value={item.name}
              checked={index === active}
              onChange={() => {
                setAutoplay(false)
                setActive(index)
              }}
              onClick={() => setAutoplay(false)}
            />
            <span className={styles.swatch} aria-hidden="true" />
            <span className={styles.optionText}>
              <strong>{item.name}</strong>
              <span>{item.behavior}</span>
            </span>
            <span className={styles.meaning}>{item.meaning}</span>
          </label>
        ))}
      </fieldset>
    </div>
  )
}
