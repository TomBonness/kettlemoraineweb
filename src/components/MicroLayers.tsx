import { useRef, useState, type CSSProperties } from 'react'
import { explodedLayers, marketingRenders, productCopy } from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import styles from './MicroLayers.module.css'

/** Where each layer sits on the exploded render, as [top, bottom] percent of its height. */
const bands: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[19, 34]],
  [[32.5, 47]],
  [
    [43, 56.5],
    [65.5, 76],
  ],
  [[51.5, 69]],
  [[77, 93]],
]

/**
 * The exploded render beside the five layers it shows. Pointing at, focusing or choosing a layer
 * marks its band on the render; the layers step through by themselves while on screen until the
 * visitor picks one.
 */
export function MicroLayers() {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [active, setActive] = useState(0)

  useInterval(
    () => setActive((current) => (current + 1) % explodedLayers.length),
    3200,
    inView && autoplay && !reduced,
  )

  const choose = (index: number) => {
    setAutoplay(false)
    setActive(index)
  }

  return (
    <div className={styles.layers} ref={root}>
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <img
            {...marketingRenders.exploded}
            sizes="(max-width: 900px) 92vw, 560px"
            loading="lazy"
            decoding="async"
          />
          {bands.map((layer, index) =>
            layer.map(([top, bottom], part) => (
              <span
                className={styles.band}
                data-active={index === active}
                style={{ '--top': `${top}%`, '--bottom': `${100 - bottom}%` } as CSSProperties}
                aria-hidden="true"
                key={`${index}-${top}`}
              >
                {part === 0 && (
                  <span className={styles.leader} data-n={String(index + 1).padStart(2, '0')} />
                )}
              </span>
            )),
          )}
        </div>
        <figcaption>
          <span className={styles.conceptTag}>{productCopy.conceptTag}</span>
          {productCopy.explodedCaption}
        </figcaption>
      </figure>

      <ol className={styles.list}>
        {explodedLayers.map((layer, index) => (
          <li key={layer.title}>
            <button
              className={styles.layer}
              type="button"
              aria-pressed={index === active}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') choose(index)
              }}
              onFocus={() => choose(index)}
              onClick={() => choose(index)}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.text}>
                <strong>{layer.title}</strong>
                <span>{layer.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
