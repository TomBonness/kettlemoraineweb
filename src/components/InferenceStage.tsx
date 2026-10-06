import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { draftPrompt, draftRounds, peakTokensPerSecond } from '../content/inference'
import { prefersReducedMotion, useInView, useStageMotion } from '../lib/motion'
import styles from './InferenceStage.module.css'

type DraftRound = { tokens: readonly string[]; accepted: readonly number[] }

/* Scene coordinates are design units (1200 across the stage); y points down, z toward you. */
type Point = { x: number; y: number; z: number }

const floor = 430
const root: Point = { x: 528, y: floor - 70, z: 120 }

/** The drafted tree: 15 tokens, six levels ahead. Every round in `draftRounds` reuses it. */
const tree = [
  { level: 1, parent: -1, y: 278, z: 40 },
  { level: 1, parent: -1, y: 372, z: 170 },
  { level: 1, parent: -1, y: 200, z: -90 },
  { level: 2, parent: 0, y: 236, z: 10 },
  { level: 2, parent: 0, y: 322, z: 110 },
  { level: 2, parent: 1, y: 394, z: 210 },
  { level: 2, parent: 2, y: 156, z: -170 },
  { level: 3, parent: 3, y: 200, z: -20 },
  { level: 3, parent: 3, y: 276, z: -120 },
  { level: 3, parent: 4, y: 348, z: 150 },
  { level: 4, parent: 7, y: 170, z: -40 },
  { level: 4, parent: 7, y: 244, z: 70 },
  { level: 4, parent: 9, y: 330, z: 200 },
  { level: 5, parent: 10, y: 150, z: -60 },
  { level: 6, parent: 13, y: 132, z: -80 },
].map((node) => ({ ...node, x: 500 + node.level * 90 }))

/** A line from `a` to `b`: a 2D bar turned in place, so it stays straight under any camera. */
function edgeStyle(a: Point, b: Point) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  const flat = Math.hypot(dx, dz)
  return {
    '--ci-ax': a.x,
    '--ci-ay': a.y,
    '--ci-az': a.z,
    '--ci-len': Math.hypot(flat, dy),
    '--ci-yaw': `${Math.atan2(-dz, dx)}rad`,
    '--ci-tilt': `${Math.atan2(dy, flat)}rad`,
  } as CSSProperties
}

const promptEdge = edgeStyle({ x: 236, y: 318, z: 40 }, { x: 352, y: floor - 46, z: -30 })
const verifyEdge = edgeStyle({ x: 410, y: floor - 58, z: -30 }, { x: 560, y: 210, z: 0 })

const phases = ['idle', 'draft', 'verify', 'stream'] as const
type Phase = (typeof phases)[number]
const phaseTimes: Record<Phase, number> = { idle: 650, draft: 1700, verify: 2100, stream: 2300 }

const controls = [
  { phase: 'draft', label: 'Draft', detail: '15 tokens ahead' },
  { phase: 'verify', label: 'Verify', detail: 'One 27B pass' },
  { phase: 'stream', label: 'Keep', detail: 'What it agrees with' },
] as const

const verifierSlices = [0, 4, 8, 12]
const drafterSlices = [0, 4, 8]

function Chip({ kind }: { kind: 'verifier' | 'drafter' }) {
  const slices = kind === 'verifier' ? verifierSlices : drafterSlices
  return (
    <div className={`${styles.chip} ${styles[kind]}`}>
      {slices.map((height) => (
        <span className={styles.substrate} style={{ '--ci-h': height } as CSSProperties} key={height} />
      ))}
      <span className={styles.substrateTop} />
      <span className={styles.package} />
      <span className={styles.die} />
      <span className={styles.core} />
      <span className={styles.chipLabel}>
        {kind === 'verifier' ? (
          <>
            <strong>27B</strong> verifier
          </>
        ) : (
          <>
            <strong>DFlash2</strong> drafter
          </>
        )}
      </span>
    </div>
  )
}

export function InferenceStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [autoplay, setAutoplay] = useState(!reduced)
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<Phase>(reduced ? 'stream' : 'idle')

  useStageMotion(stage, !reduced)

  // The collapsed tree is only a breath between rounds, so it always moves on to a fresh draft.
  // Autoplay walks the rest of the cycle while the stage is on screen.
  useEffect(() => {
    if (!inView) return
    if (phase !== 'idle' && !autoplay) return
    const timer = window.setTimeout(() => {
      if (phase === 'stream') {
        setRound((current) => (current + 1) % draftRounds.length)
        setPhase('idle')
      } else {
        setPhase(phases[phases.indexOf(phase) + 1])
      }
    }, phaseTimes[phase])
    return () => window.clearTimeout(timer)
  }, [phase, autoplay, inView])

  const choose = (next: Phase) => {
    setAutoplay(false)
    if (next === 'draft') {
      if (phase === 'stream') setRound((current) => (current + 1) % draftRounds.length)
      setPhase('idle')
      return
    }
    setPhase(next)
  }

  const current: DraftRound = draftRounds[round]
  const accepted = new Set(current.accepted)
  const kept = draftRounds
    .slice(0, round)
    .flatMap((item: DraftRound) => item.accepted.map((index) => item.tokens[index]))
  const fresh = phase === 'stream' ? current.accepted.map((index) => current.tokens[index]) : []
  const shown: Phase = phase === 'idle' ? 'draft' : phase

  return (
    <figure className={`${styles.figure} ${reduced ? styles.still : ''}`}>
      <div className={styles.stage} ref={stage} data-phase={phase}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.rig} aria-hidden="true">
          <div className={styles.floor} />

          <div className={styles.metric}>
            <span className={styles.metricNumber}>{Math.floor(peakTokensPerSecond)}</span>
            <span className={styles.metricUnit}>
              tok/s
              <small>Peak decode · one RTX 5090</small>
            </span>
          </div>

          <div className={styles.prompt}>
            <span className={styles.panelLabel}>Prompt</span>
            <pre>
              {draftPrompt.join('\n')}
              <span className={styles.promptCaret} />
            </pre>
          </div>

          <span className={`${styles.edge} ${styles.beam}`} style={promptEdge}>
            <span />
          </span>
          <span className={`${styles.edge} ${styles.beam} ${styles.verifyBeam}`} style={verifyEdge}>
            <span />
          </span>

          <Chip kind="verifier" />
          <Chip kind="drafter" />

          <div className={styles.tree}>
            {tree.map((node, index) => (
              <span
                className={`${styles.edge} ${styles.branch}`}
                data-accepted={accepted.has(index)}
                style={
                  {
                    ...edgeStyle(node.parent < 0 ? root : tree[node.parent], node),
                    '--ci-level': node.level,
                  } as CSSProperties
                }
                key={`edge-${index}`}
              >
                <span />
              </span>
            ))}
            {tree.map((node, index) => (
              <span
                className={styles.node}
                data-accepted={accepted.has(index)}
                style={
                  {
                    '--ci-x': node.x,
                    '--ci-y': node.y,
                    '--ci-z': node.z,
                    '--ci-level': node.level,
                  } as CSSProperties
                }
                key={`node-${index}`}
              >
                <span className={styles.bead} />
                <span className={styles.token}>{current.tokens[index]}</span>
              </span>
            ))}
            <span className={styles.sweep} />
          </div>

          <div className={styles.rail}>
            <span className={styles.panelLabel}>Output</span>
            <span className={styles.stream}>
              {kept.map((token, index) => (
                <span className={styles.kept} key={`${round}-${index}`}>
                  {token}
                </span>
              ))}
              {fresh.map((token, index) => (
                <span
                  className={`${styles.kept} ${styles.fresh}`}
                  style={{ '--ci-i': index } as CSSProperties}
                  key={`${round}-fresh-${index}`}
                >
                  {token}
                </span>
              ))}
              <span className={styles.streamCaret} />
            </span>
          </div>
        </div>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.srOnly}>
          Speculative decoding in Cinference Engine: a small DFlash2 drafter proposes a tree of 15
          tokens, the 27B model checks the whole tree in one pass, and every token it agrees with
          streams out. Peak decode is {Math.floor(peakTokensPerSecond)} tokens per second on one
          RTX 5090.
        </span>
        <div className={styles.controls} role="group" aria-label="Speculative decoding steps">
          {controls.map((control, index) => (
            <button
              type="button"
              aria-pressed={shown === control.phase}
              onClick={() => choose(control.phase)}
              key={control.phase}
            >
              <span className={styles.step} aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <strong>{control.label}</strong>
                <small>{control.detail}</small>
              </span>
            </button>
          ))}
        </div>
        <p className={styles.status} aria-live={autoplay ? 'off' : 'polite'}>
          Round {round + 1} · {tree.length} drafted
          {phase === 'stream' || phase === 'verify' ? ` · ${current.accepted.length} kept` : ''}
        </p>
      </figcaption>
    </figure>
  )
}
