import { useEffect, useRef, useState } from 'react'
import openMicroHome from '../assets/product/marketing/open-micro-home-960.webp'
import openMicroHomeLarge from '../assets/product/marketing/open-micro-home-1600.webp'
import { marketingRenders } from '../content/openMicro'
import { easeVars, prefersReducedMotion, useInView } from '../lib/motion'
import styles from './HomeCardMicro.module.css'

/**
 * The homepage Open Micro card's media: the real render floating over a brass and blue light pool,
 * leaning a few degrees toward the pointer. Hovering the card lifts it and slides in the exploded
 * render as a peek inside. The float only runs while the card is on screen.
 */
export function HomeCardMicro() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const element = stage.current
    if (!element || reduced) return
    const vars = easeVars(element, { '--hm-px': 0, '--hm-py': 0 }, 0.08)
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      vars.set({
        '--hm-px': Math.min(1, Math.max(-1, ((event.clientX - box.left) / box.width) * 2 - 1)),
        '--hm-py': Math.min(1, Math.max(-1, ((event.clientY - box.top) / box.height) * 2 - 1)),
      })
    }
    const leave = () => vars.set({ '--hm-px': 0, '--hm-py': 0 })
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      vars.stop()
    }
  }, [reduced])

  return (
    <div className={styles.stage} ref={stage} data-playing={inView && !reduced}>
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.tilt}>
        <div className={styles.lift}>
          <div className={styles.shadow} aria-hidden="true" />
          <img
            className={styles.product}
            src={openMicroHome}
            srcSet={`${openMicroHome} 960w, ${openMicroHomeLarge} 1600w`}
            width="1600"
            height="1190"
            alt="Art-directed concept visualization of Open Micro with twelve dark keys, a push encoder, and a softly illuminated smoked wall"
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1050px) calc(100vw - 96px), (max-width: 1280px) 60vw, 720px"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <figure className={styles.peek} aria-hidden="true">
        <img
          src={marketingRenders.exploded.src}
          srcSet={marketingRenders.exploded.srcSet}
          width={marketingRenders.exploded.width}
          height={marketingRenders.exploded.height}
          sizes="220px"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <figcaption>Inside · exploded render</figcaption>
      </figure>
    </div>
  )
}
