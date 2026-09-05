import styles from './VoiceTrace.module.css'

const waveformLevels = [
  12, 24, 48, 32, 72, 42, 86, 58, 32, 68, 46, 78, 38, 62, 94, 54, 76, 42, 58, 30, 44, 22, 16, 8,
]

const steps = [
  {
    label: 'Hold',
    caption: 'Press the shortcut you chose.',
    visual: 'key',
  },
  {
    label: 'Speak',
    caption: 'Speak while the shortcut is held.',
    visual: 'waveform',
  },
  {
    label: 'Release',
    caption: 'Release to type one final transcript into the app focused when recognition finishes.',
    visual: 'transcript',
  },
] as const

type VoiceTraceProps = {
  compact?: boolean
  id?: string
}

export function VoiceTrace({ compact = false, id }: VoiceTraceProps) {
  return (
    <figure className={`${styles.instrument} ${compact ? styles.compact : ''}`} id={id}>
      <figcaption className={styles.header}>
        <img src="/products/lavtype/lavtype-icon.png" width="1024" height="1024" alt="" />
        <span>Lavtype / Voice to text</span>
        <span className={styles.headerNote}>A three-step workflow</span>
      </figcaption>
      <ol className={styles.sequence}>
        {steps.map((step) => (
          <li className={styles.step} key={step.label}>
            {step.visual === 'key' && (
              <div className={styles.keyStage} aria-hidden="true">
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
                <span>Focused app / final text</span>
                <q>Meet me at the trailhead at nine.</q>
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
