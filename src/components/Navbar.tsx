import { useEffect, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import Logo from './ui/Logo'
import { BUSINESS } from '../lib/config'
import { useBooking } from '../context/BookingContext'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Why HappySmile?', href: '#why' },
  { label: 'Our Clinics', href: '#clinics' },
  { label: 'FAQs', href: '#faqs' },
]

export default function Navbar() {
  const { scrollToBooking } = useBooking()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function book() {
    setOpen(false)
    scrollToBooking()
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between sm:h-18">
        <Logo />

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${BUSINESS.phoneDial}`}
            className="flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-brand"
          >
            <Phone className="h-4 w-4 text-brand" />
            {BUSINESS.phoneDisplay}
          </a>
          <button type="button" onClick={book} className="btn-primary !py-2.5 !px-5 text-sm">
            Book Appointment
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" onClick={book} className="btn-primary !py-2 !px-4 text-sm">
            Book
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-px flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-ink transition hover:bg-brand-soft hover:text-brand"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${BUSINESS.phoneDial}`}
              className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-semibold text-brand"
            >
              <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
