import { useState, type FocusEvent } from 'react'
import top640Avif from '../assets/product/generated/top-640.avif'
import top1024Avif from '../assets/product/generated/top-1024.avif'
import top1536Avif from '../assets/product/generated/top-1536.avif'
import top640Webp from '../assets/product/generated/top-640.webp'
import top1024Webp from '../assets/product/generated/top-1024.webp'
import top1536Webp from '../assets/product/generated/top-1536.webp'
import { controls, headings, productCopy } from '../content/openMicro'
import styles from './ControlsShowcase.module.css'

const frameSizeMm = 130
const deviceSizeMm = 96
const deviceScale = deviceSizeMm / frameSizeMm
const deviceInset = (1 - deviceScale) / 2


export function ControlsShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeControl = controls.find((control) => control.id === activeId)

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setActiveId(null)
  }

  return (
    <section className="section" id="controls" aria-labelledby="controls-title">
      <div className={`sectionInner ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{productCopy.controlsEyebrow}</p>
          <h2 id="controls-title">{headings.controls}</h2>
          <p className="sectionLead">{productCopy.controlsLead}</p>
          <div className={styles.readout} aria-live="polite" aria-atomic="true">
            {activeControl ? (
              <>
                <strong>{activeControl.name}</strong>
                <p>{activeControl.role}</p>
              </>
            ) : (
              <>
                <strong>{productCopy.controlMapTitle}</strong>
                <p>{productCopy.controlMapInstructions}</p>
              </>
            )}
          </div>
        </div>

        <div className={styles.mapWrap} onBlurCapture={handleBlur}>
          <div className={styles.orientation} aria-hidden="true">{productCopy.controlMapRear}</div>
          <div className={styles.deviceMap} aria-label={productCopy.controlMapLabel}>
            <picture className={styles.topPicture} aria-hidden="true">
              <source
                type="image/avif"
                srcSet={`${top640Avif} 640w, ${top1024Avif} 1024w, ${top1536Avif} 1536w`}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
              <source
                type="image/webp"
                srcSet={`${top640Webp} 640w, ${top1024Webp} 1024w, ${top1536Webp} 1536w`}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
              <img src={top1024Webp} width="1536" height="1536" loading="lazy" decoding="async" alt="" />
            </picture>
            {controls.map((control) => (
              <button
                type="button"
                key={control.id}
                className={`${styles.control} ${styles[control.kind]} ${activeId === control.id ? styles.active : ''}`}
                style={{
                  left: `${(deviceInset + ((control.x - control.width / 2) / deviceSizeMm) * deviceScale) * 100}%`,
                  top: `${(deviceInset + ((control.y - control.height / 2) / deviceSizeMm) * deviceScale) * 100}%`,
                  width: `${(control.width / deviceSizeMm) * deviceScale * 100}%`,
                  height: `${(control.height / deviceSizeMm) * deviceScale * 100}%`,
                }}
                aria-label={`${control.name}: ${control.role}`}
                aria-pressed={activeId === control.id}
                onPointerEnter={() => setActiveId(control.id)}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') setActiveId(null)
                }}
                onFocus={() => setActiveId(control.id)}
                onClick={() => setActiveId(control.id)}
              >
              </button>
            ))}
          </div>
          <p className={styles.mapCaption}>{productCopy.controlMapFront}</p>
        </div>
      </div>
    </section>
  )
}
