# Lunch Finder Design Specification

**Date:** 2026-05-07
**Status:** Approved
**Topic:** Lunch Finder PWA

## Overview
A web application (PWA) that helps users find nearby lunch spots quickly. It uses the user's precise location to fetch and display restaurants sorted by distance or rating, with a focus on ease of use and immediate action.

## Core Features
1. **Precise Geolocation:** Uses the browser's Geolocation API to get the user's current coordinates.
2. **Search with Location Bias:** Integrates with the Google Places API (searchNearby, New) to find up to 50 specific food and drink place types near the user. Uses `locationRestriction` with a 1000m radius. Strictly limits results to 20 locations.
3. **Sorting:** Results can be sorted by distance (default) or rating via a dropdown control.
4. **"Open Now" Display:** Each restaurant card shows an "OPEN NOW" or "CLOSED" badge based on current opening hours. All restaurants are displayed regardless of open status.
5. **"More Info" Link:** Each card has a "MORE INFO" button that links directly to the restaurant's `googleMapsUri`, giving users quick access to reviews, menus, and contact info within Google Maps.
6. **"Surprise Me" Mode:** A randomizer mode that picks a single restaurant from the results. Users can re-roll with "PICK AGAIN" or switch to the full list with "VIEW ALL".
7. **PWA Support:** Manifest, service worker, and screenshots for richer install UI on both desktop and mobile. Workbox runtime caching for Places API responses (NetworkFirst, 5-minute TTL).

## User Experience & Design
- **Visual Style:** Neobrutalism (Bold & Playful).
- **Theme:** High contrast, thick borders, bright yellow/red accents (`#FFF9E6` background, `#FFD700` header, `#FF4B2B` progress/accents).
- **Typography:** Bold, heavy headings (Arial Black or similar).
- **Interaction:** Two entry points — "FIND LUNCH" for the full list, "SURPRISE ME" for a random pick. Chunky buttons and cards with box shadows. The header and controls container are sticky to remain visible during scrolling.

## Architecture
- **Frontend:** React (TypeScript) for component-based UI.
- **Styling:** Vanilla CSS for maximum flexibility and neobrutalism implementation.
- **Data Fetching:** Client-side requests to Google Places API (searchNearby, New) with a maximum of 20 results.
- **State Management:** React Hooks (useState, useEffect, useMemo) for location, restaurant data, sort order, and surprise mode.

## Data Model
The `Restaurant` interface includes:
- `id`, `name`, `address`, `lat`, `lng`, `distance`
- `rating?`, `openNow?`

## Tech Stack
- **Framework:** Vite + React + TypeScript
- **CSS:** Vanilla CSS
- **API:** Google Places API (searchNearby, New)
- **PWA:** vite-plugin-pwa with Workbox
- **Testing:** Vitest + React Testing Library
- **License:** Apache 2.0

## Testing Strategy
- **Unit Tests:** Component rendering and data formatting.
- **Integration Tests:** Geolocation handling and API response mapping.
- **E2E Tests:** Verification of the "Find Lunch" flow.
