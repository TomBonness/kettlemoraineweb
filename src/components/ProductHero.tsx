import type { ReactNode } from 'react'
import styles from './ProductHero.module.css'

type HeroLink = { label: string; href: string }

type ProductHeroProps = {
  title: string
  titleId: string
  /** One serif line under the title; an `<em>` inside it takes the product gradient. */
  statement: ReactNode
  lead: ReactNode
  primary: HeroLink
  secondary: HeroLink
  baseline: readonly string[]
  /** The 3D centerpiece, full width below the copy. */
  children: ReactNode
}

/**
 * The dark product hero: title, statement and actions over a perspective grid floor, then the
 * product's 3D centerpiece. Render it inside an element that sets the product palette:
 * `--product-gradient`, `--product-glow-a`, `--product-glow-b` and `--product-hover`.
 * Long titles can set `--hero-title-size` and `--hero-title-size-small` (≤ 767px).
 */
export function ProductHero({
  title,
  titleId,
  statement,
  lead,
  primary,
  secondary,
  baseline,
  children,
}: ProductHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.floor} />
      </div>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            <h1 id={titleId}>{title}</h1>
            <p className={styles.statement}>{statement}</p>
          </div>
          <div>
            <p className={styles.lead}>{lead}</p>
            <div className={styles.actions}>
              <a className={`button ${styles.primary}`} href={primary.href}>
                {primary.label}{' '}
                <span aria-hidden="true">{primary.href.startsWith('#') ? '↓' : '↗'}</span>
              </a>
              <a className={styles.secondary} href={secondary.href}>
                {secondary.label}{' '}
                <span aria-hidden="true">{secondary.href.startsWith('#') ? '↓' : '↗'}</span>
              </a>
            </div>
          </div>
        </div>
        {children}
        <div className={styles.baseline}>
          {baseline.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
