# AroundAbout – Tailwind Static

A clean, modern static build with Tailwind (CDN) + vanilla JS.

## Features
- Posts from `assets/posts.json` (title, description, image, tags, optional lat/lng)
- Search (title or tag)
- Likes & Bookmarks via `localStorage`
- Bookmarks page
- Optional Mapbox map (set token in `assets/js/config.js`)

## Deploy (GitHub Pages)
1. Create a public repo (e.g. `aroundabout-tailwind`).
2. Put all files at the repo root (where `index.html` is).
3. Settings → Pages → Deploy from a branch → `main` / `(root)`.
4. Visit your Pages URL.

## Deploy (Netlify)
- No build command. Publish directory: `/` (root).

## Customize
- Edit `assets/posts.json` and add images to `assets/images/`.
- If you later want a build system and components, we can migrate this to Astro + Tailwind in minutes.