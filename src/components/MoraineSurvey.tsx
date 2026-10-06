import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { productCatalog, type ProductId } from '../content/catalog'
import { surveyMarkers } from '../content/home'
import { moraineBounds, moraineContours, moraineSummit } from '../content/moraineContours'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import styles from './MoraineSurvey.module.css'

/** Each product's marker hue, from its page palette. */
const markerHues: Record<ProductId, string> = {
  'open-micro': '#e2c58f',
  inference: '#89adff',
  lavtype: '#b89bff',
  cinmux: '#a3be78',
}

/** Elevation tint, from the foot of the moraine to the summit. */
const elevationStops = ['#2f5bff', '#5c64ff', '#a98bff', '#4cc3a4', '#a3be78', '#e2c58f']

function mix(from: string, to: string, amount: number) {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16)
  return `rgb(${[0, 1, 2]
    .map((index) => Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * amount))
    .join(' ')})`
}

function elevationTint(level: number) {
  const position = (level / (moraineContours.length - 1)) * (elevationStops.length - 1)
  const index = Math.min(elevationStops.length - 2, Math.floor(position))
  return mix(elevationStops[index], elevationStops[index + 1], position - index)
}

const percent = (value: number, total: number) => `${(value / total) * 100}%`
const toPlane = (x: number, y: number) => ({
  left: percent(x - moraineBounds.x, moraineBounds.width),
  top: percent(y - moraineBounds.y, moraineBounds.height),
})

const rings = moraineContours.map((ring, level) => {
  const [x, y, width, height] = ring.box
  return {
    ...ring,
    level,
    viewBox: `${x} ${y} ${width} ${height}`,
    style: {
      ...toPlane(x, y),
      width: percent(width, moraineBounds.width),
      height: percent(height, moraineBounds.height),
      '--hm-level': level,
      '--hm-tint': elevationTint(level),
    } as CSSProperties,
  }
})

/**
 * The hero centerpiece: the Kettle Moraine contour map raised into terrain, ring by ring, with a
 * survey marker for each product. The rail underneath is the accessible way to the products;
 * hovering or focusing it lights the matching marker and the contour it stands on.
 */
export function MoraineSurvey() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState<ProductId | null>(reduced ? null : productCatalog[0].id)
  const [touched, setTouched] = useState(false)

  useStageMotion(stage, !reduced)

  useInterval(
    () => {
      const index = productCatalog.findIndex((product) => product.id === active)
      setActive(productCatalog[(index + 1) % productCatalog.length].id)
    },
    3200,
    inView && !reduced && !touched,
  )

  const choose = useCallback((id: ProductId) => {
    setTouched(true)
    setActive(id)
  }, [])

  const litLevel = active ? surveyMarkers[active].level : -1

  return (
    <div className={styles.survey}>
      <div
        className={`${styles.stage} ${reduced ? styles.still : ''}`}
        data-playing={inView && !reduced ? '' : undefined}
        ref={stage}
      >
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.viewport} aria-hidden="true">
          <div className={styles.plane}>
            <div className={styles.ground} />
            <div className={styles.sweep} />
            {rings.map((ring) => (
              <svg
                className={styles.ring}
                data-major={ring.major ? '' : undefined}
                data-lit={ring.level === litLevel ? '' : undefined}
                style={
                  ring.level === litLevel && active
                    ? ({ ...ring.style, '--hm-lit': markerHues[active] } as CSSProperties)
                    : ring.style
                }
                viewBox={ring.viewBox}
                preserveAspectRatio="none"
                key={ring.level}
              >
                <path className={styles.fill} d={ring.d} />
                <path className={styles.line} d={ring.d} vectorEffect="non-scaling-stroke" />
                <path className={styles.halo} d={ring.d} pathLength={1} />
                <path className={styles.light} d={ring.d} pathLength={1} />
              </svg>
            ))}
            <div
              className={styles.summit}
              style={
                {
                  ...toPlane(moraineSummit.x, moraineSummit.y),
                  '--hm-level': moraineContours.length,
                } as CSSProperties
              }
            >
              <svg viewBox="-20 -20 40 40">
                <circle r="15" />
                <path d="M-11 0h22M0-11v22" />
              </svg>
            </div>
            {productCatalog.map((product) => {
              const marker = surveyMarkers[product.id]
              return (
                <a
                  className={styles.marker}
                  data-active={active === product.id ? '' : undefined}
                  href={product.path}
                  tabIndex={-1}
                  onPointerEnter={() => choose(product.id)}
                  style={
                    {
                      ...toPlane(marker.x, marker.y),
                      '--hm-level': marker.level,
                      '--hm-beam': marker.beam,
                      '--hm-hue': markerHues[product.id],
                      '--hm-anchor': 0.15 + 0.7 * ((marker.x - moraineBounds.x) / moraineBounds.width),
                    } as CSSProperties
                  }
                  key={product.id}
                >
                  <span className={styles.pad} />
                  <span className={styles.beam} />
                  <span className={styles.label}>
                    <span className={styles.name}>{product.name}</span>
                    <span className={styles.kind}>{marker.kind}</span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <nav className={styles.rail} aria-label="Featured products">
        {productCatalog.map((product) => (
          <a
            href={product.path}
            data-active={active === product.id ? '' : undefined}
            style={{ '--hm-hue': markerHues[product.id] } as CSSProperties}
            onPointerEnter={() => choose(product.id)}
            onFocus={() => choose(product.id)}
            key={product.id}
          >
            <span className={styles.dot} aria-hidden="true" />
            <strong>{product.name}</strong>
            <span className={styles.railKind}>{surveyMarkers[product.id].kind}</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </nav>
    </div>
  )
}
