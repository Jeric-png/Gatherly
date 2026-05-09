# Gatherly

AI-Powered Social Event Platform and Event Operations Workspace

Product Requirements Document · v1.0 · May 2026

Event discovery · AI co-organiser · Venue and vendor workflows · Marketing generation · Multilingual coordination

City-agnostic MVP · Supabase-backed · Real AI generation · Exa-powered discovery with seeded fallback

| Field | Detail |
|---|---|
| Status | Draft — For Review |
| Author | Product Team |
| Target Platform | Responsive web app |
| Primary User | New or lightweight event host |
| Secondary Users | Community organisers, creators, attendees, small teams |
| Last Updated | May 2026 |

---

## 1. Executive Summary

Gatherly is an AI-powered social event platform that helps people discover, create, and operate real-world events from a single workspace. It combines a public event discovery experience with an organiser dashboard powered by an AI co-organiser that assists with planning, Exa-powered venue/vendor discovery, vendor outreach, AI image generation, multilingual translation, attendee coordination, and community engagement.

The MVP focuses on helping new or lightweight event hosts move from event idea to launch without juggling spreadsheets, messaging apps, email threads, ticketing tools, design tools, and social media workflows. The product will use real AI API calls for planning, drafting, ranking, summarisation, marketing content generation, translation, and live web discovery. Venue/vendor leads can come from Exa-powered public web research with seeded fallback data for demos, while attendee data and operational conversations can remain simulated where needed.

### Core Value Proposition

| For organisers | For attendees | For the platform |
|---|---|---|
| Launch events faster with AI-assisted operations. | Discover meaningful local experiences and join event communities. | Create a unified operating layer for social events and communities. |
| Reduce repetitive planning, outreach, and content work. | RSVP, receive updates, and chat in one place. | Differentiate beyond ticketing with AI-native workflows. |
| Centralise venue, vendor, marketing, and attendee coordination. | Build social connection before and during events. | Seed reusable event operations data for future automation. |

## 2. Problem Statement

Event planning remains fragmented, repetitive, and operationally stressful. A person hosting a meetup, workshop, networking dinner, creator event, community activity, or small gathering often has to coordinate across many disconnected tools before the event can even be published.

Current workflows commonly involve:

- Google Sheets for budgets, attendees, and vendor tracking.
- WhatsApp, Telegram, or Discord for attendee coordination.
- Gmail for venue and vendor outreach.
- Canva or design tools for promotional material.
- Google Forms or ticketing tools for registration.
- Instagram, LinkedIn, or TikTok for promotion.
- Google Maps and search engines for venue and supplier discovery.

This fragmentation creates coordination fatigue and makes event hosting feel harder than it should, especially for people who are just starting to host events.

### Core Pain Points

| Pain Point | Description | User Impact |
|---|---|---|
| Fragmented workflow | Planning, messaging, promotion, and tracking happen across disconnected tools. | Organisers lose time copying data, checking updates, and manually reconciling information. |
| Manual venue discovery | Hosts search online, compare suitability, and contact venues one by one. | Event planning starts slowly and venue decisions are hard to compare. |
| Manual vendor outreach | Catering, AV, photography, and other suppliers require repetitive outreach and follow-up. | Hosts spend time drafting similar messages and tracking responses manually. |
| Marketing burden | Small hosts often lack time or design confidence to create consistent promotional assets. | Events receive less attention and feel less polished. |
| Scattered attendee coordination | Updates and questions live across external messaging channels. | Attendees miss information and community engagement is difficult to build. |
| Ticketing-first competitors | Existing platforms often focus on listings, RSVPs, and payments. | Organisers still need separate tools to actually operate the event. |
| Language barriers | Events increasingly involve multicultural attendees, vendors, sponsors, and media audiences. | Organisers struggle to localise emails, posts, announcements, chat messages, and media captions quickly. |

### Key Insight

The gap is not only event discovery or ticketing. The real unmet need is an AI-assisted operating workspace that helps hosts prepare, coordinate, promote, and manage the operational work behind an event.

## 3. Goals & Non-Goals

### Goals

- Provide a warm, social public event discovery experience for browsing, RSVPing, and joining event communities.
- Enable a new host to create an event brief from natural language and receive AI-generated planning recommendations.
- Provide an organiser workspace for venue leads, vendor leads, outreach drafts, marketing assets, attendee management, and operations tracking.
- Use real AI API calls for reasoning, recommendations, copy generation, outreach drafting, response summarisation, and marketing prompt generation.
- Use Exa as the public web discovery and research layer for venue leads, vendor leads, sponsor prospects, comparable events, local community signals, and campaign research, with source URLs preserved for review.
- Use ChatGPT Image 2 for event poster, social creative, and campaign image generation, with saved variants tied to the event workspace.
- Use GPT-5.5 for multilingual translation workflows across community chat, organiser emails, event media captions/subtitles, and promotional copy.
- Use AI inside attendee operations to populate mailing lists, segment RSVP/contact audiences, craft reminders, translate communications, and prepare scheduled email sends.
- Support approval-based campaign distribution so organisers can send approved emails and publish approved ads through configured provider integrations.
- Use seeded venue, vendor, attendee, and conversation data to simulate a realistic MVP without requiring live vendor integrations.
- Support Supabase authentication, database storage, storage buckets, realtime chat, and role-based access control.
- Keep the UX warm, social, welcoming, AI-native, and community-driven while final Google Stitch designs are refined.

### Non-Goals

- No autonomous payment handling in MVP.
- No fully autonomous AI actions such as sending emails, publishing ads, spending ad budget, or negotiating with vendors without user approval.
- No autonomous vendor or venue email sending in MVP; venue/vendor outreach remains draft-first unless a future provider integration is explicitly approved by the user.
- No guarantee that discovered venue/vendor leads have live availability, final pricing, or confirmed contact details until the organiser verifies them.
- No autonomous ad spend optimisation or production-grade campaign optimisation in MVP.
- No enterprise analytics or complex CRM workflows in MVP.
- No advanced budget optimisation, sponsorship matching, or post-event intelligence in MVP.
- No requirement to finalise exact visual mockups before Google Stitch design work is complete.
- No legally certified translation, medical/legal interpretation, or replacement for professional human translators in high-risk contexts.
- No automatic translation or transformation of private uploaded media without explicit user action and consent.

## 4. User Personas

| Persona | Profile | Jobs To Be Done | Pain Points | Success Looks Like |
|---|---|---|---|---|
| First-Time Event Host | Someone hosting a meetup, dinner, workshop, or small community event for the first few times. | Turn an idea into a structured event plan, find suitable options, promote the event, and coordinate attendees. | Unsure where to start, overwhelmed by tools, lacks templates and confidence. | Creates and publishes a credible event with clear next steps in one workspace. |
| Community Organiser | Runs recurring gatherings for a hobby, creator audience, professional network, or local group. | Reuse planning patterns, coordinate vendors, grow attendance, and maintain community engagement. | Repetitive logistics and scattered attendee communication. | Launches repeatable events faster and keeps discussions centralised. |
| Attendee | Wants to discover interesting local experiences and join social gatherings. | Browse events, understand the vibe, RSVP, ask questions, receive updates, and connect with others. | Event details are scattered and communities disappear after RSVP. | Finds relevant events and participates in one coherent event space. |
| Small Team Host | A small business, club, or informal group hosting workshops, pop-ups, or networking sessions. | Coordinate event operations without adopting a heavy enterprise event platform. | Existing tools are either too lightweight for operations or too complex for small events. | Manages a simple but professional event workflow without enterprise overhead. |

## 5. Product Architecture

Gatherly is composed of five primary layers: the public discovery experience, the organiser workspace, the Supabase application backend, the Exa discovery layer, and the AI co-organiser layer.

### 5.1 Layer Overview

| Layer | Purpose | MVP Responsibilities |
|---|---|---|
| Public Discovery Layer | Social-facing experience for browsing and joining events. | Landing page, explore page, event detail pages, RSVP flow, event discussion preview, community positioning. |
| Organiser Workspace | Mission control for event operations. | Event creation, dashboard, venue leads, vendor leads, marketing generation, attendees, community chat, mock operations timeline. |
| Supabase Backend | Auth, database, storage, realtime, and row-level security. | User accounts, organiser/attendee roles, event records, RSVPs, seeded leads, generated outputs, chat messages, asset storage. |
| Exa Discovery Layer | Public web research layer for sourced lead discovery and market context. | Venue/vendor lead discovery, source retrieval, comparable event research, sponsor prospect discovery, campaign research grounding, seeded fallback support. |
| AI Co-Organiser Layer | Reasoning and generation layer across workflows. | Event planning, recommendations, source-backed venue/vendor ranking, outreach drafts, summaries, marketing copy, poster/video prompts. |

### 5.2 Recommended MVP Stack

| Area | Technology | Requirement |
|---|---|---|
| Frontend | Vue 3 + Vite | Build a responsive single-page app with public and organiser routes. |
| Styling | TailwindCSS | Implement design principles and final Google Stitch visual direction when available. |
| Backend | Supabase | Use hosted Supabase for authentication, Postgres, storage, realtime, and RLS. |
| AI Reasoning | OpenAI GPT-5.5 or configured equivalent | Generate plans, drafts, summaries, rankings, copy, and structured recommendations. |
| Image Generation | ChatGPT Image 2 via OpenAI image generation provider adapter | Generate event posters, social visuals, thumbnail concepts, and campaign image variants from event context and brand constraints. Implementation should map this product requirement to the currently supported OpenAI image model alias, such as `gpt-image-1.5` or `chatgpt-image-latest`, if required by the API. |
| Translation Intelligence | GPT-5.5 via text and realtime-capable OpenAI APIs | Translate chat messages, organiser emails, captions, media transcripts, event descriptions, and announcements between supported languages while preserving tone, intent, and event context. |
| Web Research & Lead Discovery | Exa Search API + Exa Contents API | Search the public web for venue/vendor/sponsor/event-market leads, retrieve clean page content or summaries, preserve source URLs, and pass structured candidates to GPT-5.5 for ranking. Seeded data remains available for demos and fallback states. |
| Email & Reminder Sending | Resend, SendGrid, Gmail API, or provider adapter | Send organiser-approved attendee reminders, invites, announcements, and campaign emails. Use simulation mode when provider keys are not configured. |
| Ads & Campaign Publishing | Meta Ads, Google Ads, social export, or provider adapter | Prepare and publish organiser-approved campaign assets and ad drafts where integrations are configured; otherwise export publish-ready assets and metadata. |
| Maps/Places | Optional or deferred | Google Maps/Places can enrich address, map, and business metadata later. Exa handles source-backed public web discovery in the MVP. |

### 5.3 AI Co-Organiser Model

The AI co-organiser is the operational intelligence layer of Gatherly. It does not replace the organiser. It prepares drafts, comparisons, summaries, and recommendations for review.

MVP AI responsibilities:

- Convert a natural-language event idea into a structured event brief.
- Recommend event planning steps based on event type, audience size, budget, location, and vibe.
- Generate Exa search queries from the event brief and retrieve public venue/vendor/sponsor/event-market candidates with source URLs.
- Extract and normalise source-backed lead details such as name, category, public description, likely location, contact page, indicative pricing claims, amenities, and confidence level.
- Rank seeded or Exa-discovered venue leads against organiser requirements.
- Rank seeded or Exa-discovered vendor leads against event needs, budget, dietary requirements, and service type.
- Draft outreach messages for venues and vendors.
- Summarise simulated replies and suggest follow-up drafts.
- Generate promotional copy, social captions, email invites, poster copy, campaign concepts, and ChatGPT Image 2 visual-generation prompts/assets.
- Translate organiser emails, attendee messages, announcements, media captions, and promotional copy into user-selected languages.
- Provide per-message or per-thread community translation so attendees can read other participants' messages in their own language.
- Build attendee mailing lists from RSVPs, imported contacts, guest types, check-in state, ticket/payment placeholders, and organiser-created segments.
- Draft and schedule attendee reminders, last-call emails, pre-event instructions, post-event follow-ups, and targeted announcements for organiser approval.
- Convert selected venues, selected vendors, event details, and generated images into a full campaign plan with channels, copy, visuals, promo video direction, and publish-ready ad assets.
- Maintain a clear approval-based workflow where user review is required before any external-facing action.

### 5.4 Human-In-The-Loop Workflow

| Step | System Behaviour | User Control |
|---|---|---|
| Draft | AI generates a recommendation, message, summary, or marketing asset. | User can accept, edit, regenerate, or discard. |
| Source Review | Exa-discovered leads display source URLs, retrieval timestamp, confidence notes, and missing fields. | User can open sources, verify details, hide weak leads, or convert a candidate into a saved lead. |
| Review | UI highlights assumptions, missing details, and suggested next actions. | User confirms what should be used. |
| Approval | MVP stores the approved draft, marks it ready, or executes an approved send/publish action through a configured provider. | No external communication, reminder, ad, or budget action happens without explicit organiser approval. |
| Simulated Response | Seeded vendor/venue conversation data can simulate replies for demo workflows. | User can continue the simulated thread or move to another workflow. |

## 6. MVP Scope

### Included In MVP

- Public landing page with Gatherly positioning and event discovery entry points.
- Explore page with seeded events, categories, search, and filters.
- Event detail pages with event information, host profile, RSVP flow, attendee list preview, and event discussion.
- Supabase auth with organiser and attendee roles.
- Organiser dashboard with event cards, setup checklist, operational timeline, and AI next actions.
- AI event creation flow from natural-language event description.
- Venue lead suggestions using Exa public web discovery, seeded fallback data, and AI ranking.
- Vendor lead suggestions using Exa public web discovery, seeded fallback data, and AI ranking.
- Source review for discovered venue/vendor leads, including source URLs, retrieval timestamp, confidence notes, and missing data warnings.
- AI-generated outreach drafts and follow-up drafts.
- Simulated venue/vendor conversations for product demonstration.
- Marketing generation for social captions, email invites, ad copy, poster copy, campaign concepts, and ChatGPT Image 2 poster/social image variants.
- Full Marketing Studio workflow that uses the event description, selected venue, selected vendors, target audience, and generated visuals to produce a campaign plan, channel plan, email sequence, ad copy, and promotion video direction.
- GPT-5.5 translation for email drafts, community chat messages, event descriptions, announcements, and media captions/transcripts.
- Attendee management with RSVP status, ticket/payment placeholders, check-in status, AI mailing-list population, audience segments, reminder drafting, scheduled sends, and export-ready table structure.
- Approval-based attendee email/reminder sending through a configured provider, with simulation mode for demos.
- Approval-based campaign publishing/export for ads and social channels, with integration mode where provider credentials are available.
- Community chat using Supabase Realtime.

### Excluded From MVP

- Google Places, paid business directories, and private vendor databases as required dependencies; Exa public web discovery is the MVP live research layer.
- Confirmed venue availability, guaranteed vendor pricing, and verified booking inventory.
- Real payment collection, refunds, or financial reconciliation.
- Automatic email sending, reminder sending, ad publishing, or budget spend without organiser approval.
- Production-grade campaign budget optimisation, automated ad bidding, and advanced attribution reporting.
- Autonomous vendor negotiation or autonomous approval of external actions.
- Advanced event CRM, segmentation, lifecycle marketing, or enterprise reporting.
- Native mobile apps.

## 7. Functional Requirements

| ID | Requirement | Description | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FR-01 | Public Landing Page | Present Gatherly's value proposition, sample event discovery, and AI co-organiser positioning. | P0 | Visitor understands the product in under 30 seconds and can navigate to explore or sign up. |
| FR-02 | Explore Events | Users can browse seeded events by category, location text, date, and interest. | P0 | Explore page renders event cards, search/filter controls, and empty states. |
| FR-03 | Event Detail Page | Each event has a detail page with title, host, time, location, description, schedule, attendee preview, and RSVP CTA. | P0 | User can view full details and start RSVP from the event page. |
| FR-04 | RSVP Flow | Authenticated attendees can RSVP to seeded or created events. | P0 | RSVP creates or updates an attendee record and reflects status in event details. |
| FR-05 | Supabase Auth | Users can sign up, log in, log out, and access role-specific areas. | P0 | Unauthenticated users are blocked from organiser workspace and RSVP persistence. |
| FR-06 | Role Model | Users can act as organiser, attendee, or both. | P0 | Organiser-only workflows are protected by ownership or role checks. |
| FR-07 | AI Event Creation | Organiser describes an event idea using type, city, budget, capacity, date, and vibe. | P0 | AI returns a structured event brief, suggested checklist, risks, and next actions. |
| FR-08 | Organiser Dashboard | Organiser sees active events, setup progress, AI recommendations, attendee counts, and operations status. | P0 | Dashboard gives a clear next step for each event. |
| FR-09 | Venue Lead Suggestions | System shows seeded and/or Exa-discovered venue leads ranked by AI against the event brief. | P0 | Each venue includes suitability score, pros/cons, estimated fit, source indicator, and outreach CTA. |
| FR-10 | Vendor Lead Suggestions | System shows seeded and/or Exa-discovered vendor leads by category such as catering, AV, photography, decor, and facilitation. | P0 | Each vendor includes fit summary, estimated budget compatibility, source indicator, and outreach CTA. |
| FR-11 | Outreach Drafting | AI drafts venue/vendor outreach messages based on event context and selected lead. | P0 | Draft can be edited, regenerated, saved, or marked approved; no live send occurs. |
| FR-12 | Simulated Conversations | Demo vendor/venue replies can be displayed and summarised by AI. | P0 | User can view a thread, request summary, and generate follow-up draft. |
| FR-13 | Marketing Studio Campaign Generation | AI generates campaign concepts, captions, email invites, poster copy, ad copy, creative direction, channel strategy, and publishing plan from event details, selected venue, selected vendors, and target audience. | P0 | User can generate a full campaign plan, save selected outputs, and see which assets are ready, missing, or awaiting approval. |
| FR-14 | Attendee Management | Organiser can view attendees, RSVP status, payment placeholder, check-in status, mailing-list eligibility, reminder status, and export-ready fields. | P1 | Table supports search/filter, event-level attendee counts, segment selection, and selected attendee actions. |
| FR-15 | Community Chat | Event participants can post and read event chat messages. | P1 | Messages appear in realtime for users with access to the event. |
| FR-16 | AI Approval States | Generated outputs have status: draft, edited, approved, archived. | P1 | UI makes it clear that AI suggestions require human approval. |
| FR-17 | Event Publishing | Organiser can publish an event from draft to public discovery. | P1 | Published events appear on Explore; drafts remain private. |
| FR-18 | Seed Data Mode | MVP includes seeded users, events, venues, vendors, attendees, and conversations. | P1 | Demo environment can be reset or reseeded consistently. |
| FR-19 | Asset Storage | Saved marketing assets and generated text outputs are associated with an event. | P1 | Organiser can revisit saved generated outputs. |
| FR-20 | Responsive Layout | Public pages and key workspace screens work on desktop and mobile. | P2 | Core flows are usable at common desktop and mobile widths. |
| FR-21 | ChatGPT Image 2 Visual Generation | Organiser can generate poster, social thumbnail, and event hero image variants from event context. | P1 | User can create at least three visual variants, preview them, save one or more to the event, and regenerate with edited direction. |
| FR-22 | Email & Outreach Translation | Organiser can translate vendor outreach, attendee announcements, invite emails, and follow-up drafts into selected languages. | P1 | User can select source and target language, preview translated text, edit output, and save approved translation as an AI output. |
| FR-23 | Community Message Translation | Attendees can translate individual chat messages or view a translated thread in their preferred language. | P1 | Translated message view preserves the original message, clearly labels the translated version, and does not overwrite stored source text. |
| FR-24 | Media Caption Translation | Organiser can upload or paste media transcript/caption text and generate translated subtitles, captions, or social copy. | P2 | User can generate translated captions for at least one target language and export/copy the result for media publishing. |
| FR-25 | AI Mailing List Builder | System can populate mailing lists from RSVP records, imported contacts, guest type, attendance status, language preference, and organiser-defined segments. | P1 | Organiser can create a list such as confirmed attendees, VIPs, waitlist, no-shows, or unpaid guests and preview recipients before sending. |
| FR-26 | AI Reminder & Email Drafting | AI drafts reminder emails, pre-event instructions, event updates, last-call messages, post-event follow-ups, and targeted attendee announcements. | P1 | Organiser can generate, edit, translate, approve, schedule, and send or simulate sending an attendee email/reminder. |
| FR-27 | Approval-Based Email Sending | Approved attendee communications can be sent through a configured email provider or marked as simulated in demo mode. | P1 | System requires explicit organiser approval, displays recipient count, logs send status, and never sends drafts automatically. |
| FR-28 | Promo Video Planning & Assembly | Marketing Studio can use generated images, event context, venue/vendor details, and campaign copy to create a short promo video storyboard or assembly plan. | P2 | User can generate scene order, captions, image selections, timing, and export-ready guidance for a 15-45 second promo video. |
| FR-29 | Approval-Based Ad Publishing | Marketing Studio can prepare publish-ready ad assets and, where integrations are configured, publish approved campaigns to ad/social channels. | P2 | User can preview channel, copy, image/video asset, targeting summary, budget placeholder, and approval state before export or publish. |
| FR-30 | Exa Lead Discovery | Organiser can run public web discovery for venues, vendors, sponsor prospects, comparable events, or local community signals using Exa. | P1 | User can submit an event-aware discovery request and receive structured candidates with source URLs, retrieval timestamp, confidence notes, and missing fields. |
| FR-31 | Source-Backed Lead Review | Exa-discovered candidates can be reviewed, saved, hidden, or converted into venue/vendor lead records. | P1 | Saved candidates preserve source metadata, generated summary, source freshness, and organiser verification status. |
| FR-32 | Campaign Research Grounding | Marketing Studio can use Exa research to surface comparable events, audience hooks, local search signals, and sponsor/community opportunities. | P2 | Campaign output can cite research inputs internally and show organiser-facing notes about which assumptions came from public web sources. |

## 8. Non-Functional Requirements

### Performance

- Public landing and explore pages should reach interactive state within 3 seconds on a typical broadband connection.
- Organiser dashboard should load initial event state within 3 seconds after authentication.
- AI text generation should begin showing a loading or streaming state within 1 second of request submission.
- AI generation requests should target completion within 20 seconds for typical event planning, outreach, and marketing prompts.
- Realtime chat messages should appear for connected clients within 2 seconds under normal conditions.

### Security & Privacy

- Supabase Row Level Security must protect user profiles, organiser workspaces, event drafts, generated outputs, RSVPs, and chat messages.
- Users can only modify events they own or have organiser access to.
- Attendees can only view and post in chat for events they have access to.
- AI prompts must avoid sending unnecessary personal data.
- Translation prompts must preserve original source text and avoid silently rewriting meaning, claims, dates, prices, or event logistics.
- Media translation workflows must require explicit user action before uploading or processing transcripts, captions, or media-derived text.
- API keys for OpenAI, Exa, Supabase service roles, image-generation providers, realtime providers, and future integrations must never be exposed in frontend code.
- Exa discovery queries must avoid sending unnecessary attendee personal data, private chat content, or confidential organiser notes.
- Exa-sourced results must show source URLs and should be treated as public research, not verified contractual facts.
- All AI-generated external communications must remain drafts until the organiser explicitly approves a send, publish, export, or simulation action.

### Reliability

- AI failure should return a user-readable fallback message and allow retry.
- If AI APIs are unavailable, the UI should preserve user input and show previously saved generated outputs.
- If Exa is unavailable, rate-limited, or returns weak results, venue/vendor workflows should fall back to seeded data and clearly label the fallback state.
- Seed data should be deterministic enough for demos and tests.
- Realtime chat should degrade gracefully to manual refresh if subscription fails.

### Accessibility

- All primary controls require visible labels or accessible names.
- Keyboard navigation must support public browsing, event RSVP, and key dashboard actions.
- Colour must not be the only indicator for status, role, or priority.
- Text contrast should meet WCAG AA for body text and controls.

### Scalability

- MVP data model should support multiple events per organiser and multiple organisers per event later, even if collaboration is limited in v1.
- Venue/vendor lead storage should support migration from seeded data to live search results.
- Discovery records should support multiple providers over time, including Exa, Google Places, private vendor directories, and manually imported leads.
- AI workflow records should preserve prompt context, output type, status, and associated event so future analytics can measure usage.

## 9. Interface Specifications

### 9.1 Public Pages

| Surface | Requirements |
|---|---|
| Landing Page | Warm hero, one-line value proposition, example events, AI co-organiser explanation, organiser CTA, attendee CTA, social proof placeholders. |
| Explore Page | Event cards, category filters, search, date filter, city/location text filter, interest tags, empty state, loading state. |
| Event Detail Page | Event summary, host section, schedule, location, attendee preview, RSVP CTA, community discussion preview, related events. |
| RSVP Modal/Page | Auth gate, RSVP confirmation, optional attendee note, confirmation state, link into event chat. |

### 9.2 Organiser Workspace

| Surface | Requirements |
|---|---|
| Workspace Home | Event list, setup status, AI next actions, draft/published distinction, create event CTA. |
| AI Event Builder | Natural-language input, structured follow-up fields, generated event brief, checklist, risk notes, save as draft. |
| Event Operations Dashboard | Progress checklist, timeline, attendee count, venue/vendor status, marketing status, chat activity, recommended next actions. |
| Venue Workspace | Exa discovery controls, seeded fallback venue leads, source review, AI fit ranking, comparison table, outreach draft generation, simulated reply summary. |
| Vendor Workspace | Vendor categories, Exa discovery controls, seeded fallback leads, source review, AI fit ranking, quote placeholder, outreach drafts, follow-up drafts. |
| Marketing Workspace | Campaign strategy, generated images, Exa-backed campaign research notes, channel plan, invite email, social captions, ad copy, poster copy, promo video plan, publish/export controls, saved variants. |
| Discovery Review | Search query history, discovered sources, confidence state, missing-field warnings, save/hide actions, source freshness, provider metadata. |
| Attendee Workspace | RSVP table, mailing lists, AI segments, reminder drafts, scheduled sends, status filters, check-in placeholder, payment placeholder, export-ready attendee fields. |
| Community Workspace | Event chat, announcements, participant messages, per-message translation, moderation basics. |
| Translation Tools | Language selector, translate action, translated preview, original/source toggle, approval/save state. |

### 9.3 AI Workflow Interfaces

Each AI workflow should store:

- Event ID.
- Workflow type.
- User input or selected lead ID.
- Prompt context summary.
- Generated output.
- Output status.
- Created by user ID.
- Created timestamp.

AI workflow types:

- `event_plan`
- `discovery_query`
- `lead_discovery`
- `source_summary`
- `campaign_research`
- `venue_rank`
- `vendor_rank`
- `outreach_draft`
- `reply_summary`
- `follow_up_draft`
- `marketing_campaign`
- `social_caption`
- `email_invite`
- `poster_copy`
- `creative_prompt`
- `image_generation`
- `campaign_plan`
- `campaign_publish_plan`
- `promo_video_plan`
- `mailing_list_segment`
- `attendee_reminder`
- `scheduled_email`
- `email_translation`
- `message_translation`
- `announcement_translation`
- `media_caption_translation`

### 9.4 Recommended Data Model

| Table | Purpose | Key Fields |
|---|---|---|
| profiles | Public user profile and role metadata. | id, name, avatar_url, bio, city, role_flags |
| events | Event records for public discovery and organiser workspace. | id, organiser_id, title, description, city, venue_text, starts_at, status, category, capacity, vibe, budget_range |
| rsvps | Attendee registration records. | id, event_id, user_id, status, attendee_note, check_in_status, payment_status |
| attendee_contacts | Event contact records for attendees and imported guests. | id, event_id, user_id, email, phone, name, source, consent_status, language_preference |
| mailing_lists | Organiser-approved recipient lists and AI-generated segments. | id, event_id, name, criteria_json, recipient_count, created_by, status |
| scheduled_messages | Approved attendee emails/reminders and send status. | id, event_id, mailing_list_id, subject, body, channel, scheduled_for, send_status, provider_message_id |
| discovery_queries | Exa or future provider search requests created from event context. | id, event_id, provider, query_text, query_type, filters_json, status, created_by, created_at |
| discovery_results | Raw and structured public web discovery results. | id, query_id, provider_result_id, title, url, snippet, retrieved_text_summary, image_url, favicon_url, published_date, confidence_score, created_at |
| lead_sources | Source metadata attached to saved venue/vendor/sponsor leads. | id, lead_type, lead_id, discovery_result_id, source_url, source_title, source_summary, retrieved_at, verification_status |
| communities | Optional grouping around hosts or event series. | id, owner_id, name, description, city |
| event_messages | Realtime event chat. | id, event_id, user_id, message, message_type, created_at |
| message_translations | Cached message translations by language. | id, message_id, source_language, target_language, translated_text, model, created_by |
| venue_leads | Seeded or Exa-discovered venue leads. | id, city, name, category, capacity_range, estimated_price, amenities, contact_placeholder, source_type, verification_status |
| vendor_leads | Seeded or Exa-discovered vendor leads. | id, city, name, category, estimated_price, services, dietary_tags, contact_placeholder, source_type, verification_status |
| lead_threads | Simulated venue/vendor conversations. | id, event_id, lead_type, lead_id, status, latest_summary |
| lead_messages | Simulated messages in lead conversations. | id, thread_id, sender_type, body, created_at |
| ai_outputs | Saved AI generations. | id, event_id, workflow_type, input_summary, output_json, status, created_by |
| marketing_assets | Saved generated marketing content. | id, event_id, asset_type, title, content, storage_path, status |
| marketing_campaigns | Saved campaign plans and publishing workflow state. | id, event_id, campaign_name, objective, channels, status, approved_by |
| ad_publish_jobs | Approval-based ad/social publishing jobs or export records. | id, event_id, campaign_id, channel, asset_id, copy, targeting_json, budget_placeholder, status |
| promo_video_plans | Storyboards and assembly plans for promotional videos. | id, event_id, campaign_id, scene_json, asset_ids, duration_seconds, status |
| media_translation_jobs | Translation jobs for captions, transcripts, and media-derived text. | id, event_id, source_type, source_language, target_language, source_text, translated_text, status |

### 9.5 Google Stitch Design System & Colour Scheme

The current Google Stitch source of truth is the `Gatherly AI Event Orchestrator` project, last updated `2026-05-07T17:09:53.574639Z`. The Stitch theme is `LIGHT`, uses `PLUS_JAKARTA_SANS` for headline, body, and label typography, and is based on a warm social palette with a custom seed colour of `#FF6B4A`.

#### Core Colour Usage

| UI Role | Stitch Token | Hex Code | Usage Guidance |
|---|---|---|---|
| Brand accent / warm coral | `customColor` / `primary_container` | `#FF6B4A` | Use for accents, icons, highlights, AI glow, and non-text decorative emphasis. Avoid white text on this colour for normal-size labels because contrast is weak. |
| Primary CTA / text-bearing primary | `primary` / `surface_tint` | `#AE3115` | Use for primary buttons, active nav states, important links, and actions that need white text. |
| Primary hover / strong emphasis | `on_primary_fixed_variant` | `#8C1900` | Use for primary hover/pressed states and strong brand emphasis. |
| Main app background | `background` / `surface` | `#FCF9F8` | Default warm off-white page background. |
| Raised white surface | `surface_container_lowest` | `#FFFFFF` | Cards, modals, popovers, and high-priority content containers. |
| Soft section background | `surface_container_low` | `#F6F3F2` | Page bands, dashboard regions, quiet secondary sections. |
| Neutral container | `surface_container` | `#F0EDED` | Low-emphasis containers, input backgrounds, skeleton surfaces. |
| Strong body text | `on_surface` / `on_background` | `#1B1C1C` | Primary readable text. |
| Secondary text | `on_surface_variant` | `#59413C` | Descriptions, metadata, captions, helper text. |
| Border / divider | `outline_variant` | `#E1BFB8` | Warm low-emphasis borders and dividers. |
| Strong outline | `outline` | `#8D716A` | Form borders, focused low-emphasis controls, chart lines. |
| AI delight / warm highlight | `tertiary_container` / `tertiary_fixed` | `#BFAA5A` / `#FAE28B` | AI suggestion highlights, delight states, soft callouts. Avoid white text on these colours. |
| Error | `error` | `#BA1A1A` | Error messages, failed generation states, destructive warnings only. |
| Error container | `error_container` | `#FFDAD6` | Error banners and validation backgrounds. |

#### Full Stitch Named Colour Tokens

| Token | Hex Code |
|---|---|
| `background` | `#FCF9F8` |
| `error` | `#BA1A1A` |
| `error_container` | `#FFDAD6` |
| `inverse_on_surface` | `#F3F0F0` |
| `inverse_primary` | `#FFB4A3` |
| `inverse_surface` | `#303030` |
| `on_background` | `#1B1C1C` |
| `on_error` | `#FFFFFF` |
| `on_error_container` | `#93000A` |
| `on_primary` | `#FFFFFF` |
| `on_primary_container` | `#661000` |
| `on_primary_fixed` | `#3D0600` |
| `on_primary_fixed_variant` | `#8C1900` |
| `on_secondary` | `#FFFFFF` |
| `on_secondary_container` | `#67645C` |
| `on_secondary_fixed` | `#1D1C15` |
| `on_secondary_fixed_variant` | `#49473F` |
| `on_surface` | `#1B1C1C` |
| `on_surface_variant` | `#59413C` |
| `on_tertiary` | `#FFFFFF` |
| `on_tertiary_container` | `#4B3E00` |
| `on_tertiary_fixed` | `#221B00` |
| `on_tertiary_fixed_variant` | `#544600` |
| `outline` | `#8D716A` |
| `outline_variant` | `#E1BFB8` |
| `primary` | `#AE3115` |
| `primary_container` | `#FF6B4A` |
| `primary_fixed` | `#FFDAD2` |
| `primary_fixed_dim` | `#FFB4A3` |
| `secondary` | `#615E56` |
| `secondary_container` | `#E7E2D7` |
| `secondary_fixed` | `#E7E2D7` |
| `secondary_fixed_dim` | `#CAC6BC` |
| `surface` | `#FCF9F8` |
| `surface_bright` | `#FCF9F8` |
| `surface_container` | `#F0EDED` |
| `surface_container_high` | `#EAE7E7` |
| `surface_container_highest` | `#E4E2E1` |
| `surface_container_low` | `#F6F3F2` |
| `surface_container_lowest` | `#FFFFFF` |
| `surface_dim` | `#DCD9D9` |
| `surface_tint` | `#AE3115` |
| `surface_variant` | `#E4E2E1` |
| `tertiary` | `#6E5D14` |
| `tertiary_container` | `#BFAA5A` |
| `tertiary_fixed` | `#FAE28B` |
| `tertiary_fixed_dim` | `#DCC672` |

#### Frontend Implementation Notes

- Use `#AE3115` for primary buttons with white text; do not use `#FF6B4A` as a normal text-bearing button background.
- Use `#FF6B4A` as the brand accent for icons, badges, low-opacity gradients, AI glow, illustrations, and visual emphasis.
- Keep large app surfaces warm and quiet with `#FCF9F8`, `#FFFFFF`, `#F6F3F2`, and `#F0EDED`.
- Use `#1B1C1C` and `#59413C` for readable text hierarchy; avoid lighter beige/grey values for body copy.
- Reserve `#BA1A1A` and `#FFDAD6` strictly for error and failed-generation states so they do not compete with brand CTAs.

## 10. AI Prompting & Workflow Requirements

### Event Planning Prompt

Input:

- Event type.
- City or target area.
- Audience description.
- Capacity.
- Budget range.
- Date or rough timing.
- Desired vibe.
- Constraints such as dietary, accessibility, age, or equipment needs.

Output:

- Structured event brief.
- Recommended planning checklist.
- Venue requirements.
- Vendor requirements.
- Marketing angle.
- Risks and missing information.
- Suggested next action.

### Exa Discovery & Source-Grounded Research Workflow

Input:

- Event brief, city or target area, audience size, budget, date, vibe, and accessibility or dietary constraints.
- Discovery target such as venue, catering vendor, AV vendor, photographer, sponsor prospect, comparable event, local community, or campaign research.
- Search constraints such as source type, geography, recency, category, minimum capacity, price range, and excluded sources.

Exa retrieval behaviour:

- Generate event-aware public web search queries.
- Use Exa Search for relevant public webpages and Exa Contents for clean page text, summaries, highlights, images, favicons, and source metadata where available.
- Store source URL, title, snippet, retrieval timestamp, provider metadata, and generated source summary.
- Avoid sending private attendee data, private chat messages, or confidential organiser notes into discovery queries.

Output:

- Structured candidate list.
- Source-backed summary for each result.
- Confidence score and missing-field warnings.
- Suggested lead type and category.
- Recommended organiser verification steps.
- Suggested outreach angle if the candidate is saved as a lead.

### Venue Ranking Prompt

Input:

- Event brief.
- Seeded or Exa-discovered venue lead list.
- Capacity, budget, vibe, location, amenities, accessibility needs.
- Source summaries, confidence scores, and verification status when available.

Output:

- Ranked venue list.
- Suitability score.
- Pros and cons.
- Budget fit.
- Source quality and missing-field notes.
- Outreach recommendation.
- Questions to ask the venue.

### Vendor Ranking Prompt

Input:

- Event brief.
- Vendor category.
- Seeded or Exa-discovered vendor lead list.
- Budget and service needs.
- Source summaries, confidence scores, and verification status when available.

Output:

- Ranked vendor list.
- Fit summary.
- Budget compatibility.
- Risks.
- Source quality and missing-field notes.
- Outreach recommendation.
- Follow-up questions.

### Marketing Generation Prompt

Input:

- Event title.
- Audience.
- Vibe.
- Venue/location context.
- Selected venue details, including location, capacity, aesthetic, amenities, and pricing assumptions.
- Selected vendor details, including catering, AV, decor, photography, entertainment, or facilitation options.
- Host/community identity.
- Desired channels.
- Available generated images and approved visual assets.
- Optional Exa campaign research, such as comparable local events, audience hooks, sponsor/community opportunities, and public venue/vendor positioning signals.

Output:

- Campaign concept.
- Full campaign plan with objective, target audience, positioning, timeline, and channel mix.
- 3 social captions.
- 1 email invite.
- Reminder email sequence.
- Short ad copy variants.
- Poster headline and body copy.
- ChatGPT Image 2-ready visual direction for poster, event hero, and social image generation.
- Saved image-generation prompt and editable creative constraints.
- Promo video storyboard using generated images, selected venue/vendor context, captions, and suggested timing.
- Publishing checklist showing what is ready, missing, approved, scheduled, or already sent.
- Research notes that distinguish AI assumptions from Exa-sourced public web inputs.

### ChatGPT Image 2 Generation Prompt

Input:

- Event title, category, date, city, and venue context.
- Audience and event vibe.
- Brand colours and Stitch design-token constraints.
- Required format such as event poster, hero image, square social post, or story creative.
- Copy that must appear in the image, if any.
- Accessibility constraints such as readable text, high contrast, and avoiding clutter.

Output:

- 3 visual directions.
- Image-generation prompt per direction.
- Suggested aspect ratio and channel.
- Safety/brand notes.
- Generated image asset reference when available.
- Regeneration controls based on organiser edits.

### Promo Video Campaign Prompt

Input:

- Approved campaign concept.
- Generated images from ChatGPT Image 2.
- Event title, audience, date, venue, vendor highlights, and host/community identity.
- Desired runtime, such as 15, 30, or 45 seconds.
- Desired format, such as vertical short-form video, square social post, or widescreen promo.
- Required text overlays and CTA.

Output:

- Scene-by-scene storyboard.
- Recommended image/video asset per scene.
- Text overlay per scene.
- Voiceover or caption script.
- Suggested pacing and duration per scene.
- Export notes for social channels.
- Publish-readiness checklist.

### Attendee Communication Prompt

Input:

- Event details and schedule.
- Attendee segment or mailing list criteria.
- RSVP, check-in, waitlist, guest type, payment placeholder, and language preference data.
- Communication goal, such as reminder, last call, logistics update, post-event follow-up, or waitlist notice.
- Desired tone and target language.

Output:

- Recommended recipient segment.
- Email subject and body.
- Short SMS/push-style variant when needed.
- Translated variant when requested.
- Suggested send time.
- Personalisation fields.
- Safety notes for dates, venue, prices, and logistics requiring organiser review.

### Campaign Publishing Prompt

Input:

- Approved campaign plan.
- Approved generated images or promo video plan.
- Channel selection, such as email, Instagram, TikTok, LinkedIn, Meta Ads, Google Ads, or manual export.
- Target audience summary.
- Budget placeholder and timing.

Output:

- Channel-specific copy and creative pairing.
- Targeting summary.
- Send/publish checklist.
- Missing requirement warnings.
- Approval state.
- Provider payload preview or export-ready asset package.

### GPT-5.5 Translation Prompt

Input:

- Source text, chat message, email draft, announcement, transcript, or caption text.
- Source language when known, otherwise auto-detect.
- Target language.
- Event context such as audience, host tone, location, date, and logistics.
- Translation style: literal, natural, formal, casual, marketing, or community-friendly.

Output:

- Translated text.
- Detected source language.
- Notes for ambiguous phrases, idioms, cultural references, dates, or event logistics.
- Optional short/localised variant for captions or social posts.
- Original/source preservation metadata.

## 11. Implementation Plan

| Phase | Name | Deliverables | Duration |
|---|---|---|---|
| P1 | Foundation & Design Shell | Vue/Vite/Tailwind project, routing, Supabase setup, auth, base layout, design-token placeholders aligned with Stitch direction. | Week 1 |
| P2 | Public Discovery | Landing page, explore page, event detail page, RSVP flow, seeded public events. | Week 2 |
| P3 | Organiser Workspace Core | Workspace home, AI event builder, event dashboard, event status model, seeded demo reset. | Week 3 |
| P4 | AI Operations & Discovery Workflows | Real AI API integration for event plans, Exa lead discovery, venue/vendor ranking, source summaries, outreach drafts, marketing generation, ChatGPT Image 2 visual generation, campaign planning, promo video planning, and GPT-5.5 translation over seeded and Exa-discovered data. | Week 4 |
| P5 | Attendees, Campaign Distribution & Community | Attendee table, AI mailing lists, reminder drafting, scheduled sends, campaign publish/export workflow, Supabase Realtime chat, announcement basics, per-message translation, and translated announcement previews. | Week 5 |
| P6 | Polish, QA & Demo Readiness | Error states, loading states, responsive pass, RLS review, demo data, acceptance testing, README/setup notes. | Week 6 |

## 12. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Event creation completion | 80% of test users can create a draft event without assistance. | Usability test task completion. |
| Time to first event plan | Under 2 minutes from workspace entry. | Product analytics or timed manual test. |
| AI draft usefulness | 70% of generated outreach/marketing drafts rated usable with light edits. | Manual review by target users. |
| Exa lead discovery relevance | 70% of discovered venue/vendor candidates are rated relevant enough to save, hide, or contact after organiser review. | Manual QA across seeded target cities and event types. |
| Source traceability | 95% of Exa-discovered saved leads preserve source URL, retrieval timestamp, and verification status. | Database QA and lead card review. |
| Image generation usefulness | 60% of generated poster/social image variants rated usable as a starting point. | Manual review by organisers against brand and event fit. |
| Campaign plan completeness | 80% of generated plans include audience, channels, image usage, email sequence, ad copy, video direction, and publishing checklist. | Product QA against campaign output rubric. |
| Attendee reminder readiness | 80% of generated reminder emails require only light edits before approval. | Manual review by organisers. |
| Translation usefulness | 80% of translated emails/messages/captions rated understandable and tone-appropriate by bilingual reviewers or target users. | Manual review across selected language pairs. |
| RSVP completion | 90% of users can RSVP to a public event. | Usability test task completion. |
| Demo reliability | Seeded demo flow completes without blocking errors. | QA script across public and organiser flows. |
| Chat responsiveness | Messages appear within 2 seconds. | Manual or automated realtime test. |
| Workspace clarity | 80% of users can identify the next recommended organiser action. | Usability test prompt. |

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI output feels generic | Users may not trust recommendations. | Include structured event context, seeded leads, constraints, and clear regeneration/editing controls. |
| Simulated data feels fake | Demo may not feel credible. | Use realistic event, venue, vendor, and attendee examples across several cities and event types. |
| Scope creep from live integrations | MVP delivery may slow down. | Keep integrations provider-adapter based, support simulation/export mode, and require explicit approval for any real send or publish action. |
| Visual direction changes after Stitch | UI implementation may need redesign. | Use flexible design tokens and component structure; PRD locks principles, not exact visuals. |
| Supabase RLS mistakes | Users may access data they should not. | Treat RLS as a P0 implementation requirement and test organiser/attendee boundaries. |
| AI API cost or latency | Generation may become slow or expensive. | Log workflow type and usage, use concise prompts, cache saved outputs, and provide retry/fallback states. |
| Exa search results are incomplete, stale, or irrelevant | Venue/vendor recommendations may mislead users or reduce trust. | Display source URLs, retrieval timestamps, confidence notes, missing-field warnings, and organiser verification status; fall back to seeded leads when live discovery is weak. |
| Public web discovery includes noisy or low-quality sources | Users may see irrelevant directories, outdated event pages, or duplicate businesses. | Use query constraints, source deduplication, result hiding, category filters, and AI summarisation that separates confirmed facts from inferred details. |
| Generated images may be off-brand or contain unusable text | Marketing assets could look unprofessional or require manual correction. | Provide strict brand/style prompts, allow regeneration/editing, store prompt history, and require organiser approval before publishing. |
| Translation errors may change meaning | Misstated logistics, prices, times, or vendor commitments could harm trust. | Preserve source text, show translation confidence/notes, require review for outbound communications, and flag dates/prices/names for verification. |
| Incorrect recipient segmentation | Reminders or announcements may be sent to the wrong audience. | Show recipient count and criteria before send, require approval, support test sends, and log recipient list snapshots. |
| Ad publishing creates spend risk | Users may accidentally launch campaigns or spend budget. | Require explicit publish confirmation, show budget/channel summary, default to export/simulation mode, and keep provider integrations permission-gated. |
| Community chat moderation gaps | Public chat can create trust issues. | MVP includes basic event-scoped access and announcement controls; advanced moderation is future scope. |

## 14. Open Questions

- Should Gatherly support organiser collaboration in v1, or should every event have exactly one owner for MVP?
- Should attendees be required to create an account before RSVP, or can guest RSVP be added after the authenticated MVP is stable?
- Which official OpenAI image-generation model alias should be used in production for the ChatGPT Image 2 requirement if the API exposes a different model name?
- Which languages should be supported in the first translation demo set?
- Should media translation in MVP accept uploaded files, pasted transcripts/captions only, or both?
- Which email provider should be the default for attendee reminder sending: Resend, SendGrid, Gmail API, or a provider-agnostic adapter?
- Should ad publishing be live in MVP for configured providers, or start as export/simulation with live publishing in V1.1?
- Which promo video output should be supported first: storyboard only, editable asset sequence, or generated rendered video?
- Which Exa plan, quota, and rate-limit profile should be assumed for demos and early production?
- Which Exa discovery categories should ship first: venues, vendors, sponsors, comparable events, or campaign research?
- Should Gatherly enrich Exa-discovered leads with Google Places or another structured business data provider in V1.1?
- Which event categories should seed the initial demo: meetups, workshops, dinners, creator events, hackathons, wellness, pop-ups, or all of them?
- What Google Stitch design tokens should become canonical once the visual design is finalised?

## Appendix A — Technology Stack Summary

| Area | MVP Choice | Notes |
|---|---|---|
| Frontend | Vue 3 | Component-based web app. |
| Build Tool | Vite | Fast local development and production builds. |
| Styling | TailwindCSS | Design tokens to be updated from Google Stitch direction. |
| Auth | Supabase Auth | Email/password or magic link depending on final implementation preference. |
| Database | Supabase Postgres | Events, users, RSVPs, leads, AI outputs, chat. |
| Realtime | Supabase Realtime | Event community chat and live updates. |
| Storage | Supabase Storage | Marketing assets and user-uploaded media when needed. |
| AI Reasoning | OpenAI GPT-5.5 or configured equivalent | Event planning, ranking, drafting, summarisation, copy generation, and translation orchestration. |
| Image Generation | ChatGPT Image 2 via OpenAI image generation provider adapter | Poster, event hero, social creative, and campaign image generation. Implementation should map to the current OpenAI image-generation model alias supported by the API. |
| Realtime Translation | GPT-5.5 plus OpenAI realtime/text APIs | Community message translation, translated announcements, email localisation, media transcript/caption translation, and future live multilingual support. |
| Web Discovery | Exa Search API + Exa Contents API | Public web discovery for venue/vendor/sponsor leads, comparable event research, source summaries, campaign grounding, and source-backed lead records. |
| Email & Reminders | Resend, SendGrid, Gmail API, or provider adapter | Approval-based attendee reminder sending, invite emails, announcements, post-event follow-ups, and simulation mode. |
| Ads & Social Publishing | Meta Ads API, Google Ads API, social export, or provider adapter | Approval-based ad/social publishing or export-ready campaign packages. |
| Maps/Places | Optional or deferred | Google Maps/Places can enrich map/address/business metadata later; Exa is the MVP web discovery layer. |

## Appendix B — Future Roadmap

### V1.1

- Google Places or structured business-data enrichment on top of Exa-discovered venue/vendor leads.
- Expanded campaign analytics for email opens, clicks, ad performance, and attendee conversion.
- Guest RSVP support.
- Export attendees to CSV.
- More robust marketing asset generation.

### V1.2

- Organiser collaboration and team roles.
- Budget tracking and recommendation improvements.
- AI FAQ helper for event pages.
- Conversation summaries for event chat.
- Post-event recap and feedback collection.

### V2

- Sponsorship matchmaking.
- AI networking recommendations.
- Automated schedule generation.
- Advanced vendor negotiation assistance.
- Paid tickets and payment reconciliation.
- Post-event analytics and community growth insights.

## Final Positioning Statement

Gatherly is an AI-powered social event operating system that helps people move from event idea to execution through Exa-powered lead discovery, AI-assisted venue sourcing, vendor outreach, marketing generation, attendee management, and community coordination.

Gatherly_PRD.md — v1.0
