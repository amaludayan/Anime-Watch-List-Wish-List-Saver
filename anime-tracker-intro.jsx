import React, { useEffect, useRef, useState } from "react";

/*
  月鑑 — GEKKAN
  Cinematic intro inspired by Wuthering Waves loading screens.
  Signature element: a horizontal "seal band" — an ink-jade bar that
  sweeps across the frame and fills with the loading percentage, with
  a glowing kanji emblem burning brighter as progress climbs.
*/

const THEME = {
  dark: {
    bg: "#121212",
    bg2: "#161613",
    ink: "#e9e6db",
    inkDim: "#8c8a80",
    hairline: "rgba(233,230,219,0.09)",
    hairlineStrong: "rgba(233,230,219,0.16)",
    jade: "#4fae8a",
    jadeBright: "#8fe6c4",
    sandal: "#c9a876",
    band1: "#0d3b30",
    band2: "#3a8f6d",
    band3: "#0a241d",
    danger: "#a23b34",
  },
  light: {
    bg: "#f1ead9",
    bg2: "#ece2cc",
    ink: "#241f16",
    inkDim: "#83786357".slice(0, 7),
    hairline: "rgba(36,31,22,0.10)",
    hairlineStrong: "rgba(36,31,22,0.20)",
    jade: "#2f7d5e",
    jadeBright: "#1f5c44",
    sandal: "#a9793f",
    band1: "#bcd8c6",
    band2: "#79b596",
    band3: "#d8e8dc",
    danger: "#a23b34",
  },
};

function useTicker(active, duration = 3400) {
  const [pct, setPct] = useState(0);
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.7 ? t / 0.7 * 0.82 : 0.82 + (t - 0.7) / 0.3 * 0.18;
      setPct(Math.min(100, Math.round(eased * 100)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, duration]);

  return pct;
}

function FrameLines({ c }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    >
      <g stroke={c.hairline} strokeWidth="1" fill="none">
        <line x1="800" y1="0" x2="800" y2="330" />
        <line x1="800" y1="570" x2="800" y2="900" />
        <path d="M760 60 h30 v40 h-25 v60 h20 M840 60 h-30 v40 h25 v60 h-20" />
        <path d="M690 210 h60 v20 h40 M850 210 h-60 v20 h-40" />
        <rect x="720" y="500" width="160" height="70" />
        <path d="M700 570 v40 M900 570 v40" />
        <circle cx="510" cy="360" r="14" />
        <path d="M496 360 h28 M510 346 v28" />
        <circle cx="1090" cy="360" r="14" />
        <path d="M1076 360 h28 M1090 346 v28" />
        {[0, 1].map((side) => {
          const dir = side === 0 ? -1 : 1;
          const ox = 800 + dir * 60;
          return (
            <g key={side}>
              <path d={`M${ox} 40 v100 h${dir * 60} v60 h${dir * 40} v50`} />
              <path d={`M${ox + dir * 120} 250 h${dir * 90} v-70 h${dir * 30}`} />
              <path d={`M${ox - dir * 10} 640 v70 h${dir * 100} v40`} />
              <path d={`M${ox + dir * 180} 300 v120 h${dir * 60}`} />
              <rect x={ox + dir * 40 - (side === 0 ? 30 : 0)} y="150" width="30" height="18" />
              <rect x={ox + dir * 260 - (side === 0 ? 30 : 0)} y="420" width="22" height="34" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function Emblem({ c, pct }) {
  const glow = 0.25 + (pct / 100) * 0.85;
  return (
    <svg
      viewBox="0 0 120 150"
      width="86"
      height="108"
      style={{
        filter: `drop-shadow(0 0 ${6 + glow * 14}px ${c.jadeBright}) drop-shadow(0 0 ${2 + glow * 6}px ${c.ink})`,
        transition: "filter 120ms linear",
      }}
      aria-hidden="true"
    >
      <g fill="none" stroke={c.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
         style={{ opacity: 0.55 + glow * 0.45 }}>
        <path d="M60 8 C52 26 46 34 34 42 C22 50 16 64 20 80 C24 96 18 112 8 122" />
        <path d="M60 8 C58 24 60 34 70 44 C80 54 84 66 80 80" />
        <path d="M60 8 L60 40" />
        <path d="M40 46 C48 52 56 54 66 52 C78 50 88 54 94 64" />
        <path d="M40 46 C36 62 40 76 52 86 C40 92 30 104 30 118" />
        <path d="M66 52 C70 66 66 80 54 90 C64 96 70 108 68 122" />
        <path d="M94 64 C98 78 94 92 82 100 C90 108 92 118 86 128" />
        <path d="M52 86 C58 90 66 90 72 86" />
      </g>
      <g fill={c.jadeBright} style={{ opacity: 0.5 + glow * 0.5 }}>
        <circle cx="86" cy="58" r="1.6" />
        <circle cx="92" cy="64" r="1.1" />
        <circle cx="80" cy="52" r="1.1" />
      </g>
    </svg>
  );
}

function GlyphColumn({ c, chars, style }) {
  return (
    <div
      style={{
        writingMode: "vertical-rl",
        color: c.inkDim,
        fontSize: 12,
        letterSpacing: 4,
        fontFamily: "'Noto Serif JP', serif",
        opacity: 0.5,
        ...style,
      }}
      aria-hidden="true"
    >
      {chars}
    </div>
  );
}

function IntroScreen({ theme, onDone }) {
  const c = THEME[theme];
  const [active, setActive] = useState(true);
  const pct = useTicker(active);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pct >= 100 && !leaving) {
      setLeaving(true);
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
  }, [pct, leaving, onDone]);

  const bandFill = pct;

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: c.bg,
        transition: "opacity 700ms ease, background 400ms ease",
        opacity: leaving ? 0 : 1,
      }}
    >
      <FrameLines c={c} />

      {/* vertical seam */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${c.hairlineStrong}, transparent)`,
        }}
      />

      <GlyphColumn c={c} chars="千載一瞬" style={{ position: "absolute", left: "50%", top: 40, transform: "translateX(-50%)" }} />
      <GlyphColumn c={c} chars="蒐集録" style={{ position: "absolute", left: "50%", bottom: 96, transform: "translateX(-50%)" }} />

      {/* seal band */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 84,
          transform: "translateY(-50%)",
          overflow: "hidden",
          background: `linear-gradient(180deg, ${c.band3}, ${c.bg} 130%)`,
          borderTop: `1px solid ${c.hairlineStrong}`,
          borderBottom: `1px solid ${c.hairlineStrong}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${bandFill}%`,
            transition: "width 90ms linear",
            background: `linear-gradient(90deg, ${c.band1}, ${c.band2} 55%, ${c.jade})`,
            backgroundSize: "220% 100%",
            backgroundPosition: `${100 - bandFill}% 0`,
            boxShadow: `0 0 24px 2px ${c.jade}55 inset`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.18), transparent 45%)",
          }}
        />
        <div className="absolute left-[31%] top-1/2 -translate-y-1/2" style={{ opacity: 0.5 }}>
          <SealMark c={c} />
        </div>
        <div className="absolute right-[31%] top-1/2 -translate-y-1/2" style={{ opacity: 0.5 }}>
          <SealMark c={c} />
        </div>
      </div>

      {/* emblem centered on band */}
      <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
        <Emblem c={c} pct={pct} />
      </div>

      {/* percentage + progress dots */}
      <div className="absolute left-1/2 flex flex-col items-center" style={{ top: "63%", transform: "translateX(-50%)" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            letterSpacing: 2,
            color: c.ink,
            fontWeight: 500,
          }}
        >
          {pct}%
        </div>
        <div className="mt-4 grid grid-cols-3 gap-[3px]" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 4,
                height: 4,
                background: i / 9 * 100 < pct ? c.jade : c.hairlineStrong,
                transition: "background 200ms ease",
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 11,
            letterSpacing: 3,
            color: c.inkDim,
          }}
        >
          記録を読み込み中
        </div>
      </div>

      <div
        className="absolute left-1/2 flex items-center gap-2"
        style={{ bottom: 54, transform: "translateX(-50%)", fontSize: 10, color: c.inkDim, letterSpacing: 2 }}
      >
        <span style={{ width: 5, height: 5, borderRadius: 9999, background: c.danger }} />
        <span style={{ fontFamily: "'Noto Serif JP', serif" }}>月鑑 · GEKKAN ARCHIVE</span>
      </div>
    </div>
  );
}

function SealMark({ c }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <g fill={c.ink} opacity="0.7">
        <rect x="0" y="0" width="7" height="7" />
        <rect x="9" y="0" width="7" height="7" />
        <rect x="0" y="9" width="7" height="7" />
        <rect x="9" y="9" width="7" height="7" />
      </g>
    </svg>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const dark = theme === "dark";
  const c = THEME[theme];
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      className="fixed top-5 right-5 z-50 flex items-center"
      style={{
        width: 58,
        height: 30,
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
          width: 22,
          height: 22,
          borderRadius: 999,
          background: c.jade,
          transform: dark ? "translateX(0px)" : "translateX(28px)",
          transition: "transform 260ms cubic-bezier(.4,0,.2,1), background 300ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: dark ? c.bg : "#fff",
        }}
      >
        {dark ? "月" : "日"}
      </span>
    </button>
  );
}

function MainApp({ theme, setTheme }) {
  const c = THEME[theme];
  const shows = [
    { title: "Frieren: Beyond Journey's End", ep: "18 / 28", status: "watching", tag: "秋" },
    { title: "Vinland Saga S2", ep: "24 / 24", status: "completed", tag: "完" },
    { title: "Mushishi", ep: "3 / 26", status: "watching", tag: "続" },
    { title: "Ping Pong the Animation", ep: "0 / 11", status: "planned", tag: "予" },
  ];
  return (
    <div
      className="min-h-screen w-full transition-colors duration-500"
      style={{ background: c.bg, color: c.ink, fontFamily: "'Zen Kaku Gothic New', sans-serif" }}
    >
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <div className="flex items-baseline justify-between border-b pb-6" style={{ borderColor: c.hairlineStrong }}>
          <div>
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 12, letterSpacing: 3, color: c.inkDim }}>
              GEKKAN ARCHIVE
            </div>
            <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 32, marginTop: 4 }}>月鑑</h1>
          </div>
          <div style={{ fontSize: 12, color: c.inkDim, letterSpacing: 1 }}>32 works tracked</div>
        </div>

        <div className="mt-10 grid gap-3">
          {shows.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4"
              style={{
                border: `1px solid ${c.hairline}`,
                background: c.bg2,
                borderRadius: 2,
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 15,
                    color: c.jade,
                    width: 20,
                    textAlign: "center",
                  }}
                >
                  {s.tag}
                </span>
                <div>
                  <div style={{ fontSize: 15 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: c.inkDim, marginTop: 2 }}>{s.status}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: c.inkDim }}>{s.ep}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [introDone, setIntroDone] = useState(false);

  return (
    <div style={{ minHeight: "100vh" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      {!introDone && <IntroScreen theme={theme} onDone={() => setIntroDone(true)} />}
      <MainApp theme={theme} setTheme={setTheme} />
    </div>
  );
}
