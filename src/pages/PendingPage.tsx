import type { MouseEvent } from 'react'
import { SiteShell } from '../components/SiteShell'
import { productCatalog, routes } from '../content/catalog'
import styles from './PendingPage.module.css'

const navigation = productCatalog.map((product) => ({
  label: product.name,
  href: product.path,
}))

/** Back to the page that linked here; straight to home for visitors who arrived from elsewhere. */
function goBack(event: MouseEvent<HTMLAnchorElement>) {
  if (document.referrer.startsWith(`${window.location.origin}/`) && window.history.length > 1) {
    event.preventDefault()
    window.history.back()
  }
}

/** Where links to source and downloads lead while they aren't public. */
export function PendingPage() {
  return (
    <SiteShell currentPath={routes.pending} navigation={navigation}>
      <section className={styles.page} aria-labelledby="pending-title">
        <h1 id="pending-title">Public access pending.</h1>
        <p>This isn’t public yet.</p>
        <a className={`button ${styles.back}`} href={routes.home} onClick={goBack}>
          <span aria-hidden="true">←</span> Go back
        </a>
      </section>
    </SiteShell>
  )
}
