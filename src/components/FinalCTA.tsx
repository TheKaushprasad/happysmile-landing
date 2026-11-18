import { ArrowRight, Phone } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import { BUSINESS } from '../lib/config'

export default function FinalCTA() {
  const { scrollToBooking } = useBooking()

  return (
    <section className="py-20 sm:py-24">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-6 py-14 text-center text-white shadow-float sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Don't Wait to Get the Smile You Deserve.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Find your nearest HappySmile clinic and book your dental consultation today.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToBooking}
              className="btn bg-white px-6 py-3 text-brand hover:bg-brand-soft active:scale-[0.98]"
            >
              Book an Appointment <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={`tel:${BUSINESS.phoneDial}`}
              className="btn border border-white/40 px-6 py-3 text-white hover:bg-white/10 active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" /> Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
