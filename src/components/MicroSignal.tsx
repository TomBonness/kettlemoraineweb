import { useRef, useState, type CSSProperties } from 'react'
import { productCopy, statusSignals } from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import { MicroDevice } from './MicroDevice'
import styles from './MicroSignal.module.css'

type SignalName = (typeof statusSignals)[number]['name']

/** How each signal's light moves; the CSS animates `--om-level` to match its behavior. */
const behaviors: Record<SignalName, string> = {
  Ready: 'still',
  Working: 'breathe',
  Active: 'pulse',
  'Needs input': 'blink',
  Complete: 'solid',
  Attention: 'alarm',
}

/** With reduced motion the light holds on the signal that asks for the visitor. */
const stillSignal = statusSignals.findIndex((signal) => signal.name === 'Needs input')

/**
 * The status light, live: choose a signal and the model's smoked wall takes its color and
 * pattern. It steps through the signals by itself while on screen until the visitor picks one.
 */
export function MicroSignal() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(root, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState(reduced ? stillSignal : 1)
  const [autoplay, setAutoplay] = useState(true)
  const playing = inView && autoplay && !reduced

  useStageMotion(stage, !reduced)
  useInterval(() => setActive((current) => (current + 1) % statusSignals.length), 3600, playing)

  const signal = statusSignals[active]

  return (
    <div
      className={`${styles.demo} ${reduced ? styles.still : ''}`}
      ref={root}
      data-behavior={behaviors[signal.name]}
      style={{ '--signal': signal.color } as CSSProperties}
    >
      <div className={styles.stage} ref={stage}>
        <div className={styles.halo} aria-hidden="true" />
        <div
          className={styles.rig}
          role="img"
          aria-label={`The Open Micro concept model with its wall light showing ${signal.name}: ${signal.behavior.toLowerCase()}`}
        >
          <MicroDevice className={styles.device} />
        </div>
      </div>

      <div className={styles.panel}>
        <fieldset className={styles.picker}>
          <legend>{productCopy.statusLegendLabel}</legend>
          {statusSignals.map((option, index) => (
            <label
              key={option.name}
              data-behavior={behaviors[option.name]}
              style={{ '--signal': option.color } as CSSProperties}
            >
              <input
                type="radio"
                name="open-micro-signal"
                value={option.name}
                checked={index === active}
                onChange={() => {
                  setAutoplay(false)
                  setActive(index)
                }}
              />
              <span className={styles.swatch} aria-hidden="true" />
              <span className={styles.optionName}>{option.name}</span>
              <span className={styles.optionBehavior}>{option.behavior}</span>
            </label>
          ))}
        </fieldset>

        <div className={styles.readout} aria-live={autoplay ? 'off' : 'polite'}>
          <p className={styles.behavior}>{signal.behavior}</p>
          <p className={styles.name}>{signal.name}</p>
          <p className={styles.meaning}>{signal.meaning}</p>
        </div>

        <div className={styles.timer} data-playing={playing} key={active} aria-hidden="true" />
      </div>
    </div>
  )
}
