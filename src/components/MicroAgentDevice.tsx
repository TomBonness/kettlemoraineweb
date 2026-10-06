import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { agentStates, type AgentState } from '../content/openMicro'
import styles from './MicroAgentDevice.module.css'

/* Open Micro's top layout in millimetres, from the board model: a 96 mm square board, 18 mm
   caps on a 19.05 mm pitch, a push encoder in the bottom-left cell and touch in the bottom-right. */
const BOARD = 96
const CAP = 18
const PITCH = 19.05
const GRID = (BOARD - (PITCH * 3 + CAP)) / 2
const ENCODER_RADIUS = 8.7

/** [column, row, units] for the twelve keys, top-left first. */
const KEYS = [
  [1, 0, 2],
  [3, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
  [2, 1, 1],
  [3, 1, 1],
  [0, 2, 1],
  [1, 2, 1],
  [2, 2, 1],
  [3, 2, 1],
  [1, 3, 1],
  [2, 3, 1],
] as const

/** The index in `KEYS` of agent keys 1–6: the two bottom keys, then the row above them. */
const AGENT_KEYS = [10, 11, 6, 7, 8, 9] as const

/** Mounting holes and the stabilizer housings peeking above the 2U key, as [x, y, diameter]. */
const HOLES = [
  [6.5, 35.2, 3.4],
  [80, 68.2, 3.4],
  [8, 87.9, 3.4],
  [88, 87.9, 3.4],
] as const
const STABILIZERS = [
  [36, 9.6, 3.2],
  [60, 9.6, 3.2],
] as const

/** Degrees the knob turns per detent: the encoder has 24 detents a turn. */
const DETENT_DEGREES = 360 / 24

function cell(column: number, row: number, units = 1) {
  return {
    '--x': GRID + column * PITCH,
    '--y': GRID + row * PITCH,
    '--w': CAP + (units - 1) * PITCH,
    '--h': CAP,
  } as CSSProperties
}

function circle(x: number, y: number, diameter: number) {
  return { '--x': x - diameter / 2, '--y': y - diameter / 2, '--w': diameter, '--h': diameter } as CSSProperties
}

type MicroAgentDeviceProps = {
  states: readonly AgentState[]
  hot: number | null
  selected: number
  turns: number
  live: boolean
  onHot: (slot: number | null) => void
  onSelect: (slot: number) => void
  onTurn: (direction: -1 | 1) => void
}

/**
 * A flat top-down drawing of Open Micro. Agent keys glow from beneath their caps in the color and
 * effect of their session's state. Pointer users can press agent keys and drag the encoder; the
 * session list beside it is the accessible equivalent, so the drawing is hidden from assistive tech.
 */
export function MicroAgentDevice({
  states,
  hot,
  selected,
  turns,
  live,
  onHot,
  onSelect,
  onTurn,
}: MicroAgentDeviceProps) {
  const drag = useRef<{ angle: number; travelled: number } | null>(null)
  const encoderCenter = { x: GRID + CAP / 2, y: GRID + 3 * PITCH + CAP / 2 }
  const touchCenter = { x: GRID + 3 * PITCH + CAP / 2, y: encoderCenter.y }

  const angleOf = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    return (
      (Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2)) *
        180) /
      Math.PI
    )
  }

  return (
    <div className={styles.device} data-live={live} aria-hidden="true">
      <div className={styles.board}>
        <span className={styles.silk}>OPEN MICRO 1.0 / top_control_pcb</span>
        <span className={styles.statusLed} style={{ '--x': 18, '--y': 4, '--w': 3, '--h': 3 } as CSSProperties} />
        {[...HOLES, ...STABILIZERS].map(([x, y, d]) => (
          <span className={styles.hole} style={circle(x, y, d)} key={`${x}-${y}`} />
        ))}
        <span className={styles.touch} style={circle(touchCenter.x, touchCenter.y, 12)} />

        {KEYS.map(([column, row, units], index) => {
          const slot = AGENT_KEYS.indexOf(index as (typeof AGENT_KEYS)[number])
          if (slot < 0) return <span className={styles.cap} style={cell(column, row, units)} key={index} />
          return (
            <button
              className={styles.cap}
              type="button"
              tabIndex={-1}
              style={cell(column, row, units)}
              data-hot={hot === slot}
              data-selected={selected === slot}
              onPointerEnter={() => onHot(slot)}
              onPointerLeave={() => onHot(null)}
              onClick={() => onSelect(slot)}
              key={index}
            />
          )
        })}

        {AGENT_KEYS.map((key, slot) => {
          const state = states[slot]
          if (state === 'idle') return null
          const [column, row, units] = KEYS[key]
          const light = agentStates[state]
          return (
            <span
              className={styles.glow}
              data-effect={light.effect}
              style={{ ...cell(column, row, units), '--c': light.color } as CSSProperties}
              key={`${slot}-${state}`}
            />
          )
        })}

        <span
          className={styles.encoder}
          style={circle(encoderCenter.x, encoderCenter.y, ENCODER_RADIUS * 2)}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { angle: angleOf(event), travelled: 0 }
          }}
          onPointerMove={(event) => {
            const current = drag.current
            if (!current) return
            const angle = angleOf(event)
            current.travelled += ((angle - current.angle + 540) % 360) - 180
            current.angle = angle
            while (Math.abs(current.travelled) >= DETENT_DEGREES) {
              const direction = current.travelled > 0 ? 1 : -1
              current.travelled -= direction * DETENT_DEGREES
              onTurn(direction)
            }
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <span className={styles.knob} style={{ transform: `rotate(${turns * DETENT_DEGREES}deg)` }} />
        </span>
      </div>
    </div>
  )
}
