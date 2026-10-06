import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  draftFrom,
  draftRounds,
  draftSize,
  draftUntil,
  localEndpoint,
  peakTokensPerSecond,
  raceFile,
  tokenPieces,
} from '../content/inference'
import { prefersReducedMotion, useInView, useStageMotion } from '../lib/motion'
import styles from './InferenceDraftWindow.module.css'

const fileName = 'nsys_kernels.py'
const prefix = raceFile.slice(0, raceFile.indexOf(draftFrom))
const target = raceFile.slice(0, raceFile.indexOf(draftUntil))
const streamed = tokenPieces(target.slice(prefix.length))

/** Each round as text: where it starts, what it keeps, its wrong guess and the model's own piece. */
const rounds: { start: number; kept: string; keptCount: number; guess: readonly string[]; bonus: string }[] = []
for (let piece = 0, start = 0, index = 0; index < draftRounds.length; index++) {
  const { kept, guess } = draftRounds[index]
  const round = {
    start,
    kept: streamed.slice(piece, piece + kept).join(''),
    keptCount: kept,
    guess,
    bonus: streamed[piece + kept] ?? '',
  }
  rounds.push(round)
  piece += kept + 1
  start += round.kept.length + round.bonus.length
}

const phases = { draft: 850, verify: 450, accept: 600, commit: 300 } as const
type Phase = keyof typeof phases | 'done' | 'reset' | 'rewind'
const holdDone = 4200
const resetFade = 600
const rewind = 120

type Run = { text: string; kind: string }

const keyword =
  /^(?:def|return|for|in|if|with|as|import|from|class|raise|not|else|elif|and|or|is|None|True|False|lambda)$/
const builtin = /^(?:dict|list|str|float|int|len|sum|sorted|round|print)$/

/** Python syntax runs for the whole file, so any slice of it can be painted. */
function highlight(text: string) {
  const runs: Run[] = []
  let afterDef = false
  for (const [token] of text.matchAll(
    /"""[\s\S]*?"""|f?"(?:[^"\\\n]|\\.)*"|#[^\n]*|@\w+|\d+(?:\.\d+)?|[A-Za-z_]\w*|\s+|[\s\S]/g,
  )) {
    let kind = ''
    if (token.startsWith('"') || token.startsWith('f"')) kind = 'string'
    else if (token.startsWith('#')) kind = 'comment'
    else if (token.startsWith('@')) kind = 'decorator'
    else if (/^\d/.test(token)) kind = 'number'
    else if (keyword.test(token)) kind = 'keyword'
    else if (afterDef && /^\w/.test(token)) kind = 'function'
    else if (builtin.test(token)) kind = 'builtin'
    else if (/^[A-Z][a-z]/.test(token)) kind = 'type'
    if (!/^\s+$/.test(token)) afterDef = token === 'def' || token === 'class'
    const last = runs.at(-1)
    if (last && last.kind === kind) last.text += token
    else runs.push({ text: token, kind })
  }
  return runs
}

const fileRuns = highlight(target)

/** Paints `target` from `from` to `to` with syntax colours. */
function paint(from: number, to: number, key: string): ReactNode[] {
  const spans: ReactNode[] = []
  let offset = 0
  for (const run of fileRuns) {
    const end = offset + run.text.length
    if (end > from && offset < to) {
      const text = run.text.slice(Math.max(0, from - offset), to - offset)
      spans.push(
        run.kind ? (
          <span className={styles[run.kind]} key={`${key}${offset}`}>
            {text}
          </span>
        ) : (
          text
        ),
      )
    }
    if (end >= to) break
    offset = end
  }
  return spans
}

const finalRound = rounds.length - 1
const prefixSpans = paint(0, prefix.length, 'p')

/**
 * The hero: a coding agent writing a file through Cinference Engine. Each round, 15 drafted pieces
 * appear as ghost text ahead of the caret; the verified prefix turns solid at once and the rest
 * fades. It plays while on screen and opens on the finished file with reduced motion.
 */
export function InferenceDraftWindow() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [round, setRound] = useState(reduced ? finalRound : 0)
  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'draft')
  const playing = inView && !reduced

  useStageMotion(stage, !reduced)

  useEffect(() => {
    if (!playing) return
    const delay =
      phase === 'done'
        ? holdDone
        : phase === 'reset'
          ? resetFade
          : phase === 'rewind'
            ? rewind
            : phases[phase]
    const id = window.setTimeout(() => {
      if (phase === 'draft') setPhase('verify')
      else if (phase === 'verify') setPhase('accept')
      else if (phase === 'accept') setPhase('commit')
      else if (phase === 'commit' && round < finalRound) {
        setRound(round + 1)
        setPhase('draft')
      } else if (phase === 'commit') setPhase('done')
      else if (phase === 'done') setPhase('reset')
      else if (phase === 'reset') {
        setRound(0)
        setPhase('rewind')
      } else setPhase('draft')
    }, delay)
    return () => window.clearTimeout(id)
  }, [playing, phase, round])

  const current = rounds[round]
  const settled = prefix.length + current.start
  const keptEnd = settled + current.kept.length
  const drafting = phase === 'draft' || phase === 'verify'
  const finished = phase === 'done' || phase === 'reset'
  const resolved = phase === 'accept' || phase === 'commit' || finished
  const solidEnd =
    phase === 'commit' || finished
      ? keptEnd + current.bonus.length
      : phase === 'accept'
        ? keptEnd
        : settled
  const fresh = phase === 'accept' || phase === 'commit'
  const ghosts = drafting
    ? [...tokenPieces(current.kept), ...current.guess]
    : phase === 'accept'
      ? current.guess
      : []
  const caretLine = target.slice(0, solidEnd).split('\n').length - 1
  const shownLines = caretLine + ghosts.join('').split('\n').length

  return (
    <div className={`${styles.stage} ${reduced ? styles.still : ''}`} ref={stage}>
      <div className={styles.glow} aria-hidden="true" />
      <figure
        className={styles.rig}
        role="img"
        aria-label={`A coding agent writing ${fileName} through Cinference Engine. Each round, 15 drafted tokens appear as faint text ahead of the cursor; the 27B model keeps the ones it agrees with in one pass and the rest fade. Illustration; peak decode is ${Math.floor(peakTokensPerSecond)} tokens per second on one RTX 5090.`}
      >
        <div className={styles.window} data-playing={playing}>
          <div className={styles.titleBar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.title}>
              {fileName} <span>— fafstmobel-cinference</span>
            </span>
          </div>
          <div className={styles.body}>
            <aside className={styles.chat}>
              <span className={styles.chatLabel}>Agent</span>
              <p className={styles.ask}>
                Write a script that summarizes per-kernel timings from an Nsight Systems CSV
                export.
              </p>
              <div className={styles.reply}>
                <span className={styles.model}>
                  <i /> {localEndpoint.model}
                </span>
                <p>
                  Writing <code>{fileName}</code>…
                </p>
                <ul>
                  <li data-done="true">Read the cuda_gpu_trace columns</li>
                  <li data-done="true">load_durations()</li>
                  <li data-done={finished}>summarize()</li>
                </ul>
              </div>
              <div className={styles.hud}>
                <span className={styles.hudLabel}>Illustrated rounds</span>
                <span className={styles.meter}>
                  {Array.from({ length: draftSize }, (_, index) => (
                    <i
                      data-state={
                        !resolved ? 'drafted' : index < current.keptCount ? 'kept' : 'rejected'
                      }
                      key={index}
                    />
                  ))}
                </span>
                <span className={styles.hudCount}>
                  {draftSize} drafted ·{' '}
                  {resolved ? `${current.keptCount} kept` : phase === 'verify' ? 'checking' : '…'}
                </span>
                <span className={styles.hudPeak}>
                  <strong>{Math.floor(peakTokensPerSecond)}</strong> tok/s
                  <small>Peak decode · one RTX 5090</small>
                </span>
              </div>
            </aside>
            <div className={styles.editor}>
              <div className={styles.tab}>
                <span>{fileName}</span>
              </div>
              <div className={styles.viewport}>
                <div
                  className={`${styles.scroll} ${phase === 'reset' ? styles.fading : phase === 'rewind' ? `${styles.fading} ${styles.rewind}` : ''}`}
                  style={{ '--ci-top': Math.max(0, caretLine - 11) } as CSSProperties}
                >
                  <pre className={styles.gutter}>
                    {Array.from({ length: shownLines }, (_, line) => line + 1).join('\n')}
                  </pre>
                  <pre className={styles.code}>
                    <code>
                      {prefixSpans}
                      {paint(prefix.length, fresh ? settled : solidEnd, 's')}
                      {fresh && (
                        <span className={styles.fresh} key={`f${round}`}>
                          {paint(settled, solidEnd, 'f')}
                        </span>
                      )}
                      <span className={styles.caret} />
                      {ghosts.length > 0 && (
                        <span
                          className={`${styles.ghosts} ${phase === 'accept' ? styles.leaving : ''}`}
                          key={`g${round}`}
                        >
                          {ghosts.map((ghost, index) => (
                            <span
                              className={styles.ghost}
                              style={{ '--ci-i': index } as CSSProperties}
                              key={index}
                            >
                              {ghost}
                            </span>
                          ))}
                        </span>
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.statusBar}>
            <span>
              <i /> Cinference Engine · {localEndpoint.baseUrl.replace('http://', '')}
            </span>
            <span>
              Ln {caretLine + 1} · Python · UTF-8
            </span>
          </div>
        </div>
      </figure>
    </div>
  )
}
