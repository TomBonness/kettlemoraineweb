import { useEffect, useRef, useState } from 'react'
import { heroFolders, heroTabs, heroTimeline, omarchyThemes } from '../content/cinmux'
import { easeVars, prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { CinmuxWindow, Ink, Pane, Prompt, TerminalLine } from './CinmuxWindow'
import styles from './WorkspaceStage.module.css'

const [gruvbox] = omarchyThemes

function BuildPane() {
  return (
    <Pane active depth={0.3}>
      <Prompt directory="api" branch="main">
        npm run build
      </Prompt>
      <TerminalLine />
      <TerminalLine>
        <Ink tone="muted">&gt; api@2.4.0 build</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">&gt; tsc -p . &amp;&amp; vite build</Ink>
      </TerminalLine>
      <TerminalLine />
      <TerminalLine>
        <Ink tone="cyan">vite v7.2.1</Ink> <Ink tone="green">building for production…</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓</Ink> 412 modules transformed.
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">dist/</Ink>index.html <Ink tone="muted">          0.46 kB</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">dist/assets/</Ink>
        <Ink tone="magenta">index.css</Ink> <Ink tone="muted">  18.20 kB</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">dist/assets/</Ink>
        <Ink tone="cyan">index.js</Ink> <Ink tone="muted">  146.92 kB</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓ built in 2.84s</Ink>
      </TerminalLine>
      <TerminalLine />
      <Prompt directory="api" branch="main">
        git log --oneline -5
      </Prompt>
      <TerminalLine>
        <Ink tone="yellow">4f1c2ab</Ink> Rotate session tokens on refresh
      </TerminalLine>
      <TerminalLine>
        <Ink tone="yellow">9be07d1</Ink> Retry flaky webhook delivery
      </TerminalLine>
      <TerminalLine>
        <Ink tone="yellow">2d4a913</Ink> Paginate the audit log
      </TerminalLine>
      <TerminalLine>
        <Ink tone="yellow">c71e5f0</Ink> Cache plan lookups
      </TerminalLine>
      <TerminalLine>
        <Ink tone="yellow">0a93be4</Ink> Add health check route
      </TerminalLine>
      <TerminalLine />
      <Prompt directory="api" branch="main" cursor />
    </Pane>
  )
}

function TestPane() {
  return (
    <Pane depth={0.6}>
      <Prompt directory="api" branch="main">
        npm test
      </Prompt>
      <TerminalLine>
        <Ink tone="green">✓</Ink> auth/session.test.ts <Ink tone="muted">(14)</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓</Ink> auth/tokens.test.ts <Ink tone="muted">(9)</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓</Ink> billing/invoice.test.ts <Ink tone="muted">(22)</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓</Ink> routes/health.test.ts <Ink tone="muted">(3)</Ink>
      </TerminalLine>
      <TerminalLine />
      <TerminalLine>
        <Ink tone="muted"> Test Files </Ink>
        <Ink tone="green">4 passed</Ink> <Ink tone="muted">(4)</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">      Tests </Ink>
        <Ink tone="green">48 passed</Ink> <Ink tone="muted">(48)</Ink>
      </TerminalLine>
    </Pane>
  )
}

function ListPane() {
  return (
    <Pane depth={0.9}>
      <Prompt directory="api" branch="main">
        cinmux list --json | jq -r &apos;.[] | .activity + &quot;  &quot; + .title&apos;
      </Prompt>
      {heroTabs.slice(0, 7).map((tab) => (
        <TerminalLine key={tab.id}>
          <Ink tone={tab.activity === 'waiting' ? 'warning' : tab.activity === 'idle' ? 'muted' : 'accent'}>
            {tab.activity.padEnd(9)}
          </Ink>
          {tab.title}
        </TerminalLine>
      ))}
    </Pane>
  )
}

/** The split tmux session in the hero window: a build, its tests and a status snapshot. */
export function WorkspacePanes() {
  return (
    <>
      <BuildPane />
      <TestPane />
      <ListPane />
    </>
  )
}

export function WorkspaceStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const [reduced] = useState(prefersReducedMotion)
  const [step, setStep] = useState(0)
  const [tabs, setTabs] = useState(heroTabs)

  useInterval(
    () => {
      const next = (step + 1) % heroTimeline.length
      setStep(next)
      setTabs((current) =>
        current.map((tab) => ({ ...tab, activity: heroTimeline[next][tab.id] ?? tab.activity })),
      )
    },
    2600,
    inView && !reduced,
  )

  useEffect(() => {
    const element = stage.current
    if (!element || reduced) return
    const progress = () => {
      const top = element.getBoundingClientRect().top + window.scrollY
      const distance = Math.max(1, top - window.innerHeight * 0.12)
      return Math.min(1, Math.max(0, window.scrollY / distance))
    }
    const vars = easeVars(element, { '--progress': progress(), '--intro': 1, '--mx': 0, '--my': 0 })
    vars.set({ '--intro': 0 })

    const scroll = () => vars.set({ '--progress': progress() })
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = element.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width) * 2 - 1
      const y = ((event.clientY - box.top) / Math.min(box.height, window.innerHeight)) * 2 - 1
      vars.set({ '--mx': Math.min(1, Math.max(-1, x)), '--my': Math.min(1, Math.max(-1, y)) })
    }

    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    document.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
      document.removeEventListener('pointermove', move)
      vars.stop()
    }
  }, [reduced])

  return (
    <div className={`${styles.stage} ${reduced ? styles.still : ''}`} ref={stage}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.rig}>
        <CinmuxWindow
          className={styles.window}
          label="The Cinmux window taken apart into layers: folders, a tab list where each agent shows Working, Needs input or Done, and a tmux session split into three panes"
          theme={gruvbox}
          tabs={tabs}
          folders={heroFolders}
          selectedId="build"
          split="split"
          layered
          layerLabels={{ sidebar: 'Folders', tabs: 'Tabs · live status', terminal: 'Real tmux panes' }}
          panes={<WorkspacePanes />}
        />
      </div>
    </div>
  )
}
