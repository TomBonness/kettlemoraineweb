import { useRef, useState, type CSSProperties } from 'react'
import { speedTechniques } from '../content/inference'
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './InferenceTechniques.module.css'

type Kind = (typeof speedTechniques)[number]['icon']

/* Draft: 15 tokens fanned out in four ranks; the lit ones are the path the model keeps. */
const fan = [3, 4, 4, 4].flatMap((count, rank) =>
  Array.from({ length: count }, (_, slot) => ({
    rank,
    x: 26 + rank * 21,
    y: 50 + (slot - (count - 1) / 2) * (26 - rank * 2),
    z: (slot - (count - 1) / 2) * -26,
  })),
)
const fanPath = new Set([1, 4, 8, 12])

/* Verify: one distribution, drawn twice; the drafted copy settles onto the model's own. */
const distribution = [0.22, 0.48, 0.9, 0.62, 0.34, 0.18, 0.1]

function Illustration({ kind }: { kind: Kind }) {
  if (kind === 'draft') {
    return (
      <div className={styles.draft}>
        <span className={styles.seed} />
        {fan.map((tile, index) => (
          <span
            className={`${styles.fanTile} ${fanPath.has(index) ? styles.onPath : ''}`}
            style={
              {
                '--ci-x': tile.x,
                '--ci-y': tile.y,
                '--ci-z': tile.z,
                '--ci-i': index,
                '--ci-rank': tile.rank,
              } as CSSProperties
            }
            key={index}
          />
        ))}
        <span className={styles.counter}>15</span>
      </div>
    )
  }

  if (kind === 'lookup') {
    return (
      <div className={styles.lookup}>
        <span className={`${styles.sheet} ${styles.context}`}>
          <span className={styles.sheetLabel}>Context</span>
          {[78, 54, 66, 40, 72].map((width, index) => (
            <span className={styles.line} style={{ width: `${width}%` }} key={index} />
          ))}
          <span className={styles.match} />
        </span>
        <span className={`${styles.sheet} ${styles.answer}`}>
          <span className={styles.sheetLabel}>Answer</span>
          {[70, 48].map((width, index) => (
            <span className={styles.line} style={{ width: `${width}%` }} key={index} />
          ))}
          <span className={styles.slot} />
        </span>
        <span className={styles.flying} />
      </div>
    )
  }

  if (kind === 'kernel') {
    return (
      <div className={styles.kernel}>
        <div className={styles.board}>
          <span className={styles.boardBase} />
          <span className={styles.boardDie} />
          <span className={`${styles.stream} ${styles.streamA}`}>
            {['FP8', 'NVFP4', 'K8V4'].map((label, index) => (
              <span style={{ '--ci-i': index } as CSSProperties} key={label}>
                {label}
              </span>
            ))}
          </span>
          <span className={`${styles.stream} ${styles.streamB}`}>
            {['GDN', 'GDN'].map((label, index) => (
              <span style={{ '--ci-i': index } as CSSProperties} key={index}>
                {label}
              </span>
            ))}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.verify}>
      {(['drafted', 'model'] as const).map((layer) => (
        <span className={`${styles.plot} ${styles[layer]}`} key={layer}>
          {distribution.map((height, index) => (
            <span style={{ '--ci-bar': height } as CSSProperties} key={index} />
          ))}
        </span>
      ))}
      <svg className={styles.check} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="21" />
        <path d="m15 24.5 6.5 6.5L34 18" />
      </svg>
    </div>
  )
}

/** The four techniques, each with a small looping 3D scene that plays only while on screen. */
export function InferenceTechniques() {
  const grid = useRef<HTMLDivElement>(null)
  const inView = useInView(grid, 0.2)
  const [reduced] = useState(prefersReducedMotion)

  return (
    <div
      className={`${styles.techniques} ${reduced ? styles.still : ''}`}
      data-playing={inView && !reduced}
      ref={grid}
    >
      {speedTechniques.map((technique, index) => (
        <article className={styles.card} key={technique.icon}>
          <div className={styles.viewport} aria-hidden="true">
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <Illustration kind={technique.icon} />
          </div>
          <div className={styles.text}>
            <h3>{technique.title}</h3>
            <p>{technique.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
