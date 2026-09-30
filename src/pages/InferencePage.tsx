import { SiteShell } from '../components/SiteShell'
import { routes } from '../content/catalog'
import {
  inferenceLinks,
  inferenceNavigation,
  installCommands,
  localEndpoint,
  speedTechniques,
  throughputResults,
  verificationChecks,
} from '../content/inference'
import styles from './InferencePage.module.css'

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
      ) : (
        <>
          <path d="M4 24h18m-12 8h12M4 40h18" />
          <rect x="38" y="10" width="44" height="44" rx="4" />
          <rect x="50" y="22" width="20" height="20" rx="2" />
          <path d="M48 10V3m12 7V3m12 7V3M48 61v-7m12 7v-7m12 7v-7M38 20h-7m7 12h-7m7 12h-7M82 20h7m-7 12h7m-7 12h7" />
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
              Less waiting,
              <br />
              <em>on hardware you own.</em>
            </p>
            <p className={styles.heroLead}>
              An open-source C++/CUDA inference engine for one RTX 5090. It serves a 27B model with
              a 256K-token context window and image input through an OpenAI-compatible API on your
              own machine.
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
              <span className={styles.metricNumber}>256K</span>
              <div>
                <span>tokens of context</span>
                <small>On one RTX 5090 (32 GB)</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.speedSection} id="speed" aria-labelledby="speed-title">
          <div className={styles.sectionIntro}>
            <h2 id="speed-title">
              Shorter waits,
              <br />
              <em>measured.</em>
            </h2>
            <p className={styles.lead}>
              The engine drafts several tokens ahead and checks them together, so each step can
              produce more than one token. How many depends on how predictable the output is.
            </p>
          </div>
          <figure className={styles.speedPanel} aria-labelledby="throughput-caption">
            <figcaption className={styles.panelCaption} id="throughput-caption">
              <strong>Tokens per second on one RTX 5090.</strong>
              <span>One request at a time. Higher is faster.</span>
            </figcaption>
            <div className={styles.throughputPlot}>
              {throughputResults.map((result) => (
                <div className={styles.throughputRow} key={result.label}>
                  <div className={styles.throughputLabel}>
                    <span>
                      {result.label}
                      <small>{result.detail}</small>
                    </span>
                    <strong>{result.tokensPerSecond.toFixed(1)}</strong>
                  </div>
                  <div className={styles.throughputTrack}>
                    <span style={{ width: `${(result.tokensPerSecond / 1000) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className={styles.chartAxis} aria-hidden="true">
                <span>0</span>
                <span>250</span>
                <span>500</span>
                <span>750</span>
                <span>1,000</span>
              </div>
            </div>
            <p className={styles.finePrint}>
              Chats and edits: ninfer-serve with verify trees and the model’s default sampling; 64
              requests over 16 coding tasks with 1,024 output tokens, and 16 requests over four
              edits that return a complete repository file. Benchmark: ninfer_bench, greedy, 256
              tokens after a 32,768-token prompt from a corpus that repeats a few paragraphs.
              Recorded on a desktop RTX 5090 at its 575&nbsp;W limit.{' '}
              <a href={inferenceLinks.measurements}>Measurements</a>.
            </p>
          </figure>
          <div className={styles.scenarios}>
            {speedTechniques.map((technique) => (
              <article key={technique.icon}>
                <TechniqueIcon kind={technique.icon} />
                <h3>{technique.title}</h3>
                <p>{technique.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.engineSection} id="engine" aria-labelledby="engine-title">
          <div className={styles.engineInner}>
            <div className={styles.engineCopy}>
              <h2 id="engine-title">
                A long context
                <br />
                <em>on one card.</em>
              </h2>
              <p className={styles.lead}>
                The recommended model, fafstmobel, runs with a 262,144-token context window, image
                input, and reasoning in the RTX 5090’s 32 GB.
              </p>
              <p className={styles.bodyCopy}>
                fafstmobel is a 27B Qwen3.8 derivative packaged as one file with its vision encoder
                and DFlash2 drafter, so there’s nothing to convert. The engine also loads other
                compatible NInfer v3 models by path.
              </p>
              <a className={styles.textLink} href={inferenceLinks.model}>
                Read the model card <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure className={styles.recallCheck} aria-labelledby="recall-caption">
              <figcaption id="recall-caption">
                <strong>One long-context check.</strong>
                <span>Installer verification with the full 256K profile.</span>
              </figcaption>
              <div className={styles.recallResult}>
                <span className={styles.recallNumber}>259,749</span>
                <p>
                  prompt tokens
                  <br />
                  <span>The model recalled a code placed at the very beginning.</span>
                </p>
              </div>
              <p className={styles.checksLabel}>Also completed</p>
              <ul className={styles.checks}>
                {verificationChecks.map((check) => (
                  <li key={check}>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 12.5 9.5 18 20 6" />
                    </svg>
                    {check}
                  </li>
                ))}
              </ul>
              <p className={styles.finePrint}>
                Source:{' '}
                <a href={inferenceLinks.verification}>installer verification, September 29, 2026</a>.
                Capacity and integration smoke checks, not a quality or throughput benchmark.
              </p>
            </figure>
            <dl className={styles.modelSpecs}>
              <div>
                <dt>Context window</dt>
                <dd>
                  256<span>K tokens</span>
                </dd>
              </div>
              <div>
                <dt>Parameters</dt>
                <dd>
                  27<span>B</span>
                </dd>
              </div>
              <div>
                <dt>Draft tokens</dt>
                <dd>
                  15<span> per round</span>
                </dd>
              </div>
              <div>
                <dt>Weights</dt>
                <dd className={styles.textSpec}>
                  NVFP4 +<br />
                  FP8
                </dd>
              </div>
            </dl>
            <div className={styles.sourceRail}>
              <a href={inferenceLinks.source}>
                Engine source <span aria-hidden="true">↗</span>
              </a>
              <a href={inferenceLinks.installer}>
                Installer <span aria-hidden="true">↗</span>
              </a>
              <a href={inferenceLinks.model}>
                fafstmobel on Hugging Face <span aria-hidden="true">↗</span>
              </a>
              <a href={inferenceLinks.upstream}>
                Built from NInfer <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.setupSection} id="setup" aria-labelledby="setup-title">
          <div className={styles.sectionIntro}>
            <h2 id="setup-title">
              Runs on
              <br />
              <em>your machine.</em>
            </h2>
            <p className={styles.lead}>
              The installer builds a pinned copy of the engine, downloads and checks the model, and
              starts a local server. Point your application at it like any OpenAI-compatible API.
            </p>
          </div>
          <div className={styles.setupGrid}>
            <figure className={styles.setupArtwork}>
              <img
                src="/products/inference/inference-flow.svg"
                width="1000"
                height="640"
                loading="lazy"
                decoding="async"
                alt="Isometric illustration of a local GPU sending a token stream to an application interface"
              />
              <figcaption>
                Cinference Engine serves the model from your GPU. Your application connects through
                a local, OpenAI-compatible endpoint.
              </figcaption>
            </figure>
            <div className={styles.setupCopy}>
              <h3>
                One menu,
                <br />
                three steps.
              </h3>
              <ol className={styles.setupSteps}>
                <li>
                  <strong>Check your setup.</strong>
                  <p>
                    Linux x86_64, an RTX 5090 with 32 GB, and an NVIDIA driver compatible with CUDA
                    13.4. The installer doesn’t change drivers.
                  </p>
                </li>
                <li>
                  <strong>Install.</strong>
                  <p>
                    Run the commands below and choose 1. The installer builds the engine and
                    downloads about 23&nbsp;GB of model files.
                  </p>
                </li>
                <li>
                  <strong>Start the server.</strong>
                  <p>Choose 3, then connect your application to the local endpoint.</p>
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
              <a className={styles.textLink} href={inferenceLinks.installGuide}>
                Read the installer guide <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <h2 id="questions-title">Questions about the engine.</h2>
          <div className={styles.questions}>
            <details>
              <summary>
                What does Cinference Engine change from NInfer?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Cinference Engine is built from NInfer, an open-source C++/CUDA inference engine,
                and changes the native engine itself: faster DFlash2 verification kernels, verify
                trees with prompt lookup, lookup rounds, draft windows of up to 10 tokens for MTP
                decoding, capture-based CUDA Graph reuse, and faster long-prompt prefill.
              </p>
            </details>
            <details>
              <summary>
                Which GPUs and models does it support?<span aria-hidden="true">+</span>
              </summary>
              <p>
                It’s validated on an RTX 5090 with 32 GB, and the installer builds for Blackwell
                (sm_120a); other GPUs are not validated. The installer sets up fafstmobel, and the
                engine also loads other compatible NInfer v3 models by path. fafstmobel’s outputs
                are unmoderated and aren’t suitable for safety-critical use.
              </p>
            </details>
            <details>
              <summary>
                How fast will it be on my work?<span aria-hidden="true">+</span>
              </summary>
              <p>
                It depends on how much of the output the drafter predicts. On one RTX 5090, coding
                chats with reasoning averaged 307.5 tokens per second and complete-file edits 564.6;
                output that copies its prompt goes fastest. Long prompts also take time to process
                before the first token: a 190K-token request waited 51.3 seconds.
              </p>
            </details>
            <details>
              <summary>
                Can other computers connect to it?<span aria-hidden="true">+</span>
              </summary>
              <p>
                By default, the installer’s server listens on 127.0.0.1 with no authentication and
                handles one request at a time. Keep it on loopback and connect from applications on
                the same machine.
              </p>
            </details>
            <details>
              <summary>
                How is it licensed?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Cinference Engine’s source is Apache-2.0. The fafstmobel model has separate terms:
                its Swift contribution uses the Swift Open License v1.0, whose commercial-use grant
                has a US$1 million gross-revenue threshold. Read the model’s LICENSE.swift before
                commercial use or redistribution.
              </p>
            </details>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
