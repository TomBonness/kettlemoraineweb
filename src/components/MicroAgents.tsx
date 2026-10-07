import { useId, useRef, useState, type CSSProperties } from 'react'
import {
  agentBeats,
  agentCopy,
  agentLevels,
  agentSessions,
  agentStartLevels,
  agentStates,
  marketingRenders,
} from '../content/openMicro'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { CopyCommand } from './CopyCommand'
import styles from './MicroAgents.module.css'

const BEAT_MS = 3400

/* Where the keys sit on the overhead render, from the board model: the 96 mm board fills the middle
   76.15% of the image, and the 18 mm caps sit on a 19.05 mm pitch. */
const BOARD_INSET = 11.925
const MM = 76.15 / 96
const PITCH = 19.05
const CAP = 18
const GRID = (96 - (PITCH * 3 + CAP)) / 2

/** Agent keys 1–6 as [column, row]: the two bottom keys, then the row above them. */
const AGENT_KEYS = [
  [1, 3],
  [2, 3],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
] as const

function keyBox([column, row]: readonly [number, number]) {
  return {
    '--x': `${BOARD_INSET + (GRID + column * PITCH) * MM}%`,
    '--y': `${BOARD_INSET + (GRID + row * PITCH) * MM}%`,
    '--size': `${CAP * MM}%`,
  } as CSSProperties
}

/**
 * Six example agent sessions on Open Micro's agent keys: the real overhead render with each key lit
 * in its session's color and effect, beside the session list. While on screen the sessions move
 * through a calm example loop; the first interaction hands control to the visitor, who can pick a
 * session (in the list or on its key) and change its thinking level.
 */
export function MicroAgents() {
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()
  const inView = useInView(root, 0.25)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(true)
  const [beat, setBeat] = useState(0)
  const [selected, setSelected] = useState(agentBeats[0].selected)
  const [levels, setLevels] = useState<number[]>(() => [...agentStartLevels])
  const [hot, setHot] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const states = agentBeats[beat].states
  const level = levels[selected]
  const session = agentSessions[selected]

  const turn = (slot: number, direction: -1 | 1) => {
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
    setAnnouncement(
      `${agentSessions[slot].name} selected, ${agentStates[states[slot]].label}. Thinking level ${levels[slot] + 1} of ${agentLevels}.`,
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
      <div className={styles.stage} data-live={inView && !reduced}>
        {/* The list beside it is the accessible equivalent; the keys here are for pointers. */}
        <div className={styles.device} aria-hidden="true">
          <span className={styles.surface} />
          <img
            className={styles.render}
            src={marketingRenders.top.src}
            srcSet={marketingRenders.top.srcSet}
            width={marketingRenders.top.width}
            height={marketingRenders.top.height}
            sizes="(max-width: 860px) 92vw, 600px"
            alt=""
            loading="lazy"
            decoding="async"
          />
          {AGENT_KEYS.map((key, slot) => (
            <span
              className={styles.key}
              data-effect={agentStates[states[slot]].effect}
              data-selected={selected === slot}
              data-hot={hot === slot}
              style={{ ...keyBox(key), '--c': agentStates[states[slot]].color } as CSSProperties}
              onPointerEnter={() => setHot(slot)}
              onPointerLeave={() => setHot(null)}
              onClick={() => select(slot)}
              key={slot}
            >
              <span className={styles.glow} />
            </span>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <p id={listId}>{agentCopy.listLabel}</p>
            <span>{agentCopy.slots}</span>
          </div>
          <ul className={styles.sessions} aria-labelledby={listId}>
            {agentSessions.map((item, slot) => (
              <li key={item.name}>
                <button
                  className={styles.session}
                  type="button"
                  aria-pressed={selected === slot}
                  data-hot={hot === slot}
                  data-state={states[slot]}
                  style={{ '--c': agentStates[states[slot]].color } as CSSProperties}
                  onPointerEnter={() => setHot(slot)}
                  onPointerLeave={() => setHot(null)}
                  onFocus={() => setHot(slot)}
                  onBlur={() => setHot(null)}
                  onClick={() => select(slot)}
                >
                  <span className={styles.keycap} aria-hidden="true">
                    {slot + 1}
                  </span>
                  <span className={styles.sessionText}>
                    <span className={styles.sessionName}>{item.name}</span>
                    <span className={styles.sessionDetail}>{item.detail}</span>
                  </span>
                  <span className={styles.state}>{agentStates[states[slot]].label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.encoder}>
            <div>
              <p className={styles.encoderLabel}>
                {agentCopy.encoderLabel} <strong>{session.name}</strong>
              </p>
              <div
                className={styles.level}
                role="meter"
                aria-label={`Thinking level for ${session.name}`}
                aria-valuemin={1}
                aria-valuemax={agentLevels}
                aria-valuenow={level + 1}
                aria-valuetext={`${level + 1} of ${agentLevels}`}
              >
                {Array.from({ length: agentLevels }, (_, index) => (
                  <i data-on={index <= level} key={index} />
                ))}
              </div>
            </div>
            <div className={styles.encoderButtons}>
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
