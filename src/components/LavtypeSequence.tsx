import { useRef, useState, type CSSProperties } from 'react'
import { lavtypeExampleShortcut, lavtypeProcess, lavtypeSteps } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { LavtypeKeycaps } from './LavtypeKeycaps'
import styles from './LavtypeSequence.module.css'

const transcript = lavtypeProcess.transcript
const ribbon = Array.from({ length: 44 }, (_, index) => ({
  level: 0.32 + Math.abs(Math.sin(index * 0.7) * 0.6 + Math.sin(index * 0.27 + 0.6) * 0.4) * 0.68,
  depth: Math.sin(index / 5.5),
}))

/**
 * Hold, Speak and Release as three cards on a tilted track. The lit card lifts toward you and its
 * scene plays: the keys go down, the waveform speaks, the transcript types. Steps through itself
 * while on screen; choosing a step takes over.
 */
export function LavtypeSequence() {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(!reduced)
  const [typed, setTyped] = useState(reduced ? transcript.length : 0)

  useInterval(
    () => {
      const next = (active + 1) % lavtypeSteps.length
      setActive(next)
      if (next === 0) setTyped(0)
    },
    active === 2 ? 3600 : 2400,
    inView && autoplay,
  )

  useInterval(() => setTyped(typed + 1), 40, active === 2 && typed < transcript.length && !reduced)

  const choose = (index: number) => {
    setAutoplay(false)
    setActive(index)
    if (index === 2 && !reduced) setTyped(0)
  }

  return (
    <figure
      className={`${styles.sequence} ${reduced ? styles.still : ''} ${inView ? '' : styles.paused}`}
      ref={figure}
      style={{ '--active': active } as CSSProperties}
    >
      <div className={styles.stage}>
        <div className={styles.track}>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railLight} />
          </div>
          <ol className={styles.cards}>
            {lavtypeSteps.map((step, index) => {
              const lit = index === active
              return (
                <li
                  className={styles.card}
                  data-lit={lit}
                  data-visual={step.visual}
                  style={{ '--index': index } as CSSProperties}
                  key={step.label}
                >
                  <div className={styles.visual} aria-hidden="true">
                    {step.visual === 'key' && (
                      <div className={styles.keyScene}>
                        <LavtypeKeycaps
                          className={styles.keycaps}
                          pressed={reduced || active === 0 || active === 1}
                        />
                        <span className={styles.keyCaption}>{lavtypeExampleShortcut.label}</span>
                      </div>
                    )}
                    {step.visual === 'waveform' && (
                      <div className={styles.waveScene}>
                        <div className={styles.ribbon}>
                          {ribbon.map((bar, barIndex) => (
                            <span
                              style={
                                {
                                  '--b': barIndex,
                                  '--level': bar.level.toFixed(3),
                                  '--depth': bar.depth.toFixed(3),
                                } as CSSProperties
                              }
                              key={barIndex}
                            >
                              <span />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {step.visual === 'transcript' && (
                      <div className={styles.appScene}>
                        <div className={styles.app}>
                          <div className={styles.appChrome}>
                            <i />
                            <i />
                            <i />
                          </div>
                          <span className={styles.appLine} />
                          <span className={styles.appLine} />
                          <p>
                            {transcript.slice(0, active === 2 || reduced ? typed : 0)}
                            <span className={styles.caret} />
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.copy}>
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>
                      <button
                        className={styles.select}
                        type="button"
                        aria-pressed={lit}
                        onClick={() => choose(index)}
                      >
                        {step.label}
                      </button>
                    </h3>
                    <p>{step.caption}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <figcaption className={styles.caption}>{lavtypeProcess.illustrationAlt}</figcaption>
    </figure>
  )
}
