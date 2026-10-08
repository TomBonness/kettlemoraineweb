import markSvg from '../assets/brand/kettle-moraine-mark.svg?raw'

// The KMRL mark, read from the designer's SVG: three hexagon-bracket segments around the blue dot,
// as absolute SVG paths in a 512-unit box.
const dot = markSvg.match(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/) ?? []

export const markShape = {
  size: 512,
  segments: [...markSvg.matchAll(/<path d="([^"]+)"/g)].map(([, d]) => d),
  dot: { cx: Number(dot[1]), cy: Number(dot[2]), r: Number(dot[3]) },
}
