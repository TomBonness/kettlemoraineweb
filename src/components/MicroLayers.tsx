import { useEffect, useRef, useState } from 'react'
import { explodedLayers } from '../content/openMicro'
import { easeVars, prefersReducedMotion } from '../lib/motion'
import { MicroDevice } from './MicroDevice'
import styles from './MicroLayers.module.css'

const steps = explodedLayers.length

/** Where the visitor is in the track, 0 → 1 as it scrolls past the sticky stage. */
function trackProgress(track: HTMLElement) {
  const box = track.getBoundingClientRect()
  const travel = box.height - window.innerHeight
  return Math.min(1, Math.max(0, -box.top / Math.max(1, travel)))
}

/**
 * The exploded view, driven by scroll: the model peels apart from the keycaps down, one layer per
 * step, while the matching caption lights up. Captions jump to their step.
 */
export function MicroLayers() {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const element = track.current
    const target = stage.current
    if (!element || !target || reduced) return

    // Gap k (0 = keycaps above the controls … 3 = wall above the base) opens during step k.
    const lifts = (progress: number) => {
      const at = progress * steps
      const gaps = [0, 1, 2, 3].map((gap) => Math.min(1, Math.max(0, (at - gap) / 0.7)))
      return {
        '--om-lift-1': gaps[3],
        '--om-lift-2': gaps[3] + gaps[2],
        '--om-lift-3': gaps[3] + gaps[2] + gaps[1],
        '--om-lift-4': gaps[3] + gaps[2] + gaps[1] + gaps[0],
        '--om-scroll-turn': progress,
      }
    }
    const vars = easeVars(target, lifts(trackProgress(element)), 0.12)
    const update = () => {
      const progress = trackProgress(element)
      vars.set(lifts(progress))
      setStep(Math.min(steps - 1, Math.floor(progress * steps)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      vars.stop()
    }
  }, [reduced])

  const jump = (index: number) => {
    const element = track.current
    if (!element) return
    const travel = element.offsetHeight - window.innerHeight
    const top = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((index + 0.45) / steps) * travel })
  }

  return (
    <div className={`${styles.track} ${reduced ? styles.still : ''}`} ref={track}>
      <div className={styles.sticky}>
        <div className={styles.stage} ref={stage}>
          <div className={styles.glow} aria-hidden="true" />
          <div
            className={styles.rig}
            role="img"
            aria-label="The Open Micro concept model separating into its five layers, from the keycaps down to the aluminum base"
          >
            <MicroDevice className={styles.device} internals focus={reduced ? null : step} />
          </div>
        </div>

        <ol className={styles.captions}>
          {explodedLayers.map((layer, index) => (
            <li key={layer.title} data-active={reduced || index === step}>
              <h3 className={styles.heading}>
                {reduced ? (
                  <span className={styles.label}>
                    <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                    {layer.title}
                  </span>
                ) : (
                  <button
                    className={styles.label}
                    type="button"
                    aria-current={index === step ? 'step' : undefined}
                    onClick={() => jump(index)}
                  >
                    <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                    {layer.title}
                  </button>
                )}
              </h3>
              <div className={styles.body}>
                <p>{layer.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
