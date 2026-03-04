# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native (0.68.2) app for browsing movies using The Movie Database (TMDB) API. TypeScript with strict mode. Spanish localization (`es-ES`).

## Commands

- `npm start` — Start Metro bundler
- `npm run ios` — Run on iOS
- `npm run android` — Run on Android
- `npm run run-development-ios` — Run iOS dev build (iPhone 15 Pro simulator)
- `npm run run-development-android` — Run Android dev build
- `npm test` — Run Jest tests
- `npm run lint` — Run ESLint
- `npm run commit` — Interactive conventional commit (Commitizen)

## Architecture

**Atomic Design components** in `src/components/`:
- `molecules/` — MoviePoster, MovieCastCard
- `organisms/` — MoviesCarrousel, MovieCastCarrousel
- `templates/` — GradientWrapper, MovieDetails

**Data flow:** Screens → Custom Hooks → Services → API (axios) → Adapters (transform response)

- `src/api/api.ts` — Axios instance with TMDB base URL and API key from env
- `src/services/movies.ts` — All TMDB endpoints (now_playing, popular, top_rated, upcoming, details, credits)
- `src/adapters/` — Transform API responses (add image URLs, format currency)
- `src/hooks/` — `useMovies` (home data via Promise.all), `useMovieDetails`, `useFadeAnimation`
- `src/context/gradientContext/` — React Context for animated background gradient colors extracted from movie posters
- `src/screens/` — HomeScreen, DetailScreen (each with co-located custom hooks)

**Navigation:** `@react-navigation/native-stack` with typed params (`RootStackParams`). Two screens: Home → Detail.

## Path Aliases

Configured in both `tsconfig.json` and `babel.config.js`:
`@api`, `@components`, `@constants`, `@hooks`, `@context`, `@interfaces`, `@navigation`, `@screens`, `@services`, `@adapters`, `@helpers`

## Environment Variables

Copy `.env.template` to `.env` with: `API_KEY_TMDB`, `BASE_URL_TMDB`, `BASE_URL_TMDB_IMAGE`. Managed via `react-native-config`.

## Code Style

- Prettier: single quotes, trailing commas, no bracket spacing
- ESLint: `@react-native-community` config + TypeScript
- Conventional commits enforced via commitlint + Husky pre-commit hooks
