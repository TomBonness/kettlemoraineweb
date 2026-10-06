import type { CSSProperties } from 'react'
import { lavtypeExampleShortcut } from '../content/lavtype'
import styles from './LavtypeKeycaps.module.css'

const slices = 7
const widths: Record<string, number> = { Space: 2.6, '⇧': 1.3 }

type LavtypeKeycapsProps = {
  pressed: boolean
  className?: string
}

/**
 * The example shortcut as solid keycaps lying on a surface, each built from stacked slices so it
 * has real thickness. Size comes from `--k` (one key unit) on an ancestor. Decorative.
 */
export function LavtypeKeycaps({ pressed, className = '' }: LavtypeKeycapsProps) {
  return (
    <span className={`${styles.chord} ${className}`} data-pressed={pressed} aria-hidden="true">
      {lavtypeExampleShortcut.keys.map((key, index) => (
        <span
          className={styles.cap}
          style={{ '--key': index, '--w': widths[key] ?? 1 } as CSSProperties}
          key={key}
        >
          <span className={styles.glow} />
          {Array.from({ length: slices }, (_, slice) => (
            <span
              className={styles.slice}
              style={{ '--slice': slice, '--slices': slices } as CSSProperties}
              key={slice}
            />
          ))}
          <span className={styles.top}>
            <span>{key}</span>
          </span>
        </span>
      ))}
    </span>
  )
}
