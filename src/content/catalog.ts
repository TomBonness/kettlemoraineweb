export const routes = {
  home: '/',
  openMicro: '/products/open-micro',
  inference: '/products/1000-tps',
  lavtype: '/products/lavtype',
} as const

export type ProductId = 'open-micro' | 'inference' | 'lavtype'

export type CatalogProduct = {
  id: ProductId
  name: string
  summary: string
  path: (typeof routes)[keyof typeof routes]
}

export const productCatalog: readonly CatalogProduct[] = [
  {
    id: 'open-micro',
    name: 'Open Micro',
    summary:
      'A concept in development. Tactile controls, local software, and an open design you can shape to fit your work.',
    path: routes.openMicro,
  },
  {
    id: 'inference',
    name: '1,000 TPS',
    summary:
      'GLM-5.3-Flash. A 1,000-token-per-second ambition. Open-weight intelligence, served from our hardware to your next idea.',
    path: routes.inference,
  },
  {
    id: 'lavtype',
    name: 'Lavtype',
    summary:
      'Hold a shortcut, speak, and release. Lavtype types the final transcript into the focused app.',
    path: routes.lavtype,
  },
]
