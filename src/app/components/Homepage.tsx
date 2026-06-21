import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { BottomNav } from './BottomNav';
import {
  Play, BookOpen, Star, ChevronRight, Sparkles,
  Flame, Trophy, Clock, ThumbsUp, TrendingUp,
} from 'lucide-react';

// ── Shared types ──────────────────────────────────────────────────────────────
interface Movie {
  id: number;
  title: string;
  emoji: string;
  color: string;
  bgLight: string;
  genre: string;
  duration: string;
  rating?: number;
}

// ── Canonical content library (single source of truth for titles + ages) ─────
// 3-5 years
const CONTENT_35: Movie[] = [
  { id: 101, title: 'Omar & Hana',  emoji: '👧', color: '#FFB6C1', bgLight: '#FFE8ED', genre: 'Musical',   duration: '22 min', rating: 5 },
  { id: 102, title: 'Upin & Ipin',  emoji: '👦', color: '#FFFDD0', bgLight: '#FFFBE8', genre: 'Comedy',    duration: '24 min', rating: 5 },
  { id: 103, title: 'Bluey',        emoji: '🐕', color: '#87CEEB', bgLight: '#DFF1FB', genre: 'Adventure', duration: '20 min', rating: 5 },
];

// 6-9 years
const CONTENT_69: Movie[] = [
  { id: 201, title: 'Boboiboy Galaxy',      emoji: '⚡', color: '#87CEEB', bgLight: '#DFF1FB', genre: 'Action',  duration: '48 min', rating: 5 },
  { id: 202, title: 'Ejen Ali The Movie',   emoji: '🕵️', color: '#9DC183', bgLight: '#E8F5E0', genre: 'Sci-Fi',  duration: '80 min', rating: 4 },
  { id: 203, title: 'Encanto',              emoji: '🌺', color: '#FFB6C1', bgLight: '#FFE8ED', genre: 'Fantasy', duration: '99 min', rating: 5 },
];

// 10-12 years
const CONTENT_1012: Movie[] = [
  { id: 301, title: 'Ejen Ali: The Movie 2',  emoji: '🤖', color: '#4A90D9', bgLight: '#E3EEFA', genre: 'Action',  duration: '95 min', rating: 5 },
  { id: 302, title: 'Boboiboy The Movie 2',   emoji: '🌌', color: '#6C63D4', bgLight: '#ECEAFC', genre: 'Sci-Fi',  duration: '100 min', rating: 5 },
  { id: 303, title: 'The Bad Guys',           emoji: '🐺', color: '#E86060', bgLight: '#FAEAEA', genre: 'Comedy',  duration: '100 min', rating: 4 },
];

// ── Per-profile seed data ─────────────────────────────────────────────────────
const PROFILES = {
  emma: {
    name: 'Emma',
    tier: '3-5' as const,
    accentColor: '#FFB6C1',
    watchHistory: [
      { id: 1, title: 'Omar & Hana', emoji: '👧', duration: '22 min', progress: 65, color: '#FFB6C1', bgLight: '#FFE8ED' },
      { id: 2, title: 'Upin & Ipin',  emoji: '👦', duration: '24 min', progress: 30, color: '#FFFDD0', bgLight: '#FFFBE8' },
      { id: 3, title: 'Bluey',        emoji: '🐕', duration: '20 min', progress: 80, color: '#87CEEB', bgLight: '#DFF1FB' },
    ],
    recommendations: CONTENT_35,
    showLearningMode: true,
    learningTitle: 'Continue learning with Omar & Hana!',
  },
  liam: {
    name: 'Liam',
    tier: '6-9' as const,
    accentColor: '#87CEEB',
    watchHistory: [
      { id: 1, title: 'Boboiboy Galaxy',    emoji: '⚡', duration: '48 min', progress: 55, color: '#87CEEB', bgLight: '#DFF1FB' },
      { id: 2, title: 'Ejen Ali The Movie', emoji: '🕵️', duration: '80 min', progress: 20, color: '#9DC183', bgLight: '#E8F5E0' },
      { id: 3, title: 'Encanto',            emoji: '🌺', duration: '99 min', progress: 90, color: '#FFB6C1', bgLight: '#FFE8ED' },
    ],
    recommendations: CONTENT_69,
    showLearningMode: true,
    learningTitle: 'Continue learning with Boboiboy Galaxy!',
  },
  sophia: {
    name: 'Sophia',
    tier: '10-12' as const,
    accentColor: '#4A90D9',
    watchHistory: [
      { id: 1, title: 'Ejen Ali: The Movie 2', emoji: '🤖', duration: '95 min',  progress: 72, color: '#4A90D9', bgLight: '#E3EEFA' },
      { id: 2, title: 'Boboiboy The Movie 2',  emoji: '🌌', duration: '100 min', progress: 40, color: '#6C63D4', bgLight: '#ECEAFC' },
      { id: 3, title: 'The Bad Guys',          emoji: '🐺', duration: '100 min', progress: 15, color: '#E86060', bgLight: '#FAEAEA' },
    ],
    recommendations: CONTENT_1012,
    showLearningMode: false,
    learningTitle: '',
  },
};

type ProfileKey = keyof typeof PROFILES;

// ── Shared star rating ────────────────────────────────────────────────────────
function StarRating({ count, size = 'sm' }: { count: number; size?: 'sm' | 'xs' }) {
  const cls = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`${cls} ${i <= count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

// ── 3-5 layout: giant tiles, minimal text ─────────────────────────────────────
function SmallKidsRow({ movies }: { movies: Movie[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3 px-1 scrollbar-hide">
      {movies.map((m) => (
        <button key={m.id} className="flex-shrink-0 w-40 rounded-3xl overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none" aria-label={`Watch ${m.title}`}>
          <div className="h-40 flex items-center justify-center" style={{ backgroundColor: m.color }}>
            <span className="text-7xl leading-none">{m.emoji}</span>
          </div>
          <div className="p-3 bg-white">
            <p className="text-sm font-black text-[#2D3748] text-center leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>{m.title}</p>
            <div className="flex justify-center mt-1.5">
              <div className="bg-[#87CEEB] text-white text-sm font-bold px-4 py-1 rounded-full" style={{ fontFamily: "'Fredoka One', cursive" }}>Watch!</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── 6-9 layout: balanced 2-column grid ────────────────────────────────────────
function MidKidsGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {movies.map((m) => (
        <button key={m.id} className="rounded-2xl overflow-hidden shadow-md hover:scale-[1.03] active:scale-95 transition-all text-left focus:outline-none" aria-label={`Watch ${m.title}`}>
          <div className="h-28 flex items-center justify-center" style={{ backgroundColor: m.color }}>
            <span className="text-6xl">{m.emoji}</span>
          </div>
          <div className="p-3 bg-white">
            <p className="text-sm font-bold text-[#2D3748] mb-1 leading-tight">{m.title}</p>
            <StarRating count={m.rating ?? 4} />
            <p className="text-xs text-[#A0AEC0] mt-0.5">{m.genre} · {m.duration}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── 10-12 layout: dense streaming rows, sharper, more refined ─────────────────
function PreTeenSection({ movies, accentColor }: { movies: Movie[]; accentColor: string }) {
  const trending = movies.slice(0, 2);
  const pickForYou = movies.slice(2);

  const rowClass = 'w-full flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md active:scale-[0.99] transition-all focus:outline-none text-left';

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <h3 className="text-xs font-black text-[#2D3748] uppercase tracking-widest">Trending Now</h3>
        </div>
        <div className="space-y-2">
          {trending.map((m, i) => (
            <button key={m.id} className={rowClass} aria-label={`Watch ${m.title}`}>
              <span className="text-sm font-black text-[#CBD5E0] w-4 text-center flex-shrink-0">{i + 1}</span>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl" style={{ backgroundColor: m.bgLight }}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1A202C] truncate">{m.title}</p>
                <p className="text-xs text-[#718096] mt-0.5">{m.genre} · {m.duration}</p>
                <StarRating count={m.rating ?? 4} size="xs" />
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentColor }}>
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {pickForYou.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ThumbsUp className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <h3 className="text-xs font-black text-[#2D3748] uppercase tracking-widest">Picked For You</h3>
          </div>
          <div className="space-y-2">
            {pickForYou.map((m) => (
              <button key={m.id} className={rowClass} aria-label={`Watch ${m.title}`}>
                <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-3xl" style={{ backgroundColor: m.bgLight }}>
                  {m.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A202C] truncate">{m.title}</p>
                  <p className="text-xs text-[#718096] mt-0.5">{m.genre} · {m.duration}</p>
                  <StarRating count={m.rating ?? 4} size="xs" />
                </div>
                <div className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0" style={{ borderColor: accentColor }}>
                  <Play className="w-3 h-3 fill-current" style={{ color: accentColor }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Homepage ─────────────────────────────────────────────────────────────
export function Homepage() {
  const [searchParams] = useSearchParams();
  const profileKey = (searchParams.get('profile') ?? 'emma') as ProfileKey;
  const data = PROFILES[profileKey] ?? PROFILES.emma;

  const isSophia = data.tier === '10-12';

  // ── Sophia-specific design tokens ────────────────────────────────────────
  const S = {
    bg:          'linear-gradient(160deg, #1A2744 0%, #1E3A5F 50%, #162035 100%)',
    card:        'bg-[#1E2D4A]',
    cardBorder:  'border border-[#2A3F60]',
    text:        'text-white',
    subtext:     'text-[#8BA3C4]',
    sectionHead: 'text-[10px] font-black tracking-[0.18em] uppercase text-[#8BA3C4]',
    radius:      'rounded-xl',
    accent:      data.accentColor, // #4A90D9
  };

  return (
    <div
      className="min-h-full pb-28 relative"
      style={{
        background: isSophia
          ? S.bg
          : 'linear-gradient(160deg, #DFF1FB 0%, #FFFBE8 40%, #FFE8ED 100%)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-10 h-10 flex items-center justify-center shadow-md text-xl"
            style={{
              background: 'linear-gradient(135deg, #87CEEB, #FFB6C1)',
              borderRadius: isSophia ? '10px' : '16px',
            }}
          >
            🎬
          </div>
          <span
            className="text-3xl tracking-tight leading-none"
            style={{
              fontFamily: "'Fredoka One', cursive",
              background: isSophia
                ? 'linear-gradient(135deg, #6FB3F5, #A78BFA)'
                : 'linear-gradient(135deg, #3BA3D0, #E8799A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PoppyToons
          </span>
          {isSophia
            ? <TrendingUp className="w-4 h-4 text-[#4A90D9] ml-auto" />
            : <Sparkles className="w-5 h-5 text-yellow-400 ml-auto animate-pulse" />}
        </div>

        {/* Greeting */}
        {isSophia ? (
          <div className={`${S.radius} px-5 py-4 mb-1`} style={{ backgroundColor: '#1E2D4A', border: '1px solid #2A3F60' }}>
            <p className="text-sm font-bold text-white leading-snug">
              Hi Sophia, what are you watching today?
            </p>
            <p className="text-xs mt-1" style={{ color: '#8BA3C4' }}>Your picks are ready · 10–12</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-5 py-4 shadow-sm border border-white/80 mb-1">
            <p className="text-lg font-black text-[#2D3748] leading-snug" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Hi {data.name}, what are you<br />watching today? 👋
            </p>
            <p className="text-xs text-[#718096] mt-1 font-semibold">Ready for some fun? Let's go!</p>
          </div>
        )}
      </div>

      {/* ── Watch History ── */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          {isSophia
            ? <h2 className={S.sectionHead}>Continue Watching</h2>
            : <h2 className="text-lg font-black text-[#2D3748]" style={{ fontFamily: "'Fredoka One', cursive" }}>Continue Watching</h2>}
          <button className="flex items-center gap-1 text-xs font-bold transition-colors" style={{ color: data.accentColor }}>
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSophia ? (
          /* Sophia: dense compact rows */
          <div className="px-5 space-y-2">
            {data.watchHistory.map((movie) => (
              <div
                key={movie.id}
                className={`flex items-center gap-3 ${S.radius} p-3`}
                style={{ backgroundColor: '#1E2D4A', border: '1px solid #2A3F60' }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: movie.bgLight }}
                >
                  {movie.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{movie.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-[#2A3F60] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${movie.progress}%`, backgroundColor: S.accent }} />
                    </div>
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color: '#8BA3C4' }}>{movie.progress}%</span>
                  </div>
                  <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: '#8BA3C4' }}>
                    <Clock className="w-2.5 h-2.5" /> {movie.duration}
                  </p>
                </div>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: S.accent }}
                >
                  <Play className="w-2.5 h-2.5 fill-white" /> Resume
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Emma / Liam: card carousel */
          <div className="flex gap-4 overflow-x-auto pb-2 px-5 scrollbar-hide">
            {data.watchHistory.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-44 bg-white rounded-3xl overflow-hidden shadow-md hover:scale-[1.03] active:scale-95 transition-all cursor-pointer">
                <div className="h-28 flex items-center justify-center text-6xl relative" style={{ backgroundColor: movie.bgLight }}>
                  <span>{movie.emoji}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/50">
                    <div className="h-full rounded-full" style={{ width: `${movie.progress}%`, backgroundColor: movie.color }} />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#2D3748] mb-0.5 leading-tight">{movie.title}</h3>
                  <p className="text-xs text-[#718096]">{movie.progress}% watched</p>
                  <button className="mt-2 w-full py-1.5 text-white text-xs font-bold rounded-full flex items-center justify-center gap-1 hover:opacity-90" style={{ backgroundColor: movie.color }}>
                    <Play className="w-3 h-3 fill-white" /> Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Learning Mode card (Emma / Liam only) ── */}
      {data.showLearningMode && (
        <section className="px-5 mb-6">
          <div className="rounded-3xl p-5 shadow-md relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all" style={{ background: 'linear-gradient(135deg, #9DC183, #6AAF55)' }}>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 bg-white" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10 bg-white" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">📚</div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wide">Learning Mode</span>
                </div>
                <p className="text-white font-black text-sm leading-snug" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {data.learningTitle} 🌿
                </p>
                <div className="mt-2 bg-white/25 rounded-full px-3 py-1 inline-flex items-center gap-1">
                  <span className="text-white text-xs font-bold">Resume Activity</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Sophia: #1 Featured Banner ── */}
      {isSophia && (
        <section className="px-5 mb-6">
          <div
            className="rounded-xl p-4 relative overflow-hidden cursor-pointer hover:brightness-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #1E3A6E, #2B4F8E)', border: '1px solid #3A5F9A' }}
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-white" />
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-4xl flex-shrink-0"
                style={{ backgroundColor: '#E3EEFA' }}
              >
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">#1 This Week</span>
                </div>
                <p className="text-white font-bold text-sm leading-snug">Ejen Ali: The Movie 2</p>
                <p className="text-xs mt-0.5" style={{ color: '#8BA3C4' }}>Action · 95 min · 10–12 years</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: S.accent, color: '#fff' }}
                  >
                    <Play className="w-3 h-3 fill-white" /> Watch Now
                  </button>
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Recommendations ── */}
      <section className="px-5 mb-6">
        {isSophia ? (
          <h2 className={`${S.sectionHead} mb-4`}>Recommended For You</h2>
        ) : (
          <h2 className="text-lg font-black text-[#2D3748] mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Recommended For You
          </h2>
        )}

        {isSophia ? (
          <PreTeenSection movies={data.recommendations} accentColor={S.accent} />
        ) : data.tier === '3-5' ? (
          <SmallKidsRow movies={data.recommendations} />
        ) : (
          <MidKidsGrid movies={data.recommendations} />
        )}
      </section>

      {/* ── Ask Poppy FAB ── */}
      <div className="fixed bottom-24 right-5 flex flex-col items-end gap-2 z-50">
        <div
          className="text-sm font-bold px-4 py-2 shadow-lg relative"
          style={{
            backgroundColor: isSophia ? '#1E2D4A' : 'white',
            color: isSophia ? '#6FB3F5' : '#2D3748',
            border: isSophia ? '1px solid #2A3F60' : 'none',
            borderRadius: isSophia ? '10px' : '16px',
            fontFamily: "'Fredoka One', cursive",
          }}
        >
          Ask Poppy!
        </div>
        <button
          className="w-14 h-14 flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none"
          style={{
            background: isSophia
              ? `linear-gradient(135deg, ${S.accent}, #6C63D4)`
              : 'linear-gradient(135deg, #87CEEB, #FFB6C1)',
            borderRadius: isSophia ? '14px' : '9999px',
            boxShadow: `0 6px 20px ${S.accent}55`,
          }}
          aria-label="Ask Poppy"
        >
          🐾
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
