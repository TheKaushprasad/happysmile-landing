export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: 'How can I book an appointment online?',
    answer:
      'Use the booking section above: choose your treatment, pick a clinic, select a date and time, add your contact details and submit. You receive an instant booking reference on screen.',
  },
  {
    question: 'Can I select my preferred HappySmile clinic?',
    answer:
      'Yes. You can filter by city and choose any of our clinic locations. Selecting a clinic anywhere on the page carries it straight into your booking.',
  },
  {
    question: 'How much does a dental consultation cost?',
    answer:
      'Consultation and treatment costs vary by clinic and by the care you need. Your chosen clinic will share exact pricing when they confirm your appointment.',
  },
  {
    question: 'Can I reschedule my appointment?',
    answer:
      'Yes. Once the clinic confirms your request, you can reschedule by contacting the clinic directly using the number shown on your confirmation.',
  },
  {
    question: 'What happens after I submit my booking?',
    answer:
      'You get an immediate on-screen acknowledgement with a booking reference. Because this is a booking request, the clinic will confirm your final slot shortly — it is not a guaranteed confirmed appointment until the clinic verifies availability.',
  },
  {
    question: 'Are all treatments available at every clinic?',
    answer:
      'Most treatments are offered across our clinics, but some specialised procedures may be available only at select locations. The clinic will confirm availability when they reach out.',
  },
  {
    question: 'Can I contact the clinic directly?',
    answer:
      'Absolutely. Every clinic listing includes a direct phone number, and you can reach us on WhatsApp any time using the chat button.',
  },
]
