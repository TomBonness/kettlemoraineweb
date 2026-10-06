import { AgentField } from '../components/AgentField'
import { CinmuxIcon3D } from '../components/CinmuxIcon3D'
import { StatusGlyph } from '../components/CinmuxWindow'
import { CopyCommand } from '../components/CopyCommand'
import { PlatformCarousel } from '../components/PlatformCarousel'
import { SearchDemo } from '../components/SearchDemo'
import { SessionDemo } from '../components/SessionDemo'
import { ShortcutDeck } from '../components/ShortcutDeck'
import { SiteShell } from '../components/SiteShell'
import { ThemeShowcase } from '../components/ThemeShowcase'
import { WorkspaceStage } from '../components/WorkspaceStage'
import { routes } from '../content/catalog'
import {
  activityLabels,
  activityStates,
  cinmuxLinks,
  cinmuxNavigation,
  cinmuxQuestions,
  installDetails,
  installOptions,
  organizeFeatures,
  statusCommands,
} from '../content/cinmux'
import styles from './CinmuxPage.module.css'

export function CinmuxPage() {
  return (
    <SiteShell
      currentPath={routes.cinmux}
      navigation={cinmuxNavigation}
      cta={{ label: 'Install', href: `${routes.cinmux}#install` }}
    >
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="cinmux-title">
          <div className={styles.heroBackdrop} aria-hidden="true">
            <div className={styles.heroFloor} />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div>
                <h1 id="cinmux-title">Cinmux</h1>
                <p className={styles.heroStatement}>
                  Every terminal. Every agent. <em>One place.</em>
                </p>
              </div>
              <div>
                <p className={styles.heroLead}>
                  Persistent terminal workspaces for Linux and macOS. Real terminals in folders,
                  agents you can read at a glance, and sessions that keep running — at your desk
                  or over SSH.
                </p>
                <div className={styles.heroActions}>
                  <a className={`button ${styles.primaryButton}`} href="#install">
                    Install Cinmux <span aria-hidden="true">↓</span>
                  </a>
                  <a className={styles.textLink} href={cinmuxLinks.source}>
                    View source <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
            <WorkspaceStage />
            <div className={styles.heroBaseline}>
              <span>Linux · macOS 15+ · any terminal over SSH</span>
              <span>Open source · MIT licensed</span>
            </div>
          </div>
        </section>

        <section className={styles.agentsSection} id="agents" aria-labelledby="agents-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="agents-title">
                Which one
                <br />
                <em>needs you?</em>
              </h2>
              <p className={styles.lead}>
                Every tab shows what its agent is doing: Working, Needs input, Done or Idle.
                Anything waiting on you collects under Needs Attention, and one shortcut takes you
                straight there.
              </p>
            </div>
            <AgentField />
            <dl className={styles.states}>
              {activityStates.map((state) => (
                <div data-activity={state.activity} key={state.activity}>
                  <dt>
                    <StatusGlyph activity={state.activity} />
                    {activityLabels[state.activity]}
                  </dt>
                  <dd>{state.description}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.reporting}>
              <div>
                <h3>Anything can report in.</h3>
                <p>
                  OMP reports its status through a bundled extension that the installer sets up.
                  Scripts, builds and other agents can use the cinmux command from inside their
                  tab.
                </p>
                <a className={styles.textLink} href={cinmuxLinks.agentStatus}>
                  Agent status docs <span aria-hidden="true">↗</span>
                </a>
              </div>
              <pre className={styles.cli}>
                <code>
                  {statusCommands.map((item) => (
                    <span key={item.command}>
                      <span className={styles.cliComment}># {item.note}</span>
                      {'\n'}
                      <span className={styles.cliPrompt}>$ </span>
                      {item.command}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section className={styles.sessionsSection} id="sessions" aria-labelledby="sessions-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="sessions-title">
                Quit the app.
                <br />
                <em>Not your work.</em>
              </h2>
              <p className={styles.lead}>
                Every tab is a tmux session on Cinmux’s own private tmux server. Close the window
                and your builds, servers and agents keep going. Open it again and everything is
                where you left it.
              </p>
            </div>
            <SessionDemo />
            <dl className={styles.facts}>
              <div>
                <dt>Closing a tab</dt>
                <dd>Ends its shells. Quitting the app never does.</dd>
              </div>
              <div>
                <dt>After a reboot</dt>
                <dd>Your tabs are still there. One click starts each session again.</dd>
              </div>
              <div>
                <dt>Your config</dt>
                <dd>Untouched. Cinmux never edits your tmux, Foot or Hyprland config.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.organizeSection} aria-labelledby="organize-title">
          <div className={`${styles.inner} ${styles.organizeGrid}`}>
            <div>
              <h2 id="organize-title">
                A place for
                <br />
                <em>every terminal.</em>
              </h2>
              <p className={styles.lead}>
                Folders keep projects apart, pins keep your favorites on top, and search finds any
                tab in a keystroke.
              </p>
              <dl className={styles.features}>
                {organizeFeatures.map((feature) => (
                  <div key={feature.title}>
                    <dt>{feature.title}</dt>
                    <dd>{feature.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <SearchDemo />
          </div>
        </section>

        <section className={styles.anywhereSection} id="anywhere" aria-labelledby="anywhere-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="anywhere-title">
                At your desk.
                <br />
                <em>Or over SSH.</em>
              </h2>
              <p className={styles.lead}>
                Native apps for Linux and macOS, and the same live workspace in any terminal with
                cinmux tui. Same tabs, same folders, same statuses.
              </p>
            </div>
            <PlatformCarousel />
          </div>
        </section>

        <section className={styles.themeSection} aria-labelledby="theme-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="theme-title">
                Your theme.
                <br />
                <em>Live.</em>
              </h2>
              <p className={styles.lead}>
                On Linux, Cinmux follows your Omarchy theme the moment you switch it, with no
                restart. On macOS, it follows light and dark mode.
              </p>
            </div>
            <ThemeShowcase />
          </div>
        </section>

        <section className={styles.shortcutsSection} aria-labelledby="shortcuts-title">
          <div className={styles.inner}>
            <div className={styles.sectionIntro}>
              <h2 id="shortcuts-title">
                Keep your hands
                <br />
                <em>on the keys.</em>
              </h2>
              <p className={styles.lead}>
                Open, rename, split and jump between tabs without reaching for the mouse. The
                same actions work in the desktop apps and in cinmux tui.
              </p>
            </div>
            <ShortcutDeck />
          </div>
        </section>

        <section className={styles.installSection} id="install" aria-labelledby="install-title">
          <div className={`${styles.inner} ${styles.installGrid}`}>
            <div className={styles.installCopy}>
              <h2 id="install-title">
                Installed in
                <br />
                <em>one line.</em>
              </h2>
              <p className={styles.lead}>
                The installer adds anything missing, builds the latest version and installs it to
                ~/.local, with Cinmux.app in ~/Applications on a Mac. It sets up OMP if you use it.
                Run it again to update; your sessions keep running.
              </p>
              <div className={styles.installCommands}>
                {installOptions.map((option) => (
                  <CopyCommand command={option.command} label={option.label} key={option.id} />
                ))}
              </div>
              <dl className={styles.requirements}>
                {installDetails.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.installLinks}>
                <a className={styles.textLink} href={cinmuxLinks.source}>
                  Source on GitHub <span aria-hidden="true">↗</span>
                </a>
                <a className={styles.textLink} href={cinmuxLinks.buildFromSource}>
                  Build from source <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <CinmuxIcon3D />
          </div>
        </section>

        <section className={styles.questionsSection} aria-labelledby="questions-title">
          <div className={`${styles.inner} ${styles.questionsGrid}`}>
            <h2 id="questions-title">Good to know.</h2>
            <div className={styles.questions}>
              {cinmuxQuestions.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
