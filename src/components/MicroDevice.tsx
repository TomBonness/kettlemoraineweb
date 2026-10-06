import { useState, type CSSProperties, type ReactNode } from 'react'
import styles from './MicroDevice.module.css'

/*
 * Open Micro in CSS 3D, measured in millimetres from the overhead render: a 96 × 96 mm body with
 * 12 mm corners, twelve MX keycaps on a 19.05 mm grid (a 2u key in the top row), a push encoder
 * bottom left and the exposed touch control bottom right. `--mm` sets the scale in pixels.
 *
 * Layers stack bottom up, and each one lifts by `--om-lift-N` × `--om-gap` mm when exploded
 * (defaulting to `--om-explode` × N): base, wall, boards, controls, keycaps.
 */

type Facet = { x: number; y: number; a: number; w: number }

const body = 96
const corner = 12
const pitch = 19.05
const capSize = 18
const gridStart = (body - (pitch * 3 + capSize)) / 2

/** The keys as [column, row, width in units], left to right and top to bottom. */
const keyLayout = [
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

const keys = keyLayout.map(([column, row, units]) => ({
  x: gridStart + column * pitch,
  y: gridStart + row * pitch,
  w: capSize + (units - 1) * pitch,
}))

const cellCenter = (index: number) => gridStart + index * pitch + capSize / 2
const encoder = { x: cellCenter(0), y: cellCenter(3), radius: 8.7 }

/** Wall emitters around the sister board's edge, in its own millimetres (86 × 86). */
const emitters = [14, 31.3, 54.7, 72].flatMap((along) => [
  [along, 2.2],
  [83.8, along],
  [along, 83.8],
  [2.2, along],
])
const touch = { x: cellCenter(3), y: cellCenter(3) }

/** Direction the light comes from, in degrees clockwise from the top edge of the board. */
const light = 200

const lit = (angle: number) => +(0.5 + 0.5 * Math.cos(((angle - light) * Math.PI) / 180)).toFixed(3)

/** The upright faces around a rounded rectangle, each facing out at angle `a`. */
function outline(width: number, depth: number, radius: number, perCorner: number): Facet[] {
  const sides = [
    { x: width / 2, y: 0, a: 0, w: width - 2 * radius },
    { x: width, y: depth / 2, a: 90, w: depth - 2 * radius },
    { x: width / 2, y: depth, a: 180, w: width - 2 * radius },
    { x: 0, y: depth / 2, a: 270, w: depth - 2 * radius },
  ]
  const corners = [
    [width - radius, radius],
    [width - radius, depth - radius],
    [radius, depth - radius],
    [radius, radius],
  ]
  const step = 90 / perCorner
  const half = ((step / 2) * Math.PI) / 180
  const chord = 2 * radius * Math.sin(half)
  const reach = radius * Math.cos(half)
  const facets: Facet[] = []
  sides.forEach((side, index) => {
    if (side.w > 0.01) facets.push(side)
    const [cx, cy] = corners[index]
    for (let k = 0; k < perCorner; k += 1) {
      const a = side.a + step * (k + 0.5)
      const radians = (a * Math.PI) / 180
      facets.push({ x: cx + reach * Math.sin(radians), y: cy - reach * Math.cos(radians), a, w: chord })
    }
  })
  return facets
}

const boxSides = (width: number, depth: number): Facet[] => [
  { x: width / 2, y: 0, a: 0, w: width },
  { x: width, y: depth / 2, a: 90, w: depth },
  { x: width / 2, y: depth, a: 180, w: width },
  { x: 0, y: depth / 2, a: 270, w: depth },
]

const outlines = {
  base: outline(body - 2, body - 2, corner - 1, 4),
  shell: outline(body, body, corner, 4),
  sister: outline(body - 10, body - 10, corner - 5, 2),
  knob: outline(encoder.radius * 2, encoder.radius * 2, encoder.radius, 6),
}

const vars = (values: Record<string, number | string>) => values as CSSProperties

type PrismProps = {
  className: string
  facets: Facet[]
  x?: number
  y?: number
  z: number
  width: number
  depth: number
  height: number
  radius?: number
  children?: ReactNode
}

/** An upright extrusion: its side faces plus a top face that holds `children`. */
function Prism({ className, facets, x = 0, y = 0, z, width, depth, height, radius = 0, children }: PrismProps) {
  return (
    <div
      className={`${styles.prism} ${className}`}
      style={vars({ '--x': x, '--y': y, '--z': z, '--w': width, '--d': depth, '--h': height, '--r': radius })}
    >
      {facets.map((facet, index) => (
        <span
          className={styles.facet}
          style={vars({ '--fx': facet.x, '--fy': facet.y, '--fa': facet.a, '--fw': facet.w, '--lit': lit(facet.a) })}
          key={index}
        />
      ))}
      <span className={styles.top}>{children}</span>
    </div>
  )
}

const capSides = (width: number) =>
  boxSides(width, capSize).map((facet) => (
    <span
      className={styles.capSide}
      style={vars({ '--fx': facet.x, '--fy': facet.y, '--fa': facet.a, '--fw': facet.w, '--lit': lit(facet.a) })}
      key={facet.a}
    />
  ))

type Control = number | 'knob' | 'touch'

type MicroDeviceProps = {
  className?: string
  /** The key (0–11) a demo is pressing. */
  pressedKey?: number | null
  /** Called when the visitor presses a key, the encoder or the touch control. */
  onPress?: (control: Control) => void
  /** Draw the parts the closed enclosure hides: switches, the encoder body and the sister board. */
  internals?: boolean
  /** Highlights one layer, numbered like `explodedLayers`: 0 keycaps … 4 base. */
  focus?: number | null
  /** One caption per layer, keycaps first, that turns to face the viewer (`--om-rx`/`--om-rz`). */
  tags?: readonly string[]
}

/** Decorative: the parent labels the model. */
export function MicroDevice({
  className = '',
  pressedKey = null,
  onPress,
  internals = false,
  focus = null,
  tags,
}: MicroDeviceProps) {
  const [detent, setDetent] = useState(0)

  const tag = (layer: number, z: number) =>
    tags?.[layer] ? (
      <span className={styles.tag} style={vars({ '--tag-z': z })}>
        <span className={styles.tagFace}>
          <span className={styles.tagIndex}>{String(layer + 1).padStart(2, '0')}</span>
          {tags[layer]}
        </span>
      </span>
    ) : null

  return (
    <div className={`${styles.device} ${className}`} data-focus={focus ?? undefined}>
      <span className={styles.shadow} />
      <span className={styles.bloom} />

      <div className={`${styles.layer} ${styles.base}`} data-layer={4}>
        <Prism className={styles.baseShell} facets={outlines.base} x={1} y={1} z={0} width={body - 2} depth={body - 2} height={3} radius={corner - 1}>
          <span className={styles.pocket} />
        </Prism>
        {tag(4, 1.5)}
      </div>

      <div className={`${styles.layer} ${styles.wall}`} data-layer={3}>
        <Prism className={styles.wallShell} facets={outlines.shell} z={3} width={body} depth={body} height={13} radius={corner} />
        {tag(3, 9)}
      </div>

      <div className={`${styles.layer} ${styles.boards}`} data-layer={2}>
        {internals && (
          <Prism className={styles.sister} facets={outlines.sister} x={5} y={5} z={7} width={body - 10} depth={body - 10} height={1.4} radius={corner - 5}>
            {emitters.map(([x, y]) => (
              <span className={styles.emitter} style={vars({ '--ex': x, '--ey': y })} key={`${x}-${y}`} />
            ))}
            <span className={styles.module} />
            <span className={styles.sisterLabel}>OPEN MICRO 1.0 / sister_pcb</span>
          </Prism>
        )}
        <Prism className={styles.pcb} facets={outlines.shell} z={16} width={body} depth={body} height={1.6} radius={corner}>
          <span className={styles.silk}>OPEN MICRO 1.0 / top_control_pcb</span>
          <span className={styles.silkSmall}>RF / NO COPPER</span>
          <span className={styles.led} />
          {[
            [6.4, 35],
            [79.9, 68],
            [8, 88],
            [88, 88],
            [36.5, 9.9],
            [60, 9.9],
          ].map(([x, y]) => (
            <span className={styles.standoff} style={vars({ '--sx': x, '--sy': y })} key={`${x}-${y}`} />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <span className={styles.via} style={vars({ '--i': index })} key={index} />
          ))}
        </Prism>
        {tag(2, 16.8)}
      </div>

      <div className={`${styles.layer} ${styles.controls}`} data-layer={1}>
        {internals &&
          keys.map((key, index) => (
            <Prism
              className={styles.switch}
              facets={boxSides(14, 14)}
              x={key.x + (key.w - 14) / 2}
              y={key.y + 2}
              z={17.6}
              width={14}
              depth={14}
              height={5.5}
              radius={1}
              key={index}
            />
          ))}
        {internals && (
          <Prism className={styles.encoderBody} facets={boxSides(12.5, 12.5)} x={encoder.x - 6.25} y={encoder.y - 6.25} z={17.6} width={12.5} depth={12.5} height={6.5} radius={0.6}>
            <span className={styles.shaft} />
          </Prism>
        )}
        <span
          className={styles.touch}
          style={vars({ '--tx': touch.x, '--ty': touch.y })}
          onPointerDown={() => onPress?.('touch')}
        >
          <span />
        </span>
        {tag(1, 20)}
      </div>

      <div className={`${styles.layer} ${styles.caps}`} data-layer={0}>
        {keys.map((key, index) => (
          <span
            className={styles.key}
            data-pressed={pressedKey === index}
            style={vars({ '--kx': key.x, '--ky': key.y, '--kw': key.w })}
            onPointerDown={() => onPress?.(index)}
            key={index}
          >
            {capSides(key.w)}
            <span className={styles.capTop} />
          </span>
        ))}
        <span
          className={styles.knob}
          style={vars({ '--kx': encoder.x - encoder.radius, '--ky': encoder.y - encoder.radius, '--detent': detent })}
          onPointerDown={() => {
            setDetent((current) => current + 1)
            onPress?.('knob')
          }}
        >
          <Prism className={styles.knobBody} facets={outlines.knob} z={0} width={encoder.radius * 2} depth={encoder.radius * 2} height={15} radius={encoder.radius}>
            <span className={styles.notch} />
          </Prism>
        </span>
        {tag(0, 26)}
      </div>
    </div>
  )
}
