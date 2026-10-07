import { useState, type CSSProperties } from 'react'
import { marketingRenders, specCallouts, specs } from '../content/openMicro'
import styles from './MicroSpecs.module.css'

type SpecName = (typeof specs)[number][0]

/**
 * The spec sheet beside the overhead render. Thin leader lines run from labels beside the device to
 * the parts a spec describes; pointing at a callout or a row marks the other.
 */
export function MicroSpecs() {
  const [callout, setCallout] = useState<number | null>(null)
  const [row, setRow] = useState<SpecName | null>(null)
  const activeSpec = row ?? (callout === null ? null : specCallouts[callout].spec)

  return (
    <div className={styles.specs}>
      <figure className={styles.figure}>
        <div className={styles.drawing}>
          <img
            {...marketingRenders.top}
            sizes="(max-width: 900px) 70vw, 440px"
            loading="lazy"
            decoding="async"
          />
          {specCallouts.map((item, index) => (
            <span
              className={styles.callout}
              data-side={item.side}
              data-match={activeSpec === item.spec}
              style={{ '--y': `${item.y}%`, '--to': `${item.to}%` } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') setCallout(index)
              }}
              onPointerLeave={() => setCallout(null)}
              key={item.label}
            >
              <span className={styles.calloutLabel}>{item.label}</span>
              <span className={styles.calloutLine} />
            </span>
          ))}
        </div>
      </figure>

      <dl className={styles.list}>
        {specs.map(([term, detail]) => (
          <div
            data-active={activeSpec === term}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setRow(term)
            }}
            onPointerLeave={() => setRow(null)}
            key={term}
          >
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
