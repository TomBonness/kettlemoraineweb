import { useRef, useState, type CSSProperties } from 'react'
import { omarchyThemes, searchSessions, searchSuggestions } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { StatusBadge, windowThemeStyle } from './CinmuxWindow'
import styles from './SearchDemo.module.css'

const [gruvbox] = omarchyThemes
// Typed out in turn until the visitor searches for themselves; repeats are pauses.
const typingScript = searchSuggestions.flatMap((word) => [
  ...Array.from(word, (_, index) => word.slice(0, index + 1)),
  ...Array<string>(8).fill(word),
  ...Array<string>(3).fill(''),
])

function Highlight({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query) : -1
  if (start < 0) return text
  return (
    <>
      {text.slice(0, start)}
      <mark>{text.slice(start, start + query.length)}</mark>
      {text.slice(start + query.length)}
    </>
  )
}

export function SearchDemo() {
  const panel = useRef<HTMLDivElement>(null)
  const inView = useInView(panel, 0.4)
  const [reduced] = useState(prefersReducedMotion)
  const [query, setQuery] = useState('')
  const [autoplay, setAutoplay] = useState(true)
  const [frame, setFrame] = useState(0)

  useInterval(
    () => {
      const next = (frame + 1) % typingScript.length
      setFrame(next)
      setQuery(typingScript[next])
    },
    170,
    inView && autoplay && !reduced,
  )

  const needle = query.trim().toLowerCase()
  const matches = searchSessions.map(
    (session) =>
      !needle ||
      [session.title, session.directory, session.branch].some((field) =>
        field.toLowerCase().includes(needle),
      ),
  )
  const count = matches.filter(Boolean).length

  return (
    <div
      className={styles.panel}
      style={{ ...windowThemeStyle(gruvbox), '--u': '1px' } as CSSProperties}
      ref={panel}
    >
      <div className={styles.searchRow}>
        <label
          className={`${styles.field} ${autoplay && inView && !reduced ? styles.typing : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm4.8 11.3 4.7 4.7" />
          </svg>
          <input
            type="search"
            value={query}
            placeholder="Search sessions"
            aria-label="Search the example tabs by title, directory or branch"
            aria-controls="cinmux-search-results"
            autoComplete="off"
            spellCheck={false}
            onFocus={() => {
              // The typing demo hands over to the visitor with an empty field.
              if (autoplay) setQuery('')
              setAutoplay(false)
            }}
            onChange={(event) => {
              setAutoplay(false)
              setQuery(event.currentTarget.value)
            }}
          />
        </label>
        <span className={styles.count} aria-live={autoplay ? 'off' : 'polite'}>
          {count} of {searchSessions.length}
        </span>
      </div>

      <div className={styles.suggestions}>
        <span>Try</span>
        {searchSuggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            aria-pressed={!autoplay && needle === suggestion}
            onClick={() => {
              setAutoplay(false)
              setQuery(needle === suggestion ? '' : suggestion)
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <ul className={styles.results} id="cinmux-search-results">
        {searchSessions.map((session, index) => (
          <li key={session.title} data-match={matches[index]} aria-hidden={!matches[index]}>
            <div className={styles.result}>
              <span className={styles.title}>
                <Highlight text={session.title} query={needle} />
              </span>
              <StatusBadge activity={session.activity} />
              <span className={styles.meta}>
                {'folder' in session && (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5.5 4.5h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-10.5a2 2 0 0 1 2-2Z" />
                    </svg>
                    {session.folder}
                    <i aria-hidden="true">·</i>
                  </>
                )}
                <Highlight text={session.directory} query={needle} />
                <i aria-hidden="true">·</i>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm12-12a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM6 7v10m12-8c0 5-7 3.5-11.5 8" />
                </svg>
                <Highlight text={session.branch} query={needle} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
