# KŌROKU (行録) — Anime Tracker

KŌROKU is a personal, browser-based anime tracker. Search anime, browse by genre, keep a **Watched** list and a **Wish List / Watch Later** shelf, add your own notes, and install it as a PWA on mobile. All data is stored locally in your browser (with import/export support) — nothing is sent to a server.

Anime data is fetched from the [Jikan API](https://jikan.moe/) (an unofficial MyAnimeList API).

## Features
- Light/dark theme toggle (sandal/beige + charcoal black, Japanese-inspired design)
- Home feed with search, genre filter, and paginated browsing (page 1, 2, 3…)
- Anime detail view with background blur
- Floating "+" button to add anime to Watched or Wish List, with optional personal notes on single adds
- Wish List presented as a 3D bookshelf
- Edit mode with bulk delete for Watched/Wish List
- Local-only storage with import/export (JSON)
- Installable as a PWA (mobile & desktop)

## Tech
Single-page HTML/CSS/JS app, Tailwind (CDN), Lucide icons, Jikan API for anime data. No backend, no account system, no tracking.

## Getting Started
1. Clone or download this repo.
2. Open `index.html` in a browser, or serve it locally (e.g. `npx serve`) for full PWA install behavior.
3. That's it — no build step, no API key required.

---

## ⚠️ Disclaimer & Safety Notice

This is a **personal, non-commercial hobby project**, built as an experiment in AI-assisted ("vibe coding") web development. Please read before using or forking:

- **Unofficial third-party API**: This project uses the [Jikan API](https://jikan.moe/), an unofficial API for MyAnimeList (MAL) data. It is **not affiliated with, endorsed by, or supported by MyAnimeList or Jikan's maintainers**. Availability, rate limits, and data accuracy depend entirely on that third-party service and can change or break without notice.
- **No warranty**: This software is provided **"as is"**, without warranty of any kind, express or implied — including but not limited to fitness for a particular purpose, accuracy, or reliability. Use it at your own risk.
- **No liability**: The author is **not responsible** for any data loss, browser storage issues, API downtime/changes, security vulnerabilities, or any other direct or indirect damages resulting from the use, misuse, or inability to use this project.
- **Local data only, your responsibility**: All watched/wish-list data is stored in your browser's local storage. Clearing browser data, uninstalling the browser, or switching devices **will erase your data** unless you've exported it yourself. Regularly use the export feature to back up your data.
- **Not a data host**: This project does not store, back up, or have access to any user data. There is no server component.
- **Copyright**: Anime titles, posters, and metadata belong to their respective copyright holders (studios, publishers, MyAnimeList, etc.). This project only displays data fetched via Jikan for personal reference use and claims no ownership over any anime artwork or information shown.
- **AI-assisted development**: Significant portions of this codebase were generated with AI assistance. It has not undergone professional security auditing. Do not use it to handle sensitive personal data or in any production/commercial context without your own review.

By using or forking this project, you agree that you do so at your own risk and that the author bears no responsibility for any consequences arising from its use.

## License
MIT (or your license of choice) — feel free to fork and modify, but keep the disclaimer above intact if you redistribute.
