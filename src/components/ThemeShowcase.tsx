import { useRef, useState, type CSSProperties } from 'react'
import { heroFolders, heroTabs, omarchyThemes } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { CinmuxWindow, Ink, Pane, Prompt, TerminalLine } from './CinmuxWindow'
import styles from './ThemeShowcase.module.css'

function StatusPane() {
  return (
    <Pane active>
      <Prompt directory="api" branch="auth-sessions">
        git status -sb
      </Prompt>
      <TerminalLine>
        <Ink tone="green">## auth-sessions</Ink>...<Ink tone="warning">origin/auth-sessions</Ink>{' '}
        <Ink tone="muted">[ahead 2]</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning"> M</Ink> src/auth/session.ts
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning"> M</Ink> src/auth/tokens.ts
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">A </Ink> src/auth/rotate.ts
      </TerminalLine>
      <TerminalLine>
        <Ink tone="magenta">??</Ink> notes/rotation.md
      </TerminalLine>
      <TerminalLine />
      <Prompt directory="api" branch="auth-sessions">
        ls
      </Prompt>
      <TerminalLine>
        <Ink tone="accent">migrations</Ink> <Ink tone="accent">src</Ink>{' '}
        <Ink tone="accent">tests</Ink> Cargo.toml README.md
      </TerminalLine>
      <TerminalLine />
      <Prompt directory="api" branch="auth-sessions" cursor />
    </Pane>
  )
}

function GraphPane() {
  return (
    <Pane>
      <Prompt directory="api" branch="auth-sessions">
        git log --graph --oneline
      </Prompt>
      <TerminalLine>
        <Ink tone="warning">*</Ink> <Ink tone="yellow">4f1c2ab</Ink>{' '}
        <Ink tone="cyan">(HEAD → auth-sessions)</Ink> Rotate tokens
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">*</Ink> <Ink tone="yellow">9be07d1</Ink> Retry webhook delivery
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">*</Ink>   <Ink tone="yellow">2d4a913</Ink>{' '}
        <Ink tone="green">(main)</Ink> Merge audit-log
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">|</Ink>
        <Ink tone="magenta">\</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">|</Ink> <Ink tone="magenta">*</Ink> <Ink tone="yellow">8c31e07</Ink>{' '}
        Paginate the audit log
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">*</Ink> <Ink tone="magenta">|</Ink> <Ink tone="yellow">c71e5f0</Ink>{' '}
        Cache plan lookups
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">|</Ink>
        <Ink tone="magenta">/</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="warning">*</Ink> <Ink tone="yellow">0a93be4</Ink> Add health check route
      </TerminalLine>
    </Pane>
  )
}

export function ThemeShowcase() {
  const showcase = useRef<HTMLDivElement>(null)
  const inView = useInView(showcase, 0.35)
  const [reduced] = useState(prefersReducedMotion)
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const theme = omarchyThemes[active]

  useInterval(
    () => setActive((current) => (current + 1) % omarchyThemes.length),
    2400,
    inView && autoplay && !reduced,
  )

  return (
    <div className={styles.showcase} ref={showcase}>
      <div className={styles.preview}>
        <CinmuxWindow
          label={`Cinmux in the ${theme.name} theme`}
          theme={theme}
          tabs={heroTabs}
          folders={heroFolders}
          selectedId="auth"
          split="columns"
          panes={
            <>
              <StatusPane />
              <GraphPane />
            </>
          }
        />
      </div>

      <fieldset className={styles.picker}>
        <legend>
          <span>Omarchy theme</span>
          <strong key={theme.name}>{theme.name}</strong>
        </legend>
        <div className={styles.swatches}>
          {omarchyThemes.map((option, index) => (
            <label
              className={styles.swatch}
              key={option.name}
              style={
                {
                  '--swatch-bg': option.bg,
                  '--swatch-fg': option.fg,
                  '--swatch-accent': option.accent,
                  '--swatch-warning': option.warning,
                  '--swatch-green': option.green,
                } as CSSProperties
              }
            >
              <input
                type="radio"
                name="cinmux-theme"
                checked={index === active}
                onChange={() => {
                  setAutoplay(false)
                  setActive(index)
                }}
              />
              <span className={styles.chip} aria-hidden="true" />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
