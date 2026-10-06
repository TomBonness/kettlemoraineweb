import { useRef, useState, type CSSProperties } from 'react'
import { inferenceLinks, speedHistory } from '../content/inference'
import { prefersReducedMotion, useStageMotion } from '../lib/motion'
import styles from './InferenceLadder.module.css'

const ceiling = 1000

/** The speed history as solid columns that rise, one pass after another, as they scroll in. */
export function InferenceLadder() {
  const stage = useRef<HTMLElement>(null)
  const [reduced] = useState(prefersReducedMotion)

  useStageMotion(stage, !reduced)

  return (
    <figure
      className={`${styles.ladder} ${reduced ? styles.still : ''}`}
      ref={stage}
      aria-labelledby="ladder-caption"
    >
      <div className={styles.scene}>
        <div className={styles.floor} aria-hidden="true" />
        <ol>
          {speedHistory.map((step, index) => (
            <li
              data-latest={index === speedHistory.length - 1}
              style={{ '--ci-level': step.tokensPerSecond / ceiling, '--ci-i': index } as CSSProperties}
              key={step.date}
            >
              <span className={styles.column} aria-hidden="true">
                <span className={styles.front} />
                <span className={styles.lid} />
                <span className={styles.side} />
              </span>
              <strong className={styles.value}>{step.tokensPerSecond.toFixed(1)}</strong>
              <span className={styles.date}>{step.date}</span>
              <span className={styles.label}>{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption id="ladder-caption">
        Decode tokens per second after a 32,768-token prompt (ninfer_bench, greedy).{' '}
        <a href={inferenceLinks.performance}>Measurements</a>.
      </figcaption>
    </figure>
  )
}
