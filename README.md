# AroundAbout – Static (Functional)

This is a static export that works on GitHub Pages or Netlify. It includes:

- Client-side posts, loaded from `assets/posts.json`
- Search (title + tags)
- Likes and Saves via `localStorage`
- Map with markers using Mapbox GL JS (optional; requires a **public** token)

## Setup Mapbox (optional)
1. Get a public Mapbox access token (pk.*) from https://account.mapbox.com/.
2. Edit `assets/js/config.js` and set:

```js
window.MAPBOX_TOKEN = 'pk.YOUR_TOKEN_HERE';
```

## Add/Edit Content
- Modify `assets/posts.json` to add more posts. Include `"lat"` and `"lng"` for markers.
- Put your images in `assets/images/` and reference the filename in the JSON.

## Deploy to GitHub Pages
1. Create a new **public** repo on GitHub, e.g. `aroundabout-static`.
2. Upload all files in this folder to the repo root (include `index.html` at the root).
3. Commit & push.
4. In GitHub: **Settings → Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `master`) **/** `/ (root)`
5. Wait for the Pages URL to appear (it will look like `https://<your-username>.github.io/aroundabout-static/`).

> If your site is in a subfolder, you may need to set relative links or a `base` tag. This export uses relative links so it should work as-is.

## Deploy to Netlify
- Drag and drop the folder in the Netlify UI, or connect the Git repo.
- **Build command**: *none*
- **Publish directory**: `/` (root)

## Development
No build step is required. Everything is plain HTML/CSS/JS.