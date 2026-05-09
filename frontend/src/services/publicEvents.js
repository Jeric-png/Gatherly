import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export const eventImagePool = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDitVxLkW8HsvwZ8IvQHw7mDxrdxW22nfaxRK_YrHY1pK3RgK8EvamQkYwl4_wnK-rxWqNrZcOsvKNxMHf_tboPavTfxxpBN6QjXx0v4CPJP5Yq5KW8n8bwyvKXD4qH94rWQuZoFtTzixWcdfZub71HuJH6kZukBz3e9wbA7QRrkDX4U_mwKX9wX8UqY5Rzi1Qxmkm8XKEpMm71qgwOx_6Sr9aJsu8UMPPfdjrfVizoNEgF6YWB6WUO99WlGBMSxMnQrx0QIyjFLKg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhmcTfrwcqiDURPdm1av2IyA5A0FObUlJWNe9CYQ_fI_iitaJ-e5f4QuwIEhBAkRk10CLX4gyCLKnYhURBvxzEgDBwjOroj0BFRbbye9BQ5PJ49DDQHMy2JygDeolrzIZ2PVSAxmvS2UvOUmUn3-ouqqtaZUZIuqZ3W_A9Ag_UbBpa_Wyz7QU8dULOfFMEKvfgjlc28E-H35lAD2E6PI1KMq9ENqym-s29zhJPt0tua3-qcKDPjk3_taTY1jgNdRj8lEwiUp3ygpM',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAm085PI-uyokZepDP_mIXD5VH6lBe8HpGneCVfQefW41xIeqAmAWCkzhJ4fl3xX_Y--zdOtxVYucQVgMHCfPSJcSWtItK5j23hUyUI0JniJJeL3I4Abci_jy7jEQRidu6i9v4uphuklkIOuBJqEU0n7dKhFL0WSQgCg-a-9UaB-6OXy-hl0k5Hm3MDNJyGcLGdKxFk0ZVsFcsPs0m-0A32JufdPG7XDQmncRt_qfr74J-zsj1EqbWKbv8vfl_b9k2ngrj0UiFo5WI',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhl5lwyhATb2MTErObUtdTr-M1kAY8871UjCx0QfcrQ8iltwaSQiQe9nYXPWEH4uRSdnpfSCR2z0j8M1FKEsGZvNAybV8lePbad7qLLYKcmwzvvxDhPCVh-mjzWzKwoa5nKuFlRESpSi50-8rp-OZndFxj_yEL5SQevRN9UaBuJtVUf8j11oxSrlBPxSdlgR-BH0bSykwV5X5fVJUUjiEnwiyaGT4BXM9ON91QW3PmjqbL30k_RVHiFF4P-0X0Qgc0Jtrwydl3Gr0',
]

const eventSelect = `
  id,
  title,
  slug,
  description,
  category,
  city,
  country,
  venue_name,
  venue_address,
  starts_at,
  ends_at,
  capacity,
  price_amount,
  currency,
  host_name,
  tags,
  ai_summary,
  hero_image_url
`

export async function fetchPublicEvents() {
  if (!isSupabaseConfigured) {
    return { events: [], source: 'fallback', error: null }
  }

  const { data, error } = await supabase
    .from('events')
    .select(eventSelect)
    .eq('status', 'published')
    .in('visibility', ['public', 'unlisted'])
    .order('starts_at', { ascending: true })
    .limit(12)

  if (error) {
    return { events: [], source: 'fallback', error }
  }

  return { events: data ?? [], source: 'supabase', error: null }
}

export function getEventImage(event, index = 0) {
  return event?.hero_image_url || eventImagePool[index % eventImagePool.length]
}

export function getPriceLabel(event) {
  const amount = Number(event?.price_amount ?? 0)

  if (!amount) {
    return 'Free'
  }

  const currency = event?.currency || 'USD'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getDateBadge(event) {
  if (!event?.starts_at) {
    return 'TBD'
  }

  const date = new Date(event.starts_at)

  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      timeZone: event.timezone || 'UTC',
    })
    .replace(' ', '\n')
    .toUpperCase()
}

export function getDateLine(event) {
  if (!event?.starts_at) {
    return 'Date to be announced'
  }

  const date = new Date(event.starts_at)

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function getTimeLine(event) {
  if (!event?.starts_at) {
    return 'Time to be announced'
  }

  const start = new Date(event.starts_at)
  const end = event.ends_at ? new Date(event.ends_at) : null
  const format = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return end ? `${format.format(start)} - ${format.format(end)}` : format.format(start)
}

export function getLocationLine(event) {
  return [event?.venue_name, event?.city].filter(Boolean).join(', ') || 'Location to be announced'
}

export function getSpotsLabel(event, fallback = 'Spots available') {
  if (!event?.capacity) {
    return fallback
  }

  return `${event.capacity} capacity`
}

export function getEventTags(event) {
  const tags = event?.tags?.length ? event.tags : [event?.category].filter(Boolean)

  return tags.slice(0, 2).map((tag) => String(tag).toUpperCase())
}
