import type { CSSProperties } from 'react'
import { headings, productCopy, statusSignals } from '../content/openMicro'
import styles from './StatusLanguage.module.css'

export function StatusLanguage() {
  return (
    <section className={styles.section} aria-labelledby="status-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>03 / Ambient feedback</p>
          <h2 id="status-title">{headings.status}</h2>
          <p className={styles.lead}>{productCopy.statusLead}</p>
          <div className={styles.principle}>
            <span aria-hidden="true">RGB</span>
            <p>{productCopy.statusPrinciple}</p>
          </div>
        </header>

        <div className={styles.legend}>
          <div className={styles.lightField} aria-hidden="true">
            <div className={styles.signalRail}>
              {statusSignals.map((signal) => (
                <span
                  key={signal.name}
                  style={{ '--signal-color': signal.color } as CSSProperties}
                />
              ))}
            </div>
            <div className={styles.railCaption}>
              <span>Status light language</span>
              <span>Six distinct states</span>
            </div>
          </div>

          <ol className={styles.signals} aria-label={productCopy.statusLegendLabel}>
            {statusSignals.map((signal, index) => (
              <li key={signal.name} style={{ '--signal-color': signal.color } as CSSProperties}>
                <span className={styles.signalIndex}>{String(index + 1).padStart(2, '0')}</span>
                <strong className={styles.signalName}>{signal.name}</strong>
                <p>{signal.meaning}</p>
                <small>{signal.behavior}</small>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
