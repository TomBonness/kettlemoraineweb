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
      <div className={styles.panelTopline}>
        <span className={styles.eyebrow}>A different sense of time</span>
        <span className={styles.annotation}>Illustrative generation time</span>
      </div>
      <figcaption className={styles.speedStatement} id="speed-illustration-title">
        <strong>4,000 tokens.<br /><em>Four seconds.</em></strong>
        <p>A substantial response, in a moment. At 1,000 tokens per second, the space between asking and making gets a lot smaller.</p>
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
      <p className={styles.finePrint}>
        4,000 generated tokens ÷ our 1,000 TPS output-throughput target = 4 seconds.
        Illustrative, not a measured service result. Excludes prompt processing, network latency,
        tool execution, and additional reasoning tokens. Performance varies with workload and concurrency.
      </p>
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
            <div className={styles.heroTopline}>
              <p className={styles.eyebrow}><span className={styles.brandDot} /> Kettle Moraine / Inference</p>
              <span className={styles.modelTag}>Powered by GLM-5.3-Flash</span>
            </div>
            <h1 id="inference-title">A thousand tokens.<br /><em>A different rhythm.</em></h1>
            <p className={styles.heroLead}>
              Less waiting between an idea and what it becomes.
              Open-weight intelligence, accelerated on our hardware.
              Built for your next application.
            </p>
            <div className={styles.heroActions}>
              <a className={`button ${styles.primaryButton}`} href="#waitlist">Request API access <span aria-hidden="true">↗</span></a>
              <a className={styles.textLink} href="#speed">Feel the difference <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.heroMetric}>
              <span className={styles.metricNumber}>1,000</span>
              <div><span>tokens / second</span><small>Our inference target</small></div>
            </div>
            <div className={styles.heroBaseline}>
              <span>Open weights. Serious ambition.</span>
              <span>Designed for the next interaction <span aria-hidden="true">↘</span></span>
            </div>
          </div>
        </section>

        <section className={styles.speedSection} id="speed" aria-labelledby="speed-title">
          <div className={styles.sectionIntro}>
            <div><p className={styles.eyebrow}>01 / A new tempo</p><h2 id="speed-title">Waiting is not<br /><em>a workflow.</em></h2></div>
            <p className={styles.lead}>Speed changes more than how quickly text appears. It changes how often you experiment, how freely you iterate, and what an application can feel like.</p>
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

        <section className={styles.intelligenceSection} id="intelligence" aria-labelledby="intelligence-title">
          <div className={styles.intelligenceInner}>
            <div className={styles.intelligenceCopy}>
              <p className={styles.eyebrow}>02 / Substance behind the speed</p>
              <h2 id="intelligence-title">Fast is only<br /><em>half the story.</em></h2>
              <p className={styles.lead}>Meet GLM-5.3-Flash. Open-weight intelligence with a serious coding pedigree.</p>
              <p className={styles.bodyCopy}>In Z.ai’s published Code Bench evaluation, GLM-5.3-Flash at max effort scores 29.0 against Claude Opus 4.8’s 29.5. A narrow gap on this coding evaluation. A compelling model to accelerate.</p>
              <a className={styles.textLink} href={inferenceSources.release}>Read the model release <span aria-hidden="true">↗</span></a>
            </div>
            <figure className={styles.benchmark} aria-labelledby="benchmark-caption">
              <figcaption id="benchmark-caption"><strong>In very good company.</strong><span>Z.ai Code Bench v1.0 · Higher is better</span></figcaption>
              <div className={styles.benchmarkPlot}>
                {codingComparison.map((model) => (
                  <div className={`${styles.benchmarkRow} ${model.highlight ? styles.highlightModel : ''}`} key={model.name}>
                    <div><span>{model.name}</span><strong>{model.score.toFixed(1)}</strong></div>
                    <div className={styles.benchmarkTrack}><span style={{ width: `${model.score / 40 * 100}%` }} /></div>
                    {model.highlight && <small>The model behind 1,000 TPS</small>}
                  </div>
                ))}
                <div className={styles.chartAxis} aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span></div>
              </div>
              <div className={styles.benchmarkNote}><span className={styles.scoreGap}>0.5</span><p>points apart<br /><span>on this evaluation</span></p></div>
              <p className={styles.finePrint}>Source: <a href={inferenceSources.release}>Z.ai, August 26, 2026</a>. Publisher-reported results; GLM at max effort, evaluated using Claude Code 2.1.207. Not an Arena rating, proof of overall model equivalence, or a benchmark of our infrastructure.</p>
            </figure>
            <dl className={styles.modelSpecs}>
              <div><dt>Total parameters</dt><dd>320<span>B</span></dd></div>
              <div><dt>Active parameters</dt><dd>18<span>B</span></dd></div>
              <div><dt>Model context window</dt><dd>1<span>M tokens</span></dd></div>
              <div><dt>Model architecture</dt><dd className={styles.architecture}>Sparse +<br />linear attention</dd></div>
            </dl>
            <div className={styles.sourceRail}>
              <span>Go deeper, at the source.</span>
              <a href={inferenceSources.model}>Model specifications <span aria-hidden="true">↗</span></a>
              <a href={inferenceSources.arena}>Explore Arena rankings <span aria-hidden="true">↗</span></a>
              <a href={inferenceSources.analysis}>Artificial Analysis <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className={styles.apiSection} id="api" aria-labelledby="api-title">
          <div className={styles.sectionIntro}>
            <div><p className={styles.eyebrow}>03 / Your ideas, accelerated</p><h2 id="api-title">Our hardware.<br /><em>Your next big thing.</em></h2></div>
            <p className={styles.lead}>Locally hosted inference at Kettle Moraine. API access for you. Bring the ambition; let the lab focus on the compute.</p>
          </div>
          <div className={styles.apiGrid}>
            <figure className={styles.apiArtwork}>
              <img src="/products/inference/inference-flow.svg" width="1000" height="640" loading="lazy" decoding="async" alt="Isometric illustration of a local compute module sending a token stream to an application interface" />
              <figcaption><span>GLM-5.3-Flash → API → Your application</span><span>Architecture concept</span></figcaption>
            </figure>
            <div className={styles.apiCopy}>
              <h3>One connection.<br />A whole new pace.</h3>
              <p>For the editor that keeps up. The agent that tries one more approach. The product that makes intelligence feel like part of the interface.</p>
              <ol className={styles.accessSteps}>
                <li><span>01</span><div><strong>Tell us you’re interested.</strong><p>Sign up for API access with your email.</p></div></li>
                <li><span>02</span><div><strong>Get your invitation.</strong><p>Access details and onboarding, straight from the lab.</p></div></li>
                <li><span>03</span><div><strong>Bring your application.</strong><p>Connect to your assigned endpoint with your API credentials.</p></div></li>
              </ol>
              <a className={styles.textLink} href="#waitlist">Let’s build something faster <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <h2 id="questions-title">A little more context.</h2>
          <div className={styles.questions}>
            <details><summary>What does 1,000 TPS actually mean?<span aria-hidden="true">+</span></summary><p>TPS means tokens per second: the rate at which a model generates pieces of text. A token might be a word, part of a word, or punctuation. At 1,000 tokens per second, generating 4,000 tokens takes four seconds, before accounting for prompt processing, networking, tools, and additional reasoning.</p></details>
            <details><summary>Is throughput the same as response time?<span aria-hidden="true">+</span></summary><p>No. Throughput measures generation speed. Time to first token also includes getting the request to the model and processing the prompt. A full response can include reasoning and tool calls. Our 1,000 TPS target concerns output throughput; it is not a guarantee of total request latency or speed at every context length and concurrency level.</p></details>
            <details><summary>Where does the model run?<span aria-hidden="true">+</span></summary><p>Our approach is to host GLM-5.3-Flash on Kettle Moraine’s own hardware and expose inference through an API. “Local” describes the lab’s model hosting, not an offline model running on your device. Your application connects over the network.</p></details>
            <details><summary>How should I read the model comparison?<span aria-hidden="true">+</span></summary><p>The chart shows one coding evaluation published by Z.ai, the model’s developer. It compares GLM-5.3-Flash with Claude Opus 4.8 in that evaluation, not across all tasks. Model quality benchmarks and inference speed measure different things. Follow the linked sources for methodology and current results.</p></details>
          </div>
        </section>
        <div className={styles.signup}><WaitlistForm signup={inferenceSignup} /></div>
      </div>
    </SiteShell>
  )
}
