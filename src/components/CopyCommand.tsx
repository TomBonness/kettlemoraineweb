import { useEffect, useId, useRef, useState } from 'react'
import styles from './CopyCommand.module.css'

type CopyCommandProps = {
  command: string
  label?: string
  tone?: 'dark' | 'light'
}

export function CopyCommand({ command, label, tone = 'dark' }: CopyCommandProps) {
  const id = useId()
  const [copied, setCopied] = useState(false)
  const reset = useRef(0)

  useEffect(() => () => window.clearTimeout(reset.current), [])

  return (
    <div className={`${styles.command} ${tone === 'light' ? styles.light : ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row}>
        <pre>
          <code id={id}>
            <span className={styles.prompt} aria-hidden="true">
              ${' '}
            </span>
            {command}
          </code>
        </pre>
        <button
          className={styles.copy}
          type="button"
          aria-describedby={id}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(command)
            } catch {
              return
            }
            setCopied(true)
            window.clearTimeout(reset.current)
            reset.current = window.setTimeout(() => setCopied(false), 1800)
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <span className={styles.status} role="status">
          {copied ? 'Copied to the clipboard' : ''}
        </span>
      </div>
    </div>
  )
}
