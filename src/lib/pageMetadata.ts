import { routes, type ProductId } from '../content/catalog.ts'

const productionOrigin = 'https://main.d1weoyfvphogxs.amplifyapp.com'

export type RouteMetadata = {
  path: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export const routeMetadata: Record<ProductId | 'home' | 'not-found', RouteMetadata> = {
  home: {
    path: routes.home,
    title: 'Kettle Moraine Research Labs — You have work to do',
    description:
      'Hardware, dictation, and hosted inference for people who would rather be making something than managing software.',
    image: '/social/company.png',
    imageAlt: 'Kettle Moraine Research Labs — You have work to do.',
  },
  'open-micro': {
    path: routes.openMicro,
    title: 'Open Micro — Kettle Moraine Research Labs',
    description:
      'Give everyday actions a physical control. Open Micro is an open-source desktop controller in development, with twelve keys, an encoder, and touch.',
    image: '/social/open-micro.png',
    imageAlt: 'Open Micro — an open-source desktop controller with twelve keys, an encoder, and touch.',
  },
  inference: {
    path: routes.inference,
    title: '1,000 TPS — Kettle Moraine Research Labs',
    description:
      'Hosted GLM-5.3-Flash inference with a 1,000-token-per-second target. Less waiting is the goal. Sign up for API access updates.',
    image: '/social/inference.png',
    imageAlt: '1,000 TPS — hosted GLM-5.3-Flash inference with a 1,000-token-per-second target.',
  },
  lavtype: {
    path: routes.lavtype,
    title: 'Lavtype — Kettle Moraine Research Labs',
    description:
      'Say what you were going to type. Lavtype transcribes on your machine and types into the focused app, on macOS or X11 Linux.',
    image: '/social/lavtype.png',
    imageAlt: 'Lavtype — local dictation for macOS and X11 Linux.',
  },
  'not-found': {
    path: routes.home,
    title: 'Page not found — Kettle Moraine Research Labs',
    description: 'That address doesn’t lead to a page on this site.',
    image: '/social/company.png',
    imageAlt: 'Kettle Moraine Research Labs — You have work to do.',
  },
}

type MetaTag = { attribute: 'name' | 'property'; key: string; content: string }

export function getPageMetadata({ path, title, description, image, imageAlt }: RouteMetadata) {
  const canonicalUrl = new URL(path, productionOrigin).toString()
  const imageUrl = new URL(image, productionOrigin).toString()
  const tags: MetaTag[] = [
    { attribute: 'name', key: 'description', content: description },
    { attribute: 'property', key: 'og:type', content: 'website' },
    { attribute: 'property', key: 'og:site_name', content: 'Kettle Moraine Research Labs' },
    { attribute: 'property', key: 'og:url', content: canonicalUrl },
    { attribute: 'property', key: 'og:title', content: title },
    { attribute: 'property', key: 'og:description', content: description },
    { attribute: 'property', key: 'og:image', content: imageUrl },
    { attribute: 'property', key: 'og:image:type', content: 'image/png' },
    { attribute: 'property', key: 'og:image:width', content: '1200' },
    { attribute: 'property', key: 'og:image:height', content: '630' },
    { attribute: 'property', key: 'og:image:alt', content: imageAlt },
    { attribute: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attribute: 'name', key: 'twitter:title', content: title },
    { attribute: 'name', key: 'twitter:description', content: description },
    { attribute: 'name', key: 'twitter:image', content: imageUrl },
    { attribute: 'name', key: 'twitter:image:alt', content: imageAlt },
  ]

  return { title, canonicalUrl, tags }
}
