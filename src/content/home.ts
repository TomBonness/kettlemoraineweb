import type { ProductId } from './catalog'
import { llamaCppSpeedup } from './inference'

export const homeHero = {
  statement:
    'We’re building hardware, software, and local inference for people who would rather be making something than managing their computer.',
  primary: { label: 'See what we’re building', href: '#products' },
  secondary: { label: 'How we work', href: '#principles' },
} as const

/**
 * Where each product stands on the contour map, as a point on one of its rings. `level` indexes
 * `moraineContours` (0 is the outermost ring), `x`/`y` are in the artwork's coordinates, and
 * `beam` is the marker's height above the terrain, in terrain steps.
 */
export const surveyMarkers: Record<
  ProductId,
  { kind: string; level: number; x: number; y: number; beam: number }
> = {
  'open-micro': { kind: 'Desktop controller', level: 10, x: 431, y: 507, beam: 22 },
  inference: { kind: 'Local inference engine', level: 23, x: 676, y: 327, beam: 11 },
  lavtype: { kind: 'Speech to text', level: 15, x: 1018, y: 544, beam: 20 },
  cinmux: { kind: 'Terminal workspaces', level: 29, x: 759, y: 542, beam: 12 },
}

export const productsIntro = {
  lead: 'We’re starting with the actions you repeat, the words you want to write, the time spent waiting for an answer, and the terminals you leave running.',
} as const

export const productFacts: Record<ProductId, readonly (readonly [string, string])[]> = {
  'open-micro': [
    ['Controls', '12 keys + encoder + touch'],
    ['Connection', 'USB-C + Bluetooth'],
  ],
  inference: [
    ['vs llama.cpp', `Up to ${llamaCppSpeedup.toFixed(1)}× faster`],
    ['Hardware', 'One RTX 5090'],
  ],
  lavtype: [
    ['Recognition', 'Local'],
    ['Platforms', 'macOS + X11 Linux'],
  ],
  cinmux: [
    ['Agent status', 'Working · Needs input · Done'],
    ['Runs on', 'Linux, macOS + SSH'],
  ],
}

export const principlesIntro = {
  lead: 'We want a computer to feel like a tool you know, not a collection of systems you have to keep happy. That’s a big ambition. We’re taking it one useful piece at a time.',
} as const

export const principles = [
  {
    title: 'Start with what gets in the way.',
    body: 'The extra click, the copied transcript, the wait for an answer. Those are small interruptions until they fill your day.',
  },
  {
    title: 'Leave room for the owner.',
    body: 'We publish Open Micro’s designs and Lavtype’s source code. You can read them, change them, and take the work in a direction we didn’t plan.',
  },
  {
    title: 'Fit the way you work.',
    body: 'Keep your favorite editor, your shortcuts, your habits. We’re building tools that make your setup more useful, without asking you to start over.',
  },
] as const
