export const routes = {
  home: '/',
  openMicro: '/products/open-micro',
  inference: '/products/cinference-engine',
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
      'Give the actions you repeat a key, a turn, or a touch. An open-source desktop controller, currently a concept in development.',
    path: routes.openMicro,
  },
  {
    id: 'inference',
    name: 'Cinference Engine',
    summary:
      'Spend less time waiting on a model you run yourself. Cinference Engine serves a 27B model with 256K context from one RTX 5090.',
    path: routes.inference,
  },
  {
    id: 'lavtype',
    name: 'Lavtype',
    summary:
      'Say the sentence you were going to type. Lavtype writes it where you’re working, with speech recognition that stays on your machine.',
    path: routes.lavtype,
  },
]
