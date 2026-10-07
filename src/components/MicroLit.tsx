import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { marketingRenders } from '../content/openMicro'
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './MicroLit.module.css'

/* Open Micro's top layout in millimetres, from the board model: a 96 mm square board with 18 mm caps
   on a 19.05 mm pitch. In the overhead render the board fills the middle 76.15% of the image. */
const BOARD = 96
const CAP = 18
const PITCH = 19.05
const GRID = (BOARD - (PITCH * 3 + CAP)) / 2
const RENDER_BOARD = 0.7615

/** The twelve keys as [column, row, width in units], top-left first. */
const KEYS = [
  [1, 0, 2],
  [3, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
  [2, 1, 1],
  [3, 1, 1],
  [0, 2, 1],
  [1, 2, 1],
  [2, 2, 1],
  [3, 2, 1],
  [1, 3, 1],
  [2, 3, 1],
] as const

const percent = (millimetres: number) => `${((millimetres / BOARD) * 100).toFixed(3)}%`

/** Each key's box on the board, how far along the diagonal it sits (0–100) and its turn to light. */
const lights = (() => {
  const boxes = KEYS.map(([column, row, units]) => {
    const x = GRID + column * PITCH
    const y = GRID + row * PITCH
    const width = CAP + (units - 1) * PITCH
    return { x, y, width, centre: x + width / 2 + y + CAP / 2 }
  })
  const first = Math.min(...boxes.map((box) => box.centre))
  const last = Math.max(...boxes.map((box) => box.centre))
  const order = boxes.map((box) => box.centre).sort((a, b) => a - b)
  return boxes.map((box) => ({
    style: {
      '--x': percent(box.x),
      '--y': percent(box.y),
      '--w': percent(box.width),
      '--h': percent(CAP),
      '--t': `${Math.round(((box.centre - first) / (last - first)) * 100)}%`,
      '--i': order.indexOf(box.centre),
    } as CSSProperties,
  }))
})()

/**
 * The overhead render as the page's closing shot: the board on its own, with every key lit from
 * beneath in the product's brass-to-blue. The keys light in a wave the first time it's on screen,
 * then breathe slowly while it stays there; with reduced motion they're simply lit.
 */
export function MicroLit() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.4)
  const [reduced] = useState(prefersReducedMotion)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])

  return (
    <div
      className={styles.stage}
      ref={stage}
      data-lit={reduced || seen}
      data-live={inView && !reduced}
      aria-hidden="true"
    >
      <span className={styles.pool} />
      <div className={styles.board}>
        <img
          src={marketingRenders.top.src}
          srcSet={marketingRenders.top.srcSet}
          width={marketingRenders.top.width}
          height={marketingRenders.top.height}
          sizes={`(max-width: 767px) ${Math.round(78 / RENDER_BOARD)}vw, ${Math.round(460 / RENDER_BOARD)}px`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className={styles.lights}>
        {lights.map((light, index) => (
          <i style={light.style} key={index} />
        ))}
      </span>
    </div>
  )
}
