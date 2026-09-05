import { SiteShell } from '../components/SiteShell'
import { VoiceTrace } from '../components/VoiceTrace'
import { routes } from '../content/catalog'
import {
  lavtypeHero,
  lavtypeLinks,
  lavtypeNavigation,
  localRecognitionDetails,
  platformDetails,
} from '../content/lavtype'
import styles from './LavtypePage.module.css'

export function LavtypePage() {
  return (
    <SiteShell
      currentPath={routes.lavtype}
      navigation={lavtypeNavigation}
      cta={{ label: 'Download', href: lavtypeLinks.download }}
    >
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="lavtype-title">
          <div className={styles.heroInner}>
            <div className={styles.heroTopline}>
              <p className={styles.eyebrow}>
                <span className={styles.brandDot} /> Kettle Moraine / Lavtype
              </p>
              <span className={styles.heroTag}>Local voice → text</span>
            </div>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <h1 id="lavtype-title">Lavtype</h1>
                <p className={styles.heroStatement}>
                  Your voice.
                  <br />
                  <em>Right where you work.</em>
                </p>
                <p className={styles.outcome}>{lavtypeHero.outcome}</p>
                <div className={styles.heroActions}>
                  <a className={`button ${styles.primaryCta}`} href={lavtypeLinks.download}>
                    Download Lavtype <span aria-hidden="true">↗</span>
                  </a>
                  <a className={styles.textLink} href={lavtypeLinks.source}>
                    View source <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              <figure className={styles.heroArt}>
                <img
                  src="/products/lavtype/voice-to-text.svg"
                  width="680"
                  height="660"
                  alt="A spoken waveform becomes the sentence ‘Meet me at the trailhead at nine.’ above a held shortcut key."
                  fetchPriority="high"
                />
                <figcaption>
                  <span>Voice in. Words out.</span>
                  <span>One shortcut.</span>
                </figcaption>
              </figure>
            </div>
            <div className={styles.heroBaseline}>
              <span>{lavtypeHero.compatibility}</span>
              <span>Open source · MIT licensed</span>
            </div>
          </div>
        </section>

        <section
          className={styles.processSection}
          id="how-it-works"
          aria-labelledby="process-title"
        >
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>01 / From thought to text</p>
              <h2 id="process-title">
                Say it.
                <br />
                <em>Keep going.</em>
              </h2>
            </div>
            <p className={styles.lead}>
              The message, the note, the next sentence. Speak it instead of typing it. Lavtype sends
              one complete transcript to the app that is focused when recognition finishes—not to a
              separate transcript window.
            </p>
          </div>
          <VoiceTrace />
          <div className={styles.processNotes}>
            <p>
              <span>01—03</span> Hold. Speak. Release. That’s the workflow.
            </p>
            <p>Up to 55 seconds per hold. Final results only.</p>
          </div>
        </section>

        <section
          className={styles.privacySection}
          id="local-recognition"
          aria-labelledby="local-recognition-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.privacyGrid}>
              <div>
                <p className={styles.eyebrow}>02 / Recognition, kept close</p>
                <h2 id="local-recognition-title">
                  Your machine.
                  <br />
                  <em>Your words.</em>
                </h2>
                <p className={styles.lead}>
                  No cloud recognizer. No transcript history. No clipboard fallback.
                </p>
                <p className={styles.bodyCopy}>
                  Choose Parakeet and explicitly download its English model to recognize speech
                  locally, offline. Or, on macOS, use Apple Speech when on-device recognition is
                  supported. Lavtype never falls back to Apple’s network recognizer.
                </p>
              </div>
              <figure className={styles.localDiagram}>
                <figcaption>
                  <span className={styles.statusDot} /> Recognition on your device
                </figcaption>
                <div className={styles.diagramInput}>
                  <svg viewBox="0 0 32 40" fill="none" aria-hidden="true">
                    <rect x="10" y="2" width="12" height="23" rx="6" />
                    <path d="M5 17v3a11 11 0 0 0 22 0v-3M16 31v7m-6 0h12" />
                  </svg>
                  <span>Your voice</span>
                </div>
                <div className={styles.recognizerChoices}>
                  <div>
                    <strong>Parakeet</strong>
                    <span>Downloaded model</span>
                    <small>Local / offline</small>
                  </div>
                  <span className={styles.choiceOr}>or</span>
                  <div>
                    <strong>Apple Speech</strong>
                    <span>On-device support required</span>
                    <small>macOS only</small>
                  </div>
                </div>
                <div className={styles.diagramOutput}>
                  <span aria-hidden="true">↓</span>
                  <span>Final transcript → focused app</span>
                </div>
                <p className={styles.diagramNote}>
                  Model setup may need a download.
                  <br />
                  Recognition stays on this side of the boundary.
                </p>
              </figure>
            </div>
            <dl className={styles.recognitionDetails}>
              {localRecognitionDetails.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={styles.platformSection} id="platform" aria-labelledby="platform-title">
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>03 / Make room for your voice</p>
              <h2 id="platform-title">
                Small software.
                <br />
                <em>Clear requirements.</em>
              </h2>
            </div>
            <p className={styles.lead}>
              Built for macOS and X11 Linux. Check your platform below, then grab a release. The
              source and install instructions are there if you want a closer look.
            </p>
          </div>
          <div className={styles.platformGrid}>
            <article className={styles.platformCard} aria-labelledby="macos-title">
              <div className={styles.platformHeading}>
                <h3 id="macos-title">macOS</h3>
                <span>01 / DMG</span>
              </div>
              <dl className={styles.platformDetails}>
                {platformDetails.slice(0, 3).map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </article>
            <article className={styles.platformCard} aria-labelledby="linux-title">
              <div className={styles.platformHeading}>
                <h3 id="linux-title">Linux</h3>
                <span>02 / AppImage</span>
              </div>
              <dl className={styles.platformDetails}>
                {platformDetails.slice(3, 6).map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
          <dl className={styles.sharedDetails}>
            {platformDetails.slice(6).map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.downloadRow}>
            <div className={styles.downloadIdentity}>
              <img
                src="/products/lavtype/lavtype-icon.png"
                width="1024"
                height="1024"
                alt=""
                loading="lazy"
              />
              <div>
                <strong>A shortcut to your next sentence.</strong>
                <span>Lavtype · Local voice typing</span>
              </div>
            </div>
            <div className={styles.platformActions}>
              <a className={`button ${styles.primaryCta}`} href={lavtypeLinks.download}>
                Download Lavtype <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href={lavtypeLinks.installGuide}>
                Install guide <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textLink} href={lavtypeLinks.source}>
                Source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
