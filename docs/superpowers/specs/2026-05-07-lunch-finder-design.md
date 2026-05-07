# Lunch Finder Design Specification

**Date:** 2026-05-07
**Status:** Approved
**Topic:** Lunch Finder PWA

## Overview
A web application (PWA) that helps users find nearby lunch spots quickly. It uses the user's precise location to fetch and display restaurants sorted by distance, with a focus on ease of use and immediate action.

## Core Features
1. **Precise Geolocation:** Uses the browser's Geolocation API to get the user's current coordinates.
2. **Nearby Search:** Integrates with the Google Places API (New) to find restaurants within a configurable radius.
3. **Distance Sorting:** Automatically sorts results by distance from the user.
4. **"Open Now" Filter:** Primarily shows places that are currently open.
5. **Navigation Integration:** Provides direct links to open the location in Google Maps.
6. **PWA Support:** Manifest and service worker for "Add to Home Screen" and offline caching of basic assets.

## User Experience & Design
- **Visual Style:** Neobrutalism (Bold & Playful).
- **Theme:** High contrast, thick borders, bright yellow/red accents (`#FFF9E6` background, `#FFD700` header, `#FF4B2B` progress/accents).
- **Typography:** Bold, heavy headings (Arial Black or similar).
- **Interaction:** One-tap interaction to find food; clear, chunky buttons and cards.

## Architecture
- **Frontend:** React (TypeScript) for component-based UI.
- **Styling:** Vanilla CSS for maximum flexibility and neobrutalism implementation.
- **Data Fetching:** Client-side requests to Google Places API (using a proxy if needed for CORS/API key protection, or standard client-side implementation if appropriate).
- **State Management:** React Hooks (useState, useEffect) for location and restaurant data.

## Tech Stack
- **Framework:** Vite + React + TypeScript
- **CSS:** Vanilla CSS
- **API:** Google Places API (New)
- **Deployment:** Vercel or Netlify (ideal for PWAs)

## Testing Strategy
- **Unit Tests:** Component rendering and data formatting.
- **Integration Tests:** Geolocation handling and API response mapping.
- **E2E Tests:** Verification of the "Find Lunch" flow.
