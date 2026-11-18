import { ArrowRight } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import { TREATMENTS } from '../data/treatments'
import { useBooking } from '../context/BookingContext'

export default function Treatments() {
  const { startWithTreatment } = useBooking()

  return (
    <section id="treatments" className="py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Explore Our Treatments"
          title="Find the Right Treatment for Your Smile."
          subtitle="Explore our most requested treatments and book a consultation with the treatment already selected for you."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t, i) => {
            const Icon = t.icon
            return (
              <article
                key={t.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-brand shadow-card">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{t.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
                    {t.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => startWithTreatment(t.id)}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand transition hover:gap-2.5 hover:text-brand-dark"
                  >
                    Book Consultation <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
