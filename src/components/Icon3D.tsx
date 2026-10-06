import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { easeVars, prefersReducedMotion } from '../lib/motion'
import styles from './Icon3D.module.css'

const slices = 18

type Icon3DProps = {
  /** The icon artwork, drawn on the tile's face. */
  children: ReactNode
  /** Sets the palette: `--icon-face`, `--icon-edge`, `--icon-edge-deep`, `--icon-glow-a`, `--icon-glow-b`. */
  className?: string
}

/** An app icon as a solid, floating tile that turns to face the pointer. Decorative. */
export function Icon3D({ children, className = '' }: Icon3DProps) {
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
    <div className={`${styles.stage} ${className}`} ref={stage} aria-hidden="true">
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
          <span className={styles.face}>{children}</span>
          <span className={styles.shine} />
        </div>
      </div>
      <div className={styles.shadow} />
    </div>
  )
}
