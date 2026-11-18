import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import Logo from './ui/Logo'
import { TREATMENTS } from '../data/treatments'
import { CITIES } from '../data/clinics'
import { BUSINESS } from '../lib/config'
import { useBooking } from '../context/BookingContext'

export default function Footer() {
  const { startWithTreatment } = useBooking()

  return (
    <footer className="border-t border-slate-800 bg-ink text-slate-300">
      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_span]:text-white">
              <Logo onLight />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Expert dental care across {BUSINESS.clinicCount} clinics in India. Explore treatments,
              find your nearest clinic and book online — no waiting for callbacks.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Treatments
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TREATMENTS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => startWithTreatment(t.id)}
                    className="text-slate-400 transition hover:text-brand-light"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Clinic Locations
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CITIES.map((c) => (
                <li key={c}>
                  <a href="#clinics" className="flex items-center gap-2 text-slate-400 transition hover:text-brand-light">
                    <MapPin className="h-3.5 w-3.5" /> {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`tel:${BUSINESS.phoneDial}`} className="flex items-center gap-2 text-slate-400 transition hover:text-brand-light">
                  <Phone className="h-3.5 w-3.5" /> {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 text-slate-400 transition hover:text-brand-light">
                  <Mail className="h-3.5 w-3.5" /> {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {BUSINESS.brand}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-brand-light">Privacy Policy</a>
            <a href="#" className="transition hover:text-brand-light">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
