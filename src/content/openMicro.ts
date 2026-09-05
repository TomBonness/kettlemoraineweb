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
import night from '../assets/product/marketing/open-micro-night-1600.webp'
import nightFull from '../assets/product/marketing/open-micro-night.webp'
import transparent from '../assets/product/marketing/open-micro-transparent-1600.webp'
import transparentFull from '../assets/product/marketing/open-micro-transparent.webp'

export const marketingRenders = {
  desk: {
    src: desk,
    srcSet: `${desk} 1600w, ${deskFull} 3200w`,
    width: 3200,
    height: 1800,
    alt: 'Concept visualization of Open Micro beside a laptop and coffee on a light desk',
  },
  studio: {
    src: studio,
    srcSet: `${studio} 1600w, ${studioFull} 3200w`,
    width: 3200,
    height: 2400,
    alt: 'Studio concept visualization of Open Micro with dark keycaps, exposed control PCB, and frosted wall',
  },
  exploded: {
    src: exploded,
    srcSet: `${exploded} 1200w, ${explodedFull} 2400w`,
    width: 2400,
    height: 3200,
    alt: 'Exploded concept visualization separating the keycaps, switches, top PCB, frosted wall, sister PCB, aluminum bottom, and feet',
  },
  top: {
    src: top,
    srcSet: `${top} 1600w, ${topFull} 2400w`,
    width: 2400,
    height: 2400,
    alt: 'Overhead concept visualization of twelve MX keys, a push encoder, and an exposed touch control on the matte-black PCB',
  },
  detail: {
    src: detail,
    srcSet: `${detail} 1600w, ${detailFull} 3200w`,
    width: 3200,
    height: 2400,
    alt: 'Material close-up of the encoder, textured dark keycaps, matte solder mask, and gold-colored ENIG contacts',
  },
  night: {
    src: night,
    srcSet: `${night} 1600w, ${nightFull} 3200w`,
    width: 3200,
    height: 1800,
    alt: 'Night concept visualization with cyan and violet light diffused through the frosted polycarbonate wall',
  },
  transparent: {
    src: transparent,
    srcSet: `${transparent} 1600w, ${transparentFull} 2400w`,
    width: 2400,
    height: 2400,
    alt: 'Three-quarter concept visualization of Open Micro with twelve dark keys, a push encoder, and a softly illuminated frosted wall',
  },
} as const

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
    'An exposed control board. A separate electronics layer. A frosted wall that carries the light. Each part has a place in a design you can look into.',
  explodedRenderTitle: 'Thoughtful from the inside out.',
  explodedRenderBody:
    'The concept separates the controls, two circuit boards, light-carrying wall, aluminum bottom, and silicone feet.',
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
    title: 'Enclosure',
    value: 'Anodized aluminum',
    body: 'A CNC 6061-T6 aluminum bottom gives the concept its compact, grounded foundation.',
  },
  {
    title: 'Core',
    value: 'Two boards. Clear roles.',
    body: 'The exposed top PCB holds the controls; the lower sister board carries compute, power, USB, RF, and wall emitters.',
  },
  {
    title: 'Light-carrying wall',
    value: 'Soft, diffused light',
    body: 'A removable neutral-frosted polycarbonate wall carries the light around the perimeter.',
  },
  {
    title: 'Control hardware',
    value: 'Tactile by design',
    body: 'Twelve MX switches, a push encoder, and an exposed capacitive touch control give actions a physical place.',
  },
  {
    title: 'Caps',
    value: 'Textured dark PBT',
    body: 'Vendor-made uniform-profile keycaps sit above the switches; silicone feet complete the base.',
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
