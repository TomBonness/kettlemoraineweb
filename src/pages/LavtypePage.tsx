import { Icon3D } from '../components/Icon3D'
import { LavtypeEnclosure } from '../components/LavtypeEnclosure'
import { LavtypePlatforms } from '../components/LavtypePlatforms'
import { LavtypeSequence } from '../components/LavtypeSequence'
import { LavtypeStage } from '../components/LavtypeStage'
import { ProductHero } from '../components/ProductHero'
import { SiteShell } from '../components/SiteShell'
import { routes } from '../content/catalog'
import {
  lavtypeHero,
  lavtypeLinks,
  lavtypeNavigation,
  lavtypePlatform,
  lavtypeProcess,
  lavtypeQuestions,
  lavtypeRecognition,
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
        <ProductHero
          title="Lavtype"
          titleId="lavtype-title"
          statement={
            <>
              {lavtypeHero.statement}
              <br />
              <em>{lavtypeHero.statementEmphasis}</em>
            </>
          }
          lead={lavtypeHero.outcome}
          primary={{ label: 'Download Lavtype', href: lavtypeLinks.download }}
          secondary={{ label: 'View source', href: lavtypeLinks.source }}
          baseline={[lavtypeHero.compatibility, 'Open source · MIT licensed']}
        >
          <LavtypeStage />
        </ProductHero>

        <section className={styles.processSection} id="how-it-works" aria-labelledby="process-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="process-title">
                {lavtypeProcess.title}
                <br />
                <em>{lavtypeProcess.titleEmphasis}</em>
              </h2>
              <p className={styles.lead}>{lavtypeProcess.lead}</p>
            </div>
            <LavtypeSequence />
          </div>
        </section>

        <section
          className={styles.localSection}
          id="local-recognition"
          aria-labelledby="local-recognition-title"
        >
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="local-recognition-title">
                {lavtypeRecognition.title}
                <br />
                <em>{lavtypeRecognition.titleEmphasis}</em>
              </h2>
              <p className={styles.lead}>{lavtypeRecognition.lead}</p>
            </div>
            <LavtypeEnclosure />
            <div className={styles.recognition}>
              <div>
                <p className={styles.body}>{lavtypeRecognition.body}</p>
                <p className={styles.output}>
                  <span aria-hidden="true" />
                  {lavtypeRecognition.output}
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
          </div>
        </section>

        <section className={styles.platformSection} id="platform" aria-labelledby="platform-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="platform-title">
                {lavtypePlatform.title}
                <br />
                <em>{lavtypePlatform.titleEmphasis}</em>
              </h2>
              <p className={styles.lead}>{lavtypePlatform.lead}</p>
            </div>
            <LavtypePlatforms />
            <dl className={styles.facts}>
              {platformDetails.slice(6).map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={styles.downloadSection} aria-labelledby="download-title">
          <div className={`${styles.inner} ${styles.downloadGrid}`}>
            <div className={styles.downloadCopy}>
              <h2 id="download-title">
                {lavtypePlatform.download}
                <br />
                <em>{lavtypePlatform.downloadEmphasis}</em>
              </h2>
              <p className={styles.lead}>{lavtypePlatform.downloadLead}</p>
              <div className={styles.downloadActions}>
                <a className={`button ${styles.primary}`} href={lavtypeLinks.download}>
                  Download Lavtype <span aria-hidden="true">↗</span>
                </a>
                <a className={styles.textLink} href={lavtypeLinks.installGuide}>
                  Install guide <span aria-hidden="true">↗</span>
                </a>
                <a className={styles.textLink} href={lavtypeLinks.source}>
                  Source <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className={styles.downloadNote}>
                {lavtypeHero.compatibility} · {platformDetails[2][0]}: {platformDetails[2][1]}
              </p>
            </div>
            <Icon3D className={styles.icon}>
              <svg viewBox="0 0 128 128" fill="none">
                <defs>
                  <linearGradient id="lavtype-mic" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8fb4ff" />
                    <stop offset="0.55" stopColor="#a98bff" />
                    <stop offset="1" stopColor="#f09ad0" />
                  </linearGradient>
                </defs>
                <g style={{ filter: 'drop-shadow(0 0 7px rgb(169 139 255 / 70%))' }}>
                  <ellipse cx="64" cy="50" rx="15" ry="20" fill="url(#lavtype-mic)" />
                  <path
                    d="M39 56c0 17 11 27 25 27s25-10 25-27"
                    stroke="url(#lavtype-mic)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M64 83v14M50 99h28"
                    stroke="url(#lavtype-mic)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </Icon3D>
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <div className={`${styles.inner} ${styles.questionsGrid}`}>
            <h2 id="questions-title">Good to know.</h2>
            <div className={styles.questions}>
              {lavtypeQuestions.map((item) => (
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
      </div>
    </SiteShell>
  )
}
