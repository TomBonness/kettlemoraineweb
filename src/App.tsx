import { type ReactNode } from 'react'
import { ControlsShowcase } from './components/ControlsShowcase'
import { ExplodedStory } from './components/ExplodedStory'
import { HeroProduct } from './components/HeroProduct'
import { LifecycleDemo } from './components/LifecycleDemo'
import { SpecsGrid } from './components/SpecsGrid'
import { WaitlistForm } from './components/WaitlistForm'
import {
  connectivityCards,
  designPanels,
  headings,
  licenses,
  navigation,
  openSourceStatement,
  privacyStatement,
  productCopy,
} from './content/product'

function Reveal({ children }: { children: ReactNode }) {
  return <div className="revealSection">{children}</div>
}

function App() {
  return (
    <>
      <a className="skipLink" href="#main-content">{productCopy.skipLink}</a>
      <header className="siteNav">
        <nav className="navInner" aria-label={productCopy.primaryNavigationLabel}>
          <a className="wordmark" href="#overview" aria-label={productCopy.overviewAriaLabel}>
            <span>{productCopy.wordmark}</span>
          </a>
          <div className="navLinks">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </div>
          <a className="navCta" href="#waitlist">{productCopy.navigationCta}</a>
        </nav>
      </header>

      <main id="main-content">
        <HeroProduct />


        <Reveal><LifecycleDemo /></Reveal>
        <Reveal><ControlsShowcase /></Reveal>

        <Reveal>
          <section className="section" aria-labelledby="connectivity-title">
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

        <ExplodedStory />

        <Reveal>
          <section className="section designSection" aria-labelledby="materials-title">
            <div className="sectionInner">
              <div className="materialsIntro">
                <h2 id="materials-title">{productCopy.materialsHeading}</h2>
              </div>
              <div className="designGrid">
                {designPanels.map((panel) => (
                  <article className="editorialCard" key={panel.label}>
                    <small>{panel.label}</small>
                    <h3>{panel.value}</h3>
                    <p>{panel.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal><SpecsGrid /></Reveal>

        <Reveal>
          <section className="section" aria-labelledby="open-source-title">
            <div className={`sectionInner openSourceLayout`}>
              <div>
                <p className="eyebrow">{productCopy.openSourceEyebrow}</p>
                <h2 id="open-source-title">{headings.openSource}</h2>
                <p className="openSourceStatement">{openSourceStatement}</p>
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

        <WaitlistForm />
      </main>

      <footer className="siteFooter">
        <div className="footerInner">
          <strong>{productCopy.footerProduct}</strong>
          <p className="footerPrivacy">{privacyStatement}</p>
          <p className="footerCredit">{productCopy.visualizationCredit}</p>
        </div>
      </footer>
    </>
  )
}

export default App
