import { CopyCommand } from '../components/CopyCommand'
import { Icon3D } from '../components/Icon3D'
import { InferenceBars } from '../components/InferenceBars'
import { InferenceLadder } from '../components/InferenceLadder'
import { InferenceStage } from '../components/InferenceStage'
import { InferenceTechniques } from '../components/InferenceTechniques'
import { ProductHero } from '../components/ProductHero'
import { SiteShell } from '../components/SiteShell'
import { TokenRace } from '../components/TokenRace'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  comparedEngines,
  engineComparison,
  engineSpecs,
  inferenceLinks,
  inferenceNavigation,
  inferenceQuestions,
  inferenceSignup,
  installCommands,
  installSteps,
  llamaCppSpeedup,
  localEndpoint,
  peakTokensPerSecond,
  raceFile,
  raceTokens,
  speedHistory,
} from '../content/inference'
import styles from './InferencePage.module.css'

const [, edits] = engineComparison
const historyGain =
  speedHistory[speedHistory.length - 1].tokensPerSecond / speedHistory[0].tokensPerSecond

export function InferencePage() {
  return (
    <SiteShell
      currentPath={routes.inference}
      navigation={inferenceNavigation}
      cta={{ label: 'Install', href: inferenceLinks.installer }}
    >
      <div className={styles.page}>
        <ProductHero
          title="Cinference Engine"
          titleId="inference-title"
          statement={
            <>
              Up to {llamaCppSpeedup.toFixed(1)}× faster than llama.cpp.{' '}
              <em>On the same RTX 5090.</em>
            </>
          }
          lead={`A custom C++/CUDA inference engine. It drafts 15 tokens ahead, checks them all in one pass, and runs a 27B model at up to ${Math.floor(peakTokensPerSecond)} tokens per second on a single GPU.`}
          primary={{ label: 'Get the installer', href: inferenceLinks.installer }}
          secondary={{ label: 'View source', href: inferenceLinks.source }}
          baseline={[
            'Linux x86_64 · one RTX 5090',
            'fafstmobel · a 27B Qwen3.8 model',
            'Engine: Apache-2.0',
          ]}
        >
          <InferenceStage />
        </ProductHero>

        <section className={styles.speedSection} id="speed" aria-labelledby="speed-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="speed-title">
                Same GPU.
                <br />
                <em>Less waiting.</em>
              </h2>
              <p className={styles.lead}>
                We ran llama.cpp, NInfer, and Cinference Engine on one RTX 5090 with the same
                prompts. Here’s a whole-file edit, replayed at each engine’s measured speed.
              </p>
            </div>
            <TokenRace
              lanes={comparedEngines.map((engine) => ({
                engine,
                tokensPerSecond: edits.tokensPerSecond[engine],
                highlight: engine === 'Cinference Engine',
              }))}
              text={raceFile}
              tokenCount={raceTokens}
            />
            <div className={styles.comparison}>
              <InferenceBars />
            </div>
            <p className={styles.finePrint}>
              Decode tokens per second, one request at a time, measured September 30, 2026 on one
              RTX 5090. llama.cpp ran Qwen3.8-27B Q4_K_M with stock settings; NInfer and Cinference
              Engine ran fafstmobel with 15-token DFlash2 drafts.
            </p>
          </div>
        </section>

        <section className={styles.historySection} aria-labelledby="history-title">
          <div className={styles.inner}>
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
            <InferenceLadder />
          </div>
        </section>

        <section className={styles.engineSection} id="engine" aria-labelledby="engine-title">
          <div className={styles.inner}>
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
            <InferenceTechniques />
            <dl className={styles.specs}>
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
          </div>
        </section>

        <section className={styles.installSection} id="install" aria-labelledby="install-title">
          <div className={`${styles.inner} ${styles.installGrid}`}>
            <div className={styles.installCopy}>
              <h2 id="install-title">
                Running in
                <br />
                <em>three steps.</em>
              </h2>
              <p className={styles.lead}>
                The installer builds the engine, downloads and checks the model, and starts a local
                server. Point your app or coding agent at it like any OpenAI-compatible API.
              </p>
              <ol className={styles.steps}>
                {installSteps.map((step, index) => (
                  <li key={step.title}>
                    <kbd aria-hidden="true">{index + 1}</kbd>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.command}>
                <CopyCommand command={installCommands} />
              </div>
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
              <a className={`button ${styles.installButton}`} href={inferenceLinks.installer}>
                Get the installer <span aria-hidden="true">↗</span>
              </a>
            </div>
            <Icon3D className={styles.installIcon}>
              <svg viewBox="10 10 108 108" fill="none">
                <defs>
                  <linearGradient
                    id="cinference-lens"
                    x1="22"
                    y1="40"
                    x2="106"
                    y2="88"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#dfe8ff" />
                    <stop offset="0.45" stopColor="#89adff" />
                    <stop offset="1" stopColor="#5c64ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M22 64c11-19 26-29 42-29s31 10 42 29c-11 19-26 29-42 29S33 83 22 64Z"
                  stroke="url(#cinference-lens)"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgb(92 100 255 / 80%))' }}
                />
                <circle cx="64" cy="64" r="15" stroke="#89adff" strokeWidth="4" />
                <circle
                  cx="64"
                  cy="64"
                  r="6.5"
                  fill="#f3f6ff"
                  style={{ filter: 'drop-shadow(0 0 6px #89adff)' }}
                />
              </svg>
            </Icon3D>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <div className={`${styles.inner} ${styles.questionsGrid}`}>
            <h2 id="questions-title">Questions about the engine.</h2>
            <div className={styles.questions}>
              {inferenceQuestions.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.signup}>
          <WaitlistForm signup={inferenceSignup} />
        </div>
      </div>
    </SiteShell>
  )
}
