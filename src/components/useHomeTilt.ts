import { useEffect, type RefObject } from 'react'
import { easeVars, prefersReducedMotion } from '../lib/motion'

/**
 * Tilts a homepage stage toward the pointer while it's over the stage's card (the closest link,
 * or the stage itself): writes eased `--hm-tx` / `--hm-ty` (-1…1) and `--hm-hover` (0…1) on `ref`.
 * Mouse and pen only; with reduced motion the stage stays still.
 */
export function useHomeTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return
    const card = element.closest('a') ?? element
    const vars = easeVars(element, { '--hm-tx': 0, '--hm-ty': 0, '--hm-hover': 0 }, 0.08)

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width) * 2 - 1
      const y = ((event.clientY - box.top) / box.height) * 2 - 1
      vars.set({
        '--hm-tx': Math.max(-1, Math.min(1, x)),
        '--hm-ty': Math.max(-1, Math.min(1, y)),
        '--hm-hover': 1,
      })
    }
    const leave = () => vars.set({ '--hm-tx': 0, '--hm-ty': 0, '--hm-hover': 0 })
    const focus = () => vars.set({ '--hm-hover': 1 })

    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('focus', focus)
    card.addEventListener('blur', leave)
    return () => {
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('focus', focus)
      card.removeEventListener('blur', leave)
      vars.stop()
    }
  }, [ref])
}
