export const events = [
  {
    id: 1,
    title: 'Founders Dinner: Product Stories',
    category: 'Networking dinner',
    city: 'Any city',
    date: 'Fri, 7:30 PM',
    venue: 'Studio Loft District',
    host: 'Gatherly Labs',
    attendees: 86,
    capacity: 100,
    price: 'Free RSVP',
    gradient: 'linear-gradient(135deg, #4b3e00, #bfaa5a 52%, #ffb4a3)',
  },
  {
    id: 2,
    title: 'AI Creator Workshop',
    category: 'Workshop',
    city: 'Central neighbourhood',
    date: 'Sat, 2:00 PM',
    venue: 'Creative Campus Hall',
    host: 'Maker Circle',
    attendees: 142,
    capacity: 160,
    price: '$24',
    gradient: 'linear-gradient(135deg, #2e5c8a, #6f9bc2 52%, #ffdad2)',
  },
  {
    id: 3,
    title: 'Community Supper Club',
    category: 'Social',
    city: 'Riverside quarter',
    date: 'Sun, 6:00 PM',
    venue: 'Greenhouse Kitchen',
    host: 'Nomad Table Club',
    attendees: 48,
    capacity: 60,
    price: '$18',
    gradient: 'linear-gradient(135deg, #2f6f4e, #8fbf9d 50%, #fae28b)',
  },
]

export const workspaceMetrics = [
  { label: 'Launch progress', value: '72%', tone: 'primary' },
  { label: 'RSVPs confirmed', value: '86', tone: 'good' },
  { label: 'Lead candidates', value: '24', tone: 'warn' },
  { label: 'Assets ready', value: '9', tone: 'neutral' },
]

export const timeline = [
  {
    title: 'Event brief approved',
    detail: 'Audience, budget, vibe, and city-agnostic constraints saved.',
    status: 'Done',
  },
  {
    title: 'Venue shortlist in review',
    detail: 'Exa candidates and seeded fallback venues ranked by fit.',
    status: 'Review',
  },
  {
    title: 'Marketing campaign awaiting approval',
    detail: 'Poster variants, email invite, ad copy, and video storyboard generated.',
    status: 'Next',
  },
]

export const venueLeads = [
  {
    name: 'The Assembly Loft',
    category: 'Creative venue',
    score: 94,
    price: '$1,400 est.',
    capacity: '80-120',
    source: 'Exa public web result',
    summary: 'Strong match for a warm networking dinner. AV listed, flexible seating, and strong visual atmosphere.',
    missing: 'Confirm final package pricing and weekend availability.',
  },
  {
    name: 'Civic Hall Studio',
    category: 'Workshop space',
    score: 88,
    price: '$900 est.',
    capacity: '60-100',
    source: 'Seeded fallback lead',
    summary: 'Operationally simple venue with projector, transit access, and affordable weekday rates.',
    missing: 'Check catering rules and after-hours access.',
  },
  {
    name: 'Greenhouse Kitchen Room',
    category: 'Dining venue',
    score: 82,
    price: '$1,750 est.',
    capacity: '50-90',
    source: 'Exa public web result',
    summary: 'Best atmosphere fit for intimate community events and creator dinners.',
    missing: 'Confirm minimum spend and private room policy.',
  },
]

export const vendorLeads = [
  {
    name: 'Tablecraft Catering',
    category: 'Catering',
    score: 91,
    price: '$18-28 per guest',
    source: 'Exa public web result',
    summary: 'Good fit for flexible menus, halal-friendly requests, and plated or buffet service.',
  },
  {
    name: 'Signal AV Studio',
    category: 'AV support',
    score: 86,
    price: '$600 package',
    source: 'Seeded fallback lead',
    summary: 'Simple projector, microphone, lighting, and technician bundle for workshops.',
  },
  {
    name: 'Lens & Light Collective',
    category: 'Photography',
    score: 79,
    price: '$450 half day',
    source: 'Exa public web result',
    summary: 'Strong event recap style for community and creator gatherings.',
  },
]

export const marketingAssets = [
  {
    title: 'Warm dinner poster',
    format: '4:5 social poster',
    gradient: 'linear-gradient(135deg, #8c1900, #ff6b4a 58%, #fae28b)',
  },
  {
    title: 'Venue-led hero image',
    format: 'Event page hero',
    gradient: 'linear-gradient(135deg, #1b1c1c, #ae3115 55%, #ffb4a3)',
  },
  {
    title: 'Vertical promo creative',
    format: '9:16 video cover',
    gradient: 'linear-gradient(135deg, #2e5c8a, #ff6b4a 58%, #ffffff)',
  },
]

export const attendees = [
  { name: 'Amelia Wong', segment: 'Confirmed', language: 'English', reminder: 'Scheduled', status: 'Checked in' },
  { name: 'Ravi Menon', segment: 'VIP', language: 'English', reminder: 'Draft ready', status: 'Confirmed' },
  { name: 'Mei Tan', segment: 'Waitlist', language: 'Mandarin', reminder: 'Needs review', status: 'Waitlist' },
  { name: 'Daniel Lim', segment: 'Confirmed', language: 'Malay', reminder: 'Sent', status: 'Confirmed' },
]

export const communityMessages = [
  {
    author: 'Sophia',
    message: 'Is there a dress code for the dinner?',
    translation: 'Spanish preview: Hay algun codigo de vestimenta para la cena?',
    time: '2 min ago',
  },
  {
    author: 'Gatherly AI',
    message: 'Draft announcement ready: doors open at 7:00 PM, dinner starts at 7:30 PM.',
    translation: 'Translation can be generated per attendee language preference.',
    time: 'Now',
  },
  {
    author: 'Marcus',
    message: 'Can I bring a founder friend if there is space?',
    translation: 'Japanese preview placeholder: translated version shown here after approval.',
    time: '8 min ago',
  },
]
