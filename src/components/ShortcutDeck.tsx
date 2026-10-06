import { Fragment, useRef, useState, type CSSProperties } from 'react'
import { shortcuts, type ShortcutPlatform } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval, usesMacKeys } from '../lib/motion'
import styles from './ShortcutDeck.module.css'

const platformLabels: Record<ShortcutPlatform, string> = { linux: 'Linux', macos: 'macOS' }

export function ShortcutDeck() {
  const deck = useRef<HTMLDivElement>(null)
  const inView = useInView(deck, 0.25)
  const [reduced] = useState(prefersReducedMotion)
  const [platform, setPlatform] = useState<ShortcutPlatform>(usesMacKeys ? 'macos' : 'linux')
  // The deck plays its shortcuts one after another, like hands on a keyboard; hovering a row
  // presses that one instead.
  const [playing, setPlaying] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  useInterval(
    () => setPlaying((current) => (current + 1) % shortcuts.length),
    1500,
    inView && hovered === null && !reduced,
  )

  const pressed = hovered ?? (inView && !reduced ? playing : null)

  return (
    <div className={styles.deck} ref={deck}>
      <fieldset className={styles.toggle}>
        <legend>Keyboard</legend>
        {(['linux', 'macos'] as const).map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="cinmux-shortcuts"
              checked={platform === option}
              onChange={() => setPlatform(option)}
            />
            <span>{platformLabels[option]}</span>
          </label>
        ))}
      </fieldset>

      <ul className={styles.list} onPointerLeave={() => setHovered(null)}>
        {shortcuts.map((shortcut, index) => (
          <li
            key={shortcut.action}
            data-pressed={pressed === index}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setHovered(index)
            }}
          >
            <span className={styles.action}>{shortcut.action}</span>
            <span className={styles.combos}>
              {shortcut[platform].map((combo, comboIndex) => (
                <Fragment key={combo.join('+')}>
                  {comboIndex > 0 && (
                    <span className={styles.separator} aria-hidden="true">
                      /
                    </span>
                  )}
                  <kbd className={styles.combo}>
                    {combo.map((key, keyIndex) => (
                      <kbd
                        className={styles.key}
                        style={{ '--key': comboIndex * combo.length + keyIndex } as CSSProperties}
                        key={key}
                      >
                        {key}
                      </kbd>
                    ))}
                  </kbd>
                </Fragment>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.footnote}>
        Inside a tab, {platform === 'macos' ? '⌃ ⌥ arrows' : 'Ctrl+Alt+arrows'} move between panes
        and {platform === 'macos' ? '⌃ ⌥ ⇧ arrows' : 'Ctrl+Alt+Shift+arrows'} resize them. The tmux
        prefix is Ctrl+Space or Ctrl+B. In cinmux tui, Ghostty, kitty, foot and Alacritty get the
        same shortcuts as the Linux app; other terminals use Ctrl+Alt in place of Ctrl+Shift.
      </p>
    </div>
  )
}
