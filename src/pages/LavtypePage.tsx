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
          <div className={styles.heroCopy}>
            <p className="eyebrow">{lavtypeHero.category}</p>
            <h1 id="lavtype-title">Lavtype</h1>
            <p className={styles.outcome}>{lavtypeHero.outcome}</p>
            <p className={styles.compatibility}>{lavtypeHero.compatibility}</p>
            <div className={styles.heroActions}>
              <a className={`button ${styles.primaryCta}`} href={lavtypeLinks.download}>Download Lavtype <span aria-hidden="true">↗</span></a>
              <a className="button buttonQuiet" href={lavtypeLinks.source}>View source <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <VoiceTrace id="how-it-works" />
        </section>

        <section className={`section ${styles.localRecognition}`} id="local-recognition" aria-labelledby="local-recognition-title">
          <div className={`sectionInner ${styles.statementGrid}`}>
            <div>
              <p className="eyebrow">Local recognition</p>
              <h2 id="local-recognition-title">No cloud recognizer.</h2>
              <p className="sectionLead">
                Parakeet is downloaded only after you choose it and then runs locally/offline. On macOS, Lavtype requires on-device Apple Speech and never falls back to Apple’s network recognizer.
              </p>
            </div>
            <dl className={styles.darkDetails}>
              {localRecognitionDetails.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={`section ${styles.platform}`} id="platform" aria-labelledby="platform-title">
          <div className="sectionInner">
            <p className="eyebrow">Platform</p>
            <h2 id="platform-title">Built for macOS and X11 Linux.</h2>
            <dl className={styles.detailsGrid}>
              {platformDetails.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.platformActions}>
              <a className={`button ${styles.primaryCta}`} href={lavtypeLinks.download}>Download Lavtype <span aria-hidden="true">↗</span></a>
              <a className="sourceLink" href={lavtypeLinks.source}>View source <span aria-hidden="true">↗</span></a>
              <a className="sourceLink" href={lavtypeLinks.installGuide}>Read the install guide <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
