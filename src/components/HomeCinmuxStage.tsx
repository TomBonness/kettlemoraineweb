import { useRef, useState } from 'react'
import { heroFolders, heroTabs, heroTimeline, omarchyThemes } from '../content/cinmux'
import { prefersReducedMotion, useInView, useInterval } from '../lib/motion'
import { CinmuxWindow } from './CinmuxWindow'
import styles from './HomeCinmuxStage.module.css'
import { useHomeTilt } from './useHomeTilt'
import { WorkspacePanes } from './WorkspaceStage'

/** The Cinmux window in layers, its agents changing status while it's on screen. */
export function HomeCinmuxStage() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const [reduced] = useState(prefersReducedMotion)
  const [step, setStep] = useState(0)
  const [tabs, setTabs] = useState(heroTabs)
  useHomeTilt(stage)

  useInterval(
    () => {
      const next = (step + 1) % heroTimeline.length
      setStep(next)
      setTabs((current) =>
        current.map((tab) => ({ ...tab, activity: heroTimeline[next][tab.id] ?? tab.activity })),
      )
    },
    2400,
    inView && !reduced,
  )

  return (
    <div className={styles.stage} ref={stage}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.rig}>
        <CinmuxWindow
          className={styles.window}
          label="The Cinmux window coming apart into its folders, tab list and tmux panes"
          theme={omarchyThemes[0]}
          tabs={tabs}
          folders={heroFolders}
          selectedId="build"
          split="split"
          layered
          panes={<WorkspacePanes />}
        />
      </div>
    </div>
  )
}
