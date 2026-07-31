import { type ReactNode } from 'react'
import { productCatalog, routes } from '../content/catalog'

type NavigationLink = {
  label: string
  href: string
}

type SiteShellProps = {
  children: ReactNode
  currentPath: string
  navigation: readonly NavigationLink[]
  cta?: NavigationLink
}

function currentPageValue(href: string, currentPath: string) {
  return !href.includes('#') && href === currentPath ? 'page' : undefined
}

export function SiteShell({ children, currentPath, navigation, cta }: SiteShellProps) {
  return (
    <>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <header className="siteNav">
        <nav className="navInner" aria-label="Primary navigation">
          <a
            className="wordmark"
            href={routes.home}
            aria-label="Kettle Moraine Research Labs — home"
            aria-current={currentPageValue(routes.home, currentPath)}
          >
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
              <a
                key={item.href}
                href={item.href}
                aria-current={currentPageValue(item.href, currentPath)}
              >
                {item.label}
              </a>
            ))}
          </div>
          {cta ? <a className="navCta" href={cta.href}>{cta.label}</a> : <span className="navSpacer" />}
          <details className="mobileNav">
            <summary>
              <span>Menu</span>
              <span className="mobileNavIcon" aria-hidden="true"><i /><i /></span>
            </summary>
            <div className="mobileNavPanel">
              <div className="mobileNavLinks">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={currentPageValue(item.href, currentPath)}
                  >
                    {item.label}
                    <span aria-hidden="true">{item.href.includes('#') ? '↓' : '↗'}</span>
                  </a>
                ))}
              </div>
              {cta && (
                <a
                  className="mobileNavCta"
                  href={cta.href}
                  aria-label={`${cta.label} — mobile navigation`}
                >
                  {cta.label}
                </a>
              )}
            </div>
          </details>
        </nav>
      </header>

      <main id="main-content">{children}</main>

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
              <strong>Kettle Moraine Research Labs</strong>
              <span>Tools for clearer work.</span>
            </div>
          </div>
          <nav className="footerLinks" aria-label="Products">
            {productCatalog.map((product) => (
              <a
                key={product.id}
                href={product.path}
                aria-current={currentPageValue(product.path, currentPath)}
              >
                {product.name}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
