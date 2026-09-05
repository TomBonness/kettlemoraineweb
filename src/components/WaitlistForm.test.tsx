import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const joinWaitlistMock = vi.hoisted(() => vi.fn())

vi.mock('../lib/waitlist', () => ({
  joinWaitlist: joinWaitlistMock,
}))

import { WaitlistForm } from './WaitlistForm'
import { openMicroSignup } from '../content/openMicro'

function deferredResult() {
  let resolve!: (value: 'accepted' | 'retry') => void
  const promise = new Promise<'accepted' | 'retry'>((resolver) => {
    resolve = resolver
  })
  return { promise, resolve }
}

describe('WaitlistForm', () => {
  beforeEach(() => {
    joinWaitlistMock.mockReset()
  })

  it('keeps submit disabled until the native email validity is valid', async () => {
    const user = userEvent.setup()
    render(<WaitlistForm signup={openMicroSignup} />)
    const email = screen.getByLabelText('Email address')
    const submit = screen.getByRole('button', { name: 'Notify me' })

    expect(submit).toBeDisabled()
    await user.type(email, 'not-an-email')
    expect(submit).toBeDisabled()
    await user.clear(email)
    await user.type(email, 'person@example.com')
    expect(submit).toBeEnabled()
  })

  it('announces pending and retry states, then restores submit', async () => {
    const user = userEvent.setup()
    const request = deferredResult()
    joinWaitlistMock.mockReturnValueOnce(request.promise)
    const { container } = render(<WaitlistForm signup={openMicroSignup} />)
    const email = screen.getByLabelText('Email address')

    await user.type(email, 'person@example.com')
    await user.click(screen.getByRole('button', { name: 'Notify me' }))

    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(screen.getByRole('button', { name: 'Joining…' })).toBeDisabled()
    expect(liveRegion).toHaveTextContent('Joining…')

    await act(async () => request.resolve('retry'))
    expect(liveRegion).toHaveTextContent("We couldn't save your email. Please try again.")
    expect(screen.getByRole('button', { name: 'Notify me' })).toBeEnabled()
  })

  it('locks the form after an accepted signup to prevent duplicate submissions', async () => {
    const user = userEvent.setup()
    joinWaitlistMock.mockResolvedValue('accepted')
    render(<WaitlistForm signup={openMicroSignup} />)

    const email = screen.getByLabelText('Email address')
    const submit = screen.getByRole('button', { name: 'Notify me' })
    await user.type(email, 'person@example.com')
    await user.click(submit)

    expect(email).toBeDisabled()
    expect(submit).toBeDisabled()
    await user.click(submit)
    expect(joinWaitlistMock).toHaveBeenCalledOnce()
  })

  it('treats a filled honeypot as success without making a request', async () => {
    const user = userEvent.setup()
    const { container } = render(<WaitlistForm signup={openMicroSignup} />)
    const honeypot = container.querySelector<HTMLInputElement>('input[name="website"]')
    if (!honeypot) throw new Error('honeypot missing')

    await user.type(screen.getByLabelText('Email address'), 'person@example.com')
    await user.type(honeypot, 'https://bot.example')
    await user.click(screen.getByRole('button', { name: 'Notify me' }))

    expect(joinWaitlistMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Notify me' })).toBeDisabled()
  })
})
