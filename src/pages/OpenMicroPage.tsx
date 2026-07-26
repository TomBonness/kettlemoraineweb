import { type ReactNode } from 'react'
import { ControlsShowcase } from '../components/ControlsShowcase'
import { ExplodedStory } from '../components/ExplodedStory'
import { HeroProduct } from '../components/HeroProduct'
import { LifecycleDemo } from '../components/LifecycleDemo'
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
  openSourceStatement,
  productCopy,
} from '../content/openMicro'

const openMicroNavigation = navigation.map((item) => ({
  ...item,
  href: `${routes.openMicro}${item.href}`,
}))

function Reveal({ children }: { children: ReactNode }) {
  return <div className="revealSection">{children}</div>
}

export function OpenMicroPage() {
  return (
    <SiteShell
      currentPath={routes.openMicro}
      navigation={openMicroNavigation}
      cta={{ label: productCopy.navigationCta, href: `${routes.openMicro}#waitlist` }}
    >
      <HeroProduct />

      <Reveal><ControlsShowcase /></Reveal>
      <Reveal><LifecycleDemo /></Reveal>
      <ExplodedStory />

      <Reveal>
        <section className="section sectionCompact sectionCanvas" aria-labelledby="connectivity-title">
          <div className="sectionInner">
            <p className="eyebrow">{productCopy.connectivityEyebrow}</p>
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

      <Reveal><SpecsGrid /></Reveal>

      <Reveal>
        <section className="section sectionCompact sectionCanvas" aria-labelledby="open-source-title">
          <div className="sectionInner openSourceLayout">
            <div>
              <p className="eyebrow">{productCopy.openSourceEyebrow}</p>
              <h2 id="open-source-title">{headings.openSource}</h2>
              <p className="openSourceStatement">{openSourceStatement}</p>
              <a className="sourceLink" href="https://github.com/TomBonness/open-micro">
                View Open Micro source <span aria-hidden="true">↗</span>
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
              <p className="eyebrow">{brandCopy.statementEyebrow}</p>
              <h2 id="lab-statement-title">{brandCopy.statementHeading}</h2>
              <p>{brandCopy.statementBody}</p>
            </div>
          </div>
        </section>
      </Reveal>

      <WaitlistForm />
    </SiteShell>
  )
}
