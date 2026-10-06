import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { productCatalog, type ProductId } from '../content/catalog'
import { workList } from '../content/home'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import { CinmuxPiece, InferencePiece, LavtypePiece, OpenMicroPiece } from './HomeHeroPieces'
import styles from './HomeHeroStage.module.css'

const choreCount = workList.chores.length
/** Every chore is crossed off, then the work is circled, then the last piece settles. */
const circledStep = choreCount + 1
const finalStep = choreCount + 2

/** Where each piece settles: `top` pieces sit above and left of the note, `bottom` ones below. */
const pieceLayout: Record<ProductId, { group: 'top' | 'bottom'; depth: number }> = {
  'open-micro': { group: 'top', depth: 150 },
  inference: { group: 'top', depth: 110 },
  cinmux: { group: 'bottom', depth: 95 },
  lavtype: { group: 'bottom', depth: 65 },
}

/** The element's layout offset inside `root`, ignoring transforms. */
function offsetIn(element: HTMLElement, root: HTMLElement) {
  let x = element.offsetWidth / 2
  let y = element.offsetHeight / 2
  let current: HTMLElement | null = element
  while (current && current !== root) {
    x += current.offsetLeft
    y += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return { x, y }
}

/**
 * A to-do note on a pad of engineering paper. Once on screen it crosses off one chore at a time;
 * each chore's product lifts off the page and settles beside the note at its own depth. Then it
 * circles what's left: the work.
 */
export function HomeHeroStage() {
  const stage = useRef<HTMLDivElement>(null)
  const rig = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.3)
  const [reduced] = useState(prefersReducedMotion)
  const [step, setStep] = useState(reduced ? finalStep : 0)
  const [hot, setHot] = useState<ProductId | null>(null)

  useStageMotion(stage, !reduced)
  useInterval(() => setStep((current) => current + 1), 1100, inView && step < finalStep)

  // Each piece starts flat on the page, on its product pill, and rises from there.
  useEffect(() => {
    const root = rig.current
    if (!root) return
    const measure = () => {
      for (const piece of root.querySelectorAll<HTMLElement>('[data-piece]')) {
        const pill = root.querySelector<HTMLElement>(`[data-pill="${piece.dataset.piece}"]`)
        if (!pill) continue
        const from = offsetIn(pill, root)
        const to = offsetIn(piece, root)
        piece.style.setProperty('--hm-fx', `${Math.round(from.x - to.x)}px`)
        piece.style.setProperty('--hm-fy', `${Math.round(from.y - to.y)}px`)
      }
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const pieceVisual = (product: ProductId, landed: boolean): ReactNode => {
    if (product === 'open-micro') return <OpenMicroPiece />
    if (product === 'lavtype') return <LavtypePiece landed={landed} />
    if (product === 'inference') return <InferencePiece landed={landed} />
    return <CinmuxPiece phase={step < circledStep ? 0 : step < finalStep ? 1 : 2} />
  }

  const pieces = (group: 'top' | 'bottom') => (
    <div className={styles.group} data-group={group} aria-hidden="true">
      {workList.chores.map((chore, index) => {
        const layout = pieceLayout[chore.product]
        const product = productCatalog.find((item) => item.id === chore.product)
        if (layout.group !== group || !product) return null
        const lifted = step > index
        return (
          <a
            className={styles.piece}
            href={product.path}
            tabIndex={-1}
            data-piece={chore.product}
            data-lifted={lifted}
            data-hot={hot === chore.product}
            style={{ '--hm-depth': layout.depth } as CSSProperties}
            onPointerEnter={() => setHot(chore.product)}
            onPointerLeave={() => setHot(null)}
            key={chore.product}
          >
            <span className={styles.shadow} />
            <span className={styles.lift}>{pieceVisual(chore.product, lifted)}</span>
          </a>
        )
      })}
    </div>
  )

  return (
    <div
      className={styles.stage}
      ref={stage}
      data-settled={step >= finalStep}
      data-in-view={inView}
      // The first click, tap or focus inside stops the autoplay at its finished state.
      onPointerDown={() => setStep(finalStep)}
      onFocus={() => setStep(finalStep)}
    >
      <div className={styles.rig} ref={rig}>
        <div className={styles.desk} aria-hidden="true" />
        {pieces('top')}
        <div className={styles.pad}>
          <span className={styles.binding} aria-hidden="true" />
          <section className={styles.sheet} aria-labelledby="work-list-heading">
            <h2 id="work-list-heading">{workList.heading}</h2>
            <ol className={styles.items}>
              {workList.chores.map((chore, index) => {
                const product = productCatalog.find((item) => item.id === chore.product)
                if (!product) return null
                return (
                  <li
                    className={styles.item}
                    data-done={step > index}
                    data-hot={hot === chore.product}
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
                    <a
                      className={styles.product}
                      href={product.path}
                      onPointerEnter={() => setHot(chore.product)}
                      onPointerLeave={() => setHot(null)}
                      onFocus={() => setHot(chore.product)}
                      onBlur={() => setHot(null)}
                      data-pill={chore.product}
                    >
                      <i aria-hidden="true" />
                      {product.name}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )
              })}
              <li className={`${styles.item} ${styles.remaining}`} data-done={step >= circledStep}>
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
        {pieces('bottom')}
      </div>
    </div>
  )
}
