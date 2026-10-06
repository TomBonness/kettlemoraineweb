import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { marketingRenders, specHotspots, specs } from '../content/openMicro'
import { easeVars, prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import styles from './MicroSpecs.module.css'

type SpecName = (typeof specs)[number][0]

const specId = (name: string) => `open-micro-spec-${name.toLowerCase().replace(/\W+/g, '-')}`

/**
 * The spec sheet beside the overhead render. Hotspots on the render point at the parts a spec
 * describes; hovering or focusing either side lights up the other. The hotspots tour by themselves
 * while on screen until the visitor points at something.
 */
export function MicroSpecs() {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [tour, setTour] = useState(0)
  const [hotspot, setHotspot] = useState<number | null>(null)
  const [row, setRow] = useState<SpecName | null>(null)

  useInterval(() => setTour((current) => current + 1), 2600, inView && autoplay && !reduced)

  // The render leans toward the pointer while it is over the figure.
  useEffect(() => {
    const element = figure.current
    if (!element || reduced) return
    const vars = easeVars(element, { '--mx': 0, '--my': 0 }, 0.08)
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      vars.set({
        '--mx': ((event.clientX - box.left) / box.width) * 2 - 1,
        '--my': ((event.clientY - box.top) / box.height) * 2 - 1,
      })
    }
    const leave = () => vars.set({ '--mx': 0, '--my': 0 })
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      vars.stop()
    }
  }, [reduced])

  const touring = autoplay && !reduced && inView
  const shownSpot = hotspot ?? (touring ? tour % specHotspots.length : null)
  const activeSpec = row ?? (shownSpot === null ? null : specHotspots[shownSpot].spec)

  const pointAt = (index: number | null) => {
    setAutoplay(false)
    setHotspot(index)
  }

  return (
    <div className={styles.specs}>
      <figure className={styles.figure} ref={figure} data-spec={activeSpec ?? undefined}>
        <div className={styles.tilt}>
          <img
            {...marketingRenders.top}
            sizes="(max-width: 900px) 92vw, 600px"
            loading="lazy"
            decoding="async"
          />
          <span className={styles.dimension} data-axis="x" aria-hidden="true">
            <span>96 mm</span>
          </span>
          <span className={styles.dimension} data-axis="y" aria-hidden="true">
            <span>96 mm</span>
          </span>
          {specHotspots.map((spot, index) => (
            <button
              className={styles.hotspot}
              type="button"
              style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%` } as CSSProperties}
              data-shown={shownSpot === index}
              data-match={activeSpec === spot.spec}
              data-side={spot.x > 60 ? 'left' : 'right'}
              aria-describedby={specId(spot.spec)}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') pointAt(index)
              }}
              onPointerLeave={() => setHotspot(null)}
              onFocus={() => pointAt(index)}
              onBlur={() => setHotspot(null)}
              onClick={() => pointAt(index)}
              key={spot.label}
            >
              <span className={styles.hotspotLabel}>{spot.label}</span>
            </button>
          ))}
        </div>
      </figure>

      <dl className={styles.list}>
        {specs.map(([term, detail]) => (
          <div
            id={specId(term)}
            data-active={activeSpec === term}
            onPointerEnter={(event) => {
              if (event.pointerType === 'touch') return
              setAutoplay(false)
              setRow(term)
            }}
            onPointerLeave={() => setRow(null)}
            key={term}
          >
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
