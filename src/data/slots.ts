import type { TimeSlot } from '../types'

/**
 * DEMO AVAILABILITY — illustrative slots only, not real-time availability.
 * These are grouped by time of day and shown until the clinic scheduling
 * system is connected.
 */
export const DEMO_SLOTS: TimeSlot[] = [
  { label: '10:00 AM', period: 'Morning' },
  { label: '11:30 AM', period: 'Morning' },
  { label: '2:00 PM', period: 'Afternoon' },
  { label: '4:30 PM', period: 'Afternoon' },
  { label: '6:00 PM', period: 'Evening' },
]

export const SLOT_PERIODS: TimeSlot['period'][] = ['Morning', 'Afternoon', 'Evening']
