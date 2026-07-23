export const routes = {
  home: '/',
  openMicro: '/products/open-micro',
  lavtype: '/products/lavtype',
} as const

export type ProductId = 'open-micro' | 'lavtype'

export type CatalogProduct = {
  id: ProductId
  name: string
  category: string
  summary: string
  path: (typeof routes)[keyof typeof routes]
}

export const productCatalog: readonly CatalogProduct[] = [
  {
    id: 'open-micro',
    name: 'Open Micro',
    category: 'Open-source control surface',
    summary: 'Fifteen controls, local software, and an open design you can shape to fit your work.',
    path: routes.openMicro,
  },
  {
    id: 'lavtype',
    name: 'Lavtype',
    category: 'Local push-to-talk dictation',
    summary: 'Hold a shortcut, speak, and release. Lavtype types the final transcript into the focused app.',
    path: routes.lavtype,
  },
]
