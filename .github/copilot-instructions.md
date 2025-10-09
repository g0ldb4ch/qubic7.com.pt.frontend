# Copilot Instructions for AI Agents

## Project Overview
This is a Vue 3 + Vite + Pinia + Tailwind CSS frontend for a penetration testing project manager. The app manages projects, subdomains, tech stacks, and vulnerabilities, communicating with a backend via a REST API (proxied to `localhost:3000`).

## Key Architecture
- **Vue 3 Composition API** is used throughout (`.vue` files, `script setup`).
- **Pinia** is used for state management. Stores are in `src/stores/` (e.g., `projects.js`).
- **API communication** is centralized in `src/services/api.js` using Axios. All API calls use `/api` as the base URL (see Vite proxy config).
- **Component structure:**
  - Views in `src/views/` (e.g., `Dashboard.vue`)
  - Reusable components in `src/components/`
- **Routing** is handled by Vue Router (`src/router/index.js`).
- **Styling** uses Tailwind CSS (`src/assets/main.css`).

## Developer Workflows
- **Start dev server:** `npm run dev` (Vite, port 5173)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **API requests** are automatically proxied to the backend (`localhost:3000`) via Vite's proxy config.

## Project-Specific Patterns
- **API Layer:** All API calls are grouped by domain (projects, subdomains, tech stacks, vulnerabilities) in `src/services/api.js`. Use these abstractions in stores and components.
- **Store Usage:** State and async actions (fetch, create, update, delete) are managed in Pinia stores (see `src/stores/projects.js` for patterns).
- **Error Handling:** Errors from API calls are caught and set on the store's `error` property, which is displayed in the UI.
- **Modals:** Modal dialogs for create/edit are implemented as components (e.g., `ProjectModal.vue`).
- **UI Feedback:** Loading and error states are handled in the UI (see `Dashboard.vue`).

## Integration Points
- **Backend:** All data is fetched from/sent to a backend REST API. No direct DB access.
- **No test scripts** are defined in `package.json` (add if needed).

## Conventions
- Use `@` as an alias for `src/` in imports (see Vite config).
- Use Composition API (`script setup`) in Vue SFCs.
- Keep business logic in Pinia stores, not components.
- Use centralized API layer for all HTTP requests.

## Examples
- To fetch all projects: `projectsStore.fetchProjects()` (calls API, updates store, triggers UI update)
- To add a project: open `ProjectModal`, submit, then call `projectsStore.createProject()`

---

For more details, see `src/services/api.js`, `src/stores/`, and `src/views/` for usage patterns.
