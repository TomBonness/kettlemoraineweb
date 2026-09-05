import { SiteShell } from '../components/SiteShell'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  codingComparison,
  inferenceNavigation,
  inferenceSignup,
  inferenceSources,
  speedScenarios,
} from '../content/inference'
import styles from './InferencePage.module.css'

function ScenarioIcon({ kind }: { kind: (typeof speedScenarios)[number]['icon'] }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" aria-hidden="true">
      {kind === 'flow' ? (
        <>
          <path d="M4 40h25l10-22 16 34 15-34 10 22h36" />
          <circle cx="80" cy="40" r="4" />
        </>
      ) : kind === 'loop' ? (
        <>
          <path d="M86 21A27 27 0 0 0 35 32m0 0-7-10m7 10 10-7M35 43a27 27 0 0 0 51-11m0 0 7 10m-7-10-10 7" />
          <path d="m55 24-8 8 8 8m10-16 8 8-8 8" />
        </>
      ) : (
        <>
          <rect x="17" y="8" width="86" height="48" rx="5" />
          <path d="M17 20h86M29 30h23m-23 9h34m-34 9h19" />
          <rect x="74" y="30" width="18" height="17" rx="2" />
        </>
      )}
    </svg>
  )
}

function SpeedIllustration() {
  return (
    <figure className={styles.speedPanel} aria-labelledby="speed-illustration-title">
      <figcaption className={styles.speedStatement} id="speed-illustration-title">
        <strong>
          4,000 tokens.
          <br />
          <em>Four seconds.</em>
        </strong>
        <p>
          At our target of 1,000 tokens per second, a 4,000-token response would take four seconds
          to generate. That’s less time waiting before you can read, test, and revise it.
        </p>
      </figcaption>
      <div className={styles.tokenTimeline} aria-hidden="true">
        {[1, 2, 3, 4].map((second) => (
          <div key={second}>
            <span className={styles.tokenBlock} />
            <span>{second.toLocaleString('en-US')},000 tokens</span>
            <small>0{second} s</small>
          </div>
        ))}
      </div>
    </figure>
  )
}

export function InferencePage() {
  return (
    <SiteShell
      currentPath={routes.inference}
      navigation={inferenceNavigation}
      cta={{ label: 'Request access', href: `${routes.inference}#waitlist` }}
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
            <h1 id="inference-title">
              Spend less time
              <br />
              <em>waiting for output.</em>
            </h1>
            <p className={styles.heroLead}>
              We’re building a hosted API for GLM-5.3-Flash on our own hardware, with a target of
              1,000 tokens per second. Less time watching output arrive means more time to work
              with it.
            </p>
            <div className={styles.heroActions}>
              <a className={`button ${styles.primaryButton}`} href="#waitlist">
                Request API access <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href="#speed">
                See what the target means <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className={styles.heroMetric}>
              <span className={styles.metricNumber}>1,000</span>
              <div>
                <span>tokens / second</span>
                <small>Output-throughput target</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.speedSection} id="speed" aria-labelledby="speed-title">
          <div className={styles.sectionIntro}>
            <h2 id="speed-title">
              Shorter waits make
              <br />
              <em>iteration easier.</em>
            </h2>
            <p className={styles.lead}>
              Each generated draft or code change has to arrive before you can judge it. Faster
              decoding can shorten that part of the loop, leaving more time to try another approach.
            </p>
          </div>
          <SpeedIllustration />
          <div className={styles.scenarios}>
            {speedScenarios.map((scenario) => (
              <article key={scenario.icon}>
                <ScenarioIcon kind={scenario.icon} />
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.intelligenceSection}
          id="intelligence"
          aria-labelledby="intelligence-title"
        >
          <div className={styles.intelligenceInner}>
            <div className={styles.intelligenceCopy}>
              <h2 id="intelligence-title">
                Useful output
                <br />
                <em>still comes first.</em>
              </h2>
              <p className={styles.lead}>
                GLM-5.3-Flash is an open-weight model with published coding results worth examining.
              </p>
              <p className={styles.bodyCopy}>
                In Z.ai’s Code Bench v1.0 evaluation, GLM-5.3-Flash at max effort scores 29.0
                against Claude Opus 4.8’s 29.5. That result is one reason we’re working to serve
                this model faster.
              </p>
              <a className={styles.textLink} href={inferenceSources.release}>
                Read the model release <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure className={styles.benchmark} aria-labelledby="benchmark-caption">
              <figcaption id="benchmark-caption">
                <strong>One coding evaluation.</strong>
                <span>Z.ai Code Bench v1.0. Higher is better.</span>
              </figcaption>
              <div className={styles.benchmarkPlot}>
                {codingComparison.map((model) => (
                  <div
                    className={`${styles.benchmarkRow} ${model.highlight ? styles.highlightModel : ''}`}
                    key={model.name}
                  >
                    <div>
                      <span>{model.name}</span>
                      <strong>{model.score.toFixed(1)}</strong>
                    </div>
                    <div className={styles.benchmarkTrack}>
                      <span style={{ width: `${(model.score / 40) * 100}%` }} />
                    </div>
                  </div>
                ))}
                <div className={styles.chartAxis} aria-hidden="true">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
              <div className={styles.benchmarkNote}>
                <span className={styles.scoreGap}>0.5</span>
                <p>
                  points apart
                  <br />
                  <span>on this evaluation</span>
                </p>
              </div>
              <p className={styles.finePrint}>
                Source: <a href={inferenceSources.release}>Z.ai, August 26, 2026</a>.
                Publisher-reported results; GLM at max effort, evaluated using Claude Code 2.1.207.
                Not an Arena rating, proof of overall model equivalence, or a benchmark of our
                infrastructure.
              </p>
            </figure>
            <dl className={styles.modelSpecs}>
              <div>
                <dt>Total parameters</dt>
                <dd>
                  320<span>B</span>
                </dd>
              </div>
              <div>
                <dt>Active parameters</dt>
                <dd>
                  18<span>B</span>
                </dd>
              </div>
              <div>
                <dt>Model context window</dt>
                <dd>
                  1<span>M tokens</span>
                </dd>
              </div>
              <div>
                <dt>Model architecture</dt>
                <dd className={styles.architecture}>
                  Sparse +<br />
                  linear attention
                </dd>
              </div>
            </dl>
            <div className={styles.sourceRail}>
              <a href={inferenceSources.model}>
                Model specifications <span aria-hidden="true">↗</span>
              </a>
              <a href={inferenceSources.arena}>
                Explore Arena rankings <span aria-hidden="true">↗</span>
              </a>
              <a href={inferenceSources.analysis}>
                Artificial Analysis <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.apiSection} id="api" aria-labelledby="api-title">
          <div className={styles.sectionIntro}>
            <h2 id="api-title">
              A hosted API for
              <br />
              <em>your application.</em>
            </h2>
            <p className={styles.lead}>
              We’re developing inference on Kettle Moraine’s hardware, accessed over the network.
              Connect your application without managing the model or its hardware.
            </p>
          </div>
          <div className={styles.apiGrid}>
            <figure className={styles.apiArtwork}>
              <img
                src="/products/inference/inference-flow.svg"
                width="1000"
                height="640"
                loading="lazy"
                decoding="async"
                alt="Isometric illustration of a hosted compute module sending a token stream to an application interface"
              />
              <figcaption>
                Architecture concept: GLM-5.3-Flash on our hardware, connected to your app through an API.
              </figcaption>
            </figure>
            <div className={styles.apiCopy}>
              <h3>
                Access starts
                <br />with an invitation.
              </h3>
              <p>
                Request access if shorter generation waits would help your application. We’ll send
                API access and launch updates by email.
              </p>
              <ol className={styles.accessSteps}>
                <li>
                  <strong>Request access.</strong>
                  <p>Add your email to the API access list.</p>
                </li>
                <li>
                  <strong>Watch for access details.</strong>
                  <p>We’ll email you about invitations and launch.</p>
                </li>
                <li>
                  <strong>Connect when invited.</strong>
                  <p>Use the endpoint and API credentials provided with your access details.</p>
                </li>
              </ol>
              <a className={styles.textLink} href="#waitlist">
                Request API access <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <h2 id="questions-title">Questions about the service.</h2>
          <div className={styles.questions}>
            <details>
              <summary>
                What does 1,000 TPS actually mean?<span aria-hidden="true">+</span>
              </summary>
              <p>
                TPS means tokens per second: the rate at which a model generates pieces of text. A
                token might be a word, part of a word, or punctuation. Our 1,000 TPS figure is an
                output-throughput target, not a measured result. At that rate, 4,000 tokens would
                take four seconds to generate, excluding time to first token, prompt processing,
                networking, tools, and additional reasoning tokens.
              </p>
            </details>
            <details>
              <summary>
                Is throughput the same as response time?<span aria-hidden="true">+</span>
              </summary>
              <p>
                No. Throughput measures generation speed. Time to first token also includes getting
                the request to the model and processing the prompt. A full response can include
                reasoning and tool calls. Our 1,000 TPS target concerns output throughput.
              </p>
            </details>
            <details>
              <summary>
                Where does the model run?<span aria-hidden="true">+</span>
              </summary>
              <p>
                We’re building a service that hosts GLM-5.3-Flash on Kettle Moraine’s own hardware.
                Your application sends requests over the network through an API. The model does not
                run on your device, and this is not an offline service.
              </p>
            </details>
            <details>
              <summary>
                How should I read the model comparison?<span aria-hidden="true">+</span>
              </summary>
              <p>
                The chart shows Z.ai Code Bench v1.0, published by the model’s developer on August
                26, 2026 using Claude Code 2.1.207. GLM-5.3-Flash at max effort scored 29.0;
                Claude Opus 4.8 scored 29.5. These are publisher-reported results, not Arena ratings,
                overall model equivalence, or a benchmark of our serving hardware. The linked
                sources explain the evaluation and model specifications.
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
