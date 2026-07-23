import { routes } from './catalog'

export const lavtypeLinks = {
  download: 'https://github.com/TomBonness/lavtype/releases/latest',
  source: 'https://github.com/TomBonness/lavtype',
  installGuide: 'https://github.com/TomBonness/lavtype#install-a-release',
} as const

export const lavtypeNavigation = [
  { label: 'How it works', href: `${routes.lavtype}#how-it-works` },
  { label: 'Local recognition', href: `${routes.lavtype}#local-recognition` },
  { label: 'Platform', href: `${routes.lavtype}#platform` },
] as const

export const lavtypeHero = {
  category: 'Local push-to-talk dictation',
  outcome:
    'Hold one shortcut while you speak. Release it, and Lavtype types the final transcript into the app that is focused when recognition finishes.',
  compatibility: 'macOS 13+ · Linux x86_64 on X11/Xorg',
} as const

export const localRecognitionDetails = [
  ['Parakeet', '460 MiB English model; explicit download; 1.2 GiB free space'],
  ['Apple Speech', 'Available on macOS only when on-device recognition is supported'],
  ['History', 'No transcript history'],
  ['Clipboard', 'No clipboard fallback'],
  ['Output', 'Final results only'],
] as const

export const platformDetails = [
  ['macOS', '13 or newer; Apple silicon and Intel DMGs'],
  ['macOS permissions', 'Microphone and Accessibility; Speech Recognition for Apple Speech'],
  ['macOS first launch', 'Current DMGs are not notarized; Control-click → Open'],
  ['Linux', 'Ubuntu 22.04-compatible x86_64; X11/Xorg only'],
  ['Linux host', 'AppIndicator plus ALSA/PulseAudio/PipeWire input and FUSE 2 for normal AppImage mounting'],
  ['Unsupported', 'Wayland and XWayland'],
  ['Capture', 'Up to 55 seconds per hold'],
  ['Output', 'One complete transcript; clips under 100 ms type nothing'],
  ['License', 'MIT'],
] as const
