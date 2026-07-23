import { type ReactNode } from 'react'
import { type CatalogProduct } from '../content/catalog'
import styles from './ProductPanel.module.css'

type ProductPanelProps = {
  media: ReactNode
  product: CatalogProduct
}

export function ProductPanel({ media, product }: ProductPanelProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.media}>{media}</div>
      <div className={styles.copy}>
        <p>{product.category}</p>
        <h2>{product.name}</h2>
        <div className={styles.summaryRow}>
          <p>{product.summary}</p>
          <a href={product.path}>
            Explore {product.name}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}
