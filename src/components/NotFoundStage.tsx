import { useRef, useState, type CSSProperties } from 'react'
import { prefersReducedMotion, useStageMotion } from '../lib/motion'
import styles from './NotFoundStage.module.css'

const layers = 24

/** A solid, floating "404" over the brand contours that turns toward the pointer. Decorative. */
export function NotFoundStage() {
  const stage = useRef<HTMLDivElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  useStageMotion(stage, !reduced)

  return (
    <div className={styles.stage} ref={stage} aria-hidden="true">
      <img
        className={styles.contours}
        src="/brand/contours.svg"
        width="1200"
        height="1000"
        alt=""
      />
      <div className={styles.float}>
        <div className={styles.rig}>
          {Array.from({ length: layers }, (_, index) => (
            <span
              className={styles.layer}
              style={{ '--layer': index, '--layers': layers } as CSSProperties}
              key={index}
            >
              404
            </span>
          ))}
          <span className={styles.face}>404</span>
        </div>
      </div>
      <div className={styles.shadow} />
    </div>
  )
}
