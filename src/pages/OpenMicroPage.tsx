import { type ReactNode } from 'react'
import { ExplodedStory } from '../components/ExplodedStory'
import { HeroProduct } from '../components/HeroProduct'
import { StatusLanguage } from '../components/StatusLanguage'
import { SiteShell } from '../components/SiteShell'
import { SpecsGrid } from '../components/SpecsGrid'
import { WaitlistForm } from '../components/WaitlistForm'
import { routes } from '../content/catalog'
import {
  brandCopy,
  connectivityCards,
  headings,
  licenses,
  navigation,
  openMicroSignup,
  openSourceStatement,
  productCopy,
} from '../content/openMicro'
import { useReveal } from '../lib/reveal'

const openMicroNavigation = navigation.map((item) => ({
  ...item,
  href: `${routes.openMicro}${item.href}`,
}))

function Reveal({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>()
  return <div className="revealSection" ref={ref}>{children}</div>
}

export function OpenMicroPage() {
  return (
    <SiteShell
      currentPath={routes.openMicro}
      navigation={openMicroNavigation}
      cta={{ label: productCopy.navigationCta, href: `${routes.openMicro}#waitlist` }}
    >
      <HeroProduct />

      <ExplodedStory />

      <Reveal>
        <section className="section" aria-labelledby="connectivity-title">
          <div className="sectionInner">
            <h2 id="connectivity-title">{headings.connectivity}</h2>
            <p className="sectionLead">{productCopy.connectivityLead}</p>
            <div className="connectivityGrid">
              {connectivityCards.map((card) => (
                <article className="editorialCard" key={card.title}>
                  <small>{card.label}</small>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal><StatusLanguage /></Reveal>

      <Reveal><SpecsGrid /></Reveal>

      <Reveal>
        <section className="section" aria-labelledby="open-source-title">
          <div className="sectionInner openSourceLayout">
            <div>
              <h2 id="open-source-title">{headings.openSource}</h2>
              <p className="openSourceStatement">{openSourceStatement}</p>
              <a className="sourceLink" href="https://github.com/TomBonness/open-micro">
                View Open Micro source
              </a>
            </div>
            <dl className="licenseList">
              {licenses.map(([scope, license]) => (
                <div key={scope}>
                  <dt>{scope}</dt>
                  <dd>{license}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="labStatement" aria-labelledby="lab-statement-title">
          <div className="labStatementInner">
            <div className="labIdentity">
              <img
                src="/brand/kettle-moraine-wordmark.png"
                width="1440"
                height="374"
                alt={brandCopy.name}
                loading="lazy"
              />
              <p>{brandCopy.statementProduct}</p>
            </div>
            <div className="labStatementCopy">
              <h2 id="lab-statement-title">{brandCopy.statementHeading}</h2>
              <p>{brandCopy.statementBody}</p>
            </div>
            <div className="labMark" aria-hidden="true">
              <span>KM / RL</span>
              <img
                src="/brand/kettle-moraine-mark.png"
                width="512"
                height="512"
                alt=""
                loading="lazy"
              />
              <span>Open Micro</span>
            </div>
          </div>
        </section>
      </Reveal>

      <WaitlistForm signup={openMicroSignup} />
    </SiteShell>
  )
}
