import { routes } from './catalog'

export const inferenceLinks = {
  installer: 'https://github.com/satellitedown/fafstmobel-cinference',
  installGuide: 'https://github.com/satellitedown/fafstmobel-cinference#run',
  source: 'https://github.com/satellitedown/cinference',
  model: 'https://huggingface.co/satellitedown/fafstmobel',
  upstream: 'https://github.com/Neroued/ninfer',
  measurements:
    'https://github.com/satellitedown/cinference/blob/main/results/rtx5090-fafstmobel-lookup-rounds.json',
  verification:
    'https://github.com/satellitedown/fafstmobel-cinference/blob/main/results/verification.json',
} as const

export const inferenceNavigation = [
  { label: 'Speed', href: `${routes.inference}#speed` },
  { label: 'Engine', href: `${routes.inference}#engine` },
  { label: 'Setup', href: `${routes.inference}#setup` },
] as const

// Cinference results/rtx5090-fafstmobel-lookup-rounds.json: fafstmobel, DFlash2-15 with verify
// trees, one RTX 5090. Chats and edits use ninfer-serve with default sampling at concurrency 1;
// the benchmark row is ninfer_bench, greedy, after a 32,768-token prompt from a repetitive corpus.
export const throughputResults = [
  {
    label: 'Coding chats with reasoning',
    detail: 'Default sampling, medium effort',
    tokensPerSecond: 307.5,
  },
  {
    label: 'Complete-file edits',
    detail: 'The updated file, written out in full',
    tokensPerSecond: 564.6,
  },
  {
    label: 'Repetitive benchmark text',
    detail: 'Greedy decoding; the output copies its prompt',
    tokensPerSecond: 944.7,
  },
] as const

export const speedTechniques = [
  {
    title: 'Draft ahead, verify once.',
    description: 'A small DFlash2 drafter proposes up to 15 tokens. The 27B model checks a tree of those proposals in one pass and keeps the ones it agrees with.',
    icon: 'draft',
  },
  {
    title: 'Reuse text from the prompt.',
    description: 'When an answer repeats something already in context, like the file you asked it to edit, prompt lookup proposes that stretch directly.',
    icon: 'lookup',
  },
  {
    title: 'Shorten every round.',
    // U+2060 word joiners keep the ranges from wrapping after their en dashes.
    description: 'Rewritten CUDA kernels make verification rounds 17–\u206027% shorter on 8K–\u2060131K-token prompts. A 131K-token prompt prefills at 4,575 tokens per second.',
    icon: 'kernel',
  },
] as const

// Installer results/verification.json, 2026-09-29: full 256K K8V4 DFlash2-15 profile.
export const verificationChecks = ['Text', 'Tool call', 'Image input', 'Reasoning'] as const

export const installCommands = `git clone ${inferenceLinks.installer}.git
cd fafstmobel-cinference
bash setup.sh`

export const localEndpoint = {
  baseUrl: 'http://127.0.0.1:8001/v1',
  model: 'fafstmobel-cinference',
} as const
