import { useEffect, useRef, useState, type RefObject } from 'react'

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/** Whether the visitor's keyboard has ⌘ and ⌥, so demos show the Mac shortcuts. */
export const usesMacKeys = /Mac|iPhone|iPad/.test(navigator.userAgent)

/** Whether the element is on screen. Without IntersectionObserver it never is, so demos stay still. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}

/** Runs `callback` every `delay` ms while `active`, always calling the latest callback. */
export function useInterval(callback: () => void, delay: number, active: boolean) {
  const latest = useRef(callback)

  useEffect(() => {
    latest.current = callback
  }, [callback])

  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => latest.current(), delay)
    return () => window.clearInterval(id)
  }, [delay, active])
}

export type EasedVars = {
  /** Eases toward these values, one animation frame at a time. */
  set: (values: Record<string, number>) => void
  stop: () => void
}

/**
 * Writes numeric CSS custom properties on `target`, easing each toward its goal so pointer and
 * scroll input feel physical without re-rendering React on every frame.
 */
export function easeVars(
  target: HTMLElement,
  initial: Record<string, number>,
  ease = 0.1,
): EasedVars {
  const current = { ...initial }
  const goal = { ...initial }
  let frame = 0

  const write = () => {
    for (const [name, value] of Object.entries(current)) {
      target.style.setProperty(name, value.toFixed(4))
    }
  }

  const step = () => {
    let moving = false
    for (const name of Object.keys(goal)) {
      const distance = goal[name] - current[name]
      if (Math.abs(distance) > 0.0005) {
        current[name] += distance * ease
        moving = true
      } else {
        current[name] = goal[name]
      }
    }
    write()
    frame = moving ? requestAnimationFrame(step) : 0
  }

  write()

  return {
    set(values) {
      Object.assign(goal, values)
      if (!frame) frame = requestAnimationFrame(step)
    },
    stop() {
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}

/**
 * Drives a 3D stage with eased CSS custom properties on `ref`:
 * - `--progress`: 0 → 1 as the stage scrolls up to near the top of the viewport. A stage that is
 *   already on screen when the page opens starts at 0 at the top of the page; one further down
 *   starts at 0 as it enters the viewport.
 * - `--intro`: 1 → 0 once, as the stage first appears.
 * - `--mx` / `--my`: the pointer, -1…1 across the stage (mouse and pen only).
 */
export function useStageMotion(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const element = ref.current
    if (!element || !active) return
    const startTop = Math.min(
      window.innerHeight,
      element.getBoundingClientRect().top + window.scrollY,
    )
    const progress = () => {
      const end = window.innerHeight * 0.12
      const travelled = startTop - element.getBoundingClientRect().top
      return Math.min(1, Math.max(0, travelled / Math.max(1, startTop - end)))
    }
    const vars = easeVars(element, { '--progress': progress(), '--intro': 1, '--mx': 0, '--my': 0 })
    vars.set({ '--intro': 0 })

    const scroll = () => vars.set({ '--progress': progress() })
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width) * 2 - 1
      const y = ((event.clientY - box.top) / Math.min(box.height, window.innerHeight)) * 2 - 1
      vars.set({ '--mx': Math.min(1, Math.max(-1, x)), '--my': Math.min(1, Math.max(-1, y)) })
    }

    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    document.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
      document.removeEventListener('pointermove', move)
      vars.stop()
    }
  }, [ref, active])
}
