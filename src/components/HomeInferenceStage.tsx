import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { peakTokensPerSecond, raceFile } from '../content/inference'
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './HomeInferenceStage.module.css'
import { useHomeTilt } from './useHomeTilt'

const peak = Math.floor(peakTokensPerSecond)
const lensRings = 7

/** Words from the file the Cinference page races through, streaming through the lens. */
const tokens = [...new Set(raceFile.match(/[A-Za-z_][\w.]{2,}/g) ?? [])]
  .slice(0, 26)
  .map((text, index) => {
    const angle = index * 2.399963
    const radius = 70 + ((index * 37) % 150)
    return {
      text,
      style: {
        '--hm-x': `${Math.round(Math.cos(angle) * radius * 1.35)}px`,
        '--hm-y': `${Math.round(Math.sin(angle) * radius)}px`,
        animationDelay: `${(index * -0.37).toFixed(2)}s`,
      } as CSSProperties,
    }
  })

/** The peak decode rate behind a glowing lens, with code tokens streaming through it. */
export function HomeInferenceStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [count, setCount] = useState(reduced ? peak : 0)
  const counted = useRef(reduced)
  useHomeTilt(stage)

  // Counts up to the peak rate the first time the stage comes into view.
  useEffect(() => {
    if (!inView || counted.current) return
    counted.current = true
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1600)
      setCount(Math.round(peak * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => {
      cancelAnimationFrame(frame)
      setCount(peak)
    }
  }, [inView])

  return (
    <div
      className={`${styles.stage} ${reduced ? styles.still : ''}`}
      data-playing={inView && !reduced ? '' : undefined}
      ref={stage}
    >
      <div className={styles.rig} aria-hidden="true">
        {Array.from({ length: lensRings }, (_, index) => (
          <span
            className={styles.lens}
            style={{ '--hm-i': index } as CSSProperties}
            key={index}
          />
        ))}
        {tokens.map((token) => (
          <span className={styles.token} style={token.style} key={token.text}>
            {token.text}
          </span>
        ))}
      </div>
      <div className={styles.metric}>
        <span className={styles.value}>{count}</span>
        <small>tokens per second on one RTX 5090</small>
      </div>
    </div>
  )
}
