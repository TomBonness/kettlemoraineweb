import desk from '../assets/product/marketing/open-micro-desk-1600.webp'
import deskFull from '../assets/product/marketing/open-micro-desk.webp'
import studio from '../assets/product/marketing/open-micro-studio-1600.webp'
import studioFull from '../assets/product/marketing/open-micro-studio.webp'
import exploded from '../assets/product/marketing/open-micro-exploded-1600.webp'
import explodedFull from '../assets/product/marketing/open-micro-exploded.webp'
import top from '../assets/product/marketing/open-micro-top-1600.webp'
import topFull from '../assets/product/marketing/open-micro-top.webp'
import detail from '../assets/product/marketing/open-micro-detail-1600.webp'
import detailFull from '../assets/product/marketing/open-micro-detail.webp'
import transparent from '../assets/product/marketing/open-micro-transparent-1600.webp'
import transparentFull from '../assets/product/marketing/open-micro-transparent.webp'

export const marketingRenders = {
  desk: {
    src: desk,
    srcSet: `${desk} 1600w, ${deskFull} 3840w`,
    width: 3840,
    height: 2160,
    alt: 'Concept visualization of Open Micro connected by USB-C on a black mat on a whitewashed wooden desk',
  },
  studio: {
    src: studio,
    srcSet: `${studio} 1600w, ${studioFull} 3840w`,
    width: 3840,
    height: 2880,
    alt: 'Studio concept visualization of Open Micro with dark keycaps, exposed control PCB, and smoked wall',
  },
  exploded: {
    src: exploded,
    srcSet: `${exploded} 1200w, ${explodedFull} 2880w`,
    width: 2880,
    height: 3840,
    alt: 'Exploded concept visualization separating the controls, two PCBs, smoked wall, battery, aluminum base, and feet',
  },
  top: {
    src: top,
    srcSet: `${top} 1600w, ${topFull} 2880w`,
    width: 2880,
    height: 2880,
    alt: 'Overhead concept visualization of twelve MX keys, a push encoder, and an exposed touch control on the matte-black PCB',
  },
  detail: {
    src: detail,
    srcSet: `${detail} 1600w, ${detailFull} 3840w`,
    width: 3840,
    height: 2880,
    alt: 'Material close-up of the anodized encoder knob, dished dark keycaps, PCB solder mask, and solder joints',
  },
  transparent: {
    src: transparent,
    srcSet: `${transparent} 1600w, ${transparentFull} 2880w`,
    width: 2880,
    height: 2880,
    alt: 'Three-quarter concept visualization of Open Micro with twelve dark keys, a push encoder, and a softly illuminated smoked wall',
  },
} as const

export const navigation = [
  { label: 'Overview', href: '#overview' },
  { label: 'Design', href: '#design' },
  { label: 'Specs', href: '#specs' },
] as const

/** Section headings as two lines; the second is set in italic. */
export const headings = {
  hero: 'Open Micro',
  agents: ['Your agents,', 'under your hand.'],
  connectivity: ['Keep control', 'on your computer.'],
  design: ['See how it', 'fits together.'],
  specifications: ['The current', 'design.'],
  openSource: ['You can change', 'the design.'],
} as const

export const hero = {
  statement: ['A shortcut you can', 'put your hand on.'],
  description:
    'Open Micro is a desktop controller concept in development. Map repeated actions to keys, a dial, and touch instead of reaching through menus.',
  primaryCta: 'Keep me updated',
  secondaryCta: 'See how it’s built',
  baseline: [
    '12 keys · encoder · touch',
    'USB-C + Bluetooth',
    'Open-source hardware and software',
    'Concept in development',
  ],
} as const

export const sourceLinks = {
  repository: 'https://github.com/TomBonness/open-micro',
  qualification: 'https://github.com/TomBonness/open-micro/blob/main/docs/qualification.md',
} as const

export const productCopy = {
  skipLink: 'Skip to content',
  primaryNavigationLabel: 'Primary navigation',
  navigationCta: 'Get updates',
  connectivityLead:
    'The design pairs USB-C and Bluetooth with configurable firmware and local host software. Choose how to connect and what each control does.',
  designLead:
    'The exposed control PCB lets you see the board beneath the keys. A separate lower board handles compute and power. Here’s how the concept fits together, from keycaps to base.',
  materialHeading: 'Controls you can feel.',
  materialBody:
    'PBT keycaps give your fingers a textured surface. The encoder gives turning and pressing their own control.',
  explodedCaption:
    'Controls, two PCBs, smoked wall, battery, aluminum base, and feet, taken apart.',
  specsLead:
    'Open Micro is still in development. Targets and pending values are marked as they stand in the current design.',
} as const

export const waitlistCopy = {
  honeypotLabel: 'Website',
  emailLabel: 'Email address',
  placeholder: 'you@example.com',
  pending: 'Joining…',
  error: "We couldn't save your email. Please try again.",
} as const

/** Agent lifecycle states from the host SDK and the light each shows on its key. */
export const agentStates = {
  idle: { label: 'idle', effect: 'off', color: '#4a4f58' },
  thinking: { label: 'thinking', effect: 'breathe', color: '#4d8dff' },
  running: { label: 'running', effect: 'pulse', color: '#3cc4d8' },
  waiting: { label: 'needs you', effect: 'blink', color: '#ffa424' },
  done: { label: 'done', effect: 'solid', color: '#42cf7c' },
  error: { label: 'error', effect: 'solid', color: '#ff5147' },
} as const

export type AgentState = keyof typeof agentStates

/** Made-up sessions for the illustration, one per agent key (`agent-1` to `agent-6`). */
export const agentSessions = [
  { name: 'auth refactor', detail: 'splitting the session middleware' },
  { name: 'flaky test triage', detail: 'rerunning the checkout suite' },
  { name: 'API docs', detail: 'documenting the export endpoints' },
  { name: 'dependency update', detail: 'bumping the bundler' },
  { name: 'schema migration', detail: 'drafting the users table change' },
  { name: 'release notes', detail: 'summarizing merged changes' },
] as const

/**
 * The example loop. Each beat sets every session's state, the selected session, and an optional
 * encoder detent for it. At most two lights animate at once, and the detents net to zero per loop.
 */
export const agentBeats: ReadonlyArray<{
  states: readonly AgentState[]
  selected: number
  turn?: -1 | 1
}> = [
  { states: ['thinking', 'waiting', 'done', 'idle', 'done', 'idle'], selected: 0 },
  { states: ['running', 'waiting', 'done', 'idle', 'done', 'idle'], selected: 0, turn: 1 },
  { states: ['running', 'running', 'done', 'idle', 'done', 'idle'], selected: 1 },
  { states: ['done', 'running', 'done', 'thinking', 'done', 'idle'], selected: 3, turn: -1 },
  { states: ['done', 'done', 'idle', 'running', 'done', 'thinking'], selected: 3 },
  { states: ['idle', 'done', 'idle', 'error', 'done', 'running'], selected: 3 },
  { states: ['idle', 'idle', 'idle', 'thinking', 'done', 'running'], selected: 3, turn: 1 },
  { states: ['thinking', 'idle', 'done', 'running', 'idle', 'done'], selected: 0 },
  { states: ['thinking', 'running', 'done', 'done', 'idle', 'done'], selected: 0, turn: -1 },
]

/** Starting thinking level per session, 0 (lowest) to `agentLevels - 1`, on a neutral meter. */
export const agentLevels = 5
export const agentStartLevels = [2, 1, 2, 1, 3, 2] as const

export const agentCopy = {
  lead: 'Each agent you run can claim one of six lit keys, and its light follows the work: a slow breathe while it thinks, a steady pulse while it runs, an amber blink when it needs you. Press a key to select that session, then turn the encoder to change its thinking level.',
  listLabel: 'Example sessions',
  slots: 'Agent keys 1 to 6',
  encoderLabel: 'Thinking level for',
  lower: 'Lower',
  higher: 'Higher',
  fallback: 'With no app subscribed, the encoder falls back to volume down, up, and mute.',
  commandLabel: 'Set any light from a terminal',
  command:
    "open-microctl led set agent-1 --effect breathe --primary '#4D8DFF' --period 1400 --ttl 15",
  points: [
    {
      title: 'Thirteen lights to address.',
      body: 'Each of the twelve keys and the touch control takes its own color and effect: off, solid, breathe, blink, pulse, or rainbow.',
    },
    {
      title: 'Anything can set a light.',
      body: 'Apps talk to a local daemon over a private socket. Alongside the OMP agent extension, the source includes a generic JSON state producer, so a script or another tool can light a key too.',
    },
    {
      title: 'No path into your prompts.',
      body: 'The keys select a session and the encoder changes its thinking level. Nothing on the device can type into an agent: there is no hardware prompt-injection path.',
    },
  ],
} as const

export const connectivityCards = [
  {
    label: 'USB-C',
    title: 'Use a cable.',
    body: 'Connect directly to your computer at your desk.',
  },
  {
    label: 'Bluetooth',
    title: 'Switch computers.',
    body: 'Keep five bonded profiles for the computers you switch between.',
  },
  {
    label: 'ZMK + Studio',
    title: 'Assign your controls.',
    body: 'Configure the layout and behavior for the actions you repeat, rather than work around a fixed set of shortcuts.',
  },
  {
    label: 'Local software',
    title: 'Run the bridge locally.',
    body: 'The Rust host software runs on your own computer, with a daemon, CLI, and simulator for macOS, Linux, and Windows.',
  },
] as const

export const explodedLayers = [
  {
    title: 'Textured PBT keycaps',
    body: 'Uniform-profile PBT keycaps give your fingers a textured, consistent surface.',
  },
  {
    title: 'Keys, encoder, and touch',
    body: 'Twelve MX hot-swap keys, a 24-detent push encoder, and capacitive touch. Choose the control that suits the action.',
  },
  {
    title: 'Control PCB and sister board',
    body: 'The exposed top PCB holds the controls; the lower sister board carries compute, power, USB, RF, and wall emitters.',
  },
  {
    title: 'Removable polycarbonate wall',
    body: 'The satin-smoked wall diffuses light around the perimeter, where it can show the status of your work.',
  },
  {
    title: 'Anodized aluminum',
    body: 'A CNC 6061-T6 aluminum bottom closes the enclosure. Silicone feet sit between the base and your desk.',
  },
] as const

export const specs = [
  ['Footprint', '96 × 96 mm; enclosure height pending the repaired component stack'],
  ['Architecture', 'Exposed control PCB and separate lower sister PCB'],
  ['Compute', 'EBYTE E73 / nRF52840, 1 MB flash, 256 KB RAM'],
  ['Controls', '12 MX hot-swap, 24-detent push encoder, capacitive touch'],
  ['Lighting target', '21 physical emitters; 13 host-addressable channels'],
  ['Connectivity', 'USB-C, bonded BLE, five wireless profiles'],
  ['Power target', 'protected 600 mAh 503040 LiPo'],
  ['Firmware', 'ZMK with Studio support'],
  ['Host bridge', 'macOS, Linux, Windows; Rust daemon/CLI/simulator'],
  [
    'Materials',
    'CNC 6061-T6 aluminum, neutral-frosted polycarbonate, dark PBT keycaps, silicone feet',
  ],
] as const

/**
 * Callouts on the overhead render, each tied to a spec row: a label beside the device and a line
 * at height `y` that ends at `to`, both in percent of the render's size.
 */
export const specCallouts = [
  { label: 'Exposed control PCB', spec: 'Architecture', side: 'left', y: 13.5, to: 38.5 },
  { label: '24-detent push encoder', spec: 'Controls', side: 'left', y: 72.7, to: 20 },
  { label: '12 MX hot-swap keys', spec: 'Controls', side: 'right', y: 42.4, to: 80.3 },
  { label: 'Capacitive touch', spec: 'Controls', side: 'right', y: 74, to: 76.5 },
] as const satisfies ReadonlyArray<{
  label: string
  spec: (typeof specs)[number][0]
  side: 'left' | 'right'
  y: number
  to: number
}>

export const licenses = [
  ['Hardware / mechanical', 'CERN-OHL-S-2.0'],
  ['Software', 'Apache-2.0'],
  ['Documentation', 'CC-BY-4.0'],
  ['Pinned Lucide-derived keycap artwork', 'ISC'],
] as const

export const openSourceStatement =
  'The enclosure, electronics, firmware, and host software are open to inspect and change. You can study how a control reaches your computer and adapt the design to your work.'

export const openMicroSignup = {
  source: 'open-micro-product',
  heading: 'Hear when preorders are confirmed.',
  lead: 'Open Micro is still in development. Leave your email if you’d like to hear when preorder timing is confirmed.',
  submit: 'Notify me',
  success: "You're on the list. We'll let you know when preorder timing is confirmed.",
  privacy:
    'Preorder updates only. Kettle Moraine Research Labs stores your email solely for Open Micro launch notices until the preorder notice program ends.',
} as const
