import { useRef, useState, type CSSProperties } from 'react'
import { lavtypeProcess, lavtypeSteps } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import styles from './HomeVoiceStage.module.css'
import { useHomeTilt } from './useHomeTilt'

const levels = [
  12, 24, 48, 32, 72, 42, 86, 58, 32, 68, 46, 78, 38, 62, 94, 54, 76, 42, 58, 30, 44, 22, 16, 8,
]
const tick = 60
const holdTicks = 42
const charTicks = 0.75
const restTicks = 34
const transcript = lavtypeProcess.transcript
const loopTicks = holdTicks + Math.ceil(transcript.length * charTicks) + restTicks

/**
 * Lavtype in one loop: hold the shortcut and speak, release, and the transcript types itself into
 * the focused app. Plays while on screen; with reduced motion it rests on the typed result.
 */
export function HomeVoiceStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [time, setTime] = useState(reduced ? holdTicks + transcript.length * charTicks : 0)
  useHomeTilt(stage)

  useInterval(() => setTime((current) => (current + 1) % loopTicks), tick, inView && !reduced)

  const holding = time < holdTicks
  const typed = holding ? 0 : Math.min(transcript.length, Math.floor((time - holdTicks) / charTicks))
  const step = holding ? (time < 8 ? 0 : 1) : 2

  return (
    <div
      className={`${styles.stage} ${reduced ? styles.still : ''}`}
      data-holding={holding ? '' : undefined}
      data-playing={inView && !reduced ? '' : undefined}
      ref={stage}
      aria-hidden="true"
    >
      <ol className={styles.steps}>
        {lavtypeSteps.map((item, index) => (
          <li data-current={index === step ? '' : undefined} key={item.label}>
            {item.label}
          </li>
        ))}
      </ol>

      <div className={styles.rig}>
        <div className={styles.floor} />

        <div className={styles.field}>
          <div className={styles.fieldChrome}>
            <span />
            <span />
            <span />
          </div>
          <p className={styles.fieldText}>
            {transcript.slice(0, typed)}
            <span className={styles.caret} />
          </p>
        </div>

        <div className={styles.bars}>
          {levels.map((level, index) => (
            <span
              style={{ '--hm-level': level / 100, animationDelay: `${index * -0.09}s` } as CSSProperties}
              key={index}
            />
          ))}
        </div>

        <div className={styles.key}>
          <kbd>⌘ ⇧ Space</kbd>
          <span>Example shortcut</span>
        </div>
      </div>
    </div>
  )
}
