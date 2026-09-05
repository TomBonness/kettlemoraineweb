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
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
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
          {cta ? (
            <a className="navCta" href={cta.href}>
              {cta.label}
            </a>
          ) : (
            <span className="navSpacer" />
          )}
          <details
            className="mobileNav"
            onKeyDown={(event) => {
              if (event.key !== 'Escape') return
              event.preventDefault()
              event.currentTarget.open = false
              event.currentTarget.querySelector('summary')?.focus()
            }}
          >
            <summary>
              <span>Menu</span>
              <span className="mobileNavIcon" aria-hidden="true">
                <i />
                <i />
              </span>
            </summary>
            <div
              className="mobileNavPanel"
              onClick={(event) => {
                if (event.target instanceof Element && event.target.closest('a')) {
                  const menu = event.currentTarget.closest('details')
                  if (menu) menu.open = false
                }
              }}
            >
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
          <div className="footerIntro">
            <a
              className="footerBrand"
              href={routes.home}
              aria-label="Kettle Moraine Research Labs — home"
            >
              <img
                src="/brand/kettle-moraine-mark.png"
                width="512"
                height="512"
                alt=""
                loading="lazy"
              />
              <strong>
                Kettle Moraine
                <br />
                Research Labs
              </strong>
            </a>
            <p className="footerStatement">
              Tools for
              <br />
              <em>clearer work.</em>
            </p>
          </div>
          <nav className="footerLinks" aria-label="Products">
            <p className="footerLabel">From the lab</p>
            {productCatalog.map((product) => (
              <a
                key={product.id}
                href={product.path}
                aria-label={product.name}
                aria-current={currentPageValue(product.path, currentPath)}
              >
                <span>
                  <small>{product.category}</small>
                  <strong>{product.name}</strong>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <div className="footerBottom">
            <span>Hardware. Software. A little perspective.</span>
            <a href="#main-content">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
