import { useEffect, useRef, useState } from 'react'
import { markShape } from '../content/brand'
import { createMarkScene, type MarkScene } from '../lib/markScene'
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './HomeMark.module.css'

/**
 * The homepage hero's centrepiece: the KMRL mark as a machined object around a glowing core, drawn
 * in WebGL2. Where WebGL2 isn't available it's the flat mark, in light grey on the dark hero.
 */
export function HomeMark() {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const inView = useInView(host, 0.05)
  const [scene, setScene] = useState<MarkScene | null>(null)
  const [flat, setFlat] = useState(() => !('WebGL2RenderingContext' in window))

  useEffect(() => {
    if (flat || !canvas.current) return
    const created = createMarkScene(canvas.current, {
      still: prefersReducedMotion(),
      onLost: () => setFlat(true),
    })
    if (!created) {
      setFlat(true)
      return
    }
    setScene(created)
    return () => {
      created.dispose()
      setScene(null)
    }
  }, [flat])

  useEffect(() => {
    scene?.setActive(inView)
  }, [scene, inView])

  return (
    <div className={styles.mark} ref={host} data-flat={flat} aria-hidden="true">
      <span className={styles.halo} />
      {flat ? (
        <svg className={styles.flat} viewBox={`0 0 ${markShape.size} ${markShape.size}`}>
          {markShape.segments.map((d) => (
            <path d={d} key={d} />
          ))}
          <circle cx={markShape.dot.cx} cy={markShape.dot.cy} r={markShape.dot.r} />
        </svg>
      ) : (
        <canvas className={styles.canvas} ref={canvas} />
      )}
    </div>
  )
}
