import { lavtypeProcess, lavtypeSteps } from '../content/lavtype'
import styles from './VoiceTrace.module.css'

const waveformLevels = [
  12, 24, 48, 32, 72, 42, 86, 58, 32, 68, 46, 78, 38, 62, 94, 54, 76, 42, 58, 30, 44, 22, 16, 8,
]

type VoiceTraceProps = {
  compact?: boolean
  id?: string
}

export function VoiceTrace({ compact = false, id }: VoiceTraceProps) {
  return (
    <figure className={`${styles.instrument} ${compact ? styles.compact : ''}`} id={id}>
      <ol className={styles.sequence}>
        {lavtypeSteps.map((step) => (
          <li className={styles.step} key={step.label}>
            {step.visual === 'key' && (
              <div className={styles.keyStage}>
                <kbd>⌘ ⇧ Space</kbd>
                <span>Example shortcut</span>
              </div>
            )}
            {step.visual === 'waveform' && (
              <div className={styles.waveform} aria-hidden="true">
                {waveformLevels.map((level, index) => (
                  <span
                    key={`${level}-${index}`}
                    style={{ height: `${level}%`, animationDelay: `${index * -0.07}s` }}
                  />
                ))}
              </div>
            )}
            {step.visual === 'transcript' && (
              <div className={styles.transcript}>
                <q>{lavtypeProcess.transcript}</q>
              </div>
            )}
            <div className={styles.stepCopy}>
              <strong>{step.label}</strong>
              <p>{step.caption}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}
