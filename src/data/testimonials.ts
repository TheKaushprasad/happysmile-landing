export interface Testimonial {
  name: string
  city: string
  treatment: string
  rating: number
  quote: string
}

/**
 * SAMPLE TESTIMONIALS — illustrative examples for the prototype, not
 * genuine patient reviews. Replace with verified reviews before launch.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ananya R.',
    city: 'Bengaluru',
    treatment: 'Clear Aligners',
    rating: 5,
    quote:
      'Booking online took two minutes and I picked a slot that fit around work. No waiting for a callback — I just walked in at my chosen time.',
  },
  {
    name: 'Rohan M.',
    city: 'Mumbai',
    treatment: 'Teeth Whitening',
    rating: 5,
    quote:
      'The whole experience felt premium and calm. I could compare treatments first, then book the Bandra clinic right away.',
  },
  {
    name: 'Fatima S.',
    city: 'Hyderabad',
    treatment: 'Dental Implants',
    rating: 5,
    quote:
      'I was nervous about implants, but the consultation was thorough and clear. Choosing my own appointment time made it stress-free.',
  },
  {
    name: 'Karan D.',
    city: 'Delhi',
    treatment: 'Root Canal',
    rating: 4,
    quote:
      'Quick to book, friendly staff, and far less painful than I expected. Being able to pick an evening slot was a big help.',
  },
  {
    name: 'Meera P.',
    city: 'Pune',
    treatment: 'Smile Makeover',
    rating: 5,
    quote:
      'From exploring options to confirming my appointment, everything was online and simple. I love my new smile.',
  },
]
