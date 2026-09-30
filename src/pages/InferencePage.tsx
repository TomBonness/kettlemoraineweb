import type { CSSProperties } from 'react'
import { SiteShell } from '../components/SiteShell'
import { TokenRace } from '../components/TokenRace'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  comparedEngines,
  comparisonAxisMax,
  engineComparison,
  engineSpecs,
  inferenceLinks,
  inferenceNavigation,
  inferenceSignup,
  installCommands,
  llamaCppSpeedup,
  localEndpoint,
  peakTokensPerSecond,
  raceFile,
  speedHistory,
  speedTechniques,
} from '../content/inference'
import styles from './InferencePage.module.css'

const cinference = 'Cinference Engine'
const [chats, edits] = engineComparison
const historyGain =
  speedHistory[speedHistory.length - 1].tokensPerSecond / speedHistory[0].tokensPerSecond

function TechniqueIcon({ kind }: { kind: (typeof speedTechniques)[number]['icon'] }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" aria-hidden="true">
      {kind === 'draft' ? (
        <>
          <circle cx="12" cy="32" r="4" />
          <path d="M16 32h10l12-17h8M26 32h20M26 32l12 17h8M62 32h8m16 0h8" />
          <rect x="46" y="10" width="16" height="10" rx="2" />
          <rect x="46" y="27" width="16" height="10" rx="2" />
          <rect x="46" y="44" width="16" height="10" rx="2" />
          <rect x="70" y="27" width="16" height="10" rx="2" />
          <path d="m97 32 6 6 12-14" />
        </>
      ) : kind === 'lookup' ? (
        <>
          <rect x="8" y="8" width="42" height="48" rx="4" />
          <path d="M17 19h24M17 28h16M17 47h20" />
          <rect x="14" y="33" width="30" height="8" rx="2" />
          <path d="M55 37h13m-5-5 5 5-5 5" />
          <rect x="73" y="8" width="40" height="48" rx="4" />
          <path d="M82 19h22M82 28h14" />
          <rect x="79" y="33" width="28" height="8" rx="2" />
        </>
      ) : kind === 'kernel' ? (
        <>
          <path d="M4 24h18m-12 8h12M4 40h18" />
          <rect x="38" y="10" width="44" height="44" rx="4" />
          <rect x="50" y="22" width="20" height="20" rx="2" />
          <path d="M48 10V3m12 7V3m12 7V3M48 61v-7m12 7v-7m12 7v-7M38 20h-7m7 12h-7m7 12h-7M82 20h7m-7 12h7m-7 12h7" />
        </>
      ) : (
        <>
          <rect x="8" y="14" width="44" height="36" rx="4" />
          <path d="M16 26h28M16 38h20M60 28h12M60 36h12" />
          <rect x="80" y="14" width="34" height="36" rx="4" />
          <path d="m89 32 5 5 11-12" />
        </>
      )}
    </svg>
  )
}

export function InferencePage() {
  return (
    <SiteShell
      currentPath={routes.inference}
      navigation={inferenceNavigation}
      cta={{ label: 'Install', href: inferenceLinks.installer }}
    >
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="inference-title">
          <img
            className={styles.heroArtwork}
            src="/products/inference/token-lens.svg"
            width="1200"
            height="1000"
            alt="Blue light traces converging through a luminous lens, an abstract visualization of accelerated inference"
            fetchPriority="high"
          />
          <div className={styles.heroInner}>
            <h1 id="inference-title">Cinference Engine</h1>
            <p className={styles.heroStatement}>
              Up to {llamaCppSpeedup.toFixed(1)}× faster than llama.cpp.
              <br />
              <em>On the same RTX 5090.</em>
            </p>
            <p className={styles.heroLead}>
              A custom C++/CUDA inference engine. It drafts 15 tokens ahead, checks them all in one
              pass, and runs a 27B model at up to {Math.floor(peakTokensPerSecond)} tokens per
              second on a single GPU.
            </p>
            <div className={styles.heroActions}>
              <a className={`button ${styles.primaryButton}`} href={inferenceLinks.installer}>
                Get the installer <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href={inferenceLinks.source}>
                View source <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className={styles.heroMetric}>
              <span className={styles.metricNumber}>{Math.floor(peakTokensPerSecond)}</span>
              <div>
                <span>tokens / second</span>
                <small>Peak decode on one RTX 5090</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.speedSection} id="speed" aria-labelledby="speed-title">
          <div className={styles.sectionIntro}>
            <h2 id="speed-title">
              Same GPU.
              <br />
              <em>Less waiting.</em>
            </h2>
            <p className={styles.lead}>
              We ran llama.cpp, NInfer, and Cinference Engine on one RTX 5090 with the same prompts.
              Here’s a whole-file edit, replayed at each engine’s measured speed.
            </p>
          </div>
          <TokenRace
            lanes={comparedEngines.map((engine) => ({
              engine,
              tokensPerSecond: edits.tokensPerSecond[engine],
              highlight: engine === cinference,
            }))}
            text={raceFile}
          />
          <div className={styles.comparison}>
            {[chats, edits].map((workload) => (
              <figure className={styles.workload} key={workload.name}>
                <figcaption>
                  <strong>{workload.name}</strong>
                  <span>{workload.detail}</span>
                </figcaption>
                <p className={styles.speedup}>
                  {(
                    workload.tokensPerSecond[cinference] / workload.tokensPerSecond['llama.cpp']
                  ).toFixed(1)}
                  ×<span>faster than llama.cpp</span>
                </p>
                <dl className={styles.bars}>
                  {comparedEngines.map((engine) => (
                    <div
                      className={`${styles.bar} ${engine === cinference ? styles.barHighlight : ''}`}
                      key={engine}
                    >
                      <dt>{engine}</dt>
                      <dd>
                        <span className={styles.barTrack}>
                          <span
                            style={{
                              width: `${(workload.tokensPerSecond[engine] / comparisonAxisMax) * 100}%`,
                            }}
                          />
                        </span>
                        <strong>{workload.tokensPerSecond[engine].toFixed(1)}</strong>
                      </dd>
                    </div>
                  ))}
                </dl>
              </figure>
            ))}
          </div>
          <p className={styles.finePrint}>
            Decode tokens per second, one request at a time, measured September 30, 2026 on one RTX
            5090. llama.cpp ran Qwen3.8-27B Q4_K_M with stock settings; NInfer and Cinference Engine
            ran fafstmobel with 15-token DFlash2 drafts.
          </p>
        </section>

        <section className={styles.historySection} aria-labelledby="history-title">
          <div className={styles.historyInner}>
            <div className={styles.sectionIntro}>
              <h2 id="history-title">
                {historyGain.toFixed(1)}× faster
                <br />
                <em>in one week.</em>
              </h2>
              <p className={styles.lead}>
                We tune Cinference Engine one pass at a time and measure every change. This is the
                same benchmark after each pass.
              </p>
            </div>
            <figure className={styles.ladder} aria-labelledby="ladder-caption">
              <ol>
                {speedHistory.map((step) => (
                  <li
                    key={step.date}
                    style={{ '--level': step.tokensPerSecond / 10 } as CSSProperties}
                  >
                    <span className={styles.ladderColumn}>
                      <strong>{step.tokensPerSecond.toFixed(1)}</strong>
                      <span className={styles.ladderBar} />
                    </span>
                    <span className={styles.ladderDate}>{step.date}</span>
                    <span className={styles.ladderLabel}>{step.label}</span>
                  </li>
                ))}
              </ol>
              <figcaption id="ladder-caption">
                Decode tokens per second after a 32,768-token prompt (ninfer_bench, greedy).{' '}
                <a href={inferenceLinks.performance}>Measurements</a>.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.engineSection} id="engine" aria-labelledby="engine-title">
          <div className={styles.sectionIntro}>
            <h2 id="engine-title">
              Custom where
              <br />
              <em>it counts.</em>
            </h2>
            <p className={styles.lead}>
              Cinference Engine starts from NInfer and rewrites the parts that decide how long you
              wait for the next token.
            </p>
          </div>
          <div className={styles.techniques}>
            {speedTechniques.map((technique) => (
              <article key={technique.icon}>
                <TechniqueIcon kind={technique.icon} />
                <h3>{technique.title}</h3>
                <p>{technique.description}</p>
              </article>
            ))}
          </div>
          <dl className={styles.engineSpecs}>
            {engineSpecs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>
                  {spec.value}
                  <span>{spec.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className={styles.sourceRail}>
            <a href={inferenceLinks.source}>
              Engine source <span aria-hidden="true">↗</span>
            </a>
            <a href={inferenceLinks.performance}>
              Performance log <span aria-hidden="true">↗</span>
            </a>
            <a href={inferenceLinks.model}>
              fafstmobel on Hugging Face <span aria-hidden="true">↗</span>
            </a>
            <a href={inferenceLinks.upstream}>
              Built from NInfer <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className={styles.installSection} id="install" aria-labelledby="install-title">
          <div className={styles.sectionIntro}>
            <h2 id="install-title">
              Running in
              <br />
              <em>three steps.</em>
            </h2>
            <p className={styles.lead}>
              The installer builds the engine, downloads and checks the model, and starts a local
              server. Point your app or coding agent at it like any OpenAI-compatible API.
            </p>
          </div>
          <div className={styles.installGrid}>
            <figure className={styles.installArtwork}>
              <img
                src="/products/inference/inference-flow.svg"
                width="1000"
                height="640"
                loading="lazy"
                decoding="async"
                alt="Isometric illustration of a local GPU sending a token stream to an application interface"
              />
            </figure>
            <div className={styles.installCopy}>
              <ol className={styles.installSteps}>
                <li>
                  <strong>Check your setup.</strong>
                  <p>Linux x86_64, an RTX 5090, and an NVIDIA driver for CUDA 13.4.</p>
                </li>
                <li>
                  <strong>Install.</strong>
                  <p>Run the commands below and choose 1.</p>
                </li>
                <li>
                  <strong>Start the server.</strong>
                  <p>Choose 3, then connect to the local endpoint.</p>
                </li>
              </ol>
              <pre className={styles.command}>
                <code>{installCommands}</code>
              </pre>
              <dl className={styles.endpoint}>
                <div>
                  <dt>Base URL</dt>
                  <dd>{localEndpoint.baseUrl}</dd>
                </div>
                <div>
                  <dt>Model</dt>
                  <dd>{localEndpoint.model}</dd>
                </div>
              </dl>
              <a className={`button ${styles.primaryButton}`} href={inferenceLinks.installer}>
                Get the installer <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <h2 id="questions-title">Questions about the engine.</h2>
          <div className={styles.questions}>
            <details>
              <summary>
                Does the speed change what the model writes?<span aria-hidden="true">+</span>
              </summary>
              <p>
                No. The full 27B model checks every drafted token and keeps only what it would have
                produced itself, so the output follows the model’s own distribution.
              </p>
            </details>
            <details>
              <summary>
                How is it faster than NInfer?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Cinference Engine keeps NInfer’s foundation and rewrites its decode path: new
                verification kernels, verify trees, prompt lookup, lookup rounds, and GDN blocks that
                overlap on a second CUDA stream.
              </p>
            </details>
            <details>
              <summary>
                What does it run on?<span aria-hidden="true">+</span>
              </summary>
              <p>
                An RTX 5090 on Linux. The installer sets up fafstmobel, a 27B Qwen3.8 model with
                vision and reasoning, and the engine also loads other NInfer v3 models.
              </p>
            </details>
            <details>
              <summary>
                What does it cost?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Nothing. The engine is Apache-2.0. fafstmobel uses the Swift Open License v1.0, so
                read its LICENSE.swift before commercial use.
              </p>
            </details>
          </div>
        </section>

        <div className={styles.signup}>
          <WaitlistForm signup={inferenceSignup} />
        </div>
      </div>
    </SiteShell>
  )
}
