import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { headings, lifecycleStates, productCopy } from '../content/openMicro'
import styles from './LifecycleDemo.module.css'

export function LifecycleDemo() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(!document.hidden)
  const rootRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const activeState = lifecycleStates[activeIndex]

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleVisibility = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || !inView || paused || !documentVisible) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % lifecycleStates.length)
    }, 2400)
    return () => window.clearInterval(timer)
  }, [documentVisible, inView, paused, prefersReducedMotion])

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
  }

  const lightStyle = {
    '--state-color': activeState.color,
    '--state-period': `${Math.max(activeState.period, 1)}ms`,
  } as CSSProperties

  return (
    <section className="section sectionDark" aria-labelledby="lifecycle-title">
      <div
        className={`sectionInner ${styles.layout}`}
        ref={rootRef}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={handleBlur}
      >
        <div className={styles.intro}>
          <p className="eyebrow eyebrowDark">{productCopy.lifecycleEyebrow}</p>
          <h2 id="lifecycle-title">{headings.lifecycle}</h2>
          <p className="sectionLead sectionLeadDark">{productCopy.lifecycleLead}</p>
        </div>

        <div className={styles.demo}>
          <div className={styles.device} aria-hidden="true">
            <div className={styles.deviceGrid}>
              {Array.from({ length: 6 }, (_, index) => (
                <span
                  className={`${styles.agentLight} ${styles[activeState.effect]}`}
                  style={lightStyle}
                  key={index}
                />
              ))}
            </div>
            <div className={styles.stateReadout}>
              <span style={{ backgroundColor: activeState.color }} />
              <strong>{activeState.name}</strong>
              <small>{activeState.timing}</small>
            </div>
          </div>

          <div className={styles.stateCopy} aria-live="polite" aria-atomic="true">
            <p>{activeState.description}</p>
          </div>

          <div className={styles.states} aria-label={productCopy.lifecycleControlLabel}>
            {lifecycleStates.map((state, index) => (
              <button
                type="button"
                key={state.id}
                className={index === activeIndex ? styles.active : undefined}
                aria-pressed={index === activeIndex}
                onPointerEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span style={{ backgroundColor: state.color }} aria-hidden="true" />
                {state.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
