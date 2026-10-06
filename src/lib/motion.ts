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
  /** Moves to these values immediately. */
  jump: (values: Record<string, number>) => void
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
    jump(values) {
      Object.assign(goal, values)
      Object.assign(current, values)
      write()
    },
    stop() {
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
