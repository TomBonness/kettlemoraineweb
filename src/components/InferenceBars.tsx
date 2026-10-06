import { useRef, useState, type CSSProperties } from 'react'
import { comparedEngines, comparisonAxisMax, engineComparison } from '../content/inference'
import { prefersReducedMotion, useStageMotion } from '../lib/motion'
import styles from './InferenceBars.module.css'

const cinference = 'Cinference Engine'

/** Both measured workloads as solid bars that grow out of the floor as they scroll into view. */
export function InferenceBars() {
  const stage = useRef<HTMLDivElement>(null)
  const [reduced] = useState(prefersReducedMotion)

  useStageMotion(stage, !reduced)

  return (
    <div className={`${styles.comparison} ${reduced ? styles.still : ''}`} ref={stage}>
      {engineComparison.map((workload) => (
        <figure className={styles.workload} key={workload.name}>
          <figcaption>
            <strong>{workload.name}</strong>
            <span>{workload.detail}</span>
          </figcaption>
          <p className={styles.speedup}>
            {(
              workload.tokensPerSecond[cinference] / workload.tokensPerSecond['llama.cpp']
            ).toFixed(1)}
            ×<span>faster than llama.cpp</span>
          </p>
          <dl className={styles.bars}>
            {comparedEngines.map((engine, index) => (
              <div
                className={`${styles.bar} ${engine === cinference ? styles.highlight : ''}`}
                style={
                  {
                    '--ci-value': workload.tokensPerSecond[engine] / comparisonAxisMax,
                    '--ci-i': index,
                  } as CSSProperties
                }
                key={engine}
              >
                <dt>{engine}</dt>
                <dd>
                  <span className={styles.track} aria-hidden="true">
                    <span className={styles.prism} />
                  </span>
                  <strong>{workload.tokensPerSecond[engine].toFixed(1)}</strong>
                  <span className={styles.unit}> tok/s</span>
                </dd>
              </div>
            ))}
          </dl>
        </figure>
      ))}
    </div>
  )
}
