import { useRef, useState, type CSSProperties } from 'react'
import { lavtypeDemo, lavtypeProcess, lavtypeRecognition, lavtypeRecognizers } from '../content/lavtype'
import { prefersReducedMotion, useInView, useInterval, useStageMotion } from '../lib/motion'
import styles from './LavtypeEnclosure.module.css'

type RecognizerId = (typeof lavtypeRecognizers)[number]['id']

const chipSlices = 6
const outsideTokens = [
  { id: 'clipboard', label: 'Clipboard fallback' },
  { id: 'history', label: 'Transcript history' },
] as const

/**
 * The local-only story as a glass box labelled “Your computer”: your voice goes in, the chosen
 * recognizer turns it into one final transcript for the focused app, and the cloud above stays cut
 * off. The walls fold up as the box scrolls into view; the recognizer switches itself until you
 * choose one.
 */
export function LavtypeEnclosure() {
  const figure = useRef<HTMLElement>(null)
  const inView = useInView(figure, 0.25)
  const [reduced] = useState(prefersReducedMotion)
  const [recognizer, setRecognizer] = useState<RecognizerId>('parakeet')
  const [autoplay, setAutoplay] = useState(!reduced)

  useStageMotion(figure, !reduced)
  useInterval(
    () => setRecognizer(recognizer === 'parakeet' ? 'apple-speech' : 'parakeet'),
    5200,
    inView && autoplay,
  )

  const current = lavtypeRecognizers.find((item) => item.id === recognizer) ?? lavtypeRecognizers[0]

  return (
    <figure
      className={`${styles.enclosure} ${reduced ? styles.still : ''} ${inView ? '' : styles.paused}`}
      ref={figure}
      data-recognizer={recognizer}
    >
      <div className={styles.viewport} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.world}>
          <div className={styles.floor}>
            <span className={styles.floorLabel}>Your computer</span>
          </div>
          <span className={`${styles.flow} ${styles.flowIn}`}>
            <span />
          </span>
          <span className={`${styles.flow} ${styles.flowOut}`}>
            <span />
          </span>

          <div className={styles.voice}>
            <span className={styles.board}>
              <span className={styles.arcs}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.boardLabel}>Your voice</span>
            </span>
          </div>

          <div className={styles.mic}>
            <span className={styles.board}>
              <span className={styles.micPuck}>
                <svg viewBox="0 0 32 40" fill="none">
                  <rect x="10" y="3" width="12" height="22" rx="6" fill="currentColor" />
                  <path
                    d="M5 17v3a11 11 0 0 0 22 0v-3M16 31v6m-6 0h12"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </div>

          <div className={styles.chip}>
            {Array.from({ length: chipSlices }, (_, slice) => (
              <span
                className={styles.chipSlice}
                style={{ '--slice': slice, '--slices': chipSlices } as CSSProperties}
                key={slice}
              />
            ))}
            <span className={styles.chipTop}>
              {lavtypeRecognizers.map((item) => (
                <span className={styles.chipFace} data-shown={item.id === recognizer} key={item.id}>
                  <strong>{item.name}</strong>
                  <small>{item.tag}</small>
                </span>
              ))}
            </span>
            <span className={styles.model}>
              <span className={styles.modelBody} />
              <span className={styles.modelTop}>{lavtypeRecognition.modelLabel}</span>
            </span>
          </div>

          <div className={styles.app}>
            <span className={styles.board}>
              <span className={styles.appWindow}>
                <span className={styles.appTag}>{lavtypeDemo.focusedApp}</span>
                <span className={styles.appText}>{lavtypeProcess.transcript}</span>
              </span>
            </span>
          </div>

          <div className={`${styles.wall} ${styles.wallBack}`} />
          <div className={`${styles.wall} ${styles.wallLeft}`} />
          <div className={`${styles.wall} ${styles.wallRight}`} />
          <div className={`${styles.wall} ${styles.wallFront}`} />
          <div className={styles.lid} />

          <div className={styles.cloud}>
            <span className={styles.board}>
              <span className={styles.tether}>
                <span className={styles.cut}>×</span>
              </span>
              <span className={styles.cloudShape}>
                <svg viewBox="0 0 64 40" fill="none">
                  <path
                    d="M18 36h30a12 12 0 0 0 1.5-23.9A16 16 0 0 0 19 9.5 13.5 13.5 0 0 0 18 36Z"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <path d="M10 38 54 4" stroke="#f09ad0" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.cloudLabel}>Cloud fallback</span>
            </span>
          </div>

          {outsideTokens.map((token) => (
            <div className={`${styles.token} ${styles[token.id]}`} key={token.id}>
              <span className={styles.board}>
                <span className={styles.tokenPill}>{token.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className={styles.controls}>
        <fieldset className={styles.choice}>
          <legend>Recognizer</legend>
          {lavtypeRecognizers.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name="lavtype-recognizer"
                value={item.id}
                checked={item.id === recognizer}
                onChange={() => {
                  setAutoplay(false)
                  setRecognizer(item.id)
                }}
              />
              {item.name}
            </label>
          ))}
        </fieldset>
        <div className={styles.note} aria-live={autoplay ? 'off' : 'polite'}>
          <strong>{current.name}</strong>
          <span>{current.detail}</span>
        </div>
        <p className={styles.offline}>{lavtypeRecognition.note}</p>
      </figcaption>
    </figure>
  )
}
