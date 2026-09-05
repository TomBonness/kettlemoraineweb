import type { CSSProperties } from 'react'
import { headings, marketingRenders, productCopy, statusSignals } from '../content/openMicro'
import styles from './StatusLanguage.module.css'

export function StatusLanguage() {
  return (
    <section className={styles.section} aria-labelledby="status-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="status-title">{headings.status}</h2>
          <p className={styles.lead}>{productCopy.statusLead}</p>
        </header>

        <figure className={styles.nightStudy}>
          <img
            {...marketingRenders.night}
            sizes="(min-width: 1280px) 1184px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className={styles.legend}>
          <p className={styles.principle}>{productCopy.statusPrinciple}</p>

          <ul className={styles.signals} aria-label={productCopy.statusLegendLabel}>
            {statusSignals.map((signal) => (
              <li key={signal.name} style={{ '--signal-color': signal.color } as CSSProperties}>
                <strong className={styles.signalName}>{signal.name}</strong>
                <p>{signal.meaning}</p>
                <p className={styles.behavior}>{signal.behavior}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
