import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { lavtypeDemo, lavtypeExampleShortcut, lavtypeProcess } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import styles from './LavtypeStage.module.css'

type Phase = 'idle' | 'listening' | 'recognizing' | 'typing' | 'typed' | 'short'

const transcript = lavtypeProcess.transcript
const barCount = 20

/** How long the self-playing demo waits in each phase before moving on. */
const autoplayDelays: Partial<Record<Phase, number>> = {
  idle: 1400,
  listening: 2700,
  typed: 3400,
  short: 1800,
}

/** A speech-like level for each bar of the dictation pill, tapering towards the ends. */
function levelAt(index: number, seconds: number) {
  const swing = Math.sin(seconds * 5.3 + index * 0.75) * 0.6 + Math.sin(seconds * 2.1 + index * 0.31) * 0.4
  const envelope = 0.55 + 0.45 * Math.sin((Math.PI * (index + 0.5)) / barCount)
  return 0.2 + Math.abs(swing) * 0.8 * envelope
}

function clock(seconds: number) {
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

/**
 * The hero centerpiece: a notes window and the example shortcut on a gently tilted plane. Hold
 * the keys (pointer, or Space/Enter while focused) and a dictation pill listens; release and the
 * one final transcript types into the note. Plays itself while idle and on screen.
 */
export function LavtypeStage() {
  const stage = useRef<HTMLElement>(null)
  const inView = useInView(stage)
  const [reduced] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<Phase>(reduced ? 'typed' : 'idle')
  const [typed, setTyped] = useState(reduced ? transcript.length : 0)
  const [elapsed, setElapsed] = useState(0)
  const [capped, setCapped] = useState(false)
  const [autoplay, setAutoplay] = useState(!reduced)
  const phaseRef = useRef(phase)
  const startedAt = useRef(0)
  const keyReleasedAt = useRef(0)
  const assistedHold = useRef(0)

  useStageMotion(stage, !reduced)

  const go = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const press = useCallback(() => {
    startedAt.current = performance.now()
    setElapsed(0)
    setTyped(0)
    setCapped(false)
    go('listening')
  }, [go])

  const release = useCallback(
    (cap = false) => {
      if (phaseRef.current !== 'listening') return
      const held = performance.now() - startedAt.current
      setElapsed(Math.min(held / 1000, lavtypeDemo.captureLimitSeconds))
      if (held < lavtypeDemo.minimumClipMs) {
        go('short')
        return
      }
      setCapped(cap)
      go('recognizing')
    },
    [go],
  )

  const takeOver = () => {
    setAutoplay(false)
    window.clearTimeout(assistedHold.current)
  }

  // The capture clock, which also moves the waveform and stops a hold at the cap.
  useInterval(
    () => {
      const seconds = (performance.now() - startedAt.current) / 1000
      if (seconds >= lavtypeDemo.captureLimitSeconds) release(true)
      else setElapsed(seconds)
    },
    100,
    phase === 'listening',
  )

  // Recognition finishes, then the one final transcript types in.
  useEffect(() => {
    if (phase !== 'recognizing') return
    const timer = window.setTimeout(
      () => {
        if (reduced) {
          setTyped(transcript.length)
          go('typed')
        } else {
          go('typing')
        }
      },
      reduced ? 300 : 1000,
    )
    return () => window.clearTimeout(timer)
  }, [phase, reduced, go])

  useInterval(
    () => {
      const next = typed + 1
      setTyped(next)
      if (next >= transcript.length) go('typed')
    },
    38,
    phase === 'typing',
  )

  // Hold → speak → release → type, then start over, while nobody has touched it.
  useEffect(() => {
    const delay = autoplayDelays[phase]
    if (!autoplay || !inView || delay === undefined) return
    const timer = window.setTimeout(() => {
      if (phase === 'idle') press()
      else if (phase === 'listening') release()
      else {
        setTyped(0)
        setElapsed(0)
        go('idle')
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [autoplay, inView, phase, press, release, go])

  // A self-played hold that scrolls away is dropped, so nothing runs off screen.
  useEffect(() => {
    if (inView || !autoplay || phaseRef.current !== 'listening') return
    setElapsed(0)
    go('idle')
  }, [inView, autoplay, go])

  useEffect(() => () => window.clearTimeout(assistedHold.current), [])

  const listening = phase === 'listening'
  const status =
    phase === 'listening'
      ? lavtypeDemo.listening
      : phase === 'recognizing'
        ? capped
          ? lavtypeDemo.capped
          : lavtypeDemo.recognizing
        : phase === 'typing' || phase === 'typed'
          ? lavtypeDemo.typed
          : phase === 'short'
            ? lavtypeDemo.tooShort
            : lavtypeDemo.idle

  return (
    <figure
      ref={stage}
      data-phase={phase}
      className={`${styles.stage} ${reduced ? styles.still : ''} ${inView ? '' : styles.paused}`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.rig}>
        <div className={styles.window} aria-hidden="true">
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
          <div className={styles.pill}>
            <svg className={styles.mic} viewBox="0 0 16 20" fill="none">
              <rect x="5" y="1" width="6" height="11" rx="3" />
              <path d="M2.5 9a5.5 5.5 0 0 0 11 0M8 14.5V18" />
            </svg>
            <span className={styles.wave}>
              {Array.from({ length: barCount }, (_, index) => (
                <span
                  style={
                    {
                      '--level': listening ? levelAt(index, elapsed).toFixed(3) : 0.4,
                    } as CSSProperties
                  }
                  key={index}
                />
              ))}
            </span>
            <span className={styles.clock}>{clock(elapsed)}</span>
          </div>
        </div>

        <button
          className={styles.keys}
          type="button"
          aria-label={lavtypeDemo.button}
          aria-describedby="lavtype-stage-hint"
          data-pressed={listening}
          onPointerDown={(event) => {
            if (event.button !== 0) return
            event.currentTarget.setPointerCapture(event.pointerId)
            takeOver()
            press()
          }}
          onPointerUp={() => release()}
          onPointerCancel={() => release()}
          onLostPointerCapture={() => release()}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key !== ' ' && event.key !== 'Enter') return
            event.preventDefault()
            if (event.repeat) return
            takeOver()
            press()
          }}
          onKeyUp={(event) => {
            if (event.key !== ' ' && event.key !== 'Enter') return
            event.preventDefault()
            keyReleasedAt.current = performance.now()
            release()
          }}
          onBlur={() => release()}
          onClick={(event) => {
            // Assistive tech activates with a click and no hold: dictate a short phrase for it.
            if (event.detail !== 0 || performance.now() - keyReleasedAt.current < 400) return
            if (phaseRef.current === 'listening') return
            takeOver()
            press()
            assistedHold.current = window.setTimeout(() => release(), 1600)
          }}
        >
          <span className={styles.chord} aria-hidden="true">
            {lavtypeExampleShortcut.keys.map((key, index) => (
              <kbd
                className={styles.key}
                data-wide={key === 'Space' ? '' : undefined}
                style={{ '--key': index } as CSSProperties}
                key={key}
              >
                {key}
              </kbd>
            ))}
          </span>
          <span className={styles.keyLabel} aria-hidden="true">
            {lavtypeExampleShortcut.label}
          </span>
        </button>
      </div>

      <figcaption className={styles.controls}>
        <p className={styles.status} aria-live={autoplay ? 'off' : 'polite'}>
          {status}
        </p>
        <div className={styles.meter} aria-hidden="true">
          <span className={styles.meterLabel}>Capture</span>
          <span className={styles.meterTrack}>
            <span
              style={
                {
                  '--fill': Math.min(1, elapsed / lavtypeDemo.captureLimitSeconds),
                } as CSSProperties
              }
            />
          </span>
          <span>
            {elapsed.toFixed(1)} s / {lavtypeDemo.captureLimitSeconds} s
          </span>
        </div>
        <p className={styles.hint} id="lavtype-stage-hint">
          {lavtypeDemo.hint}
        </p>
      </figcaption>
    </figure>
  )
}
