import { useRef, type CSSProperties } from 'react'
import { comparedEngines, comparisonAxisMax, engineComparison } from '../content/inference'
import { useInView } from '../lib/motion'
import styles from './InferenceBars.module.css'

const cinference = 'Cinference Engine'

/** Both measured workloads as flat bars that grow once they scroll into view. */
export function InferenceBars() {
  const comparison = useRef<HTMLDivElement>(null)
  const inView = useInView(comparison, 0.3)

  return (
    <div className={styles.comparison} data-shown={inView} ref={comparison}>
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
                key={engine}
              >
                <dt>{engine}</dt>
                <dd>
                  <span className={styles.track} aria-hidden="true">
                    <span
                      style={
                        {
                          width: `${(workload.tokensPerSecond[engine] / comparisonAxisMax) * 100}%`,
                          '--ci-i': index,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <strong>
                    {workload.tokensPerSecond[engine].toFixed(1)}
                    <span> tok/s</span>
                  </strong>
                </dd>
              </div>
            ))}
          </dl>
        </figure>
      ))}
    </div>
  )
}
