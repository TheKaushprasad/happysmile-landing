import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import { TESTIMONIALS } from '../data/testimonials'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = TESTIMONIALS.length

  const prev = () => setIndex((i) => (i - 1 + count) % count)
  const next = () => setIndex((i) => (i + 1) % count)

  const active = TESTIMONIALS[index]

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading eyebrow="Patient Testimonials" title="Smiles That Speak for Themselves." />

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="relative rounded-3xl border border-slate-100 bg-canvas p-8 shadow-card sm:p-10">
            <Quote className="h-10 w-10 text-brand-light" />
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < active.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed text-ink sm:text-xl">
              “{active.quote}”
            </blockquote>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">{active.name}</p>
                <p className="text-sm text-ink-muted">
                  {active.treatment} · {active.city}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-muted transition hover:border-brand hover:text-brand"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-muted transition hover:border-brand hover:text-brand"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brand' : 'w-2 bg-slate-300 hover:bg-brand/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
