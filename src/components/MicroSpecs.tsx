import { useState, type CSSProperties } from 'react'
import { marketingRenders, specHotspots, specs } from '../content/openMicro'
import styles from './MicroSpecs.module.css'

type SpecName = (typeof specs)[number][0]

const specId = (name: string) => `open-micro-spec-${name.toLowerCase().replace(/\W+/g, '-')}`

/**
 * The spec sheet beside the overhead render. Hotspots on the render point at the parts a spec
 * describes; hovering or focusing either side marks the other.
 */
export function MicroSpecs() {
  const [hotspot, setHotspot] = useState<number | null>(null)
  const [row, setRow] = useState<SpecName | null>(null)
  const activeSpec = row ?? (hotspot === null ? null : specHotspots[hotspot].spec)

  return (
    <div className={styles.specs}>
      <figure className={styles.figure}>
        <img
          {...marketingRenders.top}
          sizes="(max-width: 900px) 92vw, 600px"
          loading="lazy"
          decoding="async"
        />
        {specHotspots.map((spot, index) => (
          <button
            className={styles.hotspot}
            type="button"
            style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%` } as CSSProperties}
            data-shown={hotspot === index}
            data-match={activeSpec === spot.spec}
            data-side={spot.x > 60 ? 'left' : 'right'}
            aria-describedby={specId(spot.spec)}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setHotspot(index)
            }}
            onPointerLeave={() => setHotspot(null)}
            onFocus={() => setHotspot(index)}
            onBlur={() => setHotspot(null)}
            onClick={() => setHotspot(index)}
            key={spot.label}
          >
            <span className={styles.hotspotLabel}>{spot.label}</span>
          </button>
        ))}
      </figure>

      <dl className={styles.list}>
        {specs.map(([term, detail]) => (
          <div
            id={specId(term)}
            data-active={activeSpec === term}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setRow(term)
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
