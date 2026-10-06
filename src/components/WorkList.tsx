import { useRef, useState } from 'react'
import { productCatalog } from '../content/catalog'
import { workList } from '../content/home'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import styles from './WorkList.module.css'

const finalStep = workList.chores.length + 1

/**
 * A to-do list on a sheet of engineering paper. Once on screen it crosses off one chore at a time,
 * each handled by one of our products, then circles what's left: the work.
 */
export function WorkList() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  // How many items are done: chores crossed off, then the circle around the work.
  const [step, setStep] = useState(reduced ? finalStep : 0)

  useStageMotion(stage, !reduced)
  useInterval(() => setStep((current) => current + 1), 900, inView && step < finalStep)

  return (
    <div className={styles.stage} ref={stage}>
      <div className={styles.rig}>
        <div className={styles.sheetBehind} aria-hidden="true" />
        <section className={styles.sheet} aria-labelledby="work-list-heading">
          <header className={styles.header}>
            <h2 id="work-list-heading">{workList.heading}</h2>
            <span aria-hidden="true">Today</span>
          </header>
          <ol className={styles.items}>
            {workList.chores.map((chore, index) => {
              const product = productCatalog.find((item) => item.id === chore.product)
              if (!product) return null
              return (
                <li
                  className={styles.item}
                  data-done={step > index}
                  data-product={chore.product}
                  key={chore.product}
                >
                  <svg className={styles.box} viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M5.6 6.3c5.6-.7 11.2-.8 16.9-.4.6 5.4.6 10.8.3 16.2-5.6.6-11.2.5-16.9-.1-.5-5.2-.6-10.5-.3-15.7Z" />
                    <path className={styles.tick} pathLength="1" d="m8.4 14.6 3.9 4.2 9.4-10.6" />
                  </svg>
                  <s className={styles.chore}>
                    <span>{chore.text}</span>
                  </s>
                  <span className={styles.srOnly}>, handled by</span>
                  <a className={styles.product} href={product.path}>
                    <i aria-hidden="true" />
                    {product.name}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              )
            })}
            <li className={`${styles.item} ${styles.remaining}`} data-done={step >= finalStep}>
              <svg className={styles.box} viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M5.6 6.3c5.6-.7 11.2-.8 16.9-.4.6 5.4.6 10.8.3 16.2-5.6.6-11.2.5-16.9-.1-.5-5.2-.6-10.5-.3-15.7Z" />
              </svg>
              <span className={styles.work}>
                {workList.remaining}
                <svg viewBox="0 0 220 72" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    pathLength="1"
                    d="M172 9c-38-9-118-6-150 10C2 29 4 52 40 61c40 10 125 9 160-5 22-9 18-33-12-44-24-9-62-10-90-6"
                  />
                </svg>
              </span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
