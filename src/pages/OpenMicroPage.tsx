import type { ReactNode } from 'react'
import { MicroHero } from '../components/MicroHero'
import { MicroLayers } from '../components/MicroLayers'
import { MicroLit } from '../components/MicroLit'
import { MicroSpecs } from '../components/MicroSpecs'
import { ProductHero } from '../components/ProductHero'
import { SiteShell } from '../components/SiteShell'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  connectivityCards,
  headings,
  hero,
  licenses,
  marketingRenders,
  navigation,
  openMicroSignup,
  openSourceStatement,
  productCopy,
  sourceLinks,
} from '../content/openMicro'
import styles from './OpenMicroPage.module.css'

const openMicroNavigation = navigation.map((item) => ({
  ...item,
  href: `${routes.openMicro}${item.href}`,
}))

function SectionTitle({ id, lines }: { id: string; lines: readonly [string, string] }) {
  return (
    <h2 id={id}>
      {lines[0]}
      <br />
      <em>{lines[1]}</em>
    </h2>
  )
}

function SectionIntro({ children, lead }: { children: ReactNode; lead: ReactNode }) {
  return (
    <div className={styles.sectionIntro}>
      {children}
      <p className={styles.lead}>{lead}</p>
    </div>
  )
}

/** Line-art icons for the four connectivity cards, in `connectivityCards` order. */
const connectionIcons: ReactNode[] = [
  <>
    <rect x="13" y="20" width="38" height="24" rx="12" />
    <rect x="23" y="29" width="18" height="6" rx="3" />
    <path d="M6 32h7m38 0h7" />
  </>,
  <path d="m28 9 15 13-22 20m7-33v46l15-13-22-20M12 21a23 23 0 0 0 0 22m40-22a23 23 0 0 1 0 22" />,
  <>
    <path d="M15 10v44m17-44v44m17-44v44" />
    <path d="M10 23h10v8H10zm17 13h10v8H27zm17-21h10v8H44z" fill="var(--om-card)" />
  </>,
  <>
    <rect x="9" y="12" width="46" height="32" rx="2" />
    <path d="M24 53h16m-8-9v9m-9-30-5 5 5 5m18-10 5 5-5 5m-7-12-4 14" />
  </>,
]

export function OpenMicroPage() {
  return (
    <SiteShell
      currentPath={routes.openMicro}
      navigation={openMicroNavigation}
      cta={{ label: productCopy.navigationCta, href: `${routes.openMicro}#waitlist` }}
    >
      <div className={styles.page}>
        <div id="overview">
          <ProductHero
            title={headings.hero}
            titleId="open-micro-title"
            statement={
              <>
                {hero.statement[0]} <em>{hero.statement[1]}</em>
              </>
            }
            lead={hero.description}
            primary={{ label: hero.primaryCta, href: '#waitlist' }}
            secondary={{ label: hero.secondaryCta, href: '#design' }}
            baseline={hero.baseline}
          >
            <MicroHero />
          </ProductHero>
        </div>

        <section className={styles.designSection} id="design" aria-labelledby="design-title">
          <div className={styles.inner}>
            <SectionIntro lead={productCopy.designLead}>
              <SectionTitle id="design-title" lines={headings.design} />
            </SectionIntro>
            <MicroLayers />
            <div className={styles.material}>
              <figure className={styles.detailScene}>
                <img
                  {...marketingRenders.detail}
                  sizes="(max-width: 900px) 92vw, 720px"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className={styles.materialCopy}>
                <h3>{productCopy.materialHeading}</h3>
                <p>{productCopy.materialBody}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.connectSection} aria-labelledby="connectivity-title">
          <div className={styles.inner}>
            <SectionIntro lead={productCopy.connectivityLead}>
              <SectionTitle id="connectivity-title" lines={headings.connectivity} />
            </SectionIntro>
            <figure className={styles.deskScene}>
              <img
                {...marketingRenders.desk}
                sizes="(max-width: 1280px) 92vw, 1184px"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className={styles.connectGrid}>
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
                    {connectionIcons[index]}
                  </svg>
                  <p className={styles.connectionLabel}>{card.label}</p>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.specsSection} id="specs" aria-labelledby="specs-title">
          <div className={styles.inner}>
            <SectionIntro lead={productCopy.specsLead}>
              <SectionTitle id="specs-title" lines={headings.specifications} />
            </SectionIntro>
            <MicroSpecs />
          </div>
        </section>

        <section className={styles.sourceSection} aria-labelledby="open-source-title">
          <div className={`${styles.inner} ${styles.sourceGrid}`}>
            <div className={styles.sourceCopy}>
              <SectionTitle id="open-source-title" lines={headings.openSource} />
              <p className={styles.lead}>{openSourceStatement}</p>
              <dl className={styles.licenses}>
                {licenses.map(([scope, license]) => (
                  <div key={scope}>
                    <dt>{scope}</dt>
                    <dd>{license}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.sourceLinks}>
                <a className={`button ${styles.sourceButton}`} href={sourceLinks.repository}>
                  View Open Micro source
                  <span aria-hidden="true">↗</span>
                </a>
                <a className={styles.textLink} href={sourceLinks.qualification}>
                  Read the hardware qualification notes
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <figure className={styles.studioScene}>
              <img
                {...marketingRenders.studio}
                sizes="(max-width: 1050px) 92vw, 600px"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <div className={styles.signup}>
          <MicroLit />
          <WaitlistForm signup={openMicroSignup} />
        </div>
      </div>
    </SiteShell>
  )
}
