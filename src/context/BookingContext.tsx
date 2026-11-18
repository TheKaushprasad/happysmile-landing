import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import type { BookingDraft, ConfirmedBooking, ContactDetails } from '../types'
import { clinicById } from '../data/clinics'
import { track } from '../lib/analytics'
import { buildBookingLead, submitLead } from '../lib/leads'

const EMPTY_CONTACT: ContactDetails = {
  fullName: '',
  mobile: '',
  email: '',
  language: 'en',
  consent: false,
}

const INITIAL_DRAFT: BookingDraft = {
  treatmentId: null,
  city: null,
  clinicId: null,
  date: null,
  slot: null,
  contact: EMPTY_CONTACT,
}

interface BookingContextValue {
  draft: BookingDraft
  confirmed: ConfirmedBooking | null
  setTreatment: (id: string) => void
  setCity: (city: string | null) => void
  setClinic: (id: string) => void
  setDate: (iso: string) => void
  setSlot: (label: string) => void
  setContact: (contact: ContactDetails) => void
  confirmBooking: () => ConfirmedBooking
  resetBooking: () => void
  /** Ref attached to the booking section so any CTA can scroll to it. */
  bookingRef: RefObject<HTMLDivElement>
  scrollToBooking: () => void
  /** Preselect a treatment, then jump to the booking flow. */
  startWithTreatment: (id: string) => void
  /** Preselect a clinic (and its city), then jump to the booking flow. */
  startWithClinic: (id: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

function generateReference(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `HS-${n}`
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(INITIAL_DRAFT)
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const scrollToBooking = useCallback(() => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const setTreatment = useCallback((id: string) => {
    setDraft((d) => ({ ...d, treatmentId: id }))
    track('treatment_selected', { treatmentId: id })
  }, [])

  const setCity = useCallback((city: string | null) => {
    // Changing city clears a clinic that no longer belongs to it.
    setDraft((d) => ({ ...d, city, clinicId: null }))
  }, [])

  const setClinic = useCallback((id: string) => {
    const clinic = clinicById(id)
    setDraft((d) => ({ ...d, clinicId: id, city: clinic?.city ?? d.city }))
    track('clinic_selected', { clinicId: id })
  }, [])

  const setDate = useCallback((iso: string) => {
    setDraft((d) => ({ ...d, date: iso }))
    track('appointment_date_selected', { date: iso })
  }, [])

  const setSlot = useCallback((label: string) => {
    setDraft((d) => ({ ...d, slot: label }))
    track('appointment_slot_selected', { slot: label })
  }, [])

  const setContact = useCallback((contact: ContactDetails) => {
    setDraft((d) => ({ ...d, contact }))
  }, [])

  const confirmBooking = useCallback((): ConfirmedBooking => {
    const result: ConfirmedBooking = { ...draft, reference: generateReference() }
    setConfirmed(result)
    track('booking_completed', {
      reference: result.reference,
      treatmentId: result.treatmentId,
      clinicId: result.clinicId,
    })
    // Queue a short confirmation call from the Sarvam agent for this booking.
    void submitLead(buildBookingLead(result))
    return result
  }, [draft])

  const resetBooking = useCallback(() => {
    setDraft(INITIAL_DRAFT)
    setConfirmed(null)
  }, [])

  const startWithTreatment = useCallback(
    (id: string) => {
      setTreatment(id)
      // allow render before scroll
      requestAnimationFrame(scrollToBooking)
    },
    [setTreatment, scrollToBooking],
  )

  const startWithClinic = useCallback(
    (id: string) => {
      setClinic(id)
      requestAnimationFrame(scrollToBooking)
    },
    [setClinic, scrollToBooking],
  )

  const value = useMemo<BookingContextValue>(
    () => ({
      draft,
      confirmed,
      setTreatment,
      setCity,
      setClinic,
      setDate,
      setSlot,
      setContact,
      confirmBooking,
      resetBooking,
      bookingRef,
      scrollToBooking,
      startWithTreatment,
      startWithClinic,
    }),
    [
      draft,
      confirmed,
      setTreatment,
      setCity,
      setClinic,
      setDate,
      setSlot,
      setContact,
      confirmBooking,
      resetBooking,
      scrollToBooking,
      startWithTreatment,
      startWithClinic,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider')
  return ctx
}
