import { beforeEach, describe, expect, it, vi } from 'vitest'

const createMock = vi.hoisted(() => vi.fn())

vi.mock('./amplify', () => ({
  client: {
    models: {
      WaitlistEntry: {
        create: createMock,
      },
    },
  },
}))

import { joinWaitlist, normalizeEmail } from './waitlist'

describe('normalizeEmail', () => {
  it('normalizes mixed case and surrounding whitespace', () => {
    expect(normalizeEmail('  Preview+Case@Example.COM \n')).toBe('preview+case@example.com')
  })
})

describe('joinWaitlist', () => {
  beforeEach(() => {
    createMock.mockReset()
  })

  it('submits the exact normalized create payload with API-key auth', async () => {
    createMock.mockResolvedValue({ data: { id: 'entry-1' }, errors: undefined })

    await expect(joinWaitlist(' Preview+Case@Example.com ')).resolves.toBe('accepted')
    expect(createMock).toHaveBeenCalledOnce()
    expect(createMock).toHaveBeenCalledWith(
      {
        email: 'preview+case@example.com',
        source: 'open-micro-product',
        consentVersion: 'waitlist-v1',
      },
      { authMode: 'apiKey' },
    )
  })

  it('maps GraphQL errors to retry even when data is present', async () => {
    createMock.mockResolvedValue({ data: { id: 'entry-1' }, errors: [{ message: 'failed' }] })

    await expect(joinWaitlist('person@example.com')).resolves.toBe('retry')
  })

  it('maps missing data and thrown request errors to retry', async () => {
    createMock.mockResolvedValueOnce({ data: null, errors: undefined })
    await expect(joinWaitlist('person@example.com')).resolves.toBe('retry')

    createMock.mockRejectedValueOnce(new Error('network unavailable'))
    await expect(joinWaitlist('person@example.com')).resolves.toBe('retry')
  })
})
