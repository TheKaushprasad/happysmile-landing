import { Award, Cpu, MapPinned, HeartHandshake } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'

const BENEFITS = [
  {
    icon: Award,
    title: 'Experienced Dental Professionals',
    text: 'Our dentists bring years of clinical experience across general, cosmetic and specialist dentistry.',
  },
  {
    icon: Cpu,
    title: 'Modern Dental Technology',
    text: 'Clinics equipped with up-to-date dental technology for comfortable, precise and efficient care.',
  },
  {
    icon: MapPinned,
    title: '12 Convenient Clinic Locations',
    text: 'Find a HappySmile clinic close to home or work across major cities in India.',
  },
  {
    icon: HeartHandshake,
    title: 'Patient-First Experience',
    text: 'From online booking to your visit, every step is designed around your time and comfort.',
  },
]

export default function WhyUs() {
  return (
    <section id="why" className="bg-white py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why Choose HappySmile?"
          title="Dental Care Designed Around You."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-100 bg-canvas p-6 transition hover:border-brand/30 hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
