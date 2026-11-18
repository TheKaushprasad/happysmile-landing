import { useEffect, useState } from 'react'
import { CalendarCheck, MessageCircle } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import { whatsappLink } from '../lib/config'

/**
 * Floating helpers:
 *  - WhatsApp contact button (always visible, configurable business number)
 *  - Sticky "Book Appointment" bar on mobile that appears after the hero
 */
export default function FloatingActions() {
  const { scrollToBooking, confirmed } = useBooking()
  const [showBar, setShowBar] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const waMessage = 'Hi HappySmile, I would like to book a dental appointment.'

  return (
    <>
      {/* WhatsApp */}
      <a
        href={whatsappLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition hover:scale-105 sm:bottom-6"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Mobile sticky book bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 p-3 backdrop-blur transition-transform duration-300 sm:hidden ${
          showBar && !confirmed ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button type="button" onClick={scrollToBooking} className="btn-primary w-full">
          <CalendarCheck className="h-5 w-5" /> Book Appointment
        </button>
      </div>
    </>
  )
}
