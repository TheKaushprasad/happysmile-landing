// Mock scheduling data — mirrors the 12 clinics on the website. Swap for your
// real scheduling system in production.

export interface Clinic {
  id: string
  name: string
  city: string
}

export const CLINICS: Clinic[] = [
  { id: 'mum-bandra', name: 'HappySmile Bandra', city: 'Mumbai' },
  { id: 'mum-andheri', name: 'HappySmile Andheri', city: 'Mumbai' },
  { id: 'del-saket', name: 'HappySmile Saket', city: 'Delhi' },
  { id: 'del-rajouri', name: 'HappySmile Rajouri Garden', city: 'Delhi' },
  { id: 'blr-indiranagar', name: 'HappySmile Indiranagar', city: 'Bengaluru' },
  { id: 'blr-koramangala', name: 'HappySmile Koramangala', city: 'Bengaluru' },
  { id: 'hyd-jubilee', name: 'HappySmile Jubilee Hills', city: 'Hyderabad' },
  { id: 'hyd-gachibowli', name: 'HappySmile Gachibowli', city: 'Hyderabad' },
  { id: 'che-nungambakkam', name: 'HappySmile Nungambakkam', city: 'Chennai' },
  { id: 'che-adyar', name: 'HappySmile Adyar', city: 'Chennai' },
  { id: 'pun-kalyaninagar', name: 'HappySmile Kalyani Nagar', city: 'Pune' },
  { id: 'pun-baner', name: 'HappySmile Baner', city: 'Pune' },
]

/** Standard daily slots (same set the website demonstrates). */
export const DEFAULT_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM']

/**
 * Resolve whatever the caller/agent passes for "clinic" (an id, a name, or
 * "Name, City") to a canonical clinic key. Falls back to the raw input so the
 * demo accepts unknown values gracefully.
 */
export function resolveClinicKey(input: string): string {
  const q = input.trim().toLowerCase()
  const byId = CLINICS.find((c) => c.id.toLowerCase() === q)
  if (byId) return byId.id
  const byName = CLINICS.find(
    (c) => q.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(q.split(',')[0].trim()),
  )
  if (byName) return byName.id
  return input.trim()
}
