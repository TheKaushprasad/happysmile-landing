import { useState } from 'react'
import { Clock, MapPin, Navigation, Phone, CalendarPlus } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import { CITIES, CLINICS, clinicsByCity, directionsUrl } from '../data/clinics'
import { useBooking } from '../context/BookingContext'

export default function Clinics() {
  const { startWithClinic } = useBooking()
  const [city, setCity] = useState<string>(CITIES[0])
  const [clinicId, setClinicId] = useState<string>(clinicsByCity(CITIES[0])[0]?.id ?? '')

  const cityClinics = clinicsByCity(city)
  const clinic = CLINICS.find((c) => c.id === clinicId) ?? cityClinics[0]

  function onCityChange(c: string) {
    setCity(c)
    const first = clinicsByCity(c)[0]
    if (first) setClinicId(first.id)
  }

  return (
    <section id="clinics" className="py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Find Your Nearest Clinic"
          title="Quality Dental Care, Closer to You."
          subtitle="Pick your city and clinic — we'll carry it straight into your booking."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Selectors */}
            <div className="card h-fit p-6">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">City</span>
                <select
                  value={city}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4">
                <span className="mb-1.5 block text-sm font-medium text-ink">Clinic</span>
                <div className="space-y-2">
                  {cityClinics.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClinicId(c.id)}
                      className={[
                        'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                        c.id === clinic?.id
                          ? 'border-brand bg-brand-soft text-ink'
                          : 'border-slate-200 bg-white text-ink-muted hover:border-brand/40 hover:bg-brand-soft/40',
                      ].join(' ')}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            {clinic && (
              <div className="card flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{clinic.name}</h3>
                    <p className="mt-1 text-sm font-medium text-brand">{clinic.city}</p>
                  </div>
                  <span className="rounded-xl bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                    Open today
                  </span>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-ink-muted">{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-brand" />
                    <a href={`tel:${clinic.phone.replace(/\s/g, '')}`} className="text-ink-muted hover:text-brand">
                      {clinic.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-ink-muted">{clinic.hours}</span>
                  </div>
                </dl>

                <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => startWithClinic(clinic.id)}
                    className="btn-primary flex-1 text-sm"
                  >
                    <CalendarPlus className="h-4 w-4" /> Book at This Clinic
                  </button>
                  <a
                    href={directionsUrl(clinic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 text-sm"
                  >
                    <Navigation className="h-4 w-4" /> Get Directions
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
