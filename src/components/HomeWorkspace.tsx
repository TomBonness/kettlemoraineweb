import { useEffect, useRef, useState, type CSSProperties } from 'react'
import microRender from '../assets/product/marketing/open-micro-home-960.webp'
import microRenderLarge from '../assets/product/marketing/open-micro-home-1600.webp'
import { productCatalog, type ProductId } from '../content/catalog'
import { omarchyThemes, type Activity } from '../content/cinmux'
import { workflowSteps, workspaceCaption, workspaceSession, workspaceTabs } from '../content/home'
import { localEndpoint, peakTokensPerSecond } from '../content/inference'
import { prefersReducedMotion, useInView, useStageMotion } from '../lib/motion'
import { CinmuxWindow, Ink, Pane, Prompt, TerminalLine } from './CinmuxWindow'
import styles from './HomeWorkspace.module.css'

const theme = omarchyThemes.find((option) => option.name === 'Tokyo Night') ?? omarchyThemes[0]

const hues: Record<ProductId, string> = {
  cinmux: '#a3be78',
  'open-micro': '#e2c58f',
  lavtype: '#a98bff',
  inference: '#89adff',
}

/** The story's beats and how long each is held (ms). The first four are the workflow's steps. */
const beats = { waiting: 2800, jump: 1900, speak: 2700, answer: 2500, done: 3600, reset: 700 } as const
type Beat = keyof typeof beats
const order = Object.keys(beats) as Beat[]
const stepBeats: readonly Beat[] = ['waiting', 'jump', 'speak', 'answer']

const session = workspaceSession

function BuildView() {
  return (
    <>
      <Prompt directory={session.directory} branch="main">
        npm run build
      </Prompt>
      <TerminalLine>
        <Ink tone="green">✓</Ink> 412 modules transformed.
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">dist/index.html</Ink> 1.21 kB
      </TerminalLine>
      <TerminalLine>
        <Ink tone="muted">dist/assets/index.js</Ink> 538.04 kB
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">✓ built in 2.84s</Ink>
      </TerminalLine>
      <TerminalLine />
      <Prompt directory={session.directory} branch="main" />
    </>
  )
}

function AgentView({ step }: { step: number }) {
  return (
    <>
      <TerminalLine>
        <Ink tone="muted">
          {session.directory} · {session.branch}
        </Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">❯</Ink> {session.request}
      </TerminalLine>
      <TerminalLine />
      <TerminalLine>
        <Ink tone="accent">●</Ink> {session.run}
      </TerminalLine>
      <TerminalLine>
        {'  '}
        <Ink tone="warning">✗</Ink> {session.failure}
      </TerminalLine>
      <TerminalLine>
        {'  '}
        <Ink tone="muted">{session.cause}</Ink>
      </TerminalLine>
      <TerminalLine />
      <TerminalLine>
        <Ink tone="yellow">? {session.question}</Ink>
      </TerminalLine>
      <TerminalLine>
        <Ink tone="green">❯</Ink>{' '}
        {step >= 2 && (
          <span
            className={`${styles.typed} ${step === 2 ? styles.typing : ''}`}
            style={{ '--hm-chars': session.answer.length } as CSSProperties}
          >
            {session.answer}
          </span>
        )}
        {step < 3 && <span className={styles.caret} />}
      </TerminalLine>
      {step >= 3 && (
        <div className={step === 3 ? styles.streaming : ''}>
          <TerminalLine />
          <span className={styles.stream} style={{ '--hm-i': 0 } as CSSProperties}>
            <TerminalLine>
              <Ink tone="accent">●</Ink> {session.writing}
            </TerminalLine>
          </span>
          {session.fix.map((line, index) => (
            <span className={styles.stream} style={{ '--hm-i': index + 1 } as CSSProperties} key={line}>
              <TerminalLine>
                {'  '}
                <Ink tone="green">+</Ink> {line}
              </TerminalLine>
            </span>
          ))}
        </div>
      )}
      {step >= 4 && (
        <div className={styles.passed}>
          <TerminalLine />
          <TerminalLine>
            <Ink tone="green">✓ {session.passed}</Ink>
          </TerminalLine>
        </div>
      )}
    </>
  )
}

/**
 * The homepage hero: one desk, all four products. A Cinmux agent stops to ask a question, its Open
 * Micro key blinks, Lavtype takes the spoken answer and Cinference Engine streams the fix. It plays
 * only on screen; pointing at a step shows that step and stops the loop. With reduced motion it
 * shows the finished story.
 */
export function HomeWorkspace() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [beat, setBeat] = useState<Beat>(reduced ? 'done' : 'waiting')
  const [held, setHeld] = useState(false)
  const live = inView && !reduced
  const playing = live && !held

  useStageMotion(stage, !reduced)

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(
      () => setBeat(order[(order.indexOf(beat) + 1) % order.length]),
      beats[beat],
    )
    return () => window.clearTimeout(id)
  }, [playing, beat])

  const show = (index: number) => {
    setHeld(true)
    setBeat(stepBeats[index])
  }

  const step = Math.min(order.indexOf(beat), 4)
  const flaky: Activity = step < 3 ? 'waiting' : step === 3 ? 'working' : 'done'
  const tabs = workspaceTabs.map((tab) => (tab.id === 'flaky' ? { ...tab, activity: flaky } : tab))
  const agent = beat !== 'waiting'

  return (
    <div className={styles.workspace}>
      <div
        className={`${styles.stage} ${reduced ? styles.still : ''}`}
        ref={stage}
        data-beat={beat}
        data-live={live}
        role="img"
        aria-label="Illustration: an agent in a Cinmux workspace asks a question, its Open Micro key blinks, Lavtype types the spoken answer and Cinference Engine streams the fix."
      >
        <div className={styles.glow} />
        <div className={styles.rig}>
          <CinmuxWindow
            className={styles.screen}
            label="A Cinmux workspace with six tabs"
            theme={theme}
            tabs={tabs}
            selectedId={agent ? 'flaky' : 'build'}
            compact
            panes={
              <Pane active>
                <div
                  className={`${styles.view} ${beat === 'reset' ? styles.fading : ''}`}
                  key={agent ? 'agent' : 'build'}
                >
                  {agent ? <AgentView step={step} /> : <BuildView />}
                </div>
              </Pane>
            }
          />

          <div className={styles.micro}>
            <span className={styles.microShadow} />
            <img
              src={microRender}
              srcSet={`${microRender} 960w, ${microRenderLarge} 1600w`}
              sizes="(max-width: 767px) 60vw, 400px"
              width="1600"
              height="1190"
              alt=""
              decoding="async"
            />
            <span className={styles.keyLight} />
          </div>

          <div className={styles.pill} data-show={beat === 'speak'}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
            </svg>
            <span className={styles.bars}>
              {Array.from({ length: 14 }, (_, index) => (
                <i style={{ '--hm-bar': index } as CSSProperties} key={index} />
              ))}
            </span>
            <span className={styles.pillLabel}>Lavtype</span>
          </div>

          <div className={styles.chip} data-show={step >= 3 && beat !== 'reset'}>
            <span className={styles.chipLabel}>
              <i /> Cinference Engine
            </span>
            <span className={styles.chipRate}>
              <strong>{Math.floor(peakTokensPerSecond)}</strong> tok/s
            </span>
            <small>Peak decode · {localEndpoint.baseUrl.replace('http://', '')}</small>
          </div>
        </div>
      </div>

      <p className={styles.caption}>{workspaceCaption}</p>

      <ol className={styles.steps}>
        {workflowSteps.map((item, index) => {
          const product = productCatalog.find((entry) => entry.id === item.product)
          if (!product) return null
          return (
            <li
              data-state={index < step ? 'past' : index === step ? 'active' : 'next'}
              style={{ '--hm-hue': hues[item.product] } as CSSProperties}
              key={item.product}
            >
              <a href={product.path} onPointerEnter={() => show(index)} onFocus={() => show(index)}>
                <span className={styles.stepNumber}>0{index + 1}</span>
                <strong>{product.name}</strong>
                <span>{item.action}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
