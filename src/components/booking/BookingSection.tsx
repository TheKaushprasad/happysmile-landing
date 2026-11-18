import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  Navigation,
  Phone,
  PartyPopper,
  Home,
  Stethoscope,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import StepIndicator from './StepIndicator'
import Calendar, { formatDisplayDate } from './Calendar'
import { TREATMENTS, treatmentById } from '../../data/treatments'
import { CITIES, clinicsByCity, clinicById, directionsUrl } from '../../data/clinics'
import { DEMO_SLOTS, SLOT_PERIODS } from '../../data/slots'
import { useBooking } from '../../context/BookingContext'
import { track } from '../../lib/analytics'
import { BUSINESS, LANGUAGES, whatsappLink } from '../../lib/config'
import type { ConfirmedBooking, ContactDetails } from '../../types'

const STEPS = ['Treatment', 'Clinic', 'Date & Time', 'Details', 'Confirm']

type Errors = Partial<Record<keyof ContactDetails, string>>

function validateContact(c: ContactDetails): Errors {
  const errors: Errors = {}
  if (!c.fullName.trim()) errors.fullName = 'Please enter your full name.'
  else if (c.fullName.trim().length < 2) errors.fullName = 'Name looks too short.'

  const mobile = c.mobile.replace(/[\s-]/g, '')
  if (!mobile) errors.mobile = 'Please enter your mobile number.'
  else if (!/^(\+?91)?[6-9]\d{9}$/.test(mobile))
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.'

  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()))
    errors.email = 'Enter a valid email address.'

  if (!c.consent)
    errors.consent = 'Please agree to be contacted so we can confirm your appointment.'

  return errors
}

function languageLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? 'your language'
}

export default function BookingSection() {
  const {
    draft,
    bookingRef,
    setTreatment,
    setCity,
    setClinic,
    setDate,
    setSlot,
    setContact,
    confirmBooking,
    resetBooking,
    scrollToBooking,
  } = useBooking()

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [formStarted, setFormStarted] = useState(false)
  const [result, setResult] = useState<ConfirmedBooking | null>(null)

  const treatment = treatmentById(draft.treatmentId)
  const clinic = clinicById(draft.clinicId)
  const cityClinics = useMemo(() => clinicsByCity(draft.city), [draft.city])

  // When a card elsewhere preselects a treatment/clinic, jump the stepper
  // forward so the user lands on the right step with their choice intact.
  useEffect(() => {
    if (result) return
    if (draft.clinicId && step < 1) setStep(1)
    else if (draft.treatmentId && step < 0) setStep(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.treatmentId, draft.clinicId])

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(draft.treatmentId)
      case 1:
        return Boolean(draft.clinicId)
      case 2:
        return Boolean(draft.date && draft.slot)
      default:
        return true
    }
  }, [step, draft])

  function goNext() {
    if (step === 3) {
      handleSubmit()
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    scrollToBooking()
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
    scrollToBooking()
  }

  function handleContactChange(patch: Partial<ContactDetails>) {
    if (!formStarted) {
      setFormStarted(true)
      track('booking_form_started')
    }
    setContact({ ...draft.contact, ...patch })
  }

  function handleSubmit() {
    track('booking_form_submitted')
    const v = validateContact(draft.contact)
    setErrors(v)
    if (Object.keys(v).length > 0) {
      track('booking_failed', { reason: 'validation', fields: Object.keys(v) })
      return
    }
    const confirmed = confirmBooking()
    setResult(confirmed)
    setStep(4)
    scrollToBooking()
  }

  function handleReset() {
    resetBooking()
    setResult(null)
    setErrors({})
    setFormStarted(false)
    setStep(0)
    scrollToBooking()
  }

  return (
    <section id="booking" className="bg-canvas py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Quick Appointment Booking"
          title="Book Your Dental Appointment in Minutes."
          subtitle="Choose your treatment, select your preferred clinic and find a convenient appointment slot."
        />

        {/* Scroll target is the stepper/panel area (not the tall heading), so
            each step lands with its fields visible under the sticky navbar. */}
        <div ref={bookingRef} className="mx-auto mt-12 max-w-5xl scroll-mt-24">
          {!result && (
            <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-6">
              <StepIndicator steps={STEPS} current={step} />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main step panel */}
            <div className="card min-h-[420px] p-6 sm:p-8">
              {step === 0 && <StepTreatment selectedId={draft.treatmentId} onSelect={setTreatment} />}
              {step === 1 && (
                <StepClinic
                  city={draft.city}
                  clinicId={draft.clinicId}
                  cityClinics={cityClinics}
                  onCity={setCity}
                  onClinic={setClinic}
                />
              )}
              {step === 2 && (
                <StepDateTime
                  date={draft.date}
                  slot={draft.slot}
                  onDate={setDate}
                  onSlot={setSlot}
                />
              )}
              {step === 3 && (
                <StepContact
                  contact={draft.contact}
                  errors={errors}
                  onChange={handleContactChange}
                />
              )}
              {step === 4 && result && <StepConfirmation result={result} onReset={handleReset} />}

              {step < 4 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 0}
                    className="btn-ghost disabled:invisible"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="btn-primary"
                  >
                    {step === 3 ? 'Continue to Booking' : 'Continue'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Persistent summary rail */}
            {!result && (
              <aside className="card h-fit p-6 lg:sticky lg:top-24">
                <h3 className="font-display text-lg font-semibold text-ink">Booking summary</h3>
                <p className="mt-1 text-sm text-ink-muted">Your details stay saved as you go.</p>
                <dl className="mt-5 space-y-4 text-sm">
                  <SummaryRow
                    icon={<Stethoscope className="h-4 w-4" />}
                    label="Treatment"
                    value={treatment?.name}
                  />
                  <SummaryRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Clinic"
                    value={clinic ? `${clinic.name}, ${clinic.city}` : undefined}
                  />
                  <SummaryRow
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Date"
                    value={formatDisplayDate(draft.date) || undefined}
                  />
                  <SummaryRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Time"
                    value={draft.slot ?? undefined}
                  />
                  {draft.contact.fullName && (
                    <SummaryRow
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      label="Name"
                      value={draft.contact.fullName}
                    />
                  )}
                </dl>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-brand-soft p-3 text-xs leading-relaxed text-brand-dark">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Slots shown are <strong>demo availability</strong>. Your request is confirmed by
                    the clinic once they verify the slot.
                  </span>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className={`text-right font-medium ${value ? 'text-ink' : 'text-slate-300'}`}>
        {value ?? '—'}
      </dd>
    </div>
  )
}

/* ----------------------------- Step 1: Treatment ---------------------------- */
function StepTreatment({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <StepTitle n={1} title="Select Your Treatment" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {TREATMENTS.map((t) => {
          const Icon = t.icon
          const active = selectedId === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              aria-pressed={active}
              className={[
                'flex items-start gap-3 rounded-2xl border p-4 text-left transition',
                active
                  ? 'border-brand bg-brand-soft shadow-card'
                  : 'border-slate-200 bg-white hover:border-brand/40 hover:bg-brand-soft/40',
              ].join(' ')}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active ? 'bg-brand text-white' : 'bg-brand-light text-brand'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{t.name}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{t.short}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------ Step 2: Clinic ------------------------------ */
function StepClinic({
  city,
  clinicId,
  cityClinics,
  onCity,
  onClinic,
}: {
  city: string | null
  clinicId: string | null
  cityClinics: ReturnType<typeof clinicsByCity>
  onCity: (c: string | null) => void
  onClinic: (id: string) => void
}) {
  const selected = clinicById(clinicId)
  return (
    <div>
      <StepTitle n={2} title="Select Your Clinic" />
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        <Info className="h-3.5 w-3.5" /> Demonstration clinic data
      </span>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">City</span>
          <select
            value={city ?? ''}
            onChange={(e) => onCity(e.target.value || null)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
          >
            <option value="">Choose a city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Clinic</span>
          <select
            value={clinicId ?? ''}
            onChange={(e) => e.target.value && onClinic(e.target.value)}
            disabled={!city}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">{city ? 'Choose a clinic' : 'Select a city first'}</option>
            {cityClinics.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-soft/50 p-5">
          <p className="font-semibold text-ink">{selected.name}</p>
          <p className="mt-1 flex items-start gap-2 text-sm text-ink-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {selected.address}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
            <Phone className="h-4 w-4 shrink-0 text-brand" />
            {selected.phone}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
            <Clock className="h-4 w-4 shrink-0 text-brand" />
            {selected.hours}
          </p>
          <a
            href={directionsUrl(selected)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <Navigation className="h-4 w-4" /> Get Directions
          </a>
        </div>
      )}
    </div>
  )
}

/* ----------------------------- Step 3: Date/Time ---------------------------- */
function StepDateTime({
  date,
  slot,
  onDate,
  onSlot,
}: {
  date: string | null
  slot: string | null
  onDate: (iso: string) => void
  onSlot: (label: string) => void
}) {
  return (
    <div>
      <StepTitle n={3} title="Choose Appointment Date & Time" />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Calendar selected={date} onSelect={onDate} />

        <div>
          <p className="text-sm font-medium text-ink">
            {date ? `Available slots for ${formatDisplayDate(date)}` : 'Select a date to see slots'}
          </p>
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-amber-700">
            <Info className="h-3.5 w-3.5" /> Demo availability — not live slots
          </span>

          <div className="mt-4 space-y-4">
            {SLOT_PERIODS.map((period) => {
              const slots = DEMO_SLOTS.filter((s) => s.period === period)
              if (slots.length === 0) return null
              return (
                <div key={period}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {period}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => {
                      const active = slot === s.label
                      return (
                        <button
                          key={s.label}
                          type="button"
                          disabled={!date}
                          onClick={() => onSlot(s.label)}
                          aria-pressed={active}
                          className={[
                            'rounded-xl border px-4 py-2 text-sm font-medium transition',
                            active
                              ? 'border-brand bg-brand text-white shadow-card'
                              : 'border-slate-200 bg-white text-ink hover:border-brand/40 hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40',
                          ].join(' ')}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Step 4: Contact ----------------------------- */
function StepContact({
  contact,
  errors,
  onChange,
}: {
  contact: ContactDetails
  errors: Errors
  onChange: (patch: Partial<ContactDetails>) => void
}) {
  return (
    <div>
      <StepTitle n={4} title="Enter Contact Details" />
      <p className="mt-2 text-sm text-ink-muted">
        We only ask for what we need to confirm your appointment.
      </p>
      <form className="mt-6 space-y-5" noValidate onSubmit={(e) => e.preventDefault()}>
        <Field
          label="Full Name"
          required
          error={errors.fullName}
          value={contact.fullName}
          onChange={(v) => onChange({ fullName: v })}
          placeholder="e.g. Priya Sharma"
          autoComplete="name"
        />
        <Field
          label="Mobile Number"
          required
          error={errors.mobile}
          value={contact.mobile}
          onChange={(v) => onChange({ mobile: v })}
          placeholder="e.g. 98765 43210"
          type="tel"
          autoComplete="tel"
        />
        <Field
          label="Email"
          optional
          error={errors.email}
          value={contact.email}
          onChange={(v) => onChange({ email: v })}
          placeholder="e.g. priya@email.com"
          type="email"
          autoComplete="email"
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Preferred language for your call
          </span>
          <select
            value={contact.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={contact.consent}
              onChange={(e) => onChange({ consent: e.target.checked })}
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <span className="text-sm leading-relaxed text-ink-muted">
              I agree to be contacted by {BUSINESS.brand} by phone, WhatsApp or automated voice
              assistant about my appointment. <span className="text-brand">*</span>
            </span>
          </label>
          {errors.consent && (
            <span className="mt-1.5 block pl-8 text-sm text-red-500">{errors.consent}</span>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  optional,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={[
          'w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:ring-2',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-brand focus:ring-brand-light',
        ].join(' ')}
      />
      {error && <span className="mt-1.5 block text-sm text-red-500">{error}</span>}
    </label>
  )
}

/* --------------------------- Step 5: Confirmation --------------------------- */
function StepConfirmation({
  result,
  onReset,
}: {
  result: ConfirmedBooking
  onReset: () => void
}) {
  const treatment = treatmentById(result.treatmentId)
  const clinic = clinicById(result.clinicId)

  const calendarHref = useMemo(() => buildCalendarLink(result), [result])
  const waMessage = `Hi ${BUSINESS.brand}, I just requested an appointment (Ref ${result.reference}) for ${treatment?.name} at ${clinic?.name} on ${formatDisplayDate(
    result.date,
  )} at ${result.slot}. Please confirm.`

  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
        <PartyPopper className="h-8 w-8 text-brand" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold text-ink">
        Your appointment request has been received!
      </h3>
      <p className="mx-auto mt-2 max-w-md text-ink-muted">
        This is a booking <strong>request</strong>. {clinic?.name ?? 'The clinic'} will verify the
        slot and <strong>confirm your appointment shortly</strong>.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-brand/20 bg-brand-soft/40 p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Booking reference</span>
          <span className="rounded-lg bg-white px-3 py-1 font-mono text-sm font-semibold text-brand">
            {result.reference}
          </span>
        </div>
        <dl className="mt-4 space-y-2.5 text-sm">
          <ConfirmRow label="Patient" value={result.contact.fullName} />
          <ConfirmRow label="Treatment" value={treatment?.name} />
          <ConfirmRow label="Clinic" value={clinic ? `${clinic.name}, ${clinic.city}` : undefined} />
          <ConfirmRow label="Date" value={formatDisplayDate(result.date)} />
          <ConfirmRow label="Time" value={result.slot ?? undefined} />
        </dl>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <Info className="h-3.5 w-3.5" /> Pending clinic confirmation
        </p>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          Our assistant may call you on {result.contact.mobile} in{' '}
          {languageLabel(result.contact.language)} to confirm this slot.
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={calendarHref} download="happysmile-appointment.ics" className="btn-primary">
          <CalendarPlus className="h-4 w-4" /> Add to Calendar
        </a>
        <a
          href={clinic ? `tel:${clinic.phone.replace(/\s/g, '')}` : whatsappLink(waMessage)}
          className="btn-secondary"
        >
          <Phone className="h-4 w-4" /> Contact Clinic
        </a>
      </div>
      <button type="button" onClick={onReset} className="btn-ghost mx-auto mt-4">
        <Home className="h-4 w-4" /> Book another appointment
      </button>
    </div>
  )
}

function ConfirmRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value ?? '—'}</dd>
    </div>
  )
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand">
        {n}
      </span>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
    </div>
  )
}

/** Build a downloadable .ics file so "Add to Calendar" works offline in the demo. */
function buildCalendarLink(b: ConfirmedBooking): string {
  const treatment = treatmentById(b.treatmentId)
  const clinic = clinicById(b.clinicId)
  const start = icsDateTime(b.date, b.slot)
  const end = icsDateTime(b.date, b.slot, 45)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HappySmile//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${b.reference}@happysmile`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${BUSINESS.brand} — ${treatment?.name ?? 'Dental appointment'} (request)`,
    `LOCATION:${clinic ? `${clinic.name}, ${clinic.address}` : ''}`,
    `DESCRIPTION:Booking request ${b.reference}. Pending clinic confirmation.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`
}

function icsDateTime(iso: string | null, slot: string | null, addMinutes = 0): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  let hour = 10
  let minute = 0
  if (slot) {
    const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (match) {
      hour = Number(match[1]) % 12
      minute = Number(match[2])
      if (/PM/i.test(match[3])) hour += 12
    }
  }
  const date = new Date(y, m - 1, d, hour, minute + addMinutes)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}00`
}
