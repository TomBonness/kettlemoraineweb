import { useRef, useState } from 'react'
import { lavtypeExampleShortcut, lavtypeProcess, lavtypeSteps } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import styles from './VoiceTrace.module.css'

const waveformLevels = [
  12, 24, 48, 32, 72, 42, 86, 58, 32, 68, 46, 78, 38, 62, 94, 54, 76, 42, 58, 30, 44, 22, 16, 8,
]

type VoiceTraceProps = {
  /** The small dark version, for a card on a dark surface. */
  compact?: boolean
  id?: string
}

/**
 * Hold → Speak → Release as three flat panels. While on screen it steps through them once every
 * couple of seconds; pointing at a step shows that step and stops the sequence.
 */
export function VoiceTrace({ compact = false, id }: VoiceTraceProps) {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(!reduced)
  const [active, setActive] = useState<number | null>(null)

  useInterval(
    () => setActive((current) => (current === null ? 0 : (current + 1) % lavtypeSteps.length)),
    active === null ? 400 : 2400,
    inView && autoplay,
  )

  const pressed = active === 0 || active === 1

  return (
    <figure
      className={`${styles.instrument} ${compact ? styles.compact : ''}`}
      id={id}
      ref={figure}
      data-playing={active !== null ? '' : undefined}
    >
      <ol className={styles.sequence}>
        {lavtypeSteps.map((step, index) => (
          <li
            className={styles.step}
            data-active={index === active ? '' : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === 'touch' || reduced) return
              setAutoplay(false)
              setActive(index)
            }}
            key={step.label}
          >
            <div className={styles.panel} data-visual={step.visual}>
              {step.visual === 'key' && (
                <>
                  <span className={styles.chord} data-pressed={pressed}>
                    {lavtypeExampleShortcut.keys.map((key) => (
                      <kbd data-wide={key === 'Space' ? '' : undefined} key={key}>
                        {key}
                      </kbd>
                    ))}
                  </span>
                  <span className={styles.panelNote}>{lavtypeExampleShortcut.label}</span>
                </>
              )}
              {step.visual === 'waveform' && (
                <div className={styles.waveform} aria-hidden="true">
                  {waveformLevels.map((level, bar) => (
                    <span
                      key={`${level}-${bar}`}
                      style={{ height: `${level}%`, animationDelay: `${bar * -0.07}s` }}
                    />
                  ))}
                </div>
              )}
              {step.visual === 'transcript' && (
                <div className={styles.transcript}>
                  <q>{lavtypeProcess.transcript}</q>
                </div>
              )}
            </div>
            <div className={styles.stepCopy}>
              <span className={styles.number} aria-hidden="true">
                0{index + 1}
              </span>
              <strong>{step.label}</strong>
              <p>{step.caption}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
