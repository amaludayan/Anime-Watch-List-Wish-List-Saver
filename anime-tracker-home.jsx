import React, { useEffect, useRef, useState, useCallback } from "react";

/*
  月鑑 — GEKKAN home screen
  Live data from the Jikan v4 API (https://api.jikan.moe/v4).
*/

const THEME = {
  dark: {
    bg: "#121212",
    bg2: "#18181b",
    bg3: "#1e1e1c",
    ink: "#e9e6db",
    inkDim: "#8c8a80",
    hairline: "rgba(233,230,219,0.09)",
    hairlineStrong: "rgba(233,230,219,0.18)",
    jade: "#4fae8a",
    jadeBright: "#8fe6c4",
    danger: "#c2564c",
  },
  light: {
    bg: "#f1ead9",
    bg2: "#e9dfc7",
    bg3: "#efe6d2",
    ink: "#241f16",
    inkDim: "#79705d",
    hairline: "rgba(36,31,22,0.10)",
    hairlineStrong: "rgba(36,31,22,0.22)",
    jade: "#2f7d5e",
    jadeBright: "#1f5c44",
    danger: "#a23b34",
  },
};

const API = "https://api.jikan.moe/v4";

function useDebounced(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ThemeToggle({ theme, setTheme, c }) {
  const dark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="fixed top-5 right-5 z-50"
      style={{
        width: 54,
        height: 28,
        borderRadius: 999,
        border: `1px solid ${c.hairlineStrong}`,
        background: c.bg2,
        padding: 3,
        cursor: "pointer",
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      <span
        style={{
          display: "flex",
          width: 20,
          height: 20,
          borderRadius: 999,
          background: c.jade,
          transform: dark ? "translateX(0px)" : "translateX(26px)",
          transition: "transform 240ms cubic-bezier(.4,0,.2,1)",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: dark ? c.bg : "#fff",
        }}
      >
        {dark ? "月" : "日"}
      </span>
    </button>
  );
}

function MenuIcon({ c, open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <g stroke={c.ink} strokeWidth="1.6" strokeLinecap="round">
        <line x1="3" y1="6" x2="19" y2="6" style={{ transition: "transform 200ms", transform: open ? "translateY(2px) rotate(10deg)" : "none", transformOrigin: "center" }} />
        <line x1="3" y1="11" x2="14" y2="11" />
        <line x1="3" y1="16" x2="19" y2="16" style={{ transition: "transform 200ms", transform: open ? "translateY(-2px) rotate(-10deg)" : "none", transformOrigin: "center" }} />
      </g>
      <circle cx="19" cy="11" r="1.4" fill={c.jade} />
    </svg>
  );
}

function GenreMenu({ c, open, genres, selected, onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute z-40"
      style={{
        top: "calc(100% + 10px)",
        left: 0,
        width: 260,
        maxHeight: 360,
        overflowY: "auto",
        background: c.bg2,
        border: `1px solid ${c.hairlineStrong}`,
        borderRadius: 2,
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div
        onClick={() => onSelect(null)}
        style={{
          padding: "10px 16px",
          fontSize: 13,
          cursor: "pointer",
          color: selected === null ? c.jade : c.ink,
          background: selected === null ? c.bg3 : "transparent",
          borderBottom: `1px solid ${c.hairline}`,
        }}
      >
        全て — All genres
      </div>
      {genres.map((g) => (
        <div
          key={g.mal_id}
          onClick={() => onSelect(g)}
          style={{
            padding: "10px 16px",
            fontSize: 13,
            cursor: "pointer",
            color: selected?.mal_id === g.mal_id ? c.jade : c.ink,
            background: selected?.mal_id === g.mal_id ? c.bg3 : "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.bg3)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = selected?.mal_id === g.mal_id ? c.bg3 : "transparent")
          }
        >
          {g.name}
        </div>
      ))}
    </div>
  );
}

function Pagination({ c, page, lastPage, onPage }) {
  if (!lastPage || lastPage <= 1) return null;
  const pages = [];
  const window = 1;
  for (let p = 1; p <= lastPage; p++) {
    if (p === 1 || p === lastPage || Math.abs(p - page) <= window) pages.push(p);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap mt-14 mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{
          width: 32,
          height: 32,
          fontSize: 13,
          color: page === 1 ? c.inkDim : c.ink,
          background: "transparent",
          border: `1px solid ${c.hairline}`,
          cursor: page === 1 ? "default" : "pointer",
          opacity: page === 1 ? 0.4 : 1,
        }}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} style={{ width: 32, textAlign: "center", color: c.inkDim, fontSize: 13 }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            style={{
              width: 32,
              height: 32,
              fontSize: 13,
              color: p === page ? c.bg : c.ink,
              background: p === page ? c.jade : "transparent",
              border: `1px solid ${p === page ? c.jade : c.hairline}`,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(Math.min(lastPage, page + 1))}
        disabled={page === lastPage}
        style={{
          width: 32,
          height: 32,
          fontSize: 13,
          color: page === lastPage ? c.inkDim : c.ink,
          background: "transparent",
          border: `1px solid ${c.hairline}`,
          cursor: page === lastPage ? "default" : "pointer",
          opacity: page === lastPage ? 0.4 : 1,
        }}
      >
        ›
      </button>
    </div>
  );
}

function AnimeCard({ c, anime }) {
  const [hover, setHover] = useState(false);
  const img = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 / 3",
          overflow: "hidden",
          background: c.bg2,
          border: `1px solid ${c.hairline}`,
        }}
      >
        {img && (
          <img
            src={img}
            alt={anime.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hover ? "scale(1.04)" : "scale(1)",
              transition: "transform 400ms ease",
              filter: hover ? "brightness(0.7)" : "brightness(1)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            padding: "2px 6px",
            background: "rgba(0,0,0,0.55)",
            color: c.jadeBright,
          }}
        >
          {anime.score ? anime.score.toFixed(1) : "—"}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            padding: 10,
            opacity: hover ? 1 : 0,
            transition: "opacity 250ms ease",
            background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)",
          }}
        >
          <span style={{ fontSize: 11, color: "#e9e6db", fontFamily: "'JetBrains Mono', monospace" }}>
            {anime.type || "—"} · {anime.episodes ?? "?"} ep
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          lineHeight: 1.35,
          color: c.ink,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {anime.title}
      </div>
    </div>
  );
}

function SkeletonCard({ c }) {
  return (
    <div>
      <div style={{ width: "100%", aspectRatio: "2 / 3", background: c.bg2, border: `1px solid ${c.hairline}` }} />
      <div style={{ marginTop: 8, height: 12, width: "80%", background: c.bg2 }} />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const c = THEME[theme];

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 500);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/genres/anime`)
      .then((r) => r.json())
      .then((d) => setGenres((d.data || []).sort((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedGenre]);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    params.set("sfw", "true");
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (selectedGenre) params.set("genres", String(selectedGenre.mal_id));
    if (!debouncedQuery.trim()) params.set("order_by", "popularity");

    try {
      const res = await fetch(`${API}/anime?${params.toString()}`);
      if (!res.ok) throw new Error(`Jikan API returned ${res.status}`);
      const data = await res.json();
      setResults(data.data || []);
      setLastPage(data.pagination?.last_visible_page || 1);
    } catch (e) {
      setError("Couldn't reach the Jikan API. Try again in a moment.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery, selectedGenre]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  return (
    <div
      className="min-h-screen w-full transition-colors duration-500"
      style={{ background: c.bg, color: c.ink, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <ThemeToggle theme={theme} setTheme={setTheme} c={c} />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
        {/* header row: menu — title — spacer */}
        <div className="relative flex items-center" style={{ minHeight: 40 }}>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open genre filter"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${c.hairline}`,
                background: c.bg2,
                cursor: "pointer",
              }}
            >
              <MenuIcon c={c} open={menuOpen} />
            </button>
            <GenreMenu
              c={c}
              open={menuOpen}
              genres={genres}
              selected={selectedGenre}
              onSelect={(g) => {
                setSelectedGenre(g);
                setMenuOpen(false);
              }}
              onClose={() => setMenuOpen(false)}
            />
          </div>

          <div className="flex-1 text-center">
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 12, letterSpacing: 3, color: c.inkDim }}>
              GEKKAN ARCHIVE
            </div>
            <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 28, marginTop: 2 }}>月鑑</h1>
          </div>

          <div style={{ width: 40 }} />
        </div>

        {/* search bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div
            className="flex items-center gap-3 px-4"
            style={{ height: 42, border: `1px solid ${c.hairlineStrong}`, background: c.bg2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke={c.inkDim} strokeWidth="1.4" />
              <line x1="11" y1="11" x2="15" y2="15" stroke={c.inkDim} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: c.ink,
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                style={{ background: "none", border: "none", color: c.inkDim, cursor: "pointer", fontSize: 14 }}
              >
                ×
              </button>
            )}
          </div>
          {selectedGenre && (
            <div className="flex justify-center mt-3">
              <span
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  border: `1px solid ${c.jade}`,
                  color: c.jade,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {selectedGenre.name}
                <span onClick={() => setSelectedGenre(null)} style={{ cursor: "pointer" }}>
                  ×
                </span>
              </span>
            </div>
          )}
        </div>

        {/* error */}
        {error && (
          <div className="mt-10 text-center" style={{ fontSize: 13, color: c.danger }}>
            {error}
          </div>
        )}

        {/* grid */}
        <div
          className="mt-10 grid gap-x-5 gap-y-8"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
        >
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard c={c} key={i} />)
            : results.map((anime) => <AnimeCard c={c} anime={anime} key={anime.mal_id} />)}
        </div>

        {!loading && !error && results.length === 0 && (
          <div className="mt-16 text-center" style={{ fontSize: 13, color: c.inkDim }}>
            No results. Try a different search or genre.
          </div>
        )}

        <Pagination c={c} page={page} lastPage={Math.min(lastPage, 200)} onPage={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} />
      </div>
    </div>
  );
}
