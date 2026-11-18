import { useEffect } from 'react'
import { BookingProvider } from './context/BookingContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BookingSection from './components/booking/BookingSection'
import Treatments from './components/Treatments'
import WhyUs from './components/WhyUs'
import Clinics from './components/Clinics'
import HowItWorks from './components/HowItWorks'
import RequestCallback from './components/RequestCallback'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'
import { track } from './lib/analytics'

export default function App() {
  useEffect(() => {
    track('landing_page_viewed', { path: '/' })
  }, [])

  return (
    <BookingProvider>
      <div className="min-h-screen bg-canvas pb-20 sm:pb-0">
        <Navbar />
        <main>
          <Hero />
          <BookingSection />
          <Treatments />
          <WhyUs />
          <Clinics />
          <HowItWorks />
          <RequestCallback />
          <Testimonials />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </BookingProvider>
  )
}
