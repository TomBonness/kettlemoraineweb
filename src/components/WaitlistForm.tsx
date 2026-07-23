import { useState, type ChangeEvent, type FormEvent } from 'react'
import { headings, privacyStatement, productCopy, waitlistCopy } from '../content/openMicro'
import { joinWaitlist } from '../lib/waitlist'
import styles from './WaitlistForm.module.css'

type FormStatus = 'idle' | 'pending' | 'success' | 'error'


export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.currentTarget.value)
    setIsValid(event.currentTarget.validity.valid && event.currentTarget.value.length > 0)
    if (status === 'error') setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement
    if (!emailInput.validity.valid) return

    if (website) {
      setStatus('success')
      return
    }

    setStatus('pending')
    try {
      const result = await joinWaitlist(email)
      setStatus(result === 'accepted' ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const statusMessage =
    status === 'pending'
      ? waitlistCopy.pending
      : status === 'success'
        ? waitlistCopy.success
        : status === 'error'
          ? waitlistCopy.error
          : ''

  return (
    <section className={`section ${styles.section}`} id="waitlist" aria-labelledby="waitlist-title">
      <div className={`sectionInner ${styles.layout}`}>
        <div>
          <p className="eyebrow eyebrowDark">{productCopy.waitlistEyebrow}</p>
          <h2 id="waitlist-title">{headings.waitlist}</h2>
          <p className="sectionLead sectionLeadDark">{productCopy.waitlistLead}</p>
        </div>

        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit} noValidate={false}>
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">{waitlistCopy.honeypotLabel}</label>
              <input
                id="website"
                name="website"
                type="text"
                value={website}
                onChange={(event) => setWebsite(event.currentTarget.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            <label htmlFor="email">{waitlistCopy.emailLabel}</label>
            <div className={styles.fields}>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={handleEmailChange}
                placeholder={waitlistCopy.placeholder}
                autoComplete="email"
                disabled={status === 'pending' || status === 'success'}
              />
              <button
                type="submit"
                disabled={!isValid || status === 'pending' || status === 'success'}
              >
                {status === 'pending' ? waitlistCopy.pending : waitlistCopy.submit}
              </button>
            </div>
          </form>

          <p className={styles.status} aria-live="polite" aria-atomic="true">
            {statusMessage}
          </p>
          <p className={styles.privacy}>{privacyStatement}</p>
        </div>
      </div>
    </section>
  )
}
