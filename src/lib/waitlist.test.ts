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


  it('maps GraphQL errors to retry even when data is present', async () => {
    createMock.mockResolvedValue({ data: { id: 'entry-1' }, errors: [{ message: 'failed' }] })

    await expect(joinWaitlist('person@example.com', 'open-micro-product')).resolves.toBe('retry')
  })

  it('maps missing data and thrown request errors to retry', async () => {
    createMock.mockResolvedValueOnce({ data: null, errors: undefined })
    await expect(joinWaitlist('person@example.com', 'open-micro-product')).resolves.toBe('retry')

    createMock.mockRejectedValueOnce(new Error('network unavailable'))
    await expect(joinWaitlist('person@example.com', 'open-micro-product')).resolves.toBe('retry')
  })
})
