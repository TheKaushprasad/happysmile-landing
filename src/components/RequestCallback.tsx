import { useState } from 'react'
import { PhoneCall, Clock3, Languages, CheckCircle2, Loader2 } from 'lucide-react'
import { LANGUAGES } from '../lib/config'
import { buildCallbackLead, submitLead } from '../lib/leads'
import { track } from '../lib/analytics'
import { useBooking } from '../context/BookingContext'

type Errors = { fullName?: string; mobile?: string; consent?: string }

export default function RequestCallback() {
  const { draft } = useBooking()
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [language, setLanguage] = useState('en')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  function validate(): Errors {
    const e: Errors = {}
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = 'Please enter your name.'
    const m = mobile.replace(/[\s-]/g, '')
    if (!/^(\+?91)?[6-9]\d{9}$/.test(m)) e.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (!consent) e.consent = 'Please agree to be contacted.'
    return e
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setStatus('sending')
    track('callback_requested', { language })
    const lead = buildCallbackLead(
      { fullName, mobile, language, consent },
      { treatmentId: draft.treatmentId, clinicId: draft.clinicId },
    )
    await submitLead(lead)
    setStatus('done')
  }

  return (
    <section id="callback" className="bg-white py-16 sm:py-20">
      <div className="container-px">
        <div className="mx-auto grid max-w-5xl items-center gap-8 rounded-3xl border border-brand/15 bg-brand-soft/40 p-6 sm:p-10 lg:grid-cols-2">
          {/* Left — the Sarvam speed + language pitch */}
          <div>
            <span className="eyebrow">
              <PhoneCall className="h-4 w-4" /> Prefer we call you?
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Not ready to pick a slot? We'll call you back.
            </h2>
            <p className="mt-3 text-ink-muted">
              Leave your name and number and our assistant rings you back to help you book —
              usually within minutes, not hours.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 text-ink">
                <Clock3 className="h-4 w-4 text-brand" /> Callback in minutes, no 4–6 hour wait
              </li>
              <li className="flex items-center gap-2.5 text-ink">
                <Languages className="h-4 w-4 text-brand" /> In English, Hindi, Tamil, Telugu and more
              </li>
            </ul>
          </div>

          {/* Right — compact capture form / acknowledgement */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            {status === 'done' ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
                  <CheckCircle2 className="h-7 w-7 text-brand" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  We'll call you shortly
                </h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Our assistant will ring {fullName.trim().split(' ')[0] || 'you'} on{' '}
                  {mobile} in {LANGUAGES.find((l) => l.code === language)?.label}. This is a
                  callback request — no appointment is booked yet.
                </p>
              </div>
            ) : (
              <form className="space-y-4" noValidate onSubmit={onSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    autoComplete="name"
                    className={inputCls(Boolean(errors.fullName))}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Mobile Number</label>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    type="tel"
                    autoComplete="tel"
                    className={inputCls(Boolean(errors.mobile))}
                  />
                  {errors.mobile && <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Preferred language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={inputCls(false)}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm leading-relaxed text-ink-muted">
                      I agree to be contacted by phone, WhatsApp or automated voice assistant.{' '}
                      <span className="text-brand">*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 pl-8 text-sm text-red-500">{errors.consent}</p>
                  )}
                </div>

                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Requesting…
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-4 w-4" /> Request a Callback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function inputCls(hasError: boolean): string {
  return [
    'w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:ring-2',
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-brand focus:ring-brand-light',
  ].join(' ')
}
