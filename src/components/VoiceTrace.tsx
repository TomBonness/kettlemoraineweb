import styles from './VoiceTrace.module.css'

const waveformLevels = [24, 48, 72, 42, 86, 58, 32, 68, 46, 78, 38, 22]

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
    caption: 'Release to type one final transcript into the focused app.',
    visual: 'transcript',
  },
] as const

type VoiceTraceProps = {
  compact?: boolean
  id?: string
}

export function VoiceTrace({ compact = false, id }: VoiceTraceProps) {
  return (
    <figure
      className={`${styles.instrument} ${compact ? styles.compact : ''}`}
      id={id}
      style={{ '--product-accent': 'var(--lavtype-accent)' } as React.CSSProperties}
    >
      <figcaption className={styles.header}>
        <img src="/products/lavtype/lavtype-icon.png" width="1024" height="1024" alt="" />
        <span>Lavtype voice trace</span>
      </figcaption>
      <ol className={styles.sequence}>
        {steps.map((step) => (
          <li className={styles.step} key={step.label}>
            {step.visual === 'key' && (
              <div className={styles.keyStage} aria-hidden="true">
                <kbd>⌘ ⇧ Space</kbd>
              </div>
            )}
            {step.visual === 'waveform' && (
              <div className={styles.waveform} aria-hidden="true">
                {waveformLevels.map((level, index) => (
                  <span key={`${level}-${index}`} style={{ height: `${level}%` }} />
                ))}
              </div>
            )}
            {step.visual === 'transcript' && (
              <div className={styles.transcript}>
                <span>Final transcript</span>
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
