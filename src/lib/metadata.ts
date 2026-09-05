import { getPageMetadata, type RouteMetadata } from './pageMetadata'

function setMetaContent(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.content = content
}

export function applyRouteMetadata(metadata: RouteMetadata) {
  const { title, canonicalUrl, tags } = getPageMetadata(metadata)
  let canonical = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']")

  document.title = title

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = canonicalUrl

  for (const { attribute, key, content } of tags) {
    setMetaContent(`meta[${attribute}='${key}']`, attribute, key, content)
  }
}
