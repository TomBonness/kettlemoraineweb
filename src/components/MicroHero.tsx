import { useRef, useState } from 'react'
import { marketingRenders, productCopy } from '../content/openMicro'
import { prefersReducedMotion, useInView, useStageMotion } from '../lib/motion'
import styles from './MicroHero.module.css'

/**
 * The hero centerpiece: the transparent Open Micro render floating over the hero floor, with a
 * contact shadow and a brass-and-blue glow. It leans gently toward the pointer and settles flat as
 * the page scrolls.
 */
export function MicroHero() {
  const stage = useRef<HTMLDivElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  useStageMotion(stage, !reduced)
  const inView = useInView(stage, 0)

  return (
    <div className={`${styles.stage} ${reduced ? styles.still : ''}`} ref={stage}>
      <div className={styles.glow} data-live={inView} aria-hidden="true" />
      <div className={styles.shadow} aria-hidden="true" />
      <figure className={styles.render}>
        <img
          {...marketingRenders.transparent}
          sizes="(max-width: 767px) 120vw, 860px"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <p className={styles.tag}>{productCopy.conceptTag}</p>
    </div>
  )
}
