# mindhunter

A dark, cinematic movies & TV shows discovery app built with **Next.js 16** and powered by the **TMDB API**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TMDB](https://img.shields.io/badge/TMDB-API-01b4e4)

## Features

- **Home** — trending movies & TV, top 10 this week, now playing, critics' favorites, airing today
- **Browse** — filter by genre, sort, and paginate through the full TMDB catalog ([/movies](src/app/movies/page.js), [/tv](src/app/tv/page.js))
- **Search** — instant multi-search across movies and TV shows with type filters ([/search](src/app/search/page.js))
- **Detail pages** — backdrop hero, trailer modal, cast, seasons & episodes browser, similar titles, and **Where to Watch** (streaming providers)
- **Person pages** — biography, known-for credits, and directing work for any cast member ([/person/[id]](src/app/person/[id]/page.js))
- **Mood Picker** — pick a mood (laugh, thrill, cry, think…) and get a curated mix instead of plain genres ([/mood](src/app/mood/page.js))
- **Movie Night Duel** — can't decide? Titles battle head-to-head until one survives ([/duel](src/app/duel/page.js))
- **My Library** — wishlist, favorites, and watch-later lists persisted locally ([/my-list](src/app/my-list/page.js))
- **TMDB sign-in** — optional OAuth-style login that **syncs your favorites & watchlist with your real TMDB account**

## Tech Stack

| Layer     | Tools                                                        |
| --------- | ------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack, Server Components)        |
| UI        | React 19, Tailwind CSS 4, shadcn-style components, lucide-react |
| Data      | TMDB API v3 (Bearer token auth, server-side fetching, ISR)   |
| State     | React Context + localStorage (library), httpOnly cookies (auth) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The TMDB read-access token currently lives in [src/lib/tmdb.js](src/lib/tmdb.js). For production, move it to an `.env.local` file:
>
> ```
> TMDB_READ_TOKEN=your_token_here
> ```

## Project Structure

```
src/
├── app/
│   ├── page.js              # Home
│   ├── movies/ tv/          # Browse pages
│   ├── movie/[id]/ tv/[id]/ # Detail pages
│   ├── person/[id]/         # Cast/crew pages
│   ├── search/ mood/ duel/  # Discovery experiences
│   ├── my-list/             # User library
│   └── api/                 # discover, search, mood, season, auth routes
├── components/              # navbar, hero, rows, cards, season browser…
└── lib/
    ├── tmdb.js              # TMDB data layer (fetchers + normalizers)
    ├── library.jsx          # local lists store (+ TMDB sync)
    └── auth.jsx             # TMDB session context
```

## Acknowledgements

This product uses the TMDB API but is not endorsed or certified by TMDB.

