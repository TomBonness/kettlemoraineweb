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
import { prefersReducedMotion, useInView } from '../lib/motion'
import styles from './HomeCardDraft.module.css'

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
const finalRound = rounds.length - 1

/** Faster than the product page hero: drafted pieces appear, then the kept run turns solid. */
const delays = { draft: 520, accept: 420, done: 2600, reset: 600, rewind: 120 } as const
type Phase = keyof typeof delays

/** Visible code rows (`.viewport` in the CSS is 16 lines tall); the view follows the caret. */
const rows = 16

const keyword =
  /^(?:def|return|for|in|if|with|as|import|from|class|raise|not|else|elif|and|or|is|None|True|False|lambda)$/
const builtin = /^(?:dict|list|str|float|int|len|sum|sorted|round|print)$/

/** Python syntax runs for the whole file, so any slice of it can be painted. */
const fileRuns: { text: string; kind: string }[] = []
{
  let afterDef = false
  for (const [token] of target.matchAll(
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
    const last = fileRuns.at(-1)
    if (last && last.kind === kind) last.text += token
    else fileRuns.push({ text: token, kind })
  }
}

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

const prefixSpans = paint(0, prefix.length, 'p')

/**
 * The homepage Cinference Engine card's media: a small editor on a tilted plane, writing a file in
 * bursts. Each round, drafted pieces appear faintly ahead of the caret, the kept run turns solid
 * and the rest fades. It plays only on screen and shows the finished function with reduced motion.
 */
export function HomeCardDraft() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, 0.2)
  const [reduced] = useState(prefersReducedMotion)
  const [round, setRound] = useState(reduced ? finalRound : 0)
  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'draft')
  const playing = inView && !reduced

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      if (phase === 'draft') setPhase('accept')
      else if (phase === 'accept' && round < finalRound) {
        setRound(round + 1)
        setPhase('draft')
      } else if (phase === 'accept') setPhase('done')
      else if (phase === 'done') setPhase('reset')
      else if (phase === 'reset') {
        setRound(0)
        setPhase('rewind')
      } else setPhase('draft')
    }, delays[phase])
    return () => window.clearTimeout(id)
  }, [playing, phase, round])

  const current = rounds[round]
  const settled = prefix.length + current.start
  const keptEnd = settled + current.kept.length
  const finished = phase === 'done' || phase === 'reset'
  const solidEnd = finished ? keptEnd + current.bonus.length : phase === 'accept' ? keptEnd : settled
  const ghosts =
    phase === 'draft'
      ? [...tokenPieces(current.kept), ...current.guess]
      : phase === 'accept'
        ? current.guess
        : []
  const caretLine = target.slice(0, solidEnd).split('\n').length - 1
  const shownLines = caretLine + ghosts.join('').split('\n').length

  return (
    <div
      className={`${styles.stage} ${reduced ? styles.still : ''}`}
      ref={stage}
      data-playing={playing}
      aria-hidden="true"
    >
      <div className={styles.rig}>
        <div className={styles.window}>
          <div className={styles.titleBar}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.title}>
              {fileName} <span>— {localEndpoint.model}</span>
            </span>
          </div>
          <div className={styles.tab}>
            <span>{fileName}</span>
          </div>
          <div className={styles.viewport}>
            <div
              className={`${styles.scroll} ${phase === 'reset' ? styles.fading : phase === 'rewind' ? `${styles.fading} ${styles.rewind}` : ''}`}
              style={{ '--hm-top': Math.max(0, caretLine - (rows - 3)) } as CSSProperties}
            >
              <pre className={styles.gutter}>
                {Array.from({ length: shownLines }, (_, line) => line + 1).join('\n')}
              </pre>
              <pre className={styles.code}>
                <code>
                  {prefixSpans}
                  {paint(prefix.length, phase === 'accept' ? settled : solidEnd, 's')}
                  {phase === 'accept' && (
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
                          style={{ '--hm-i': index } as CSSProperties}
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
          <div className={styles.statusBar}>
            <span>
              <i /> Cinference Engine · {localEndpoint.baseUrl.replace('http://', '')}
            </span>
            <span>Ln {caretLine + 1} · Python</span>
          </div>
        </div>

        <div className={styles.hud}>
          <span className={styles.peak}>
            <strong>{Math.floor(peakTokensPerSecond)}</strong> tok/s
          </span>
          <small>Peak decode · one RTX 5090</small>
          <span className={styles.meter}>
            {Array.from({ length: draftSize }, (_, index) => (
              <i
                data-state={
                  phase === 'draft' ? 'drafted' : index < current.keptCount ? 'kept' : 'rejected'
                }
                key={index}
              />
            ))}
          </span>
          <small>
            Illustrated round · {draftSize} drafted
            {phase === 'draft' ? '' : ` · ${current.keptCount} kept`}
          </small>
        </div>
      </div>
    </div>
  )
}
