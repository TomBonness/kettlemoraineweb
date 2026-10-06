import type { ReactNode } from 'react'
import { MicroConnect } from '../components/MicroConnect'
import { MicroLayers } from '../components/MicroLayers'
import { MicroSignal } from '../components/MicroSignal'
import { MicroSpecs } from '../components/MicroSpecs'
import { MicroStage } from '../components/MicroStage'
import { ProductHero } from '../components/ProductHero'
import { SiteShell } from '../components/SiteShell'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
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
            <MicroStage />
          </ProductHero>
        </div>

        <section className={styles.statusSection} id="status" aria-labelledby="status-title">
          <div className={styles.inner}>
            <SectionIntro lead={productCopy.statusLead}>
              <SectionTitle id="status-title" lines={headings.status} />
            </SectionIntro>
            <MicroSignal />
            <figure className={styles.nightScene}>
              <img
                {...marketingRenders.night}
                sizes="(max-width: 1280px) 92vw, 1184px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className={styles.conceptTag}>{productCopy.conceptTag}</span>
                {productCopy.statusPrinciple}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.designSection} id="design" aria-labelledby="design-title">
          <div className={styles.inner}>
            <SectionIntro lead={productCopy.designLead}>
              <SectionTitle id="design-title" lines={headings.design} />
            </SectionIntro>
            <MicroLayers />
            <div className={styles.renders}>
              <figure className={styles.explodedScene}>
                <img
                  {...marketingRenders.exploded}
                  sizes="(max-width: 900px) 92vw, 520px"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span className={styles.conceptTag}>{productCopy.conceptTag}</span>
                  {productCopy.explodedCaption}
                </figcaption>
              </figure>
              <div className={styles.material}>
                <figure className={styles.detailScene}>
                  <img
                    {...marketingRenders.detail}
                    sizes="(max-width: 900px) 92vw, 640px"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
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
            <MicroConnect />
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
          <figure className={styles.signupModel} aria-hidden="true">
            <span className={styles.signupGlow} />
            <img
              src={marketingRenders.transparent.src}
              srcSet={marketingRenders.transparent.srcSet}
              width={marketingRenders.transparent.width}
              height={marketingRenders.transparent.height}
              sizes="(max-width: 767px) 80vw, 460px"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <figcaption className={styles.conceptTag}>{hero.baseline[3]}</figcaption>
          </figure>
          <WaitlistForm signup={openMicroSignup} />
        </div>
      </div>
    </SiteShell>
  )
}
