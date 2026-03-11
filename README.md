# 25 Today (Static Site)

This is a tiny, static birthday site: a coffin timer counting down to local midnight, scattered 2001 nostalgia cards, confetti, and a click-to-start birthday bop (WebAudio; no external audio files).

## Customize

- Name: add `?name=Kuba`
- Date of birth: add `?dob=2001-03-11` (format: `YYYY-MM-DD`)

Example:

`/index.html?name=Kuba&dob=2001-03-11`

## Run locally

If you just double-click `index.html`, most things work, but clipboard copy and WebAudio can be picky in some browsers.

Better: serve it locally:

- Node: `npx serve` (then open the printed URL)
- Python: `python -m http.server 5173` (then open `http://localhost:5173/birthday-25/`)

## Free hosting options

### Option A: GitHub Pages (free)

1. Create a new GitHub repo (public is simplest).
2. Put the contents of this folder (`birthday-25/`) at the repo root.
3. Push to `main`.
4. GitHub repo settings:
   - Settings -> Pages
   - Build and deployment -> Deploy from a branch
   - Branch: `main` / folder: `/ (root)`
5. Your site goes live at the Pages URL.

### Option B: Netlify Drop (free)

1. Go to Netlify and use Deploy manually (drag-and-drop).
2. Drag the `birthday-25/` folder contents (or zip them).
3. Netlify gives you a live URL instantly.

### Option C: Cloudflare Pages (free)

1. Create a Pages project from a GitHub repo.
2. No build command; output directory is the repo root.
