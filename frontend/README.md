# Gatherly Frontend

Frontend-first implementation for the Gatherly MVP. This phase is intentionally static:
no Supabase, AI, Exa, email, or ad-publishing logic is wired yet.

## Stack

- Vue 3
- Vite
- Tailwind CSS v4 plugin
- Custom CSS design tokens based on the current Stitch palette

## Project Layout

- `src/App.vue` - top-level page selection shell.
- `src/components/layout` - app chrome and navigation.
- `src/components/ui` - reusable presentational components.
- `src/data` - mocked events, leads, attendees, and campaign data.
- `src/views/public` - public discovery screens.
- `src/views/workspace` - organiser workspace screens.
- `src/styles` - global design tokens and responsive styling.

## Commands

```bash
npm install
npm run dev
npm run build
```
