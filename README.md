# Where's my lunch?

Can't decide where to eat? Where's my lunch? grabs your location and shows you what's nearby — sorted by distance or popularity. It's a PWA, so you can slap it on your home screen and use it like a native app.

## What it does

- Uses your browser's geolocation to find restaurants around you
- Sort by distance or popularity (API-ranked)
- "Surprise Me" mode picks a random spot for you
- Installable as a PWA on mobile and desktop

## Stack

- React 19 + TypeScript
- Vite
- Google Places API (Places API New / `searchNearby`)
- Vanilla CSS (neobrutalist style)
- Vitest + React Testing Library

## Setup

You'll need a [Google Places API key](https://developers.google.com/maps/documentation/places/web-service/get-api-key). Create a `.env` file:

```
VITE_GOOGLE_PLACES_API_KEY=your_key_here
```

Then:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and click "Find Lunch".

## Tests

```bash
npm test
```

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
