import type { ReactNode } from 'react'
import { HomeCinmuxStage } from '../components/HomeCinmuxStage'
import { HomeInferenceStage } from '../components/HomeInferenceStage'
import { HomeMicroStage } from '../components/HomeMicroStage'
import { HomeVoiceStage } from '../components/HomeVoiceStage'
import { MorainePrinciples } from '../components/MorainePrinciples'
import { MoraineSurvey } from '../components/MoraineSurvey'
import { SiteShell } from '../components/SiteShell'
import { productCatalog, routes, type ProductId } from '../content/catalog'
import { homeHero, principlesIntro, productFacts, productsIntro } from '../content/home'
import styles from './CompanyHomePage.module.css'

const homeNavigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

const productStages: Record<ProductId, ReactNode> = {
  'open-micro': <HomeMicroStage />,
  inference: <HomeInferenceStage />,
  lavtype: <HomeVoiceStage />,
  cinmux: <HomeCinmuxStage />,
}

export function CompanyHomePage() {
  return (
    <SiteShell currentPath={routes.home} navigation={homeNavigation}>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="company-heading">
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1 id="company-heading" aria-label="You have work to do.">
                <span aria-hidden="true">You have</span>
                <span aria-hidden="true">work to do.</span>
              </h1>
              <div>
                <p className={styles.heroStatement}>{homeHero.statement}</p>
                <div className={styles.heroActions}>
                  <a className={`button ${styles.heroPrimary}`} href={homeHero.primary.href}>
                    {homeHero.primary.label} <span aria-hidden="true">↓</span>
                  </a>
                  <a className={styles.textLink} href={homeHero.secondary.href}>
                    {homeHero.secondary.label} <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </div>
            <MoraineSurvey />
          </div>
        </section>

        <section className={styles.productsSection} id="products" aria-labelledby="products-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="products-title">
                Here’s where
                <br />
                <em>we’re starting.</em>
              </h2>
              <p className={styles.lead}>{productsIntro.lead}</p>
            </div>

            <div className={styles.featureStack}>
              {productCatalog.map((product, index) => (
                <a
                  className={styles.feature}
                  data-product={product.id}
                  data-flip={index % 2 === 1 ? '' : undefined}
                  href={product.path}
                  aria-label={`Explore ${product.name}`}
                  key={product.id}
                >
                  <div className={styles.featureMedia}>{productStages[product.id]}</div>
                  <div className={styles.featureCopy}>
                    <h3>{product.name}</h3>
                    <p className={styles.productSummary}>{product.summary}</p>
                    <dl className={styles.productFacts}>
                      {productFacts[product.id].map(([term, detail]) => (
                        <div key={term}>
                          <dt>{term}</dt>
                          <dd>{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className={styles.productLink}>
                      Explore {product.name} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          className={styles.principlesSection}
          id="principles"
          aria-labelledby="principles-title"
        >
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="principles-title">
                The work
                <br />
                <em>comes first.</em>
              </h2>
              <p className={styles.lead}>{principlesIntro.lead}</p>
            </div>
            <MorainePrinciples />
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
