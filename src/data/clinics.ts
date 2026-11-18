import type { Clinic } from '../types'

/**
 * DEMONSTRATION DATA — these 12 clinics are illustrative placeholders.
 * Replace with real HappySmile locations before launch.
 */
export const CLINICS: Clinic[] = [
  {
    id: 'mum-bandra',
    name: 'HappySmile Bandra',
    city: 'Mumbai',
    address: '201, Linking Road, Bandra West, Mumbai 400050',
    phone: '+91 22 4000 1201',
    hours: 'Mon–Sat 9:00 AM – 8:00 PM, Sun 10:00 AM – 2:00 PM',
    mapsQuery: 'Linking Road, Bandra West, Mumbai',
  },
  {
    id: 'mum-andheri',
    name: 'HappySmile Andheri',
    city: 'Mumbai',
    address: '5th Floor, Infinity Mall, Andheri West, Mumbai 400058',
    phone: '+91 22 4000 1202',
    hours: 'Mon–Sat 9:30 AM – 8:30 PM, Sun Closed',
    mapsQuery: 'Infinity Mall, Andheri West, Mumbai',
  },
  {
    id: 'del-saket',
    name: 'HappySmile Saket',
    city: 'Delhi',
    address: 'M-12, Select Citywalk, Saket, New Delhi 110017',
    phone: '+91 11 4000 1203',
    hours: 'Mon–Sat 9:00 AM – 8:00 PM, Sun 10:00 AM – 3:00 PM',
    mapsQuery: 'Select Citywalk, Saket, New Delhi',
  },
  {
    id: 'del-rajouri',
    name: 'HappySmile Rajouri Garden',
    city: 'Delhi',
    address: 'A-18, Main Market, Rajouri Garden, New Delhi 110027',
    phone: '+91 11 4000 1204',
    hours: 'Mon–Sat 10:00 AM – 8:00 PM, Sun Closed',
    mapsQuery: 'Rajouri Garden Main Market, New Delhi',
  },
  {
    id: 'blr-indiranagar',
    name: 'HappySmile Indiranagar',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru 560038',
    phone: '+91 80 4000 1205',
    hours: 'Mon–Sat 9:00 AM – 8:30 PM, Sun 10:00 AM – 2:00 PM',
    mapsQuery: '100 Feet Road, Indiranagar, Bengaluru',
  },
  {
    id: 'blr-koramangala',
    name: 'HappySmile Koramangala',
    city: 'Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    phone: '+91 80 4000 1206',
    hours: 'Mon–Sat 9:30 AM – 8:00 PM, Sun Closed',
    mapsQuery: 'Koramangala 4th Block, Bengaluru',
  },
  {
    id: 'hyd-jubilee',
    name: 'HappySmile Jubilee Hills',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 4000 1207',
    hours: 'Mon–Sat 9:00 AM – 8:00 PM, Sun 10:00 AM – 1:00 PM',
    mapsQuery: 'Road No. 36, Jubilee Hills, Hyderabad',
  },
  {
    id: 'hyd-gachibowli',
    name: 'HappySmile Gachibowli',
    city: 'Hyderabad',
    address: 'DLF Cyber City, Gachibowli, Hyderabad 500032',
    phone: '+91 40 4000 1208',
    hours: 'Mon–Sat 9:30 AM – 8:30 PM, Sun Closed',
    mapsQuery: 'DLF Cyber City, Gachibowli, Hyderabad',
  },
  {
    id: 'che-nungambakkam',
    name: 'HappySmile Nungambakkam',
    city: 'Chennai',
    address: 'Sterling Road, Nungambakkam, Chennai 600034',
    phone: '+91 44 4000 1209',
    hours: 'Mon–Sat 9:00 AM – 8:00 PM, Sun 10:00 AM – 2:00 PM',
    mapsQuery: 'Sterling Road, Nungambakkam, Chennai',
  },
  {
    id: 'che-adyar',
    name: 'HappySmile Adyar',
    city: 'Chennai',
    address: 'Lattice Bridge Road, Adyar, Chennai 600020',
    phone: '+91 44 4000 1210',
    hours: 'Mon–Sat 9:30 AM – 8:00 PM, Sun Closed',
    mapsQuery: 'Lattice Bridge Road, Adyar, Chennai',
  },
  {
    id: 'pun-kalyaninagar',
    name: 'HappySmile Kalyani Nagar',
    city: 'Pune',
    address: 'North Main Road, Kalyani Nagar, Pune 411006',
    phone: '+91 20 4000 1211',
    hours: 'Mon–Sat 9:00 AM – 8:00 PM, Sun 10:00 AM – 1:00 PM',
    mapsQuery: 'North Main Road, Kalyani Nagar, Pune',
  },
  {
    id: 'pun-baner',
    name: 'HappySmile Baner',
    city: 'Pune',
    address: 'Baner Road, Baner, Pune 411045',
    phone: '+91 20 4000 1212',
    hours: 'Mon–Sat 9:30 AM – 8:30 PM, Sun Closed',
    mapsQuery: 'Baner Road, Pune',
  },
]

export const CITIES: string[] = Array.from(new Set(CLINICS.map((c) => c.city)))

export function clinicsByCity(city: string | null): Clinic[] {
  if (!city) return []
  return CLINICS.filter((c) => c.city === city)
}

export function clinicById(id: string | null): Clinic | undefined {
  return CLINICS.find((c) => c.id === id)
}

export function directionsUrl(clinic: Clinic): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    clinic.mapsQuery,
  )}`
}
