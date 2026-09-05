import { routes } from './catalog'

export const inferenceNavigation = [
  { label: 'Speed', href: `${routes.inference}#speed` },
  { label: 'Intelligence', href: `${routes.inference}#intelligence` },
  { label: 'API', href: `${routes.inference}#api` },
] as const

export const inferenceSignup = {
  source: '1000-tps-product',
  heading: 'Build with less waiting.',
  lead: 'Interested in using GLM-5.3-Flash through our hosted API? Request access for invitation and launch updates. We’re working toward 1,000 TPS; signup is not immediate access.',
  submit: 'Request access',
  success: 'You’re on the list. We’ll email you about API access and launch details.',
  privacy: 'API access updates only. Kettle Moraine Research Labs stores your email for 1,000 TPS access invitations and launch notices until the launch notice program ends.',
} as const

export const inferenceSources = {
  release: 'https://z.ai/blog/glm-5.3-flash',
  model: 'https://docs.z.ai/guides/vlm/glm-5.3-flash',
  arena: 'https://arena.ai/leaderboard',
  analysis: 'https://artificialanalysis.ai/models/glm-5-3-flash',
} as const

// Z.ai release, 2026-08-26: Code Bench v1.0, max effort, Claude Code 2.1.207.
// Publisher-reported scores, not Arena ratings or results from our serving stack.
export const codingComparison = [
  { name: 'Claude Opus 4.8', score: 29.5, highlight: false },
  { name: 'GLM-5.3-Flash', score: 29.0, highlight: true },
] as const

export const speedScenarios = [
  {
    title: 'Review the next draft sooner.',
    description: 'A generated draft is a starting point, not finished work. Shorter output waits can let you read it, spot what’s missing, and revise before you move on to something else.',
    icon: 'flow',
  },
  {
    title: 'Try another approach.',
    description: 'Coding agents alternate between generating output and running tools. Faster decoding can shorten the generation steps; tests, tool calls, and reasoning still take time.',
    icon: 'loop',
  },
  {
    title: 'Make room for longer output.',
    description: 'A code change or detailed explanation can take many tokens. We’re working to make longer responses practical inside the tools you already use.',
    icon: 'interface',
  },
] as const
