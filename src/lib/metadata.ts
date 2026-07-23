const productionOrigin = 'https://main.d1weoyfvphogxs.amplifyapp.com'

type RouteMetadata = {
  path: string
  title: string
  description: string
  image: string
}

function setMetaContent(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.content = content
}

export function applyRouteMetadata({ path, title, description, image }: RouteMetadata) {
  const canonicalUrl = new URL(path, productionOrigin).toString()
  const imageUrl = new URL(image, productionOrigin).toString()
  let canonical = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']")

  document.title = title
  setMetaContent("meta[name='description']", 'name', 'description', description)

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = canonicalUrl

  setMetaContent("meta[property='og:title']", 'property', 'og:title', title)
  setMetaContent("meta[property='og:description']", 'property', 'og:description', description)
  setMetaContent("meta[property='og:image']", 'property', 'og:image', imageUrl)
  setMetaContent("meta[name='twitter:title']", 'name', 'twitter:title', title)
  setMetaContent("meta[name='twitter:description']", 'name', 'twitter:description', description)
  setMetaContent("meta[name='twitter:image']", 'name', 'twitter:image', imageUrl)
}
