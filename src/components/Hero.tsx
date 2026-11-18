import { CalendarCheck, MapPin, Sparkles, ArrowRight, Clock, ShieldCheck } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import { BUSINESS } from '../lib/config'

export default function Hero() {
  const { scrollToBooking } = useBooking()

  return (
    <section id="home" className="relative overflow-hidden pt-10 sm:pt-16">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-light/60 blur-3xl" />
        <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-brand-soft blur-3xl" />
      </div>

      <div className="container-px grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-8 lg:pb-24">
        {/* Left */}
        <div className="animate-fade-up">
          <span className="eyebrow">
            <ShieldCheck className="h-4 w-4" /> {BUSINESS.clinicCount} clinics across India
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Your Smile Deserves <span className="text-brand">the Best Care.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Discover expert dental care at HappySmile. Explore treatments, find your nearest clinic
            and book your appointment at a time that works for you.
          </p>

          <ul className="mt-6 space-y-2.5">
            {[
              '12 convenient clinic locations',
              'Personalised dental consultations',
              'Easy online appointment booking',
            ].map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-light">
                  <CalendarCheck className="h-3 w-3 text-brand" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={scrollToBooking} className="btn-primary text-base">
              Book Your Appointment <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#treatments" className="btn-secondary text-base">
              Explore Treatments
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-dark">
            <Clock className="h-4 w-4" /> Skip the waiting. Book your preferred appointment online.
          </p>
        </div>

        {/* Right */}
        <div className="relative animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl shadow-float">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80"
              alt="A smiling patient after dental treatment at HappySmile"
              className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </div>

          {/* Booking card overlay */}
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/60 bg-white/95 p-5 shadow-float backdrop-blur sm:left-6 sm:right-6 lg:-left-8 lg:right-auto lg:w-72">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand" />
              <p className="font-display font-semibold text-ink">Ready for your next smile?</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Select a treatment
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand" /> Find a clinic
              </li>
              <li className="flex items-center gap-2">
                <CalendarCheck className="h-3.5 w-3.5 text-brand" /> Choose your appointment
              </li>
            </ul>
            <button
              type="button"
              onClick={scrollToBooking}
              className="btn-primary mt-4 w-full text-sm"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
