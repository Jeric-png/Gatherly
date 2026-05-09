import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const workspaceEventSeed = {
  host_name: 'Gatherly Labs',
  title: 'Founders Dinner: Product Stories',
  slug: '',
  description:
    'A warm founder dinner for people building products, sharing lessons, and meeting practical collaborators.',
  category: 'Networking dinner',
  status: 'draft',
  visibility: 'private',
  city: 'Any city',
  country: 'Demo',
  timezone: 'Asia/Singapore',
  venue_name: 'Studio Loft District',
  venue_address: 'Central creative district',
  starts_at: '2026-10-24T11:30:00.000Z',
  ends_at: '2026-10-24T14:30:00.000Z',
  capacity: 100,
  price_amount: 0,
  currency: 'USD',
  tags: ['networking', 'dinner', 'founders'],
  ai_summary:
    'Venue shortlist, vendor outreach, attendee reminders, and campaign assets are ready for review.',
}

function slugForUser(user) {
  return `founders-dinner-${user.id.slice(0, 8)}`
}

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }
}

export async function ensureProfile(user) {
  requireSupabase()

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    'Gatherly organiser'

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      display_name: displayName,
      preferred_language: 'en',
      account_role: 'both',
    },
    { onConflict: 'id' },
  )

  if (error) {
    throw error
  }
}

export async function ensureWorkspace(user) {
  requireSupabase()
  await ensureProfile(user)

  const { data: existingEvent, error: existingError } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) {
    throw existingError
  }

  let event = existingEvent

  if (!event) {
    const { data: createdEvent, error: createError } = await supabase
      .from('events')
      .insert({
        ...workspaceEventSeed,
        organizer_id: user.id,
        slug: slugForUser(user),
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    event = createdEvent
  }

  await seedWorkspaceRows(event.id)
  return fetchWorkspace(event.id)
}

export async function fetchWorkspace(eventId) {
  requireSupabase()

  const [
    eventResult,
    venuesResult,
    vendorsResult,
    campaignsResult,
    assetsResult,
    publicationsResult,
    tasksResult,
    attendeesResult,
    messagesResult,
  ] = await Promise.all([
    supabase.from('events').select('*').eq('id', eventId).single(),
    supabase.from('venue_leads').select('*').eq('event_id', eventId).order('fit_score', { ascending: false }),
    supabase.from('vendor_leads').select('*').eq('event_id', eventId).order('fit_score', { ascending: false }),
    supabase.from('marketing_campaigns').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
    supabase.from('marketing_assets').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
    supabase
      .from('campaign_publications')
      .select('*, marketing_campaigns!inner(event_id)')
      .eq('marketing_campaigns.event_id', eventId)
      .order('created_at', { ascending: false }),
    supabase.from('operation_tasks').select('*').eq('event_id', eventId).order('created_at', { ascending: true }),
    supabase.from('event_attendees').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
    supabase.from('event_messages').select('*').eq('event_id', eventId).order('created_at', { ascending: true }),
  ])

  const error = [
    eventResult.error,
    venuesResult.error,
    vendorsResult.error,
    campaignsResult.error,
    assetsResult.error,
    publicationsResult.error,
    tasksResult.error,
    attendeesResult.error,
    messagesResult.error,
  ].find(Boolean)

  if (error) {
    throw error
  }

  return {
    event: eventResult.data,
    venues: venuesResult.data ?? [],
    vendors: vendorsResult.data ?? [],
    campaigns: campaignsResult.data ?? [],
    assets: assetsResult.data ?? [],
    publications: publicationsResult.data ?? [],
    tasks: tasksResult.data ?? [],
    attendees: attendeesResult.data ?? [],
    messages: messagesResult.data ?? [],
  }
}

async function countRows(table, eventId) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)

  if (error) {
    throw error
  }

  return count ?? 0
}

async function seedWorkspaceRows(eventId) {
  const [venueCount, vendorCount, campaignCount, taskCount] = await Promise.all([
    countRows('venue_leads', eventId),
    countRows('vendor_leads', eventId),
    countRows('marketing_campaigns', eventId),
    countRows('operation_tasks', eventId),
  ])

  if (!venueCount) {
    const { error } = await supabase.from('venue_leads').insert([
      {
        event_id: eventId,
        name: 'The Assembly Loft',
        venue_type: 'Creative venue',
        city: 'Any city',
        address: 'Studio district',
        capacity_min: 80,
        capacity_max: 120,
        estimated_price: 1400,
        currency: 'USD',
        amenities: ['AV', 'flexible seating', 'catering access'],
        source_provider: 'seed',
        fit_score: 94,
        status: 'shortlisted',
        ai_rationale:
          'Strong match for a warm networking dinner with flexible layout and visual atmosphere.',
        missing_info: 'Confirm final package pricing and weekend availability.',
      },
      {
        event_id: eventId,
        name: 'Civic Hall Studio',
        venue_type: 'Workshop space',
        city: 'Any city',
        address: 'Civic centre',
        capacity_min: 60,
        capacity_max: 100,
        estimated_price: 900,
        currency: 'USD',
        amenities: ['projector', 'transit access'],
        source_provider: 'seed',
        fit_score: 88,
        status: 'suggested',
        ai_rationale:
          'Operationally simple venue with projector, transit access, and affordable weekday rates.',
        missing_info: 'Check catering rules and after-hours access.',
      },
    ])

    if (error) {
      throw error
    }
  }

  if (!vendorCount) {
    const { error } = await supabase.from('vendor_leads').insert([
      {
        event_id: eventId,
        name: 'Tablecraft Catering',
        vendor_type: 'Catering',
        city: 'Any city',
        service_area: 'Dinner events',
        estimated_price_min: 18,
        estimated_price_max: 28,
        currency: 'USD',
        source_provider: 'seed',
        fit_score: 91,
        status: 'shortlisted',
        ai_rationale:
          'Good fit for flexible menus, halal-friendly requests, and plated or buffet service.',
      },
      {
        event_id: eventId,
        name: 'Signal AV Studio',
        vendor_type: 'AV support',
        city: 'Any city',
        service_area: 'Workshops and dinners',
        estimated_price_min: 600,
        estimated_price_max: 600,
        currency: 'USD',
        source_provider: 'seed',
        fit_score: 86,
        status: 'suggested',
        ai_rationale:
          'Simple projector, microphone, lighting, and technician bundle for workshops.',
      },
    ])

    if (error) {
      throw error
    }
  }

  if (!campaignCount) {
    const { data: campaign, error } = await supabase
      .from('marketing_campaigns')
      .insert({
        event_id: eventId,
        title: 'Warm Product Stories Launch Campaign',
        objective: 'Drive RSVPs from local founders and product builders.',
        audience: 'Early-stage founders, product leads, and community operators.',
        channels: ['email', 'instagram', 'linkedin', 'paid_social'],
        status: 'generated',
        strategy_summary:
          'Use venue warmth and founder storytelling as the creative anchor. Pair generated images with short founder-led copy and a vertical promo video.',
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    const { error: assetsError } = await supabase.from('marketing_assets').insert([
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'poster_prompt',
        title: 'Warm dinner poster prompt',
        prompt:
          'Create a warm editorial poster for a founder dinner in a loft venue with natural light, intimate tables, and thoughtful conversation.',
        content: '4:5 social poster concept using venue and catering context.',
        provider: 'openai',
        model_name: 'chatgpt-image-2',
        status: 'generated',
        metadata: { aspect_ratio: '4:5' },
      },
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'caption',
        title: 'LinkedIn invite caption',
        content:
          'Join a small founder dinner built around honest product stories, practical lessons, and people you will actually want to follow up with.',
        provider: 'openai',
        model_name: 'gpt-5.5',
        status: 'generated',
      },
    ])

    if (assetsError) {
      throw assetsError
    }
  }

  if (!taskCount) {
    const { error } = await supabase.from('operation_tasks').insert([
      {
        event_id: eventId,
        title: 'Review venue shortlist',
        description: 'Compare top venue matches and confirm availability questions.',
        category: 'venue',
        status: 'in_progress',
        priority: 'high',
        ai_suggested: true,
      },
      {
        event_id: eventId,
        title: 'Approve campaign assets',
        description: 'Review poster prompt, email invite, ad copy, and video direction.',
        category: 'marketing',
        status: 'todo',
        priority: 'medium',
        ai_suggested: true,
      },
    ])

    if (error) {
      throw error
    }
  }
}

export async function generateVenueLead(event) {
  requireSupabase()

  const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const { error } = await supabase.from('venue_leads').insert({
    event_id: event.id,
    name: `AI Venue Match ${timestamp}`,
    venue_type: 'AI-sourced venue',
    city: event.city,
    address: 'Generated shortlist candidate',
    capacity_min: Math.max(20, Math.round((event.capacity || 100) * 0.75)),
    capacity_max: Math.max(40, Math.round((event.capacity || 100) * 1.25)),
    estimated_price: 1200,
    currency: event.currency || 'USD',
    amenities: ['AV', 'flexible layout', 'catering friendly'],
    source_provider: 'manual',
    fit_score: 90,
    status: 'suggested',
    ai_rationale:
      'Generated from the event brief, capacity, city, and selected hospitality requirements.',
    missing_info: 'Needs live Exa validation, source URL, and availability confirmation.',
  })

  if (error) {
    throw error
  }
}

export async function generateVendorLead(event) {
  requireSupabase()

  const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const { error } = await supabase.from('vendor_leads').insert({
    event_id: event.id,
    name: `AI Vendor Match ${timestamp}`,
    vendor_type: 'Catering',
    city: event.city,
    service_area: event.category,
    estimated_price_min: 20,
    estimated_price_max: 35,
    currency: event.currency || 'USD',
    source_provider: 'manual',
    fit_score: 89,
    status: 'suggested',
    ai_rationale:
      'Generated from event size, audience, budget posture, and dinner-oriented requirements.',
  })

  if (error) {
    throw error
  }
}

export async function generateMarketingAsset(workspace) {
  requireSupabase()

  const campaign = workspace.campaigns[0]

  if (!campaign) {
    throw new Error('Create a campaign before generating assets.')
  }

  const venue = workspace.venues[0]?.name || workspace.event.venue_name || 'selected venue'
  const vendor = workspace.vendors[0]?.name || 'selected vendors'

  const { error } = await supabase.from('marketing_assets').insert({
    campaign_id: campaign.id,
    event_id: workspace.event.id,
    asset_type: 'campaign_plan',
    title: `AI Campaign Plan ${workspace.assets.length + 1}`,
    prompt: `Generate a campaign using ${workspace.event.title}, ${venue}, and ${vendor}.`,
    content: `Campaign plan built from the event brief, ${venue}, ${vendor}, audience positioning, poster direction, email sequence, ad copy, and promo video storyboard.`,
    provider: 'openai',
    model_name: 'gpt-5.5',
    status: 'generated',
    metadata: {
      venue,
      vendor,
      channels: campaign.channels,
    },
  })

  if (error) {
    throw error
  }
}
