import { useRef, useState } from 'react'
import { explodedLayers, hero } from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import { MicroDevice } from './MicroDevice'
import styles from './MicroStage.module.css'

/** Keys the idle model taps, like a hand running a short macro. */
const idleKeys = [5, 9, 1, 8, 4, 0, 11, 6]

/**
 * The hero centerpiece: Open Micro taken apart into its five layers, assembling as the page
 * scrolls and turning toward the pointer. Its keys tap by themselves until the visitor presses one.
 */
export function MicroStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [tick, setTick] = useState(0)
  const [flash, setFlash] = useState(0)

  useStageMotion(stage, !reduced)
  useInterval(() => setTick((current) => current + 1), 650, inView && autoplay && !reduced)

  // Every other tick presses the next key and the tick after releases it.
  const pressedKey =
    autoplay && !reduced && inView && tick % 2 === 1
      ? idleKeys[Math.floor(tick / 2) % idleKeys.length]
      : null

  return (
    <div className={`${styles.stage} ${reduced ? styles.still : ''}`} ref={stage}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.flash} key={flash} data-on={flash > 0} aria-hidden="true" />
      <div className={styles.rig} role="img" aria-label={hero.modelLabel}>
        <MicroDevice
          className={styles.device}
          internals
          pressedKey={pressedKey}
          tags={explodedLayers.map((layer) => layer.title)}
          onPress={() => {
            setAutoplay(false)
            setFlash((current) => current + 1)
          }}
        />
      </div>
      <p className={styles.hint} aria-hidden="true">
        <span className={styles.hintDot} />
        {hero.modelHint}
      </p>
    </div>
  )
}
