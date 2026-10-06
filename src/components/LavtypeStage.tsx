import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { lavtypeDemo, lavtypeExampleShortcut, lavtypeProcess } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import { LavtypeKeycaps } from './LavtypeKeycaps'
import styles from './LavtypeStage.module.css'

type Phase = 'idle' | 'listening' | 'recognizing' | 'typing' | 'typed' | 'short'

const transcript = lavtypeProcess.transcript
const barCount = 64

/** A ring of bars around the keys; each bar gets a speech-like level and a colour stop. */
const bars = Array.from({ length: barCount }, (_, index) => {
  const swing = Math.sin(index * 0.9) * 0.55 + Math.sin(index * 0.37 + 1.2) * 0.45
  return {
    level: 0.22 + Math.abs(swing) * 0.78,
    tone: Math.abs((index / barCount) * 2 - 1),
  }
})

/** How long the self-playing demo waits in each phase before moving on. */
const autoplayDelays: Partial<Record<Phase, number>> = {
  idle: 1400,
  listening: 2700,
  typed: 3400,
  short: 1800,
}

/**
 * The hero centerpiece: the example shortcut as keycaps on a glowing pad, ringed by a waveform.
 * Hold the keys (pointer, or Space/Enter while focused) and the ring listens; release and the
 * transcript types into a floating focused-app window. Plays itself while idle and on screen.
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

  // The capture clock, which stops a hold at the cap.
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
      reduced ? 300 : 1100,
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

  useEffect(() => () => window.clearTimeout(assistedHold.current), [])

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
      className={`${styles.stage} ${reduced ? styles.still : ''} ${inView ? '' : styles.paused}`}
      ref={stage}
      data-phase={phase}
    >
      <div className={styles.viewport}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.world}>
          <div className={styles.pad} aria-hidden="true">
            <span className={styles.ripple} />
            <span className={styles.ripple} />
            <span className={styles.ripple} />
          </div>
          <div className={styles.beam} aria-hidden="true">
            <span />
          </div>
          <div className={styles.ring} aria-hidden="true">
            {bars.map((bar, index) => (
              <span
                className={styles.bar}
                style={
                  {
                    '--i': index,
                    '--n': barCount,
                    '--level': bar.level.toFixed(3),
                    '--tone': bar.tone.toFixed(3),
                  } as CSSProperties
                }
                key={index}
              >
                <span />
              </span>
            ))}
          </div>

          <button
            className={styles.key}
            type="button"
            aria-label={lavtypeDemo.button}
            aria-describedby="lavtype-stage-hint"
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
            <LavtypeKeycaps className={styles.keycaps} pressed={phase === 'listening'} />
          </button>
          <span className={styles.keyLabel} aria-hidden="true">
            {lavtypeExampleShortcut.label}
          </span>

          <span className={styles.windowGlow} aria-hidden="true" />
          <div className={styles.window} aria-hidden="true">
            <span className={styles.windowTag}>{lavtypeDemo.focusedApp}</span>
            <div className={styles.windowBack} />
            {[4, 3, 2, 1].map((depth) => (
              <span
                className={styles.windowSlice}
                style={{ '--depth': depth } as CSSProperties}
                key={depth}
              />
            ))}
            <div className={styles.windowFrame}>
              <div className={styles.chrome}>
                <i />
                <i />
                <i />
                <span className={styles.chromeTitle} />
              </div>
              <div className={styles.doc}>
                <span className={styles.ghostLine} style={{ '--w': '58%' } as CSSProperties} />
                <span className={styles.ghostLine} style={{ '--w': '82%' } as CSSProperties} />
                <span className={styles.ghostLine} style={{ '--w': '40%' } as CSSProperties} />
                <p className={styles.typed}>
                  {transcript.slice(0, typed)}
                  <span className={styles.caret} />
                </p>
                <span className={styles.final}>{lavtypeDemo.finalTranscript}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className={styles.controls}>
        <p className={styles.status} aria-live={autoplay ? 'off' : 'polite'}>
          <span className={styles.statusDot} />
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
          <span className={styles.meterValue}>
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
