import { useRef, useState, type CSSProperties } from 'react'
import { omarchyThemes, persistentSessions, type Activity } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval, usesMacKeys } from '../lib/motion'
import { CinmuxWindow, Ink, Pane, Prompt, TerminalLine } from './CinmuxWindow'
import styles from './SessionDemo.module.css'

const [gruvbox] = omarchyThemes
const crates = 540
const tickSeconds = 0.25
const crateNames = [
  'proc-macro2 v1.0.101',
  'serde v1.0.228',
  'libc v0.2.177',
  'tokio v1.48.0',
  'hyper v1.7.0',
  'tower v0.5.2',
  'sqlx-core v0.8.6',
  'rustls v0.23.32',
  'serde_json v1.0.145',
  'tracing v0.1.41',
  'axum v0.8.6',
  'chrono v0.4.42',
  'jsonwebtoken v9.3.1',
  'reqwest v0.12.24',
  'uuid v1.18.1',
  'regex v1.12.2',
]

/** What each session is doing `ticks` quarter-seconds after the demo started. */
function sessionState(ticks: number) {
  const built = 120 + ((ticks * 3) % (crates - 120))
  return {
    built,
    bar: `${'='.repeat(Math.floor((built / crates) * 18))}>`.padEnd(19, ' '),
    // The newest few lines of the build log scroll by as the build progresses.
    log: Array.from({ length: 9 }, (_, line) => crateNames[(built + line) % crateNames.length]),
    requests: 1204 + Math.floor(ticks * 1.75),
    turn: 12 + Math.floor((ticks * tickSeconds) / 7),
    run: 19 + Math.floor((ticks * tickSeconds) / 5),
  }
}

export function SessionDemo() {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [open, setOpen] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [ticks, setTicks] = useState(0)

  useInterval(() => setTicks((current) => current + 1), tickSeconds * 1000, inView && !reduced)
  useInterval(() => setOpen((current) => !current), 4600, inView && autoplay && !reduced)

  const state = sessionState(ticks)
  const activities: Record<(typeof persistentSessions)[number]['id'], Activity> = {
    build: 'working',
    server: 'idle',
    agent: 'working',
    tests: 'done',
  }
  const details = {
    build: `Building ${state.built}/${crates}`,
    server: `${state.requests.toLocaleString('en-US')} requests served`,
    agent: `Turn ${state.turn} · running checks`,
    tests: `48 passed · run ${state.run}`,
  }

  return (
    <figure className={`${styles.demo} ${open ? '' : styles.closed}`} ref={figure}>
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.server}>
            <div className={styles.serverHeader}>
              <span className={styles.serverDot} />
              Cinmux’s private tmux server
              <span className={styles.serverState}>{open ? 'Attached' : 'Still running'}</span>
            </div>
            <ol className={styles.sessions}>
              {persistentSessions.map((session) => (
                <li key={session.id} data-activity={activities[session.id]}>
                  <span className={styles.pulse} />
                  <span className={styles.sessionTitle}>{session.title}</span>
                  <code>{session.command}</code>
                  <span className={styles.sessionDetail}>{details[session.id]}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.window} aria-hidden={!open}>
            <CinmuxWindow
              label="The Cinmux window with four tabs: a build, a dev server, an agent and a test watcher"
              theme={gruvbox}
              compact
              selectedId="build"
              style={{ '--cw-design': 1000, '--cw-aspect': '1000 / 560' } as CSSProperties}
              tabs={persistentSessions.map((session) => ({
                id: session.id,
                title: session.title,
                activity: activities[session.id],
              }))}
              panes={
                <Pane active>
                  <Prompt directory="api" branch="main">
                    cargo build --release
                  </Prompt>
                  {state.log.map((crate, line) => (
                    <TerminalLine key={line}>
                      <Ink tone="green">   Compiling</Ink> {crate}
                    </TerminalLine>
                  ))}
                  <TerminalLine>
                    <Ink tone="cyan">    Building</Ink> [{state.bar}] {state.built}/{crates}
                  </TerminalLine>
                </Pane>
              }
            />
          </div>
        </div>
      </div>

      <figcaption className={styles.controls}>
        <button
          className={styles.toggle}
          type="button"
          onClick={() => {
            setAutoplay(false)
            setOpen((current) => !current)
          }}
        >
          <span>{open ? 'Quit Cinmux' : 'Open Cinmux'}</span>
          {open && (
            <span className={styles.keys} aria-hidden="true">
              {(usesMacKeys ? ['⌘', 'Q'] : ['Ctrl', 'Shift', 'Q']).map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </span>
          )}
        </button>
        <p className={styles.status} aria-live={autoplay ? 'off' : 'polite'}>
          <span className={styles.pulse} />
          {open
            ? `Cinmux is open. ${persistentSessions.length} sessions running.`
            : `Cinmux is closed. All ${persistentSessions.length} sessions are still running.`}
        </p>
      </figcaption>
    </figure>
  )
}
