import type { CSSProperties } from 'react'
import openMicroRender from '../assets/product/marketing/open-micro-home-960.webp'
import { omarchyThemes } from '../content/cinmux'
import { heroPieces } from '../content/home'
import { peakTokensPerSecond } from '../content/inference'
import { lavtypeProcess } from '../content/lavtype'
import { StatusBadge, windowThemeStyle } from './CinmuxWindow'
import styles from './HomeHeroPieces.module.css'

/*
 * The small product pieces that lift off the hero's to-do note. Each is a real product visual: the
 * Open Micro render, Lavtype's dictation pill, a Cinference Engine readout and two Cinmux tabs.
 * They're decorative (the list's product links carry the meaning), so they render no text for
 * assistive technology. `landed` is true once the piece has risen off the page.
 */

type PieceProps = { landed: boolean }

export function OpenMicroPiece() {
  return (
    <span className={styles.openMicro}>
      <img src={openMicroRender} width="960" height="714" alt="" draggable={false} />
    </span>
  )
}

// A speech-like envelope for the bars while Lavtype listens; they flatten once it has typed.
const levels = [0.32, 0.55, 0.8, 0.62, 0.95, 0.7, 0.86, 0.5, 0.74, 0.42, 0.6, 0.3]

export function LavtypePiece({ landed }: PieceProps) {
  return (
    <span className={styles.lavtype} data-landed={landed}>
      <svg className={styles.mic} viewBox="0 0 16 20" fill="none" aria-hidden="true">
        <rect x="5" y="1" width="6" height="11" rx="3" />
        <path d="M2.5 9a5.5 5.5 0 0 0 11 0M8 14.5V18" />
      </svg>
      <span className={styles.wave}>
        {levels.map((level, index) => (
          <span style={{ '--hm-level': level } as CSSProperties} key={index} />
        ))}
      </span>
      <span className={styles.transcript}>{lavtypeProcess.transcript}</span>
    </span>
  )
}

export function InferencePiece({ landed }: PieceProps) {
  return (
    <span className={styles.inference} data-landed={landed}>
      <span className={styles.rate}>
        <span className={styles.rateValue}>{Math.floor(peakTokensPerSecond)}</span>
        <span className={styles.rateUnit}>tok/s</span>
      </span>
      <span className={styles.tokens}>
        {heroPieces.inferenceTokens.map((token, index) => (
          <span style={{ '--hm-token': index } as CSSProperties} key={index}>
            {token}
          </span>
        ))}
      </span>
    </span>
  )
}

const cinmuxTheme = windowThemeStyle(omarchyThemes[0])

/** `phase`: 0 while the piece rises, 1 once it lands, 2 when the list is finished. */
export function CinmuxPiece({ phase }: { phase: 0 | 1 | 2 }) {
  return (
    <span className={styles.cinmux} style={cinmuxTheme}>
      {heroPieces.cinmuxTabs.map((tab, index) => {
        const activity = tab.activity[phase]
        return (
          <span className={styles.tab} data-selected={index === 0} key={tab.title}>
            <span className={styles.tabTitle}>{tab.title}</span>
            <StatusBadge activity={activity} />
          </span>
        )
      })}
    </span>
  )
}
