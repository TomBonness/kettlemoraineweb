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
  tagline: 'Say what you were going to type.',
  outcome:
    'Lavtype turns speech into text where you’re working. Hold your shortcut, speak, then release. Recognition runs on your computer, not on a cloud service.',
  compatibility: 'macOS 13+ · Linux x86_64 on X11/Xorg',
} as const

export const lavtypeProcess = {
  title: 'Dictate without switching apps.',
  lead:
    'Put the cursor where you want to write, then hold your shortcut and speak. When recognition finishes, Lavtype types one final transcript into the app that’s focused at that moment. Keep that app in focus until the text arrives.',
  notes: 'Up to 55 seconds per hold. Clips under 100 ms type nothing.',
  transcript: 'Send the revised drawing tomorrow.',
  illustrationAlt:
    'Hold a shortcut and speak. Release it to type “Send the revised drawing tomorrow.” into the app focused when recognition finishes.',
} as const

export const lavtypeSteps = [
  {
    label: 'Hold',
    caption: 'Put the cursor where you want the text. Hold your chosen shortcut.',
    visual: 'key',
  },
  {
    label: 'Speak',
    caption: 'Say your message or note while holding the shortcut.',
    visual: 'waveform',
  },
  {
    label: 'Release',
    caption: 'Lavtype types one final transcript into the app focused when recognition finishes.',
    visual: 'transcript',
  },
] as const

export const lavtypeRecognition = {
  title: 'Recognition stays on your computer.',
  lead:
    'You don’t need to send your voice to a cloud service to write a sentence. Lavtype uses a local recognizer and keeps no transcript history.',
  body:
    'Choose Parakeet and explicitly download its English model, or use Apple Speech on macOS where on-device recognition is supported. Once the model is set up, recognition works offline. There’s no cloud or clipboard fallback, including no fallback to Apple’s network recognizer.',
  modelLabel: 'Downloaded English model',
  output: 'Final transcript → app focused when recognition finishes',
  note: 'Model setup may need a download. Speech recognition itself runs on your computer.',
} as const

export const lavtypePlatform = {
  title: 'Check your setup.',
  lead:
    'Lavtype is available for macOS and X11 Linux, with the requirements below. Choose the release for your machine and follow the install guide. The MIT-licensed source is there to read, change or build yourself.',
  download: 'Download and choose your shortcut.',
} as const

export const localRecognitionDetails = [
  ['Parakeet', 'English model; explicit ~460 MiB download; 1.2 GiB free space'],
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
