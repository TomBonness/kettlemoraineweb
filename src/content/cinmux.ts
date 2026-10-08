import linux from '../assets/product/cinmux/cinmux-linux-1080.webp'
import linuxFull from '../assets/product/cinmux/cinmux-linux.webp'
import macos from '../assets/product/cinmux/cinmux-macos-1080.webp'
import macosFull from '../assets/product/cinmux/cinmux-macos.webp'
import tui from '../assets/product/cinmux/cinmux-tui-1080.webp'
import tuiFull from '../assets/product/cinmux/cinmux-tui.webp'
import { routes } from './catalog'

// Facts on this page follow the published README at github.com/satellitedown/cinmux (v1.2.0).
export const cinmuxLinks = {
  source: routes.pending,
  buildFromSource: routes.pending,
  agentStatus: routes.pending,
} as const

export const cinmuxNavigation = [
  { label: 'Agents', href: `${routes.cinmux}#agents` },
  { label: 'Sessions', href: `${routes.cinmux}#sessions` },
  { label: 'Anywhere', href: `${routes.cinmux}#anywhere` },
  { label: 'Install', href: `${routes.cinmux}#install` },
] as const

export const cinmuxCommands = {
  homebrew: 'brew install satellitedown/cinmux/cinmux',
  installer:
    'curl -fsSL https://raw.githubusercontent.com/satellitedown/cinmux/master/install.sh | bash',
  ssh: 'ssh -t you@your-machine cinmux tui',
} as const

export type Activity = 'idle' | 'working' | 'waiting' | 'done'

export const activityLabels: Record<Activity, string> = {
  working: 'Working',
  waiting: 'Needs input',
  done: 'Done',
  idle: 'Idle',
}

export const activityStates = [
  {
    activity: 'working',
    description: 'A turn, a tool call or a long job is running.',
  },
  {
    activity: 'waiting',
    description: 'It stopped to ask you something, so the tab joins Needs Attention.',
  },
  {
    activity: 'done',
    description: 'It finished while you were working somewhere else.',
  },
  {
    activity: 'idle',
    description: 'A shell waiting for your next command.',
  },
] as const satisfies readonly { activity: Activity; description: string }[]

export const statusCommands = [
  {
    command: `cinmux activity --state working --pid "$$" --detail 'Running checks'`,
    note: 'Mark the tab Working; it clears when that process exits',
  },
  {
    command: `cinmux notify --title 'Build complete' --body 'Ready to review'`,
    note: 'Ping the tab you’re in',
  },
  { command: 'cinmux list --json', note: 'Every tab, its folder and its status' },
] as const

export type WorkspaceTab = {
  id: string
  title: string
  activity: Activity
  pinned?: boolean
  unread?: number
}

export type WorkspaceFolder = { id: string; name: string; count: number }

export const heroFolders: readonly WorkspaceFolder[] = [
  { id: 'api', name: 'api', count: 5 },
  { id: 'web', name: 'web', count: 3 },
  { id: 'infra', name: 'infra', count: 1 },
]

export const heroTabs: readonly WorkspaceTab[] = [
  { id: 'scratch', title: 'scratch', activity: 'idle', pinned: true },
  { id: 'auth', title: 'agent: auth refactor', activity: 'working' },
  { id: 'flaky', title: 'agent: flaky tests', activity: 'waiting' },
  { id: 'dev', title: 'dev server', activity: 'idle', unread: 2 },
  { id: 'build', title: 'build', activity: 'done' },
  { id: 'docs', title: 'agent: docs sweep', activity: 'working' },
  { id: 'migrations', title: 'migrations', activity: 'idle' },
  { id: 'logs', title: 'logs', activity: 'idle' },
  { id: 'release', title: 'release notes', activity: 'done' },
]

// The hero replays this loop: each step overrides a few tabs, the rest keep their last state.
export const heroTimeline: readonly Partial<Record<string, Activity>>[] = [
  {},
  { build: 'working' },
  { flaky: 'working', auth: 'waiting' },
  { docs: 'done' },
  { build: 'done', release: 'idle' },
  { auth: 'working', docs: 'working' },
  { flaky: 'waiting', release: 'done' },
]

export const fieldTitles = [
  'agent: auth refactor',
  'dev server',
  'agent: flaky tests',
  'build',
  'logs',
  'agent: docs sweep',
  'migrations',
  'scratch',
  'agent: perf pass',
  'release notes',
  'db shell',
  'agent: i18n',
  'storybook',
  'ssh prod',
  'agent: retry logic',
  'deploy',
  'agent: api types',
  'watch tests',
  'notebook',
  'agent: css cleanup',
  'benchmarks',
  'agent: changelog',
  'redis-cli',
  'agent: dark mode',
  'tail -f',
  'agent: e2e fixes',
  'psql',
  'agent: deps bump',
  'profiling',
  'agent: onboarding',
  'htop',
  'agent: caching',
  'playground',
  'agent: search index',
  'terraform',
  'agent: rate limits',
  'cargo watch',
  'agent: webhooks',
  'nvim',
  'agent: pagination',
  'docker',
  'agent: billing',
  'journal',
  'agent: a11y pass',
  'fixtures',
  'agent: telemetry',
  'backups',
  'agent: mobile nav',
  'queue worker',
  'agent: error pages',
  'dotfiles',
  'agent: sso',
  'promo render',
  'agent: theme sync',
  'lint',
  'agent: sitemap',
] as const

export const persistentSessions = [
  { id: 'build', title: 'build', command: 'cargo build --release' },
  { id: 'server', title: 'dev server', command: 'npm run dev' },
  { id: 'agent', title: 'agent: auth refactor', command: 'omp' },
  { id: 'tests', title: 'tests', command: 'npm test -- --watch' },
] as const

export const organizeFeatures = [
  { title: 'Folders', body: 'Group tabs by project, then drag them wherever they belong.' },
  { title: 'Pins', body: 'Keep the tabs you live in at the top of the list.' },
  { title: 'Search', body: 'Find any tab by its title, its directory or its git branch.' },
  {
    title: 'Splits',
    body: 'Real tmux panes. Alt+Enter splits down and Alt+Shift+Enter splits right.',
  },
] as const

export const searchSessions = [
  { title: 'agent: auth refactor', folder: 'api', directory: '~/code/api', branch: 'auth-sessions', activity: 'working' },
  { title: 'dev server', folder: 'api', directory: '~/code/api', branch: 'main', activity: 'idle' },
  { title: 'agent: flaky tests', folder: 'api', directory: '~/code/api', branch: 'fix/flaky-retry', activity: 'waiting' },
  { title: 'storybook', folder: 'web', directory: '~/code/web', branch: 'main', activity: 'idle' },
  { title: 'agent: dark mode', folder: 'web', directory: '~/code/web', branch: 'theme/dark', activity: 'done' },
  { title: 'terraform plan', folder: 'infra', directory: '~/code/infra', branch: 'staging', activity: 'working' },
  { title: 'release notes', folder: 'web', directory: '~/notes', branch: 'main', activity: 'done' },
  { title: 'dotfiles', directory: '~/.config', branch: 'main', activity: 'idle' },
] as const satisfies readonly {
  title: string
  folder?: string
  directory: string
  branch: string
  activity: Activity
}[]

export const searchSuggestions = ['main', 'api', 'agent', 'theme'] as const

export const platforms = [
  {
    id: 'linux',
    label: 'Linux',
    title: 'A native Wayland app.',
    body: 'Real terminals, drawn by Foot, in a window that follows your Omarchy theme. Install it on Arch Linux or Omarchy with one command.',
    details: ['Wayland session', 'Arch Linux + Omarchy installer', 'Follows your Omarchy theme'],
    image: {
      src: linux,
      srcSet: `${linux} 1080w, ${linuxFull} 2160w`,
      width: 2160,
      height: 1320,
      alt: 'Cinmux on Linux: folders, a tab list with Working, Needs input and Done statuses, and a tmux session split into three panes',
    },
  },
  {
    id: 'macos',
    label: 'macOS',
    title: 'A native Mac app.',
    body: 'The same sessions, folders, agent statuses, CLI and cinmux tui. It follows light and dark mode, shows Nerd Font prompt icons out of the box, and sends a notification when a tab needs you.',
    details: ['macOS 15 or later', 'Homebrew or the installer', 'Notifications when a tab needs you'],
    image: {
      src: macos,
      srcSet: `${macos} 1080w, ${macosFull} 1932w`,
      width: 1932,
      height: 1260,
      alt: 'Cinmux for macOS with a pinned agent, folders and a split tmux session',
    },
  },
  {
    id: 'tui',
    label: 'Over SSH',
    title: 'The whole workspace, in a terminal.',
    body: 'cinmux tui shows the same tabs, folders, menus and statuses, live alongside the desktop app. Pick up your sessions from any computer that can SSH in.',
    details: [
      'Nothing to install on the other computer',
      'The mouse works: menus, drag and drop, resizing',
      'Disconnecting leaves every session running',
    ],
    image: {
      src: tui,
      srcSet: `${tui} 1080w, ${tuiFull} 2160w`,
      width: 2160,
      height: 1320,
      alt: 'cinmux tui showing the same workspace, statuses and split panes inside a terminal',
    },
  },
] as const

export type WindowTheme = {
  name: string
  bg: string
  fg: string
  light: boolean
  accent: string
  warning: string
  green: string
  yellow: string
  magenta: string
  cyan: string
}

// Omarchy palettes, as cinmux's src/theme.cpp reads them from colors.toml.
export const omarchyThemes: readonly WindowTheme[] = [
  { name: 'Gruvbox', bg: '#282828', fg: '#d4be98', light: false, accent: '#7daea3', warning: '#e1875c', green: '#a9b665', yellow: '#d8a657', magenta: '#d3869b', cyan: '#89b482' },
  { name: 'Tokyo Night', bg: '#1a1b26', fg: '#a9b1d6', light: false, accent: '#7aa2f7', warning: '#eb927b', green: '#9ece6a', yellow: '#e0af68', magenta: '#ad8ee6', cyan: '#449dab' },
  { name: 'Catppuccin', bg: '#1e1e2e', fg: '#cdd6f4', light: false, accent: '#89b4fa', warning: '#f6b6ab', green: '#a6e3a1', yellow: '#f9e2af', magenta: '#f5c2e7', cyan: '#94e2d5' },
  { name: 'Everforest', bg: '#2d353b', fg: '#d3c6aa', light: false, accent: '#7fbbb3', warning: '#e09d7f', green: '#a7c080', yellow: '#dbbc7f', magenta: '#d699b6', cyan: '#83c092' },
  { name: 'Rosé Pine', bg: '#faf4ed', fg: '#575279', light: true, accent: '#56949f', warning: '#cf8057', green: '#286983', yellow: '#ea9d34', magenta: '#907aa9', cyan: '#d7827e' },
  { name: 'Kanagawa', bg: '#1f1f28', fg: '#dcd7ba', light: false, accent: '#dcd7ba', warning: '#c17158', green: '#76946a', yellow: '#c0a36e', magenta: '#957fb8', cyan: '#6a9589' },
  { name: 'Nord', bg: '#2e3440', fg: '#d8dee9', light: false, accent: '#81a1c1', warning: '#d5967a', green: '#a3be8c', yellow: '#ebcb8b', magenta: '#b48ead', cyan: '#88c0d0' },
  { name: 'Ristretto', bg: '#2c2525', fg: '#e6d9db', light: false, accent: '#f38d70', warning: '#fb9a77', green: '#adda78', yellow: '#f9cc6c', magenta: '#a8a9eb', cyan: '#85dacc' },
  { name: 'Catppuccin Latte', bg: '#eff1f5', fg: '#4c4f69', light: true, accent: '#1e66f5', warning: '#d84e2b', green: '#40a02b', yellow: '#df8e1d', magenta: '#ea76cb', cyan: '#179299' },
  { name: 'Osaka Jade', bg: '#111c18', fg: '#c1c497', light: false, accent: '#509475', warning: '#a2734b', green: '#549e6a', yellow: '#459451', magenta: '#d2689c', cyan: '#2dd5b7' },
  { name: 'Retro 82', bg: '#05182e', fg: '#f6dcac', light: false, accent: '#faa968', warning: '#faa968', green: '#028391', yellow: '#e97b3c', magenta: '#3f8f8a', cyan: '#8cbfb8' },
  { name: 'Hackerman', bg: '#0b0c16', fg: '#ddf7ff', light: false, accent: '#82fb9c', warning: '#50f7a3', green: '#4fe88f', yellow: '#50f7d4', magenta: '#86a7df', cyan: '#7cf8f7' },
]

export type ShortcutPlatform = 'linux' | 'macos'

// Each binding is a list of alternatives; each alternative is a list of keys.
export const shortcuts = [
  { action: 'New tab', linux: [['Ctrl', 'Shift', 'N']], macos: [['⌘', 'T']] },
  { action: 'New folder', linux: [['Ctrl', 'Alt', 'N']], macos: [['⇧', '⌘', 'N']] },
  { action: 'Search', linux: [['Ctrl', 'Shift', 'F']], macos: [['⌘', 'F']] },
  { action: 'Jump to the tab that needs you', linux: [['Ctrl', 'Alt', 'U']], macos: [['⌘', 'J']] },
  { action: 'Rename tab', linux: [['Ctrl', 'R']], macos: [['⌘', 'R']] },
  {
    action: 'Previous / next tab',
    linux: [['Ctrl', 'Alt', 'PgUp'], ['Ctrl', 'Alt', 'PgDn']],
    macos: [['⇧', '⌘', '['], ['⇧', '⌘', ']']],
  },
  { action: 'Split right', linux: [['Alt', 'Shift', 'Enter']], macos: [['⌘', 'D']] },
  { action: 'Split down', linux: [['Alt', 'Enter']], macos: [['⇧', '⌘', 'D']] },
  {
    action: 'Show or hide the sidebar',
    linux: [['Ctrl', 'Shift', 'B'], ['Ctrl', 'Shift', 'L']],
    macos: [['⌃', '⌘', 'S']],
  },
  { action: 'Close tab', linux: [['Ctrl', 'Shift', 'W']], macos: [['⇧', '⌘', 'W']] },
  { action: 'Quit — sessions keep running', linux: [['Ctrl', 'Shift', 'Q']], macos: [['⌘', 'Q']] },
] as const satisfies readonly {
  action: string
  linux: readonly (readonly string[])[]
  macos: readonly (readonly string[])[]
}[]

export const installOptions = [
  {
    id: 'homebrew',
    label: 'macOS 15 or later, with Homebrew',
    command: cinmuxCommands.homebrew,
  },
  {
    id: 'installer',
    label: 'macOS, Arch Linux or Omarchy, with the installer',
    command: cinmuxCommands.installer,
  },
] as const

export const installDetails = [
  ['Linux desktop app', 'A Wayland session'],
  ['macOS', '15 or later'],
  ['cinmux tui', 'Any terminal, local or over SSH'],
  ['License', 'MIT'],
] as const

export const cinmuxQuestions = [
  {
    question: 'What happens when I close the app?',
    answer:
      'Your sessions keep running. Closing a tab is what ends its shells. Sessions don’t survive a reboot, but your tabs do, and one click starts them again.',
  },
  {
    question: 'Will it change my tmux setup?',
    answer:
      'No. Cinmux runs its own private tmux server and never edits your tmux, Foot or Hyprland config.',
  },
  {
    question: 'How does a tab know what its agent is doing?',
    answer:
      'OMP reports through the bundled extension, which the installer links for you. Anything else can call cinmux activity and cinmux notify from inside its tab.',
  },
  {
    question: 'Can I keep separate sets of tabs?',
    answer: 'Yes. Point CINMUX_STATE_DIR at an absolute path for a separate profile.',
  },
  {
    question: 'What does it cost?',
    answer: 'Nothing. Cinmux is open source under the MIT license.',
  },
] as const
