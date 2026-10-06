import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { activityLabels, fieldTitles, type Activity } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval, usesMacKeys } from '../lib/motion'
import { StatusGlyph } from './CinmuxWindow'
import styles from './AgentField.module.css'

const columns = 8
const rows = fieldTitles.length / columns
const maxWaiting = 4

type Tile = { title: string; agent: boolean; activity: Activity }

/** Deterministic, so every visit starts from the same field. */
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function initialTiles(): Tile[] {
  const random = seededRandom(11)
  let waiting = 0
  return fieldTitles.map((title) => {
    const agent = title.startsWith('agent:')
    const roll = random()
    let activity: Activity
    if (agent && waiting < 3 && roll < 0.14) {
      activity = 'waiting'
      waiting += 1
    } else if (agent) {
      activity = roll < 0.72 ? 'working' : 'done'
    } else {
      activity = roll < 0.45 ? 'idle' : roll < 0.85 ? 'working' : 'done'
    }
    return { title, agent, activity }
  })
}

/** One tick of a busy workspace: a few tabs move on, and only agents ever stop to ask. */
function evolve(tiles: readonly Tile[], random: () => number) {
  const next = tiles.slice()
  let waiting = tiles.filter((tile) => tile.activity === 'waiting').length
  for (let change = 0; change < 3; change += 1) {
    const index = Math.floor(random() * next.length)
    const tile = next[index]
    const roll = random()
    let activity = tile.activity
    if (tile.activity === 'idle') activity = roll < 0.5 ? 'working' : 'idle'
    else if (tile.activity === 'done') activity = roll < 0.35 ? 'working' : roll < 0.5 ? 'idle' : 'done'
    else if (tile.activity === 'waiting') activity = roll < 0.06 ? 'working' : 'waiting'
    else if (tile.agent && waiting < maxWaiting && roll < 0.1) activity = 'waiting'
    else if (roll < 0.3) activity = 'done'
    if (activity === 'waiting') waiting += 1
    if (tile.activity === 'waiting' && activity !== 'waiting') waiting -= 1
    next[index] = { ...tile, activity }
  }
  return next
}

export function AgentField() {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [tiles, setTiles] = useState(initialTiles)
  const [focus, setFocus] = useState<number | null>(null)
  const random = useRef(seededRandom(29))
  const timers = useRef<number[]>([])

  useInterval(() => setTiles((current) => evolve(current, random.current)), 1000, inView && !reduced)

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const waitingIndex = tiles.findIndex((tile) => tile.activity === 'waiting')

  const jump = useCallback(() => {
    if (waitingIndex < 0 || focus !== null) return
    setFocus(waitingIndex)
    timers.current.push(
      window.setTimeout(() => {
        setTiles((current) =>
          current.map((tile, index) =>
            index === waitingIndex ? { ...tile, activity: 'working' } : tile,
          ),
        )
      }, 1300),
      window.setTimeout(() => setFocus(null), 2600),
    )
  }, [waitingIndex, focus])

  // The real shortcuts work here too: ⌘J on a Mac, Ctrl+Alt+U on Linux.
  useEffect(() => {
    if (!inView) return
    const handleKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const mac = event.metaKey && !event.ctrlKey && !event.altKey && key === 'j'
      const linux = event.ctrlKey && event.altKey && !event.metaKey && key === 'u'
      if (!mac && !linux) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select')) return
      event.preventDefault()
      jump()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [inView, jump])

  const counts = { working: 0, waiting: 0, done: 0, idle: 0 }
  for (const tile of tiles) counts[tile.activity] += 1
  const pan =
    focus === null
      ? { x: 0, y: 0 }
      : { x: columns / 2 - (focus % columns) - 0.5, y: rows / 2 - Math.floor(focus / columns) - 0.5 }

  return (
    <figure className={styles.field} ref={figure}>
      <dl className={styles.hud} aria-hidden="true">
        <div>
          <dt>Tabs</dt>
          <dd>{tiles.length}</dd>
        </div>
        {(['working', 'waiting', 'done'] as const).map((activity) => (
          <div data-activity={activity} key={activity}>
            <dt>{activityLabels[activity]}</dt>
            <dd>{counts[activity]}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.viewport} aria-hidden="true">
        <div
          className={`${styles.plane} ${focus === null ? '' : styles.panning}`}
          style={{ '--dx': pan.x, '--dy': pan.y, '--columns': columns } as CSSProperties}
        >
          {tiles.map((tile, index) => (
            <div
              className={`${styles.tile} ${focus === index ? styles.focused : ''}`}
              data-activity={tile.activity}
              key={tile.title}
            >
              <StatusGlyph activity={tile.activity} />
              <span className={styles.tileTitle}>{tile.title}</span>
              <span className={styles.tileStatus}>{activityLabels[tile.activity]}</span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className={styles.caption}>
        <p>
          A busy workspace: {tiles.length} tabs, each showing what its agent is doing. The ones
          waiting on you also collect under Needs Attention.
        </p>
        <button
          className={styles.jump}
          type="button"
          onClick={jump}
          disabled={waitingIndex < 0 || focus !== null}
        >
          <span>{focus === null ? 'Jump to the one that needs you' : 'Answering…'}</span>
          <span className={styles.keys} aria-hidden="true">
            {(usesMacKeys ? ['⌘', 'J'] : ['Ctrl', 'Alt', 'U']).map((key) => (
              <kbd key={key}>{key}</kbd>
            ))}
          </span>
        </button>
      </figcaption>
    </figure>
  )
}
