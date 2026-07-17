export type LifecycleEffect = 'solid' | 'breathe' | 'pulse' | 'blink'

export const navigation = [
  { label: 'Overview', href: '#overview' },
  { label: 'Design', href: '#design' },
  { label: 'Controls', href: '#controls' },
  { label: 'Specs', href: '#specs' },
] as const

export const headings = {
  hero: 'Open Micro',
  lifecycle: 'Your work, at a glance.',
  controls: 'One touch. Any action.',
  connectivity: 'Connect the way you want.',
  design: 'Built with care.',
  specifications: 'Everything, considered.',
  openSource: 'Make it yours. All the way down.',
  waitlist: 'See what comes next.',
} as const

export const hero = {
  eyebrow: 'Open-source by design · Revision 0.1',
  description: 'A beautifully focused control surface for the work you do every day.',
  primaryCta: 'Keep me updated',
  secondaryCta: 'See how it’s built',
} as const

export const productCopy = {
  skipLink: 'Skip to content',
  primaryNavigationLabel: 'Primary navigation',
  wordmark: 'Open Micro',
  overviewAriaLabel: 'Open Micro overview',
  navigationCta: 'Get updates',
  heroCaptionTitle: 'Fifteen controls. One clear space.',
  heroCaptionBody: 'Everything you need, right where you want it.',
  lifecycleEyebrow: 'See what matters',
  lifecycleLead:
    'A quiet field of light makes every state clear—ready, working, waiting, or done.',
  lifecycleControlLabel: 'Explore status light states',
  controlsEyebrow: 'Made to be yours',
  controlsLead:
    'Twelve hot-swap keys, a dial, a five-way control, and touch put the actions you use most within easy reach.',
  controlMapTitle: 'Make it yours.',
  controlMapInstructions:
    'Choose a control to see one way it can fit the way you work.',
  controlMapLabel: 'Interactive Open Micro control map',
  controlMapFront: 'Front · operator edge',
  controlMapRear: 'Rear · USB-C',
  connectivityEyebrow: 'Simply connected',
  connectivityLead:
    'Plug in at your desk. Move freely with Bluetooth. Keep every choice in your hands.',
  designEyebrow: 'Designed with intention',
  designLead:
    'Every layer is considered. Every detail has a purpose. Together, they create a compact control surface designed to feel at home on your desk.',
  specsEyebrow: 'The details',
  openSourceEyebrow: 'Open by design',
  waitlistEyebrow: 'Stay in the loop',
  waitlistLead:
    'Open Micro is still taking shape. Leave your email and we’ll only write when preorder timing is confirmed.',
  explodedRenderTitle: 'Thoughtful from the inside out.',
  explodedRenderBody: 'A layered design keeps the shell, electronics, light plate, and controls distinct and serviceable.',
  enclosureRenderTitle: 'A quiet presence.',
  enclosureRenderBody: 'Rounded aluminum surrounds a clean working edge, with power and USB-C set neatly into the rear.',
  heroAlt:
    'Silver Open Micro controller with twelve white keys, encoder, five-way control, and touch surface',
  explodedAlt:
    'Open Micro aluminum enclosure, PCB, interface plate, switches, and keycaps separated into layers',
  enclosureAlt:
    'Rear three-quarter view of Open Micro showing its USB-C and power openings',
  topAlt:
    'Open Micro assembled control layout',
  footerProduct: 'Open Micro · Revision 0.1',
  visualizationCredit: 'Revision 0.1 design visualization — not a photographed product',
} as const

export const waitlistCopy = {
  honeypotLabel: 'Website',
  emailLabel: 'Email address',
  placeholder: 'you@example.com',
  submit: 'Notify me',
  pending: 'Joining…',
  success: "You're on the list. We'll let you know when preorder timing is confirmed.",
  error: "We couldn't save your email. Please try again.",
} as const


export const lifecycleStates = [
  {
    id: 'idle',
    name: 'Idle',
    color: '#202020',
    effect: 'solid',
    period: 0,
    timing: 'Ready',
    description: 'Ready when you are.',
  },
  {
    id: 'thinking',
    name: 'Thinking',
    color: '#4D8DFF',
    effect: 'breathe',
    period: 1400,
    timing: 'Working',
    description: 'Working through the next step.',
  },
  {
    id: 'running',
    name: 'Running',
    color: '#31C7D9',
    effect: 'pulse',
    period: 800,
    timing: 'Active',
    description: 'Putting your request into motion.',
  },
  {
    id: 'waiting',
    name: 'Waiting',
    color: '#FF9F0A',
    effect: 'blink',
    period: 900,
    timing: 'Needs input',
    description: 'Waiting for your input.',
  },
  {
    id: 'done',
    name: 'Done',
    color: '#30D158',
    effect: 'solid',
    period: 4000,
    timing: 'Complete',
    description: 'Everything is complete.',
  },
  {
    id: 'error',
    name: 'Error',
    color: '#FF453A',
    effect: 'blink',
    period: 700,
    timing: 'Attention',
    description: 'Something needs your attention.',
  },
] as const satisfies ReadonlyArray<{
  id: string
  name: string
  color: string
  effect: LifecycleEffect
  period: number
  timing: string
  description: string
}>

export type ControlKind = 'key' | 'wide-key' | 'encoder' | 'joystick' | 'touch'

export const controls = [
  { id: 'touch', name: 'Mode switch', legend: 'Mode', role: 'Switch profiles or command layers.', kind: 'touch', x: 19.425, y: 19.425, width: 14, height: 14 },
  { id: 'microphone', name: 'Voice command', legend: 'Voice', role: 'Open push-to-talk input.', kind: 'wide-key', x: 48, y: 19.425, width: 37.05, height: 18 },
  { id: 'command-6', name: 'Launch workflow', legend: 'Launch', role: 'Start the selected automation.', kind: 'key', x: 76.575, y: 19.425, width: 18, height: 18 },
  { id: 'command-1', name: 'Review diff', legend: 'Diff', role: 'Open the current change for review.', kind: 'key', x: 19.425, y: 38.475, width: 18, height: 18 },
  { id: 'command-2', name: 'Debug', legend: 'Debug', role: 'Open the debugger for the active run.', kind: 'key', x: 38.475, y: 38.475, width: 18, height: 18 },
  { id: 'command-3', name: 'Build', legend: 'Build', role: 'Build the active project.', kind: 'key', x: 57.525, y: 38.475, width: 18, height: 18 },
  { id: 'command-4', name: 'Test', legend: 'Test', role: 'Run the mapped test suite.', kind: 'key', x: 76.575, y: 38.475, width: 18, height: 18 },
  { id: 'agent-3', name: 'Create branch', legend: 'Branch', role: 'Create or switch the active branch.', kind: 'key', x: 19.425, y: 57.525, width: 18, height: 18 },
  { id: 'agent-4', name: 'Commit', legend: 'Commit', role: 'Create a commit from staged changes.', kind: 'key', x: 38.475, y: 57.525, width: 18, height: 18 },
  { id: 'agent-5', name: 'Pull request', legend: 'Pull request', role: 'Open the active change for review.', kind: 'key', x: 57.525, y: 57.525, width: 18, height: 18 },
  { id: 'agent-6', name: 'Merge branch', legend: 'Merge', role: 'Merge the active branch when checks are green.', kind: 'key', x: 76.575, y: 57.525, width: 18, height: 18 },
  { id: 'encoder', name: 'Command palette', legend: 'Palette', role: 'Turn through commands and press to confirm.', kind: 'encoder', x: 19.425, y: 76.575, width: 18.5, height: 18.5 },
  { id: 'agent-1', name: 'Terminal', legend: 'Terminal', role: 'Open a command line in the active workspace.', kind: 'key', x: 38.475, y: 76.575, width: 18, height: 18 },
  { id: 'agent-2', name: 'Code action', legend: 'Code', role: 'Open the mapped editor action.', kind: 'key', x: 57.525, y: 76.575, width: 18, height: 18 },
  { id: 'joystick', name: 'Navigate', legend: 'Move', role: 'Move through results in four directions and press to select.', kind: 'joystick', x: 76.575, y: 76.575, width: 15, height: 15 },
] as const satisfies ReadonlyArray<{
  id: string
  name: string
  legend: string
  role: string
  kind: ControlKind
  x: number
  y: number
  width: number
  height: number
}>

export const connectivityCards = [
  {
    label: 'USB-C',
    title: 'Plug in and go.',
    body: 'A direct, dependable connection for everyday control.',
  },
  {
    label: 'Bluetooth',
    title: 'Move freely.',
    body: 'Bonded wireless and five saved profiles make it easy to move between devices.',
  },
  {
    label: 'ZMK + Studio',
    title: 'Shape every control.',
    body: 'Change the layout, tune the behavior, and let Open Micro grow with the way you work.',
  },
  {
    label: 'Local software',
    title: 'Your desk. Your data.',
    body: 'The companion software runs locally on macOS, Linux, and Windows.',
  },
] as const

export const explodedLayers = [
  {
    label: '01',
    title: 'Enclosure',
    value: 'Printed or aluminum',
    body: 'Soft corners and a compact footprint give the design a calm, grounded presence.',
  },
  {
    label: '02',
    title: 'Core',
    value: 'One purposeful board',
    body: 'A compact four-layer board brings every control, connection, and light together.',
  },
  {
    label: '03',
    title: 'Light plate',
    value: 'Soft, diffused light',
    body: 'Frosted polycarbonate gives each control a clear, gentle glow.',
  },
  {
    label: '04',
    title: 'Control hardware',
    value: 'Tactile by design',
    body: 'Switches, a dial, five-way control, and touch give every action a distinct response.',
  },
  {
    label: '05',
    title: 'Caps',
    value: 'Made to change',
    body: 'Replaceable keycaps and remappable inputs let the surface become your own.',
  },
] as const


export const specs = [
  ['Enclosure', '96 × 96 × 17.5 mm'],
  ['PCB', '91.5 × 91.5 × 1.6 mm, four layers'],
  ['Compute', 'EBYTE E73 / nRF52840, 1 MB flash, 256 KB RAM'],
  ['Controls', '12 MX hot-swap, five-way joystick, 24-detent push encoder, capacitive touch'],
  ['Lighting', '13 reverse-mount RGB indicators'],
  ['Connectivity', 'USB-C, bonded BLE, five wireless profiles'],
  ['Power target', 'protected 600 mAh 503040 LiPo'],
  ['Firmware', 'ZMK with Studio support'],
  ['Host bridge', 'macOS, Linux, Windows; Rust daemon/CLI/simulator'],
  ['Materials', '1.5 mm frosted polycarbonate plate; printed or 6061-T6 CNC enclosure'],
] as const

export const licenses = [
  ['Hardware / mechanical', 'CERN-OHL-S-2.0'],
  ['Software', 'Apache-2.0'],
  ['Documentation', 'CC-BY-4.0'],
  ['Pinned Lucide-derived keycap artwork', 'ISC'],
] as const

export const openSourceStatement = 'The enclosure, electronics, firmware, and host software are open for you to study, change, and build on.'

export const privacyStatement =
  'Preorder updates only. We store your email solely for Open Micro launch notices until the preorder notice program ends.'
