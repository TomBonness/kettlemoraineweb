import type { ProductId } from './catalog'
import type { WorkspaceTab } from './cinmux'

// The hero's story, one step per product: an agent needs you, its Open Micro key blinks, you say
// the answer and the fix streams in from the local engine. Each step restates its product's own
// page: Cinmux's waiting status, Open Micro's agent keys, Lavtype's dictation, Cinference Engine's
// local endpoint.
export const workflowSteps = [
  { product: 'cinmux', action: 'An agent needs you.' },
  { product: 'open-micro', action: 'Its key blinks amber. Press it.' },
  { product: 'lavtype', action: 'Say the answer instead of typing it.' },
  { product: 'inference', action: 'The fix streams in from your own GPU.' },
] as const satisfies readonly { product: ProductId; action: string }[]

export const workspaceCaption = 'Illustration · the session is made up'

export const workspaceTabs: readonly WorkspaceTab[] = [
  { id: 'scratch', title: 'scratch', activity: 'idle', pinned: true },
  { id: 'build', title: 'build', activity: 'done' },
  { id: 'auth', title: 'agent: auth refactor', activity: 'working' },
  { id: 'flaky', title: 'agent: flaky tests', activity: 'waiting' },
  { id: 'server', title: 'dev server', activity: 'idle', unread: 2 },
  { id: 'docs', title: 'agent: docs sweep', activity: 'working' },
]

export const workspaceSession = {
  directory: 'api',
  branch: 'fix/flaky-retry',
  request: 'Make the checkout tests reliable.',
  run: 'Ran checkout.test.ts 20 times',
  failure: 'retries the payment webhook · failed 3 of 20',
  cause: 'The webhook times out under load.',
  question: 'Retry with backoff, or quarantine the test?',
  answer: 'Retry with backoff and keep the test.',
  writing: 'Writing the fix',
  fix: [
    'for attempt in range(5):',
    '    try:',
    '        return deliver(event)',
    '    except TimeoutError:',
    '        sleep(0.2 * 2 ** attempt)',
  ],
  passed: 'checkout.test.ts · 20 of 20 passed',
} as const
