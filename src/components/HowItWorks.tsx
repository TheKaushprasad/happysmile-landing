import { Stethoscope, MapPin, CalendarClock, CheckCircle2 } from 'lucide-react'
import { useBooking } from '../context/BookingContext'

const STEPS = [
  { icon: Stethoscope, title: 'Choose Your Treatment', text: 'Pick from braces, whitening, implants and more.' },
  { icon: MapPin, title: 'Select Your Clinic', text: 'Find a HappySmile clinic near you.' },
  { icon: CalendarClock, title: 'Pick a Convenient Time', text: 'Choose a date and slot that suits you.' },
  { icon: CheckCircle2, title: 'Confirm Your Appointment', text: 'Submit and get an instant acknowledgement.' },
]

export default function HowItWorks() {
  const { scrollToBooking } = useBooking()

  return (
    <section className="bg-brand py-20 text-white sm:py-24">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your Journey to a Healthier Smile Starts Here.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="relative rounded-2xl bg-white/10 p-6 backdrop-blur">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="absolute right-5 top-5 font-display text-3xl font-bold text-white/25">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{s.text}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-white/90">No waiting for callbacks. Take control of your appointment online.</p>
          <button
            type="button"
            onClick={scrollToBooking}
            className="btn mt-5 bg-white px-6 py-3 text-brand hover:bg-brand-soft active:scale-[0.98]"
          >
            Start Booking Now
          </button>
        </div>
      </div>
    </section>
  )
}
