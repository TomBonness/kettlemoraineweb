import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styles from './TokenRace.module.css'

type RaceLane = {
  engine: string
  tokensPerSecond: number
  highlight: boolean
}

type TokenRaceProps = {
  lanes: readonly RaceLane[]
  text: string
  /** The model tokenizer's count for `text`; it sets every lane's finish time. */
  tokenCount: number
}

function formatSeconds(seconds: number) {
  return `${seconds.toFixed(1)} s`
}

export function TokenRace({ lanes, text, tokenCount }: TokenRaceProps) {
  // Token-sized pieces to reveal: words carry one leading space and whitespace runs stand alone.
  const pieces = useMemo(
    () => text.match(/ ?[A-Za-z_]+| ?\d+| ?[^\sA-Za-z0-9_]+|\s+/g) ?? [],
    [text],
  )
  const duration = tokenCount / Math.min(...lanes.map((lane) => lane.tokensPerSecond))
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const figure = useRef<HTMLElement>(null)
  const screens = useRef<(HTMLDivElement | null)[]>([])
  const frame = useRef(0)

  const start = useCallback(() => {
    cancelAnimationFrame(frame.current)
    const startedAt = performance.now()
    setRunning(true)
    const tick = (now: number) => {
      const seconds = (now - startedAt) / 1000
      if (seconds >= duration) {
        setElapsed(duration)
        setRunning(false)
        return
      }
      setElapsed(seconds)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [duration])

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      setElapsed(duration)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        start()
      },
      { threshold: 0.35 },
    )
    if (figure.current) observer.observe(figure.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [duration, start])

  // Keep the newest lines in view, like an editor following the cursor.
  useLayoutEffect(() => {
    for (const screen of screens.current) {
      if (screen) screen.scrollTop = screen.scrollHeight
    }
  }, [elapsed])

  const results = lanes.map((lane) => ({
    ...lane,
    finish: tokenCount / lane.tokensPerSecond,
    shown: Math.min(
      pieces.length,
      Math.floor((pieces.length * elapsed * lane.tokensPerSecond) / tokenCount),
    ),
  }))
  const summary = results
    .map((lane) => `${lane.engine} ${formatSeconds(lane.finish)}`)
    .join(', ')

  return (
    <figure className={styles.race} ref={figure}>
      <div className={styles.lanes} aria-hidden="true">
        {results.map((lane, index) => {
          const done = lane.shown === pieces.length
          return (
            <div
              className={`${styles.lane} ${lane.highlight ? styles.highlight : ''}`}
              key={lane.engine}
            >
              <div className={styles.laneHeader}>
                <strong>{lane.engine}</strong>
                <span>{lane.tokensPerSecond.toFixed(1)} tok/s</span>
              </div>
              <div
                className={styles.screen}
                ref={(element) => {
                  screens.current[index] = element
                }}
              >
                <pre>
                  <code>
                    {pieces.slice(0, lane.shown).join('')}
                    {!done && <span className={styles.caret} />}
                  </code>
                </pre>
              </div>
              <div className={styles.laneFooter}>
                <span className={styles.progress}>
                  <span style={{ transform: `scaleX(${lane.shown / pieces.length})` }} />
                </span>
                <span className={done ? styles.done : undefined}>
                  {done
                    ? `Done in ${formatSeconds(lane.finish)}`
                    : formatSeconds(Math.min(elapsed, lane.finish))}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <figcaption className={styles.caption}>
        <span>
          The same file, written at each engine’s measured speed: {summary}.
        </span>
        <button className={styles.replay} type="button" onClick={start} disabled={running}>
          Replay <span aria-hidden="true">↻</span>
        </button>
      </figcaption>
    </figure>
  )
}
