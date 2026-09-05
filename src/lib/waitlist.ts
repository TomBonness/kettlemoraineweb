import { client } from './amplify'

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export async function joinWaitlist(email: string, source: string): Promise<'accepted' | 'retry'> {
  const normalized = normalizeEmail(email)

  try {
    const { data, errors } = await client.models.WaitlistEntry.create(
      {
        email: normalized,
        source,
        consentVersion: 'waitlist-v1',
      },
      { authMode: 'apiKey' },
    )

    return data && (!errors || errors.length === 0) ? 'accepted' : 'retry'
  } catch {
    return 'retry'
  }
}
