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
      'Give the actions you repeat a key, a turn, or a touch. An open-source desktop controller, currently a concept in development.',
    path: routes.openMicro,
  },
  {
    id: 'inference',
    name: '1,000 TPS',
    summary:
      'We’re building hosted GLM-5.3-Flash inference with a 1,000-token-per-second target. So less of the job is waiting for the next response.',
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
