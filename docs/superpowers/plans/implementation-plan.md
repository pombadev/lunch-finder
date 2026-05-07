# Implementation Plan - Lunch Finder PWA

**Project:** Lunch Finder
**Status:** Completed
**Date:** 2026-05-07

## Phase 1: Foundation & Setup
- [x] **Task 1: Initialize Project**
  - [x] Use Vite to create a React + TypeScript project.
  - [x] Cleanup boilerplate.
  - [x] **Verification:** `npm run dev` starts correctly.
- [x] **Task 2: Global Styles (Neobrutalism)**
  - [x] Set up `index.css` with neobrutalism foundations (thick borders, bold colors, heavy shadows).
  - [x] Define CSS variables for the color palette (`#FFF9E6`, `#FFD700`, `#FF4B2B`).
  - [x] **Verification:** App shows a neobrutalistic "Hello World".

## Phase 2: Core Logic (TDD)
- [x] **Task 3: Geolocation Hook**
  - [x] Write tests for a `useGeolocation` hook.
  - [x] Implement hook using `navigator.geolocation`.
  - [x] **Verification:** Hook returns coordinates or error.
- [x] **Task 4: Places API Service**
  - [x] Write tests for fetching restaurants.
  - [x] Implement service using Google Places API (Text Search, New) with pagination (up to 60 results).
  - [x] Fetch fields: id, displayName, formattedAddress, rating, currentOpeningHours, location, websiteUri, nationalPhoneNumber.
  - [x] **Verification:** Mock API response maps correctly to our internal types.

## Phase 3: UI Components (TDD)
- [x] **Task 5: Header Component**
  - [x] Bold, yellow background, black border.
  - [x] **Verification:** Displays title and logo.
- [x] **Task 6: Restaurant Card Component**
  - [x] Thick borders, distance badge, rating badge, "Open Now" / "Closed" status badge.
  - [x] "MORE INFO" button linking to Google Search for the restaurant.
  - [x] **Verification:** Renders data correctly with neobrutal styling.
- [x] **Task 7: Main List & State Orchestration**
  - [x] Combine geolocation and search logic.
  - [x] Sort by distance (default) or rating via dropdown.
  - [x] "FIND LUNCH" button for the full list.
  - [x] "SURPRISE ME" button for random restaurant pick with "PICK AGAIN" and "VIEW ALL".
  - [x] Loading states, error handling, and "SHOW MORE" pagination.
  - [x] **Verification:** Users can see nearby restaurants upon permission.

## Phase 4: PWA & Final Polish
- [x] **Task 8: PWA Manifest & Service Worker**
  - [x] Setup `vite-plugin-pwa` with `devOptions: { enabled: true }` for dev testing.
  - [x] Configure icons (192x192, 512x512, maskable) from favicon.svg.
  - [x] Add screenshots for richer install UI (wide + narrow form factors).
  - [x] Configure Workbox runtime caching for Places API (NetworkFirst, 5-min TTL).
  - [x] Add PWA meta tags to index.html (theme-color, apple-touch-icon, apple-mobile-web-app).
  - [x] **Verification:** App is installable with richer install UI on desktop and mobile.
- [x] **Task 9: Final Verification**
  - [x] Full E2E check.
  - [x] Accessibility check (high contrast should help).
