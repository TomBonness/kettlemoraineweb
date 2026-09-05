import { routes } from './catalog'

export const inferenceNavigation = [
  { label: 'Speed', href: `${routes.inference}#speed` },
  { label: 'Intelligence', href: `${routes.inference}#intelligence` },
  { label: 'API', href: `${routes.inference}#api` },
] as const

export const inferenceSignup = {
  source: '1000-tps-product',
  heading: 'Build at a different speed.',
  lead: 'Put your next idea in the fast lane. Sign up for API access and hear from the lab about access invitations and launch details.',
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
    title: 'Keep your train of thought.',
    description: 'Draft, revise, and explore without turning every prompt into a context switch. Shorter generation waits keep the next idea close.',
    icon: 'flow',
  },
  {
    title: 'Make iteration the default.',
    description: 'Agents generate, call tools, and try again. Faster decoding leaves more room for the next attempt, not just the first answer.',
    icon: 'loop',
  },
  {
    title: 'Think beyond the chat box.',
    description: 'Responsive editors. Generative interfaces. On-demand explanations. Build experiences around a fast stream, not a loading state.',
    icon: 'interface',
  },
] as const
