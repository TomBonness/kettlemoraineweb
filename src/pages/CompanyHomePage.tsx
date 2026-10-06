import { CinmuxWindow } from '../components/CinmuxWindow'
import { HomeCardDictation } from '../components/HomeCardDictation'
import { HomeCardDraft } from '../components/HomeCardDraft'
import { HomeCardMicro } from '../components/HomeCardMicro'
import { HomeWorkspace } from '../components/HomeWorkspace'
import { SiteShell } from '../components/SiteShell'
import { WorkspacePanes } from '../components/WorkspaceStage'
import { productCatalog, routes } from '../content/catalog'
import { heroFolders, heroTabs, omarchyThemes } from '../content/cinmux'
import { llamaCppSpeedup } from '../content/inference'
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

export function CompanyHomePage() {
  const [openMicro, inference, lavtype, cinmux] = productCatalog

  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <section className={styles.hero} aria-labelledby="company-heading">
        <div className={styles.heroGrid} aria-hidden="true" />
        <img
          className={styles.heroArtwork}
          src="/brand/contours.svg"
          width="1200"
          height="1000"
          alt=""
        />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="company-heading" aria-label="You have work to do.">
              <span aria-hidden="true">You have</span>
              <span aria-hidden="true">work to do.</span>
            </h1>
            <div>
              <p className={styles.heroStatement}>
                We’re building hardware, software, and local inference for people who would rather
                be making something than managing their computer.
              </p>
              <div className={styles.heroActions}>
                <a className={`button ${styles.heroPrimary}`} href="#products">
                  See what we’re building <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </div>
          <HomeWorkspace />
        </div>
      </section>

      <section className={styles.products} id="products" aria-labelledby="products-heading">
        <div className={styles.productsInner}>
          <header className={styles.productsIntro}>
            <div>
              <h2 id="products-heading">
                <span>Here’s where</span>
                <span>we’re starting.</span>
              </h2>
            </div>
            <p>
              We’re starting with the actions you repeat, the words you want to write, the time
              spent waiting for an answer, and the terminals you leave running.
            </p>
          </header>

          <div className={styles.featureStack}>
            <a
              className={`${styles.feature} ${styles.openMicroFeature}`}
              href={openMicro.path}
              aria-label={`Explore ${openMicro.name}`}
            >
              <div className={styles.openMicroMedia}>
                <HomeCardMicro />
              </div>
              <div className={styles.featureCopy}>
                <h3>{openMicro.name}</h3>
                <p className={styles.productSummary}>{openMicro.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Controls</dt>
                    <dd>12 keys + encoder + touch</dd>
                  </div>
                  <div>
                    <dt>Connection</dt>
                    <dd>USB-C + Bluetooth</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore Open Micro <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.inferenceFeature}`}
              href={inference.path}
              aria-label={`Explore ${inference.name}`}
            >
              <div className={styles.inferenceMedia}>
                <HomeCardDraft />
              </div>
              <div className={styles.featureCopy}>
                <h3>{inference.name}</h3>
                <p className={styles.productSummary}>{inference.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>vs llama.cpp</dt>
                    <dd>Up to {llamaCppSpeedup.toFixed(1)}× faster</dd>
                  </div>
                  <div>
                    <dt>Hardware</dt>
                    <dd>One RTX 5090</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore Cinference Engine <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.lavtypeFeature}`}
              href={lavtype.path}
              aria-label={`Explore ${lavtype.name}`}
            >
              <div className={styles.featureCopy}>
                <h3>{lavtype.name}</h3>
                <p className={styles.productSummary}>{lavtype.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Recognition</dt>
                    <dd>Local</dd>
                  </div>
                  <div>
                    <dt>Platforms</dt>
                    <dd>macOS + X11 Linux</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore Lavtype <span aria-hidden="true">↗</span>
                </span>
              </div>
              <div className={styles.lavtypeMedia}>
                <HomeCardDictation />
              </div>
            </a>

            <a
              className={`${styles.feature} ${styles.cinmuxFeature}`}
              href={cinmux.path}
              aria-label={`Explore ${cinmux.name}`}
            >
              <div className={styles.featureCopy}>
                <h3>{cinmux.name}</h3>
                <p className={styles.productSummary}>{cinmux.summary}</p>
                <dl className={styles.productFacts}>
                  <div>
                    <dt>Agent status</dt>
                    <dd>Working · Needs input · Done</dd>
                  </div>
                  <div>
                    <dt>Runs on</dt>
                    <dd>Linux, macOS + SSH</dd>
                  </div>
                </dl>
                <span className={styles.productLink}>
                  Explore Cinmux <span aria-hidden="true">↗</span>
                </span>
              </div>
              <div className={styles.cinmuxMedia}>
                <CinmuxWindow
                  className={styles.cinmuxWindow}
                  label="The Cinmux window coming apart into its folders, tab list and tmux panes"
                  theme={omarchyThemes[0]}
                  tabs={heroTabs}
                  folders={heroFolders}
                  selectedId="build"
                  split="split"
                  layered
                  panes={<WorkspacePanes />}
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.principlesInner}>
          <div className={styles.principlesIntro}>
            <div>
              <h2 id="principles-title">
                The work
                <br />
                <em>comes first.</em>
              </h2>
            </div>
            <p>
              We want a computer to feel like a tool you know, not a collection of systems you have
              to keep happy. That’s a big ambition. We’re taking it one useful piece at a time.
            </p>
          </div>
          <div className={styles.principleGrid}>
            <article>
              <h3>Start with what gets in the way.</h3>
              <p>
                The extra click, the copied transcript, the wait for an answer. Those are small
                interruptions until they fill your day.
              </p>
            </article>
            <article>
              <h3>Leave room for the owner.</h3>
              <p>
                We publish Open Micro’s designs and Lavtype’s source code. You can read them,
                change them, and take the work in a direction we didn’t plan.
              </p>
            </article>
            <article>
              <h3>Fit the way you work.</h3>
              <p>
                Keep your favorite editor, your shortcuts, your habits. We’re building tools
                that make your setup more useful, without asking you to start over.
              </p>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
