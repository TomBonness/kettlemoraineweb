import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getPageMetadata, routeMetadata, type RouteMetadata } from './src/lib/pageMetadata.ts'

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEntities[character])
}

function withMetadata(html: string, metadata: RouteMetadata) {
  const { title, canonicalUrl, tags } = getPageMetadata(metadata)
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    ...tags.map(
      ({ attribute, key, content }) =>
        `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`,
    ),
  ].join('\n    ')
  const marker = /<!-- route-metadata:start -->[\s\S]*?<!-- route-metadata:end -->/
  if (!marker.test(html)) {
    throw new Error('Missing route metadata markers in index.html')
  }
  return html.replace(
    marker,
    `<!-- route-metadata:start -->\n    ${head}\n    <!-- route-metadata:end -->`,
  )
}

const staticRouteMetadata: Plugin = {
    name: 'static-route-metadata',
    transformIndexHtml(html) {
      return withMetadata(html, routeMetadata.home)
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const entry = bundle['index.html']
        if (!entry || entry.type !== 'asset' || typeof entry.source !== 'string') {
          throw new Error('Missing built index.html for route metadata')
        }
        for (const [route, metadata] of Object.entries(routeMetadata)) {
          if (route === 'home' || route === 'not-found') continue
          const source = withMetadata(entry.source, metadata)
          const routePath = metadata.path.slice(1)
          // Support clean URLs and trailing slashes without falling back to the homepage.
          for (const fileName of [`${routePath}.html`, `${routePath}/index.html`]) {
            this.emitFile({ type: 'asset', fileName, source })
          }
        }
      },
    },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticRouteMetadata],
})
