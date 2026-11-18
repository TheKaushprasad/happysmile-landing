import {
  AlignHorizontalDistributeCenter,
  Sparkles,
  Bone,
  Activity,
  Smile,
  Stethoscope,
} from 'lucide-react'
import type { Treatment } from '../types'

export const TREATMENTS: Treatment[] = [
  {
    id: 'braces-aligners',
    name: 'Braces & Aligners',
    short: 'Straighten your teeth with personalised alignment solutions.',
    description:
      'Straighten your teeth with personalised alignment solutions — from modern clear aligners to traditional braces.',
    icon: AlignHorizontalDistributeCenter,
    image:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Consultation-based plan',
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    short: 'Explore professional options to brighten your smile.',
    description:
      'Explore professional, dentist-supervised options to brighten your smile safely and evenly.',
    icon: Sparkles,
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Single or multi-session',
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    short: 'Discover options for replacing missing teeth.',
    description:
      'Discover long-lasting options for replacing missing teeth and restoring natural function.',
    icon: Bone,
    image:
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Assessment required',
  },
  {
    id: 'root-canal',
    name: 'Root Canal',
    short: 'Get professional care to treat infected or damaged teeth.',
    description:
      'Get professional, comfortable care to treat infected or damaged teeth and relieve pain.',
    icon: Activity,
    image:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Per-tooth treatment',
  },
  {
    id: 'smile-makeover',
    name: 'Smile Makeover',
    short: 'Explore personalised cosmetic dental treatments.',
    description:
      'Explore personalised cosmetic dental treatments designed around the smile you want.',
    icon: Smile,
    image:
      'https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Custom cosmetic plan',
  },
  {
    id: 'general-consultation',
    name: 'General Dentistry',
    short: 'Maintain healthy teeth and gums with routine dental care.',
    description:
      'Maintain healthy teeth and gums with routine check-ups, cleaning and preventive care.',
    icon: Stethoscope,
    image:
      'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=800&q=80',
    priceNote: 'Routine check-up',
  },
]

export function treatmentById(id: string | null): Treatment | undefined {
  return TREATMENTS.find((t) => t.id === id)
}
