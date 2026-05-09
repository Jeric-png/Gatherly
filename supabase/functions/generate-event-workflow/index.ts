import { createClient } from 'npm:@supabase/supabase-js@2'

type EventRecord = {
  id: string
  title: string
  description: string
  category: string
  city: string | null
  country: string | null
  capacity: number | null
  currency: string | null
}

type SearchResult = {
  title?: string
  url?: string
  text?: string
  summary?: string
  highlights?: string[]
  image?: string
}

type WorkflowPlan = {
  event_title?: string
  event_summary: string
  venues: Array<{
    name: string
    venue_type: string
    city: string
    address: string
    capacity_min: number | null
    capacity_max: number | null
    estimated_price: number | null
    amenities: string[]
    fit_score: number
    rationale: string
    missing_info: string
    source_url?: string
  }>
  vendors: Array<{
    name: string
    vendor_type: string
    city: string
    service_area: string
    estimated_price_min: number | null
    estimated_price_max: number | null
    fit_score: number
    rationale: string
    source_url?: string
  }>
  campaign: {
    title: string
    objective: string
    audience: string
    channels: string[]
    strategy_summary: string
    poster_prompt: string
    infographic_prompt: string
    caption: string
    video_prompt: string
  }
  tasks: Array<{
    title: string
    description: string
    category: 'venue' | 'vendor' | 'marketing' | 'attendee' | 'community' | 'general'
    priority: 'low' | 'medium' | 'high'
  }>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabasePublishableKey =
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ??
  Deno.env.get('SUPABASE_ANON_KEY') ??
  ''
const openAiKey = Deno.env.get('OPENAI_API_KEY') ?? ''
const exaKey = Deno.env.get('EXA_API_KEY') ?? ''
const textModel = Deno.env.get('OPENAI_TEXT_MODEL') ?? 'gpt-5.5'
const imageModel = Deno.env.get('OPENAI_IMAGE_MODEL') ?? 'gpt-image-1.5'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function requireString(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is required.`)
  }

  return value.trim()
}

function clampScore(value: unknown, fallback: number) {
  const score = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.max(0, Math.min(100, Math.round(score)))
}

function asNumberOrNull(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
}

function summarizeImageRaw(raw: unknown) {
  if (!raw || typeof raw !== 'object') {
    return raw
  }

  const record = raw as { data?: Array<Record<string, unknown>> }
  return {
    ...record,
    data: record.data?.map((item) => ({
      ...item,
      b64_json: item.b64_json ? '[omitted]' : undefined,
    })),
  }
}

function buildFallbackPlan(event: EventRecord, brief: string, venueResults: SearchResult[], vendorResults: SearchResult[]): WorkflowPlan {
  const city = event.city || 'Any city'
  const capacity = event.capacity || 100
  const venueFallbacks = venueResults.length ? venueResults : [{ title: 'AI venue candidate', url: '' }]
  const vendorFallbacks = vendorResults.length ? vendorResults : [{ title: 'AI vendor candidate', url: '' }]

  return {
    event_summary: `Generated from the organiser brief: ${brief.slice(0, 220)}`,
    venues: venueFallbacks.slice(0, 3).map((result, index) => ({
      name: result.title || `Venue Candidate ${index + 1}`,
      venue_type: event.category || 'Event venue',
      city,
      address: city,
      capacity_min: Math.round(capacity * 0.75),
      capacity_max: Math.round(capacity * 1.25),
      estimated_price: null,
      amenities: ['source-backed lead', 'availability to confirm'],
      fit_score: 90 - index * 5,
      rationale: result.summary || result.highlights?.[0] || 'Potential match found from live web search.',
      missing_info: 'Confirm pricing, package inclusions, AV support, and availability.',
      source_url: result.url,
    })),
    vendors: vendorFallbacks.slice(0, 3).map((result, index) => ({
      name: result.title || `Vendor Candidate ${index + 1}`,
      vendor_type: 'Event supplier',
      city,
      service_area: event.category || 'Event operations',
      estimated_price_min: null,
      estimated_price_max: null,
      fit_score: 88 - index * 5,
      rationale: result.summary || result.highlights?.[0] || 'Potential supplier found from live web search.',
      source_url: result.url,
    })),
    campaign: {
      title: `${event.title} Campaign`,
      objective: 'Drive qualified RSVPs with venue-led visuals and clear event positioning.',
      audience: 'People likely to attend based on the event brief, location, and community intent.',
      channels: ['email', 'instagram', 'linkedin', 'paid_social'],
      strategy_summary:
        'Use the selected venue, supplier context, and event promise to produce a launch campaign, image concept, email sequence, and promo video storyboard.',
      poster_prompt: `Create a premium event poster for ${event.title}. Use this brief: ${brief}`,
      infographic_prompt: `Create a polished social infographic for ${event.title} showing the venue, vendor highlights, date, audience, and RSVP call-to-action.`,
      caption: `Join ${event.title} for a thoughtful real-world gathering designed around ${event.category}.`,
      video_prompt: `Create a 15-second vertical promo video storyboard for ${event.title}, opening with venue atmosphere, then vendor/community details, then RSVP CTA.`,
    },
    tasks: [
      {
        title: 'Review EXA venue shortlist',
        description: 'Check source links, pricing assumptions, availability questions, and shortlist one venue.',
        category: 'venue',
        priority: 'high',
      },
      {
        title: 'Review vendor outreach list',
        description: 'Confirm supplier categories, draft first outreach, and compare likely pricing.',
        category: 'vendor',
        priority: 'high',
      },
      {
        title: 'Approve generated marketing package',
        description: 'Review campaign strategy, infographic image, caption, and promo video prompt.',
        category: 'marketing',
        priority: 'medium',
      },
    ],
  }
}

async function exaSearch(query: string): Promise<{ results: SearchResult[]; raw: unknown }> {
  if (!exaKey) {
    return { results: [], raw: { skipped: 'EXA_API_KEY is not configured.' } }
  }

  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': exaKey,
    },
    body: JSON.stringify({
      query,
      type: 'auto',
      numResults: 4,
      contents: {
        highlights: {
          query,
          maxCharacters: 900,
        },
        summary: {
          query: 'Summarize why this result may be useful for event venue or vendor sourcing.',
        },
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`EXA search failed: ${errorText}`)
  }

  const raw = await response.json()
  return { results: raw.results ?? [], raw }
}

function extractJsonObject(text: string): WorkflowPlan | null {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : null
  }
}

async function createWorkflowPlan(event: EventRecord, brief: string, venueResults: SearchResult[], vendorResults: SearchResult[]) {
  const fallback = buildFallbackPlan(event, brief, venueResults, vendorResults)

  if (!openAiKey) {
    return { plan: fallback, raw: { skipped: 'OPENAI_API_KEY is not configured.' } }
  }

  const prompt = {
    event,
    organiser_brief: brief,
    venue_search_results: venueResults.slice(0, 4).map((result) => ({
      title: result.title,
      url: result.url,
      summary: result.summary,
      highlights: result.highlights,
    })),
    vendor_search_results: vendorResults.slice(0, 4).map((result) => ({
      title: result.title,
      url: result.url,
      summary: result.summary,
      highlights: result.highlights,
    })),
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: textModel,
      input: [
        {
          role: 'system',
          content:
            'You are Gatherly AI Co-organiser. Convert event briefs and EXA search results into structured venue leads, vendor leads, and a marketing campaign. Return only JSON matching the requested object shape. Use source URLs only from search results.',
        },
        {
          role: 'user',
          content: JSON.stringify(prompt),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'gatherly_event_workflow',
          strict: false,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['event_summary', 'venues', 'vendors', 'campaign', 'tasks'],
            properties: {
              event_summary: { type: 'string' },
              venues: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    name: { type: 'string' },
                    venue_type: { type: 'string' },
                    city: { type: 'string' },
                    address: { type: 'string' },
                    capacity_min: { type: ['number', 'null'] },
                    capacity_max: { type: ['number', 'null'] },
                    estimated_price: { type: ['number', 'null'] },
                    amenities: { type: 'array', items: { type: 'string' } },
                    fit_score: { type: 'number' },
                    rationale: { type: 'string' },
                    missing_info: { type: 'string' },
                    source_url: { type: 'string' },
                  },
                },
              },
              vendors: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    name: { type: 'string' },
                    vendor_type: { type: 'string' },
                    city: { type: 'string' },
                    service_area: { type: 'string' },
                    estimated_price_min: { type: ['number', 'null'] },
                    estimated_price_max: { type: ['number', 'null'] },
                    fit_score: { type: 'number' },
                    rationale: { type: 'string' },
                    source_url: { type: 'string' },
                  },
                },
              },
              campaign: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  title: { type: 'string' },
                  objective: { type: 'string' },
                  audience: { type: 'string' },
                  channels: { type: 'array', items: { type: 'string' } },
                  strategy_summary: { type: 'string' },
                  poster_prompt: { type: 'string' },
                  infographic_prompt: { type: 'string' },
                  caption: { type: 'string' },
                  video_prompt: { type: 'string' },
                },
              },
              tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    priority: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return { plan: fallback, raw: { error: errorText, fallback: true } }
  }

  const raw = await response.json()
  const outputText =
    raw.output_text ??
    raw.output
      ?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content ?? [])
      ?.map((content: { text?: string }) => content.text ?? '')
      ?.join('\n')

  const parsed = outputText ? extractJsonObject(outputText) : null
  const plan = parsed
    ? {
        ...fallback,
        ...parsed,
        venues: Array.isArray(parsed.venues) && parsed.venues.length ? parsed.venues : fallback.venues,
        vendors: Array.isArray(parsed.vendors) && parsed.vendors.length ? parsed.vendors : fallback.vendors,
        campaign: {
          ...fallback.campaign,
          ...(parsed.campaign ?? {}),
        },
        tasks: Array.isArray(parsed.tasks) && parsed.tasks.length ? parsed.tasks : fallback.tasks,
      }
    : fallback

  return { plan, raw }
}

async function generateImage(prompt: string) {
  if (!openAiKey) {
    return { assetUrl: null, raw: { skipped: 'OPENAI_API_KEY is not configured.' } }
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: imageModel,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'medium',
    }),
  })

  if (!response.ok) {
    return { assetUrl: null, raw: { error: await response.text() } }
  }

  const raw = await response.json()
  const image = raw.data?.[0]
  const assetUrl = image?.b64_json ? `data:image/png;base64,${image.b64_json}` : image?.url ?? null

  return { assetUrl, raw }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return jsonResponse({ error: 'Missing Authorization header.' }, 401)
    }

    const supabase = createClient(supabaseUrl, supabasePublishableKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    })

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      return jsonResponse({ error: 'Authentication failed.' }, 401)
    }

    const body = await req.json()
    const eventId = requireString(body.eventId, 'eventId')
    const brief = requireString(body.brief, 'brief')

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      throw eventError ?? new Error('Event not found.')
    }

    const eventRecord = event as EventRecord
    const location = [eventRecord.city, eventRecord.country].filter(Boolean).join(', ') || 'near me'
    const capacity = eventRecord.capacity ? `${eventRecord.capacity} guests` : 'event guests'
    const venueQuery = `${brief} ${location} event venues for ${capacity} venue hire AV catering`
    const vendorQuery = `${brief} ${location} event vendors catering AV photography marketing suppliers ${capacity}`

    const { data: runs, error: runError } = await supabase
      .from('discovery_runs')
      .insert([
        { event_id: eventId, run_type: 'venue', provider: 'exa', query: venueQuery, status: 'running' },
        { event_id: eventId, run_type: 'vendor', provider: 'exa', query: vendorQuery, status: 'running' },
      ])
      .select()

    if (runError) {
      throw runError
    }

    const [venueSearch, vendorSearch] = await Promise.all([exaSearch(venueQuery), exaSearch(vendorQuery)])
    const { plan, raw: openAiRaw } = await createWorkflowPlan(
      eventRecord,
      brief,
      venueSearch.results,
      vendorSearch.results,
    )

    await Promise.all([
      supabase
        .from('discovery_runs')
        .update({
          status: 'completed',
          result_count: venueSearch.results.length,
          source_summary: `EXA venue search returned ${venueSearch.results.length} candidates.`,
          raw_response: venueSearch.raw,
        })
        .eq('id', runs?.find((run: { run_type: string }) => run.run_type === 'venue')?.id),
      supabase
        .from('discovery_runs')
        .update({
          status: 'completed',
          result_count: vendorSearch.results.length,
          source_summary: `EXA vendor search returned ${vendorSearch.results.length} candidates.`,
          raw_response: vendorSearch.raw,
        })
        .eq('id', runs?.find((run: { run_type: string }) => run.run_type === 'vendor')?.id),
    ])

    const topVenueUrl = (candidate: { source_url?: string }, index: number) =>
      candidate.source_url || venueSearch.results[index]?.url || null
    const topVendorUrl = (candidate: { source_url?: string }, index: number) =>
      candidate.source_url || vendorSearch.results[index]?.url || null

    const venueRows = plan.venues.slice(0, 4).map((venue, index) => ({
      event_id: eventId,
      name: venue.name,
      venue_type: venue.venue_type,
      city: venue.city || eventRecord.city,
      address: venue.address,
      capacity_min: asNumberOrNull(venue.capacity_min),
      capacity_max: asNumberOrNull(venue.capacity_max),
      estimated_price: asNumberOrNull(venue.estimated_price),
      currency: eventRecord.currency || 'USD',
      amenities: Array.isArray(venue.amenities) ? venue.amenities.slice(0, 8) : [],
      source_provider: topVenueUrl(venue, index) ? 'exa' : 'manual',
      source_url: topVenueUrl(venue, index),
      source_retrieved_at: new Date().toISOString(),
      fit_score: clampScore(venue.fit_score, 85 - index * 4),
      status: index === 0 ? 'shortlisted' : 'suggested',
      ai_rationale: venue.rationale,
      missing_info: venue.missing_info,
      metadata: { workflow: 'generate-event-workflow', brief },
    }))

    const vendorRows = plan.vendors.slice(0, 4).map((vendor, index) => ({
      event_id: eventId,
      name: vendor.name,
      vendor_type: vendor.vendor_type || 'Event supplier',
      city: vendor.city || eventRecord.city,
      service_area: vendor.service_area || eventRecord.category,
      estimated_price_min: asNumberOrNull(vendor.estimated_price_min),
      estimated_price_max: asNumberOrNull(vendor.estimated_price_max),
      currency: eventRecord.currency || 'USD',
      source_provider: topVendorUrl(vendor, index) ? 'exa' : 'manual',
      source_url: topVendorUrl(vendor, index),
      source_retrieved_at: new Date().toISOString(),
      fit_score: clampScore(vendor.fit_score, 84 - index * 4),
      status: index === 0 ? 'shortlisted' : 'suggested',
      ai_rationale: vendor.rationale,
      metadata: { workflow: 'generate-event-workflow', brief },
    }))

    const [{ error: venueInsertError }, { error: vendorInsertError }] = await Promise.all([
      supabase.from('venue_leads').insert(venueRows),
      supabase.from('vendor_leads').insert(vendorRows),
    ])

    if (venueInsertError) throw venueInsertError
    if (vendorInsertError) throw vendorInsertError

    const { data: campaign, error: campaignError } = await supabase
      .from('marketing_campaigns')
      .insert({
        event_id: eventId,
        title: plan.campaign.title,
        objective: plan.campaign.objective,
        audience: plan.campaign.audience,
        channels: plan.campaign.channels?.length
          ? plan.campaign.channels
          : ['email', 'instagram', 'linkedin', 'paid_social'],
        status: 'generated',
        strategy_summary: plan.campaign.strategy_summary,
        created_by: authData.user.id,
      })
      .select()
      .single()

    if (campaignError) {
      throw campaignError
    }

    const imagePrompt = `${plan.campaign.infographic_prompt}\n\nEvent brief: ${brief}\nVenue context: ${venueRows[0]?.name ?? 'venue pending'}\nVendor context: ${vendorRows[0]?.name ?? 'vendor pending'}`
    const image = await generateImage(imagePrompt)

    const { error: assetError } = await supabase.from('marketing_assets').insert([
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'campaign_plan',
        title: 'AI full campaign plan',
        prompt: brief,
        content: plan.campaign.strategy_summary,
        provider: 'openai',
        model_name: textModel,
        status: 'generated',
        metadata: { objective: plan.campaign.objective, audience: plan.campaign.audience },
      },
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'image',
        title: 'AI event infographic',
        prompt: imagePrompt,
        content: plan.campaign.infographic_prompt,
        asset_url: image.assetUrl,
        provider: 'openai',
        model_name: imageModel,
        status: image.assetUrl ? 'generated' : 'draft',
        metadata: { image_response: summarizeImageRaw(image.raw), asset_kind: 'infographic' },
      },
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'caption',
        title: 'Launch caption',
        content: plan.campaign.caption,
        provider: 'openai',
        model_name: textModel,
        status: 'generated',
      },
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'video_prompt',
        title: 'Promo video prompt',
        prompt: plan.campaign.video_prompt,
        content: plan.campaign.video_prompt,
        provider: 'openai',
        model_name: textModel,
        status: 'generated',
      },
      {
        campaign_id: campaign.id,
        event_id: eventId,
        asset_type: 'poster_prompt',
        title: 'Poster prompt',
        prompt: plan.campaign.poster_prompt,
        content: plan.campaign.poster_prompt,
        provider: 'openai',
        model_name: imageModel,
        status: 'generated',
      },
    ])

    if (assetError) {
      throw assetError
    }

    const { error: taskError } = await supabase.from('operation_tasks').insert(
      plan.tasks.slice(0, 6).map((task) => ({
        event_id: eventId,
        owner_id: authData.user.id,
        title: task.title,
        description: task.description,
        category: task.category,
        status: 'todo',
        priority: task.priority,
        ai_suggested: true,
      })),
    )

    if (taskError) {
      throw taskError
    }

    const { error: generationError } = await supabase.from('ai_generations').insert({
      event_id: eventId,
      profile_id: authData.user.id,
      workflow_type: 'event_workflow_orchestration',
      provider: 'openai',
      model_name: textModel,
      input: {
        brief,
        venue_query: venueQuery,
        vendor_query: vendorQuery,
      },
      output: {
        plan,
        openai: openAiRaw,
        image: summarizeImageRaw(image.raw),
      },
      status: 'completed',
    })

    if (generationError) {
      throw generationError
    }

    await supabase
      .from('events')
      .update({
        description: brief,
        ai_summary: plan.event_summary,
        venue_name: venueRows[0]?.name ?? eventRecord.title,
        venue_address: venueRows[0]?.address ?? eventRecord.city,
      })
      .eq('id', eventId)

    return jsonResponse({
      ok: true,
      eventId,
      counts: {
        venues: venueRows.length,
        vendors: vendorRows.length,
        assets: 5,
        tasks: plan.tasks.length,
      },
      imageGenerated: Boolean(image.assetUrl),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Workflow failed.'
    return jsonResponse({ error: message }, 500)
  }
})
