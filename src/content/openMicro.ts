export const navigation = [
  { label: 'Overview', href: '#overview' },
  { label: 'Design', href: '#design' },
  { label: 'Specs', href: '#specs' },
] as const

export const headings = {
  hero: 'Open Micro',
  status: 'Know when to look back.',
  connectivity: 'Connect the way you want.',
  design: 'Built with care.',
  specifications: 'Everything, considered.',
  openSource: 'Make it yours. All the way down.',
} as const

export const hero = {
  eyebrow: 'Open-source control surface',
  description: 'Hardware made to study, change, and build on.',
  primaryCta: 'Keep me updated',
  secondaryCta: 'See how it’s built',
} as const

export const productCopy = {
  skipLink: 'Skip to content',
  primaryNavigationLabel: 'Primary navigation',
  navigationCta: 'Get updates',
  statusLead:
    'Open Micro turns background work into a small, consistent language of color and rhythm. Every state is visible here—nothing to hover over, cycle through, or guess.',
  statusPrinciple: 'Color names the state. Rhythm tells you whether it needs you.',
  statusLegendLabel: 'Open Micro status signal legend',
  connectivityLead:
    'Plug in at your desk. Move freely with Bluetooth. Keep every choice in your hands.',
  designLead:
    'Every layer is considered. Every detail has a purpose. Together, they create a compact control surface designed to feel at home on your desk.',
  explodedRenderTitle: 'Thoughtful from the inside out.',
  explodedRenderBody:
    'A layered design keeps the shell, electronics, light plate, and controls distinct and serviceable.',
  lightDetailTitle: 'Light in the structure.',
  lightDetailBody:
    'The frosted wall turns edge-mounted RGB into a soft, readable signal while the working surface stays visually quiet.',
  heroAlt:
    'Dark studio render of Open Micro with twelve keys, an encoder, five-way control, and illuminated side wall',
  explodedAlt:
    'Exploded studio render of Open Micro showing its controls, switches, circuit boards, illuminated wall, and enclosure',
  lightDetailAlt:
    'Close studio view of the illuminated frosted side wall and matte-black controls on Open Micro',
  topAlt: 'Top-view technical drawing of the Open Micro control layout',
} as const

export const waitlistCopy = {
  honeypotLabel: 'Website',
  emailLabel: 'Email address',
  placeholder: 'you@example.com',
  pending: 'Joining…',
  error: "We couldn't save your email. Please try again.",
} as const

export const statusSignals = [
  {
    name: 'Ready',
    color: '#69717E',
    behavior: 'Dim / still',
    meaning: 'Open Micro is standing by.',
  },
  {
    name: 'Working',
    color: '#0548FD',
    behavior: 'Slow breathe',
    meaning: 'Background work is in progress.',
  },
  {
    name: 'Active',
    color: '#31C7D9',
    behavior: 'Steady pulse',
    meaning: 'A mapped action is running now.',
  },
  {
    name: 'Needs input',
    color: '#FF9F0A',
    behavior: 'Short blink',
    meaning: 'The next step is waiting on you.',
  },
  {
    name: 'Complete',
    color: '#30D158',
    behavior: 'Solid',
    meaning: 'The workflow finished successfully.',
  },
  {
    name: 'Attention',
    color: '#FF453A',
    behavior: 'Fast blink',
    meaning: 'Something needs review.',
  },
] as const satisfies ReadonlyArray<{
  name: string
  color: string
  behavior: string
  meaning: string
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

export const openSourceStatement =
  'The enclosure, electronics, firmware, and host software are open for you to study, change, and build on.'

export const openMicroSignup = {
  source: 'open-micro-product',
  heading: 'See what comes next.',
  lead: 'Kettle Moraine Research Labs is developing Open Micro in the open. Leave your email and we’ll only write when preorder timing is confirmed.',
  submit: 'Notify me',
  success: "You're on the list. We'll let you know when preorder timing is confirmed.",
  privacy:
    'Preorder updates only. Kettle Moraine Research Labs stores your email solely for Open Micro launch notices until the preorder notice program ends.',
} as const
