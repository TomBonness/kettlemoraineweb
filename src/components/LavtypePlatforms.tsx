import { useEffect, useRef } from 'react'
import { platformDetails } from '../content/lavtype'
import { easeVars, prefersReducedMotion } from '../lib/motion'
import styles from './LavtypePlatforms.module.css'

const platforms = [
  {
    id: 'macos',
    name: 'macOS',
    kind: 'DMG download',
    badge: '13+',
    details: platformDetails.slice(0, 3),
  },
  {
    id: 'linux',
    name: 'Linux',
    kind: 'AppImage download',
    badge: 'X11',
    details: platformDetails.slice(3, 6),
  },
] as const

type Platform = (typeof platforms)[number]

function PlatformCard({ platform }: { platform: Platform }) {
  const card = useRef<HTMLElement>(null)

  // The card turns toward the pointer while it's over it, and settles back when it leaves.
  useEffect(() => {
    const element = card.current
    if (!element || prefersReducedMotion()) return
    const vars = easeVars(element, { '--tx': 0, '--ty': 0, '--hover': 0 }, 0.12)
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      vars.set({
        '--tx': ((event.clientX - box.left) / box.width) * 2 - 1,
        '--ty': ((event.clientY - box.top) / box.height) * 2 - 1,
        '--hover': 1,
      })
    }
    const leave = () => vars.set({ '--tx': 0, '--ty': 0, '--hover': 0 })
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      vars.stop()
    }
  }, [])

  return (
    <article
      className={styles.card}
      data-platform={platform.id}
      ref={card}
      aria-labelledby={`lavtype-${platform.id}-title`}
    >
      <span className={styles.plate} aria-hidden="true" />
      <span className={styles.plate} aria-hidden="true" />
      <div className={styles.face}>
        <span className={styles.badge} aria-hidden="true">
          {platform.badge}
        </span>
        <div className={styles.heading}>
          <h3 id={`lavtype-${platform.id}-title`}>{platform.name}</h3>
          <span>{platform.kind}</span>
        </div>
        <dl className={styles.details}>
          {platform.details.map(([term, detail]) => (
            <div data-unsupported={term === 'Unsupported'} key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

/** The macOS and Linux requirements as two cards opened like a book, each turning to the pointer. */
export function LavtypePlatforms() {
  return (
    <div className={styles.platforms}>
      {platforms.map((platform) => (
        <PlatformCard platform={platform} key={platform.id} />
      ))}
    </div>
  )
}
