import { useRef, useState, type CSSProperties } from 'react'
import { principles } from '../content/home'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import styles from './MorainePrinciples.module.css'

/**
 * The three principles as standing slabs: they rise off the floor as the section scrolls in, turn
 * toward the pointer, and the one under the pointer steps forward. While nobody is pointing, the
 * slabs take turns.
 */
export function MorainePrinciples() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)

  useStageMotion(stage, !reduced)
  useInterval(
    () => setActive((current) => (current + 1) % principles.length),
    3400,
    inView && !reduced && !touched,
  )

  return (
    <div className={`${styles.stage} ${reduced ? styles.still : ''}`} ref={stage}>
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.rig}>
        {principles.map((principle, index) => (
          <article
            className={styles.slab}
            data-active={active === index ? '' : undefined}
            style={{ '--hm-index': index, '--hm-offset': index - 1 } as CSSProperties}
            onPointerEnter={() => {
              setTouched(true)
              setActive(index)
            }}
            key={principle.title}
          >
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
