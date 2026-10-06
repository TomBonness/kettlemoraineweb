import { useState } from 'react'
import {
  lavtypeDemo,
  lavtypeProcess,
  lavtypeRecognition,
  lavtypeRecognizers,
} from '../content/lavtype'
import styles from './LavtypeLocalPath.module.css'

type RecognizerId = (typeof lavtypeRecognizers)[number]['id']

const absent = ['cloud fallback', 'clipboard fallback', 'transcript history']

/**
 * The path a dictation takes, all inside your computer: voice → local recognizer → one final
 * transcript → the focused app. The recognizer card switches between Parakeet and Apple Speech.
 */
export function LavtypeLocalPath() {
  const [recognizer, setRecognizer] = useState<RecognizerId>('parakeet')
  const current = lavtypeRecognizers.find((item) => item.id === recognizer) ?? lavtypeRecognizers[0]

  return (
    <figure className={styles.path}>
      <div className={styles.computer}>
        <span className={styles.boundary}>Your computer</span>
        <ol className={styles.flow}>
          <li className={styles.node}>
            <span className={styles.step}>01</span>
            <svg className={styles.mic} viewBox="0 0 32 40" fill="none" aria-hidden="true">
              <rect x="10" y="2" width="12" height="23" rx="6" />
              <path d="M5 17v3a11 11 0 0 0 22 0v-3M16 31v7m-6 0h12" />
            </svg>
            <strong>Your voice</strong>
            <span className={styles.detail}>While you hold the shortcut</span>
          </li>

          <li className={`${styles.node} ${styles.recognizer}`}>
            <span className={styles.step}>02</span>
            <fieldset className={styles.toggle}>
              <legend>Local recognizer</legend>
              {lavtypeRecognizers.map((item) => (
                <label key={item.id}>
                  <input
                    type="radio"
                    name="lavtype-recognizer"
                    value={item.id}
                    checked={item.id === recognizer}
                    onChange={() => setRecognizer(item.id)}
                  />
                  {item.name}
                </label>
              ))}
            </fieldset>
            <div className={styles.choice} key={current.id}>
              <strong>{current.name}</strong>
              <span className={styles.detail}>{current.detail}</span>
              <span className={styles.tag}>{current.tag}</span>
            </div>
          </li>

          <li className={styles.node}>
            <span className={styles.step}>03</span>
            <strong>{lavtypeDemo.finalTranscript}</strong>
            <q className={styles.quote}>{lavtypeProcess.transcript}</q>
          </li>

          <li className={`${styles.node} ${styles.app}`}>
            <span className={styles.step}>04</span>
            <strong>{lavtypeDemo.focusedApp}</strong>
            <span className={styles.window} aria-hidden="true">
              <span className={styles.lights}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.windowText}>
                {lavtypeProcess.transcript}
                <span className={styles.caret} />
              </span>
            </span>
          </li>
        </ol>
      </div>

      <ul className={styles.absent} aria-label="Not in Lavtype">
        {absent.map((item) => (
          <li key={item}>
            <span className={styles.srOnly}>No </span>
            <s>{item}</s>
          </li>
        ))}
      </ul>
      <figcaption className={styles.note}>{lavtypeRecognition.note}</figcaption>
    </figure>
  )
}
