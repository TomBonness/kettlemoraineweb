import type { CSSProperties, ReactNode } from 'react'
import {
  activityLabels,
  type Activity,
  type WindowTheme,
  type WorkspaceFolder,
  type WorkspaceTab,
} from '../content/cinmux'
import styles from './CinmuxWindow.module.css'

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgb(${value >> 16} ${(value >> 8) & 255} ${value & 255} / ${alpha * 100}%)`
}

/** The palette cinmux's qml/Theme.qml derives from an Omarchy theme, as CSS custom properties. */
export function windowThemeStyle(theme: WindowTheme) {
  const text = theme.light ? '#252528' : '#ededee'
  return {
    '--cw-bg': theme.bg,
    '--cw-fg': theme.fg,
    '--cw-text': text,
    '--cw-muted': theme.light ? '#66666e' : '#aaaab0',
    '--cw-accent': theme.accent,
    '--cw-warning': theme.warning,
    '--cw-green': theme.green,
    '--cw-yellow': theme.yellow,
    '--cw-magenta': theme.magenta,
    '--cw-cyan': theme.cyan,
    '--cw-selected': withAlpha(text, theme.light ? 0.075 : 0.1),
    '--cw-hover': withAlpha(text, theme.light ? 0.045 : 0.055),
    '--cw-border': withAlpha(text, theme.light ? 0.11 : 0.1),
    '--cw-chrome': theme.light ? 'rgb(0 0 0 / 3%)' : 'rgb(0 0 0 / 12%)',
  } as CSSProperties
}

const icons = {
  panelLeft: <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4 0v16" />,
  panelRight: <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm10 0v16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  columns: <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm7 0v16" />,
  rows: <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM3 12h18" />,
  bell: <path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.5 7 2.5 7h-17S6 15 6 9.5Zm4 10a2.2 2.2 0 0 0 4 0" />,
  search: <path d="M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm4.8 11.3 4.7 4.7" />,
  ellipsis: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  terminal: <path d="m5 7 5 5-5 5m7 1h7" />,
  folder: <path d="M5.5 4.5h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-10.5a2 2 0 0 1 2-2Z" />,
  pin: <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3-1-6Zm3 11v7" />,
} as const

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

/** The Linux app's activity glyphs: a spinner, a question mark, a check and a hollow circle. */
export function StatusGlyph({ activity }: { activity: Activity }) {
  return (
    <svg
      className={styles.glyph}
      data-activity={activity}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {activity === 'working' && (
        <circle cx="12" cy="12" r="8.5" pathLength="100" strokeDasharray="72 100" />
      )}
      {activity === 'waiting' && (
        <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm-2.4 6.4a2.5 2.5 0 0 1 4.8.9c0 1.6-2.4 2.2-2.4 3.7m0 3.2h.01" />
      )}
      {activity === 'done' && <path d="m5 12.5 4.5 4.5L19 7.5" />}
      {activity === 'idle' && <circle cx="12" cy="12" r="8" />}
    </svg>
  )
}

export function StatusBadge({ activity }: { activity: Activity }) {
  return (
    <span className={styles.badge} data-activity={activity}>
      <StatusGlyph activity={activity} />
      {activityLabels[activity]}
    </span>
  )
}

type PaneProps = {
  children: ReactNode
  active?: boolean
  /** Extra depth for this pane when the window is layered. */
  depth?: number
}

export function Pane({ children, active = false, depth = 0 }: PaneProps) {
  return (
    <div
      className={`${styles.pane} ${active ? styles.activePane : ''}`}
      style={{ '--pane-depth': depth } as CSSProperties}
    >
      <div className={styles.paneText}>{children}</div>
    </div>
  )
}

export function TerminalLine({ children }: { children?: ReactNode }) {
  return <span className={styles.line}>{children ?? ' '}</span>
}

export function Prompt({ children, directory, branch, cursor = false }: {
  children?: ReactNode
  directory: string
  branch: string
  cursor?: boolean
}) {
  return (
    <span className={styles.line}>
      <span className={styles.directory}>{directory}</span>{' '}
      <span className={styles.branch}>{branch}</span> <span className={styles.chevron}>❯</span>{' '}
      {children}
      {cursor && <span className={styles.cursor} />}
    </span>
  )
}

type Tone = 'accent' | 'green' | 'yellow' | 'warning' | 'magenta' | 'cyan' | 'muted' | 'strong'

export function Ink({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={styles[tone]}>{children}</span>
}

type CinmuxWindowProps = {
  label: string
  theme: WindowTheme
  tabs: readonly WorkspaceTab[]
  folders?: readonly WorkspaceFolder[]
  selectedId?: string
  /** Terminal panes: `split` puts the first pane on the left and stacks the rest on the right. */
  panes: ReactNode
  split?: 'single' | 'columns' | 'split'
  /** Hides the folder sidebar, as when the window is narrow. */
  compact?: boolean
  /** Puts the chrome, sidebar, tab list and terminal on separate planes for 3D views. */
  layered?: boolean
  layerLabels?: { sidebar: string; tabs: string; terminal: string }
  className?: string
  style?: CSSProperties
}

export function CinmuxWindow({
  label,
  theme,
  tabs,
  folders = [],
  selectedId,
  panes,
  split = 'single',
  compact = false,
  layered = false,
  layerLabels,
  className = '',
  style,
}: CinmuxWindowProps) {
  const attention = tabs.filter((tab) => tab.activity === 'waiting').length

  return (
    <div
      className={`${styles.window} ${layered ? styles.layered : ''} ${compact ? styles.compact : ''} ${theme.light ? styles.light : ''} ${className}`}
      style={{ ...windowThemeStyle(theme), ...style }}
      role="img"
      aria-label={label}
    >
      <div className={styles.backplate}>
        <div className={styles.header}>
          <Icon name="panelLeft" />
          <Icon name="panelRight" />
          <Icon name="plus" />
          <span className={styles.headerSpacer} />
          <Icon name="columns" />
          <Icon name="rows" />
          <Icon name="bell" />
          <span className={styles.search}>
            <Icon name="search" />
            Search sessions
          </span>
          <Icon name="ellipsis" />
        </div>
      </div>

      {!compact && (
        <div
          className={`${styles.layer} ${styles.sidebar}`}
          style={{ '--depth': 1 } as CSSProperties}
          data-label={layerLabels?.sidebar}
        >
          <span className={`${styles.navItem} ${styles.navSelected}`}>
            <Icon name="terminal" />
            <span>Tabs</span>
            <span className={styles.count}>{tabs.length}</span>
          </span>
          <span className={styles.navItem}>
            <Icon name="bell" />
            <span>Needs Attention</span>
            {attention > 0 && <span className={styles.attentionCount}>{attention}</span>}
          </span>
          <span className={styles.foldersHeading}>
            Folders <Icon name="plus" />
          </span>
          {folders.map((folder) => (
            <span className={styles.navItem} key={folder.id}>
              <Icon name="folder" />
              <span>{folder.name}</span>
              <span className={styles.count}>{folder.count}</span>
            </span>
          ))}
        </div>
      )}

      <div
        className={`${styles.layer} ${styles.list}`}
        style={{ '--depth': 2 } as CSSProperties}
        data-label={layerLabels?.tabs}
      >
        {tabs.map((tab) => (
          <span
            className={`${styles.row} ${tab.id === selectedId ? styles.rowSelected : ''}`}
            data-activity={tab.activity}
            key={tab.id}
          >
            {tab.pinned && <Icon name="pin" />}
            <span className={styles.rowTitle}>{tab.title}</span>
            {tab.unread ? <span className={styles.unread}>{tab.unread}</span> : null}
            <StatusBadge activity={tab.activity} />
          </span>
        ))}
      </div>

      <div
        className={`${styles.layer} ${styles.terminal}`}
        style={{ '--depth': 3 } as CSSProperties}
        data-label={layerLabels?.terminal}
        data-split={split}
      >
        {panes}
      </div>
    </div>
  )
}
