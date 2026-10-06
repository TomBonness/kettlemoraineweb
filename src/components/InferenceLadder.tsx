import { useRef, type CSSProperties } from 'react'
import { inferenceLinks, speedHistory } from '../content/inference'
import { useInView } from '../lib/motion'
import styles from './InferenceLadder.module.css'

const ceiling = 1000

/** The speed history as flat columns that rise, one pass after another, once in view. */
export function InferenceLadder() {
  const ladder = useRef<HTMLElement>(null)
  const inView = useInView(ladder, 0.3)

  return (
    <figure
      className={styles.ladder}
      data-shown={inView}
      ref={ladder}
      aria-labelledby="ladder-caption"
    >
      <ol>
        {speedHistory.map((step, index) => (
          <li
            data-latest={index === speedHistory.length - 1}
            style={
              { '--ci-level': step.tokensPerSecond / ceiling, '--ci-i': index } as CSSProperties
            }
            key={step.date}
          >
            <span className={styles.column}>
              <strong>{step.tokensPerSecond.toFixed(1)}</strong>
              <span className={styles.bar} aria-hidden="true" />
            </span>
            <span className={styles.date}>{step.date}</span>
            <span className={styles.label}>{step.label}</span>
          </li>
        ))}
      </ol>
      <figcaption id="ladder-caption">
        Decode tokens per second after a 32,768-token prompt (ninfer_bench, greedy).{' '}
        <a href={inferenceLinks.performance}>Measurements</a>.
      </figcaption>
    </figure>
  )
}
