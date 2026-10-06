import type { Activity } from './cinmux'
import type { ProductId } from './catalog'

type Chore = { product: ProductId; text: string }

// "You have work to do." The hero's list crosses off the busywork each product takes away, in this
// order, and leaves the one item that's yours. Each chore restates its product's own summary.
export const workList = {
  heading: 'To do',
  chores: [
    { product: 'open-micro', text: 'Reach through menus for the action you repeat' },
    { product: 'lavtype', text: 'Type out what you could just say' },
    { product: 'inference', text: 'Wait for the answer' },
    { product: 'cinmux', text: 'Check every terminal for the agent that needs you' },
  ],
  remaining: 'The work.',
} as const satisfies { heading: string; chores: readonly Chore[]; remaining: string }

type HeroTab = { title: string; activity: readonly [before: Activity, landed: Activity, settled: Activity] }

// Example content for the pieces that lift off the list. Illustrative, not measurements.
export const heroPieces = {
  /** A line of code, split where a tokenizer might split it, streaming out of the engine. */
  inferenceTokens: ['let', ' reply', ' =', ' model', '.run', '(prompt)'],
  /** Two Cinmux tabs: the agent that needed you gets its answer and finishes. */
  cinmuxTabs: [
    { title: 'agent: flaky tests', activity: ['waiting', 'working', 'done'] },
    { title: 'agent: docs sweep', activity: ['working', 'done', 'done'] },
  ],
} as const satisfies { inferenceTokens: readonly string[]; cinmuxTabs: readonly HeroTab[] }
