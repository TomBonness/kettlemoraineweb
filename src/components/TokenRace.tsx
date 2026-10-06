import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { prefersReducedMotion, useInView, useStageMotion } from '../lib/motion'
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

/**
 * Three screens in an arc, each writing the same file at one engine's measured decode rate. It
 * plays while on screen, pauses when scrolled away, and replays on request. With reduced motion
 * (or no IntersectionObserver) it opens on the finished race.
 */
export function TokenRace({ lanes, text, tokenCount }: TokenRaceProps) {
  // Token-sized pieces to reveal: words carry one leading space and whitespace runs stand alone.
  const pieces = useMemo(
    () => text.match(/ ?[A-Za-z_]+| ?\d+| ?[^\sA-Za-z0-9_]+|\s+/g) ?? [],
    [text],
  )
  const duration = tokenCount / Math.min(...lanes.map((lane) => lane.tokensPerSecond))
  const figure = useRef<HTMLElement>(null)
  const arc = useRef<HTMLDivElement>(null)
  const screens = useRef<(HTMLDivElement | null)[]>([])
  const inView = useInView(figure, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [elapsed, setElapsed] = useState(() =>
    reduced || typeof IntersectionObserver === 'undefined' ? duration : 0,
  )
  const elapsedRef = useRef(elapsed)
  const done = elapsed >= duration
  const active = inView && !done

  useStageMotion(arc, !reduced)

  useEffect(() => {
    if (!active) return
    let frame = 0
    const origin = performance.now() - elapsedRef.current * 1000
    const tick = (now: number) => {
      const seconds = Math.min(duration, (now - origin) / 1000)
      elapsedRef.current = seconds
      setElapsed(seconds)
      if (seconds < duration) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, duration])

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
      <div className={styles.arc} ref={arc} aria-hidden="true">
        <div className={styles.lanes}>
          {results.map((lane, index) => {
            const finished = lane.shown === pieces.length
            const offset = index - (results.length - 1) / 2
            return (
              <div
                className={`${styles.lane} ${lane.highlight ? styles.highlight : ''}`}
                data-finished={finished}
                style={{ '--ci-offset': offset, '--ci-distance': Math.abs(offset) } as CSSProperties}
                key={lane.engine}
              >
                <div className={styles.bezel}>
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
                        {!finished && <span className={styles.caret} />}
                      </code>
                    </pre>
                  </div>
                  <div className={styles.laneFooter}>
                    <span className={styles.progress}>
                      <span style={{ transform: `scaleX(${lane.shown / pieces.length})` }} />
                    </span>
                    <span className={finished ? styles.done : undefined}>
                      {finished
                        ? `Done in ${formatSeconds(lane.finish)}`
                        : formatSeconds(Math.min(elapsed, lane.finish))}
                    </span>
                  </div>
                  <span className={styles.badge}>{formatSeconds(lane.finish)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>The same file, written at each engine’s measured speed: {summary}.</span>
        <button
          className={styles.replay}
          type="button"
          onClick={() => {
            elapsedRef.current = 0
            setElapsed(0)
          }}
          disabled={!done}
        >
          Replay <span aria-hidden="true">↻</span>
        </button>
      </figcaption>
    </figure>
  )
}
