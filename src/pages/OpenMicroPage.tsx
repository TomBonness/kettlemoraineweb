import { ExplodedStory } from '../components/ExplodedStory'
import { HeroProduct } from '../components/HeroProduct'
import { StatusLanguage } from '../components/StatusLanguage'
import { SiteShell } from '../components/SiteShell'
import { SpecsGrid } from '../components/SpecsGrid'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  connectivityCards,
  headings,
  licenses,
  marketingRenders,
  navigation,
  openMicroSignup,
  openSourceStatement,
  productCopy,
} from '../content/openMicro'
import styles from './OpenMicroPage.module.css'

const openMicroNavigation = navigation.map((item) => ({
  ...item,
  href: `${routes.openMicro}${item.href}`,
}))

export function OpenMicroPage() {
  return (
    <SiteShell
      currentPath={routes.openMicro}
      navigation={openMicroNavigation}
      cta={{ label: productCopy.navigationCta, href: `${routes.openMicro}#waitlist` }}
    >
      <HeroProduct />
      <ExplodedStory />

      <section className={styles.connectivity} aria-labelledby="connectivity-title">
        <div className={styles.inner}>
          <header className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>02 / Connection & control</p>
              <h2 id="connectivity-title">{headings.connectivity}</h2>
            </div>
            <p className={styles.lead}>{productCopy.connectivityLead}</p>
          </header>
          <figure className={styles.deskScene}>
            <img
              {...marketingRenders.desk}
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 92vw, 1184px"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>02 / In good company</span>
              <span>A little space. A more hands-on workflow.</span>
              <span>Concept visualization</span>
            </figcaption>
          </figure>
          <div className={styles.connectivityGrid}>
            {connectivityCards.map((card, index) => (
              <article className={styles.connection} key={card.title}>
                <svg
                  className={styles.connectionIcon}
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {index === 0 && (
                    <>
                      <rect x="13" y="20" width="38" height="24" rx="12" />
                      <rect x="23" y="29" width="18" height="6" rx="3" />
                      <path d="M6 32h7m38 0h7" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <path d="m28 9 15 13-22 20m7-33v46l15-13-22-20M12 21a23 23 0 0 0 0 22m40-22a23 23 0 0 1 0 22" />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <path d="M15 10v44m17-44v44m17-44v44" />
                      <path
                        d="M10 23h10v8H10zm17 13h10v8H27zm17-21h10v8H44z"
                        fill="var(--canvas)"
                      />
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <rect x="9" y="12" width="46" height="32" rx="2" />
                      <path d="M24 53h16m-8-9v9m-9-30-5 5 5 5m18-10 5 5-5 5m-7-12-4 14" />
                    </>
                  )}
                </svg>
                <small>{card.label}</small>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <StatusLanguage />
      <SpecsGrid />

      <section className={styles.openSource} aria-labelledby="open-source-title">
        <div className={`${styles.inner} ${styles.sourceLayout}`}>
          <figure className={styles.studioScene}>
            <img
              {...marketingRenders.studio}
              sizes="(max-width: 900px) 100vw, (max-width: 1280px) 48vw, 592px"
              loading="lazy"
              decoding="async"
            />
            <figcaption>07 / Open Micro — studio study</figcaption>
          </figure>
          <div>
            <p className={styles.eyebrow}>05 / Yours to understand</p>
            <h2 id="open-source-title">{headings.openSource}</h2>
            <p className={styles.sourceStatement}>{openSourceStatement}</p>
            <a className={styles.sourceLink} href="https://github.com/TomBonness/open-micro">
              View Open Micro source<span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className={styles.sourceDetails}>
          <dl className={styles.licenseList}>
            {licenses.map(([scope, license]) => (
              <div key={scope}>
                <dt>{scope}</dt>
                <dd>{license}</dd>
              </div>
            ))}
          </dl>
          <aside className={styles.designStatus} aria-labelledby="design-status-title">
            <p className={styles.eyebrow}>Design, in the open</p>
            <div>
              <h3 id="design-status-title">A concept. Not a qualified hardware release.</h3>
              <p>
                These are concept visualizations, not photographs. Component envelopes are
                simplified; material appearance and LED illumination are art-directed.
              </p>
              <p>
                <strong>Do not fabricate or assemble the current hardware.</strong> Electrical and
                mechanical blockers remain unresolved. No fabricated unit has completed
                qualification.
              </p>
              <a
                className={styles.sourceLink}
                href="https://github.com/TomBonness/open-micro/blob/main/docs/qualification.md"
              >
                Read the hardware qualification notes<span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <WaitlistForm signup={openMicroSignup} />
    </SiteShell>
  )
}
