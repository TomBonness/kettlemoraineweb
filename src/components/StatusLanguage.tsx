import type { CSSProperties } from 'react'
import { headings, marketingRenders, productCopy, statusSignals } from '../content/openMicro'
import styles from './StatusLanguage.module.css'

export function StatusLanguage() {
  return (
    <section className={styles.section} aria-labelledby="status-title">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>03 / Ambient feedback</p>
            <h2 id="status-title">{headings.status}</h2>
          </div>
          <p className={styles.lead}>{productCopy.statusLead}</p>
        </header>

        <figure className={styles.nightStudy}>
          <img
            {...marketingRenders.night}
            sizes="(min-width: 1280px) 1184px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 48px)"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span>Light study / After dark</span>
            <p>
              Art-directed concept illumination, not qualified hardware. Lighting target: 21
              physical emitters / 13 host-addressable channels.
            </p>
          </figcaption>
        </figure>

        <div className={styles.legend}>
          <div className={styles.principle}>
            <p>{productCopy.statusPrinciple}</p>
            <span>Six states. One quiet language.</span>
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
