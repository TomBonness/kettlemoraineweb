import { useId, useRef, useState, type CSSProperties } from 'react'
import {
  agentBeats,
  agentCopy,
  agentLevels,
  agentSessions,
  agentStartLevels,
  agentStates,
} from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { CopyCommand } from './CopyCommand'
import { MicroAgentDevice } from './MicroAgentDevice'
import styles from './MicroAgents.module.css'

const BEAT_MS = 3400

/* The thinking-level meter: a half ring of `agentLevels` segments around a needle. */
const METER = { cx: 80, cy: 82, r: 62, gap: 7 }
const SEGMENT = (180 - METER.gap * (agentLevels - 1)) / agentLevels

function point(degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return `${(METER.cx + METER.r * Math.cos(radians)).toFixed(2)} ${(METER.cy - METER.r * Math.sin(radians)).toFixed(2)}`
}

/** Segment `index` runs left to right across the top of the ring. */
function segmentPath(index: number) {
  const start = 180 - index * (SEGMENT + METER.gap)
  return `M ${point(start)} A ${METER.r} ${METER.r} 0 0 1 ${point(start - SEGMENT)}`
}

/** Needle rotation from straight up to the middle of segment `level`. */
function needleDegrees(level: number) {
  const middle = 180 - level * (SEGMENT + METER.gap) - SEGMENT / 2
  return 90 - middle
}

/**
 * Six example agent sessions mapped to Open Micro's agent keys. While on screen the sessions move
 * through a calm example loop; the first interaction hands control to the visitor, who can pick a
 * session (on the list or its key) and turn the encoder to change its thinking level.
 */
export function MicroAgents() {
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()
  const gradientId = useId()
  const inView = useInView(root, 0.25)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [beat, setBeat] = useState(0)
  const [selected, setSelected] = useState(agentBeats[0].selected)
  const [levels, setLevels] = useState<number[]>(() => [...agentStartLevels])
  const [turns, setTurns] = useState(0)
  const [hot, setHot] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const states = agentBeats[beat].states
  const level = levels[selected]
  const session = agentSessions[selected]

  const turn = (slot: number, direction: -1 | 1) => {
    setTurns((current) => current + direction)
    setLevels((current) =>
      current.map((value, index) =>
        index === slot ? Math.min(agentLevels - 1, Math.max(0, value + direction)) : value,
      ),
    )
  }

  useInterval(
    () => {
      const next = (beat + 1) % agentBeats.length
      const step = agentBeats[next]
      setBeat(next)
      setSelected(step.selected)
      if (step.turn) turn(step.selected, step.turn)
    },
    BEAT_MS,
    inView && autoplay && !reduced,
  )

  const stop = () => setAutoplay(false)

  const select = (slot: number) => {
    stop()
    setSelected(slot)
    const { name } = agentSessions[slot]
    setAnnouncement(
      `${name} selected, ${agentStates[states[slot]].label}. Thinking level ${levels[slot] + 1} of ${agentLevels}.`,
    )
  }

  const userTurn = (direction: -1 | 1) => {
    stop()
    turn(selected, direction)
    const next = Math.min(agentLevels - 1, Math.max(0, level + direction))
    setAnnouncement(`${session.name}: thinking level ${next + 1} of ${agentLevels}.`)
  }

  return (
    <div className={styles.agents} ref={root} onPointerDown={stop} onFocus={stop}>
      <div className={styles.stage}>
        <figure className={styles.figure}>
          <div className={styles.deviceWrap}>
            <MicroAgentDevice
              states={states}
              hot={hot}
              selected={selected}
              turns={turns}
              live={inView}
              onHot={setHot}
              onSelect={select}
              onTurn={userTurn}
            />
          </div>
          <figcaption>
            <span className={styles.tag}>{agentCopy.captionTag}</span>
            {agentCopy.caption}
          </figcaption>
        </figure>

        <div className={styles.console}>
          <div className={styles.consoleHead}>
            <p id={listId}>{agentCopy.listLabel}</p>
            <span>{agentCopy.slots}</span>
          </div>
          <ul className={styles.sessions} aria-labelledby={listId}>
            {agentSessions.map((item, slot) => {
              const light = agentStates[states[slot]]
              return (
                <li key={item.name}>
                  <button
                    className={styles.session}
                    type="button"
                    aria-pressed={selected === slot}
                    data-hot={hot === slot}
                    data-state={states[slot]}
                    style={{ '--c': light.color } as CSSProperties}
                    onPointerEnter={() => setHot(slot)}
                    onPointerLeave={() => setHot(null)}
                    onFocus={() => setHot(slot)}
                    onBlur={() => setHot(null)}
                    onClick={() => select(slot)}
                  >
                    <span className={styles.chip} aria-hidden="true">
                      {slot + 1}
                    </span>
                    <span className={styles.sessionText}>
                      <span className={styles.sessionName}>{item.name}</span>
                      <span className={styles.sessionDetail}>{item.detail}</span>
                    </span>
                    <span className={styles.sessionState}>
                      <span className={styles.stateLabel}>{light.label}</span>
                      <span className={styles.effect}>{light.effect}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className={styles.dial}>
            <div
              className={styles.meter}
              role="meter"
              aria-label={`Thinking level for ${session.name}`}
              aria-valuemin={1}
              aria-valuemax={agentLevels}
              aria-valuenow={level + 1}
              aria-valuetext={`${level + 1} of ${agentLevels}`}
            >
              <svg viewBox="0 0 160 92" aria-hidden="true">
                <defs>
                  <linearGradient id={gradientId} x1="18" x2="142" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#e2c58f" />
                    <stop offset="0.55" stopColor="#8fa6e8" />
                    <stop offset="1" stopColor="#4d7dff" />
                  </linearGradient>
                </defs>
                {Array.from({ length: agentLevels }, (_, index) => (
                  <g key={index}>
                    <path className={styles.track} d={segmentPath(index)} />
                    <path
                      className={styles.lit}
                      d={segmentPath(index)}
                      stroke={`url(#${gradientId})`}
                      data-on={index <= level}
                    />
                  </g>
                ))}
                <g className={styles.needle} style={{ transform: `rotate(${needleDegrees(level)}deg)` }}>
                  <line x1="80" y1="70" x2="80" y2="34" />
                  <circle cx="80" cy="32" r="2.6" />
                </g>
                <circle className={styles.hub} cx="80" cy="82" r="7" />
              </svg>
              <div className={styles.meterEnds} aria-hidden="true">
                <span>{agentCopy.lower}</span>
                <span>{agentCopy.higher}</span>
              </div>
            </div>
            <div className={styles.dialCopy}>
              <p className={styles.kicker}>{agentCopy.encoderLabel}</p>
              <p className={styles.dialTarget} style={{ '--c': agentStates[states[selected]].color } as CSSProperties}>
                {session.name}
              </p>
              <div className={styles.dialButtons}>
                <button type="button" aria-label="Lower thinking level" onClick={() => userTurn(-1)}>
                  <span aria-hidden="true">↺</span>
                  {agentCopy.lower}
                </button>
                <button type="button" aria-label="Higher thinking level" onClick={() => userTurn(1)}>
                  {agentCopy.higher}
                  <span aria-hidden="true">↻</span>
                </button>
              </div>
            </div>
          </div>
          <p className={styles.fallback}>{agentCopy.fallback}</p>
        </div>
      </div>

      <div className={styles.notes}>
        <div className={styles.command}>
          <CopyCommand command={agentCopy.command} label={agentCopy.commandLabel} />
        </div>
        {agentCopy.points.map((item) => (
          <div className={styles.point} key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>

      <p className={styles.announcer} aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
