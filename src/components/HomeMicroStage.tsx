import { useRef } from 'react'
import openMicroLarge from '../assets/product/marketing/open-micro-transparent.webp'
import openMicro from '../assets/product/marketing/open-micro-transparent-1600.webp'
import { useInView } from '../lib/motion'
import styles from './HomeMicroStage.module.css'
import { useHomeTilt } from './useHomeTilt'

/** Open Micro floating over a lit floor in front of a glowing wall, turning toward the pointer. */
export function HomeMicroStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  useHomeTilt(stage)

  return (
    <div className={styles.stage} data-playing={inView ? '' : undefined} ref={stage}>
      <div className={styles.rig}>
        <div className={styles.wall} aria-hidden="true">
          <span className={styles.wallLight} />
        </div>
        <div className={styles.floor} aria-hidden="true">
          <span className={styles.shadow} />
        </div>
        <div className={styles.float}>
          <img
            className={styles.device}
            src={openMicro}
            srcSet={`${openMicro} 1600w, ${openMicroLarge} 2880w`}
            sizes="(max-width: 1050px) 90vw, 760px"
            width="1600"
            alt="Three-quarter concept visualization of Open Micro with twelve dark keys and a push encoder"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}
