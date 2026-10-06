export const routes = {
  home: '/',
  openMicro: '/products/open-micro',
  inference: '/products/cinference-engine',
  lavtype: '/products/lavtype',
  cinmux: '/products/cinmux',
} as const

export type ProductId = 'open-micro' | 'inference' | 'lavtype' | 'cinmux'

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
      'A custom C++/CUDA inference engine that runs a 27B model at up to 970 tokens per second on one RTX 5090.',
    path: routes.inference,
  },
  {
    id: 'lavtype',
    name: 'Lavtype',
    summary:
      'Say the sentence you were going to type. Lavtype writes it where you’re working, with speech recognition that stays on your machine.',
    path: routes.lavtype,
  },
  {
    id: 'cinmux',
    name: 'Cinmux',
    summary:
      'Know which agent needs you without checking every terminal. Cinmux keeps your tabs in folders, and keeps them running after you close the window.',
    path: routes.cinmux,
  },
]
