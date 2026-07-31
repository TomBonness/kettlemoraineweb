import { useState, type FocusEvent } from 'react'
import drawingTop640Avif from '../assets/product/generated/drawing-top-640.avif'
import drawingTop1024Avif from '../assets/product/generated/drawing-top-1024.avif'
import drawingTop640Webp from '../assets/product/generated/drawing-top-640.webp'
import drawingTop1024Webp from '../assets/product/generated/drawing-top-1024.webp'
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
                srcSet={`${drawingTop640Avif} 640w, ${drawingTop1024Avif} 1024w`}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
              <source
                type="image/webp"
                srcSet={`${drawingTop640Webp} 640w, ${drawingTop1024Webp} 1024w`}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
              <img src={drawingTop1024Webp} width="1024" height="1024" loading="lazy" decoding="async" alt="" />
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
