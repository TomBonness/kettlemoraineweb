import { useEffect, useRef, type CSSProperties } from 'react'
import { easeVars, prefersReducedMotion } from '../lib/motion'
import styles from './CinmuxIcon3D.module.css'

const slices = 18

/** The Cinmux app icon as a solid tile that turns to face the pointer. */
export function CinmuxIcon3D() {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = stage.current
    if (!element || prefersReducedMotion()) return
    const vars = easeVars(element, { '--mx': 0, '--my': 0 }, 0.07)
    let visible = false
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
          })
    observer?.observe(element)

    const move = (event: PointerEvent) => {
      if (!visible || event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      const x = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2)
      const y = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2)
      vars.set({ '--mx': Math.max(-1, Math.min(1, x)), '--my': Math.max(-1, Math.min(1, y)) })
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => {
      document.removeEventListener('pointermove', move)
      observer?.disconnect()
      vars.stop()
    }
  }, [])

  return (
    <div className={styles.stage} ref={stage} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.float}>
        <div className={styles.body}>
          {Array.from({ length: slices }, (_, index) => (
            <span
              className={styles.slice}
              style={{ '--slice': index, '--slices': slices } as CSSProperties}
              key={index}
            />
          ))}
          <span className={styles.face}>
            <svg viewBox="10 10 108 108" fill="none">
              <rect
                className={styles.frame}
                x="27"
                y="31"
                width="74"
                height="66"
                rx="7"
                strokeWidth="5"
              />
              <path
                d="m41 49 13 13-13 13m24 1h20"
                stroke="#e6e8e5"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.shine} />
        </div>
      </div>
      <div className={styles.shadow} />
    </div>
  )
}
