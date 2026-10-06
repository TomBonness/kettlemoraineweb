import { useRef, type CSSProperties, type ReactNode } from 'react'
import { connectivityCards } from '../content/openMicro'
import { useInView } from '../lib/motion'
import styles from './MicroConnect.module.css'

type Size = { w: number; d: number; h: number; x?: number; y?: number; z?: number }

/** A solid block lying on the icon's floor: a top face and four sides, sized in px. */
function Block({ className, size, children }: { className: string; size: Size; children?: ReactNode }) {
  const { w, d, h, x = 0, y = 0, z = 0 } = size
  return (
    <span
      className={`${styles.block} ${className}`}
      style={{ '--bw': `${w}px`, '--bd': `${d}px`, '--bh': `${h}px`, '--bx': `${x}px`, '--by': `${y}px`, '--bz': `${z}px` } as CSSProperties}
    >
      <span className={styles.north} />
      <span className={styles.east} />
      <span className={styles.south} />
      <span className={styles.west} />
      <span className={styles.top}>{children}</span>
    </span>
  )
}

const icons: Record<(typeof connectivityCards)[number]['label'], ReactNode> = {
  'USB-C': (
    <>
      <Block className={styles.body} size={{ w: 74, d: 46, h: 20, x: -37, y: -44 }}>
        <span className={styles.port} />
        <span className={styles.statusLed} />
      </Block>
      <span className={styles.plug}>
        <Block className={styles.tip} size={{ w: 16, d: 14, h: 6, x: -8, y: -2, z: 7 }} />
        <Block className={styles.overmold} size={{ w: 22, d: 26, h: 10, x: -11, y: 12, z: 5 }} />
        <Block className={styles.cable} size={{ w: 8, d: 40, h: 6, x: -4, y: 38, z: 7 }} />
      </span>
    </>
  ),
  Bluetooth: (
    <>
      {[0, 1, 2, 3, 4].map((profile) => (
        <Block
          className={styles.profile}
          size={{ w: 62, d: 62, h: 3, x: -31, y: -31, z: profile * 12 - 26 }}
          key={profile}
        >
          <span className={styles.profileNumber} style={{ '--profile': profile } as CSSProperties}>
            {profile + 1}
          </span>
        </Block>
      ))}
    </>
  ),
  'ZMK + Studio': (
    <>
      <Block className={styles.plate} size={{ w: 82, d: 82, h: 5, x: -41, y: -41 }} />
      {[0, 1, 2, 3].map((key) => (
        <span className={styles.miniKey} style={{ '--key': key } as CSSProperties} key={key}>
          <Block className={styles.miniCap} size={{ w: 30, d: 30, h: 12 }} />
        </span>
      ))}
    </>
  ),
  'Local software': (
    <>
      {['Windows', 'Linux', 'macOS'].map((system, index) => (
        <Block
          className={styles.pane}
          size={{ w: 78, d: 54, h: 2, x: -39 + index * 8, y: -15 - index * 14, z: index * 12 - 10 }}
          key={system}
        >
          <span className={styles.paneBar} />
          <span className={styles.paneName} style={{ '--pane': index } as CSSProperties}>
            {system}
          </span>
        </Block>
      ))}
    </>
  ),
}

/** The four ways Open Micro reaches a computer, each with a small animated model. */
export function MicroConnect() {
  const grid = useRef<HTMLUListElement>(null)
  const inView = useInView(grid, 0.2)

  return (
    <ul className={`${styles.grid} ${inView ? styles.playing : ''}`} ref={grid}>
      {connectivityCards.map((card) => (
        <li className={styles.card} key={card.label}>
          <div className={styles.scene} aria-hidden="true">
            <div className={styles.floor}>{icons[card.label]}</div>
          </div>
          <p className={styles.label}>{card.label}</p>
          <h3>{card.title}</h3>
          <p className={styles.text}>{card.body}</p>
        </li>
      ))}
    </ul>
  )
}
