import { speedTechniques } from '../content/inference'
import styles from './InferenceTechniques.module.css'

function TechniqueIcon({ kind }: { kind: (typeof speedTechniques)[number]['icon'] }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" aria-hidden="true">
      {kind === 'draft' ? (
        <>
          <circle cx="12" cy="32" r="4" />
          <path d="M16 32h10l12-17h8M26 32h20M26 32l12 17h8M62 32h8m16 0h8" />
          <rect x="46" y="10" width="16" height="10" rx="2" />
          <rect x="46" y="27" width="16" height="10" rx="2" />
          <rect x="46" y="44" width="16" height="10" rx="2" />
          <rect x="70" y="27" width="16" height="10" rx="2" />
          <path d="m97 32 6 6 12-14" />
        </>
      ) : kind === 'lookup' ? (
        <>
          <rect x="8" y="8" width="42" height="48" rx="4" />
          <path d="M17 19h24M17 28h16M17 47h20" />
          <rect x="14" y="33" width="30" height="8" rx="2" />
          <path d="M55 37h13m-5-5 5 5-5 5" />
          <rect x="73" y="8" width="40" height="48" rx="4" />
          <path d="M82 19h22M82 28h14" />
          <rect x="79" y="33" width="28" height="8" rx="2" />
        </>
      ) : kind === 'kernel' ? (
        <>
          <path d="M4 24h18m-12 8h12M4 40h18" />
          <rect x="38" y="10" width="44" height="44" rx="4" />
          <rect x="50" y="22" width="20" height="20" rx="2" />
          <path d="M48 10V3m12 7V3m12 7V3M48 61v-7m12 7v-7m12 7v-7M38 20h-7m7 12h-7m7 12h-7M82 20h7m-7 12h7m-7 12h7" />
        </>
      ) : (
        <>
          <rect x="8" y="14" width="44" height="36" rx="4" />
          <path d="M16 26h28M16 38h20M60 28h12M60 36h12" />
          <rect x="80" y="14" width="34" height="36" rx="4" />
          <path d="m89 32 5 5 11-12" />
        </>
      )}
    </svg>
  )
}

/** The four techniques behind the speed, each with a line drawing. */
export function InferenceTechniques() {
  return (
    <div className={styles.techniques}>
      {speedTechniques.map((technique) => (
        <article key={technique.icon}>
          <TechniqueIcon kind={technique.icon} />
          <h3>{technique.title}</h3>
          <p>{technique.description}</p>
        </article>
      ))}
    </div>
  )
}
