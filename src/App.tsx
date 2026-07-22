import { type ReactNode } from 'react'
import { ControlsShowcase } from './components/ControlsShowcase'
import { ExplodedStory } from './components/ExplodedStory'
import { HeroProduct } from './components/HeroProduct'
import { LifecycleDemo } from './components/LifecycleDemo'
import { SpecsGrid } from './components/SpecsGrid'
import { WaitlistForm } from './components/WaitlistForm'
import {
  brandCopy,
  connectivityCards,
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
          <a className="wordmark" href="#overview" aria-label={brandCopy.navigationLabel}>
            <img
              className="wordmarkFull"
              src="/brand/kettle-moraine-wordmark.png"
              width="1440"
              height="374"
              alt=""
            />
            <img
              className="wordmarkMark"
              src="/brand/kettle-moraine-mark.png"
              width="512"
              height="512"
              alt=""
            />
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

        <ExplodedStory />
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

        <Reveal><LifecycleDemo /></Reveal>

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
              <div className="labMark" aria-hidden="true">
                <span>Design / Build</span>
                <img
                  src="/brand/kettle-moraine-mark.png"
                  width="512"
                  height="512"
                  alt=""
                  loading="lazy"
                />
                <span>Hardware / Software</span>
              </div>
            </div>
          </section>
        </Reveal>

        <WaitlistForm />
      </main>

      <footer className="siteFooter">
        <div className="footerInner">
          <div className="footerBrand">
            <img
              src="/brand/kettle-moraine-mark.png"
              width="512"
              height="512"
              alt=""
            />
            <div>
              <strong>{brandCopy.name}</strong>
              <span>{productCopy.footerProduct}</span>
            </div>
          </div>
          <p className="footerPrivacy">{privacyStatement}</p>
          <p className="footerCredit">{productCopy.visualizationCredit}</p>
        </div>
      </footer>
    </>
  )
}

export default App
