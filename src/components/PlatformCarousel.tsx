import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { cinmuxCommands, platforms } from '../content/cinmux'
import { CopyCommand } from './CopyCommand'
import styles from './PlatformCarousel.module.css'

const screenCaptions = {
  linux: 'Linux · Wayland',
  macos: 'macOS 15+',
  tui: 'cinmux tui · over SSH',
} as const

export function PlatformCarousel() {
  // Start on the middle screen so the arc is balanced on both sides.
  const [active, setActive] = useState(Math.floor(platforms.length / 2))
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: platforms.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = (moves[event.key] + platforms.length) % platforms.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.stage}>
        {platforms.map((platform, index) => {
          const offset = index - active
          return (
            <figure
              className={`${styles.screen} ${styles[platform.id]}`}
              data-active={offset === 0}
              key={platform.id}
              aria-hidden={offset !== 0}
              onClick={() => setActive(index)}
              style={
                {
                  '--offset': offset,
                  '--distance': Math.abs(offset),
                  '--side': Math.sign(offset),
                } as CSSProperties
              }
            >
              <div className={styles.frame}>
                <img
                  src={platform.image.src}
                  srcSet={platform.image.srcSet}
                  sizes="(max-width: 767px) 92vw, 760px"
                  width={platform.image.width}
                  height={platform.image.height}
                  alt={platform.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>{screenCaptions[platform.id]}</figcaption>
            </figure>
          )
        })}
      </div>

      <div className={styles.details}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Where Cinmux runs"
          onKeyDown={handleKey}
        >
          {platforms.map((platform, index) => (
            <button
              type="button"
              role="tab"
              id={`platform-tab-${platform.id}`}
              aria-selected={index === active}
              aria-controls={`platform-panel-${platform.id}`}
              tabIndex={index === active ? 0 : -1}
              key={platform.id}
              ref={(element) => {
                tabs.current[index] = element
              }}
              onClick={() => setActive(index)}
            >
              {platform.label}
            </button>
          ))}
        </div>

        {platforms.map((platform, index) => (
          <div
            className={styles.panel}
            role="tabpanel"
            id={`platform-panel-${platform.id}`}
            aria-labelledby={`platform-tab-${platform.id}`}
            hidden={index !== active}
            key={platform.id}
          >
            <div>
              <h3>{platform.title}</h3>
              <p>{platform.body}</p>
            </div>
            <ul>
              {platform.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            {platform.id === 'tui' && (
              <div className={styles.command}>
                <CopyCommand command={cinmuxCommands.ssh} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
