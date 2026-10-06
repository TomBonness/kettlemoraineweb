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
