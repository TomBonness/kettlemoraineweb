import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { lavtypeDemo, lavtypeExampleShortcut, lavtypeProcess } from '../content/lavtype'
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './HomeCardDictation.module.css'

const transcript = lavtypeProcess.transcript
const barCount = 7

type Phase = 'idle' | 'hold' | 'listening' | 'recognizing' | 'typing' | 'typed' | 'reset'

/** How long each phase lasts; `typing` instead advances one character every `typeDelay`. */
const delays: Record<Exclude<Phase, 'typing'>, number> = {
  idle: 1200,
  hold: 450,
  listening: 2600,
  recognizing: 700,
  typed: 2800,
  reset: 600,
}
const typeDelay = 26
const next: Record<Exclude<Phase, 'typing'>, Phase> = {
  idle: 'hold',
  hold: 'listening',
  listening: 'recognizing',
  recognizing: 'typing',
  typed: 'reset',
  reset: 'idle',
}

/**
 * The homepage Lavtype card's media: the notes window, the example shortcut and the dictation pill
 * on a tilted plane. While on screen it loops hold → speak → the transcript typing into the note.
 * Decorative only; the whole card is the link. Reduced motion shows the typed note.
 */
export function HomeCardDictation() {
  const stage = useRef<HTMLDivElement>(null)
  const wave = useRef<HTMLSpanElement>(null)
  const clock = useRef<HTMLSpanElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<Phase>(reduced ? 'typed' : 'idle')
  const [typed, setTyped] = useState(reduced ? transcript.length : 0)
  const playing = inView && !reduced

  useEffect(() => {
    if (!playing) return
    if (phase === 'typing') {
      const id = window.setTimeout(() => {
        if (typed + 1 < transcript.length) setTyped(typed + 1)
        else {
          setTyped(transcript.length)
          setPhase('typed')
        }
      }, typeDelay)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => {
      if (phase === 'reset') setTyped(0)
      setPhase(next[phase])
    }, delays[phase])
    return () => window.clearTimeout(id)
  }, [playing, phase, typed])

  useEffect(() => {
    const bars = wave.current?.children
    const time = clock.current
    if (!bars || !time || phase !== 'listening' || !playing) return
    const started = performance.now()
    const id = window.setInterval(() => {
      const seconds = (performance.now() - started) / 1000
      for (let index = 0; index < bars.length; index++) {
        const swing =
          Math.sin(seconds * 6.1 + index * 0.9) * 0.6 + Math.sin(seconds * 2.3 + index * 0.4) * 0.4
        const envelope = 0.55 + 0.45 * Math.sin((Math.PI * (index + 0.5)) / barCount)
        ;(bars[index] as HTMLElement).style.transform = `scaleY(${(0.42 + Math.abs(swing) * 0.58 * envelope).toFixed(3)})`
      }
      time.textContent = `0:0${Math.floor(seconds)}`
    }, 130)
    return () => {
      window.clearInterval(id)
      for (const bar of bars) (bar as HTMLElement).style.transform = ''
      time.textContent = '0:00'
    }
  }, [phase, playing])

  return (
    <div
      className={`${styles.stage} ${reduced ? styles.still : ''}`}
      ref={stage}
      data-phase={phase}
      data-playing={playing}
      aria-hidden="true"
    >
      <div className={styles.glow} />
      <div className={styles.rig}>
        <div className={styles.window}>
          <div className={styles.titlebar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.title}>Notes</span>
            <span className={styles.focus}>{lavtypeDemo.focusedApp}</span>
          </div>
          <div className={styles.body}>
            <div className={styles.sidebar}>
              <span className={styles.sideHead}>Today</span>
              <span className={styles.note} data-current="">
                <b>Drawing review</b>
                <small>9:41</small>
              </span>
              <span className={styles.note}>
                <b>Bracket order</b>
                <small>Yesterday</small>
              </span>
              <span className={styles.note}>
                <b>Print shop</b>
                <small>Monday</small>
              </span>
            </div>
            <div className={styles.editor}>
              <span className={styles.date}>Today at 9:41</span>
              <span className={styles.noteTitle}>Drawing review</span>
              <span className={styles.line}>Mark up the hinge detail.</span>
              <span className={styles.line}>Check the bracket dimensions.</span>
              <span className={styles.typed}>
                {transcript.slice(0, typed)}
                <span className={styles.caret} />
              </span>
              <span className={styles.final}>{lavtypeDemo.finalTranscript}</span>
            </div>
          </div>
        </div>

        <div className={styles.pill}>
          <svg className={styles.mic} viewBox="0 0 16 20" fill="none">
            <rect x="5" y="1" width="6" height="11" rx="3" />
            <path d="M2.5 9a5.5 5.5 0 0 0 11 0M8 14.5V18" />
          </svg>
          <span className={styles.wave} ref={wave}>
            {Array.from({ length: barCount }, (_, index) => (
              <span key={index} />
            ))}
          </span>
          <span className={styles.clock} ref={clock}>
            0:00
          </span>
        </div>

        <div className={styles.keys} data-pressed={phase === 'hold' || phase === 'listening'}>
          <span className={styles.chord}>
            {lavtypeExampleShortcut.keys.map((key, index) => (
              <kbd
                className={styles.key}
                data-wide={key === 'Space' ? '' : undefined}
                style={{ '--hm-key': index } as CSSProperties}
                key={key}
              >
                {key}
              </kbd>
            ))}
          </span>
          <span className={styles.keyLabel}>{lavtypeExampleShortcut.label}</span>
        </div>
      </div>
    </div>
  )
}
