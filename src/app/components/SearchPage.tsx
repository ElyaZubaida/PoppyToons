import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown, Play, Mic } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

// ── Content catalogue ─────────────────────────────────────────────────────────
const AGE_TIERS = ['All Ages', '3-5 years', '6-9 years', '10-12 years'] as const;
type AgeTier = (typeof AGE_TIERS)[number];

const CATEGORIES = ['All', 'Musical', 'Comedy', 'Action', 'Fantasy', 'Sci-Fi'] as const;
type Category = (typeof CATEGORIES)[number];

interface Movie {
  id: number;
  title: string;
  emoji: string;
  age: AgeTier;
  category: Category;
  color: string;
  bgLight: string;
}

const ALL_MOVIES: Movie[] = [
  // 3-5 years
  { id: 101, title: 'Omar & Hana',           emoji: '👧', age: '3-5 years',   category: 'Musical', color: '#FFB6C1', bgLight: '#FFE8ED' },
  { id: 102, title: 'Upin & Ipin',           emoji: '👦', age: '3-5 years',   category: 'Comedy',  color: '#FFFDD0', bgLight: '#FFFBE8' },
  { id: 103, title: 'Bluey',                 emoji: '🐕', age: '3-5 years',   category: 'Comedy',  color: '#87CEEB', bgLight: '#DFF1FB' },
  // 6-9 years
  { id: 201, title: 'Boboiboy Galaxy',       emoji: '⚡', age: '6-9 years',   category: 'Action',  color: '#87CEEB', bgLight: '#DFF1FB' },
  { id: 202, title: 'Ejen Ali The Movie',    emoji: '🕵️', age: '6-9 years',   category: 'Action',  color: '#9DC183', bgLight: '#E8F5E0' },
  { id: 203, title: 'Encanto',              emoji: '🌺', age: '6-9 years',   category: 'Fantasy', color: '#FFB6C1', bgLight: '#FFE8ED' },
  // 10-12 years
  { id: 301, title: 'Ejen Ali: The Movie 2', emoji: '🤖', age: '10-12 years', category: 'Action',  color: '#4A90D9', bgLight: '#E3EEFA' },
  { id: 302, title: 'Boboiboy The Movie 2',  emoji: '🌌', age: '10-12 years', category: 'Sci-Fi',  color: '#6C63D4', bgLight: '#ECEAFC' },
  { id: 303, title: 'The Bad Guys',          emoji: '🐺', age: '10-12 years', category: 'Comedy',  color: '#E86060', bgLight: '#FAEAEA' },
];

// ── Per-profile design config ─────────────────────────────────────────────────
type ProfileKey = 'emma' | 'liam' | 'sophia';

const PROFILE_CONFIG: Record<ProfileKey, {
  defaultAge: AgeTier;
  bg: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  bannerBg: string;
  bannerBorder: string;
  bannerTitle: string;
  bannerSub: string;
  tagBg: string;
  tagText: string;
  cardBg: string;
  cardBorder: string;
  titleColor: string;
  subColor: string;
  sectionTitle: string;
  filterBtnBg: string;
  filterBtnActiveBg: string;
  filterPillBg: string;
  filterPillText: string;
  playBg: string;
  fabBg: string;
  fabSpeechBg: string;
  fabSpeechText: string;
  navRadius: string;
  isDark: boolean;
  // mic styling
  micBg: string;
  micIcon: string;
  micActiveBg: string;
  micSize: 'lg' | 'md' | 'sm';
  listeningBg: string;
  listeningRing: string;
  listeningText: string;
  listeningSubtext: string;
  listeningWaveBg: string;
}> = {
  emma: {
    defaultAge: '3-5 years',
    bg: 'linear-gradient(160deg, #DFF1FB 0%, #FFFBE8 50%, #FFE8ED 100%)',
    inputBg: 'white',
    inputBorder: '#87CEEB',
    inputText: '#2D3748',
    inputPlaceholder: '#CBD5E0',
    bannerBg: 'linear-gradient(135deg, rgba(135,206,235,0.18), rgba(255,182,193,0.18))',
    bannerBorder: 'rgba(135,206,235,0.35)',
    bannerTitle: '#2D3748',
    bannerSub: '#3BA3D0',
    tagBg: '#E2E8F0',
    tagText: '#718096',
    cardBg: 'white',
    cardBorder: 'transparent',
    titleColor: '#2D3748',
    subColor: '#A0AEC0',
    sectionTitle: '#2D3748',
    filterBtnBg: 'white',
    filterBtnActiveBg: 'linear-gradient(135deg, #87CEEB, #5BAED4)',
    filterPillBg: 'rgba(135,206,235,0.2)',
    filterPillText: '#3BA3D0',
    playBg: '#87CEEB',
    fabBg: 'linear-gradient(135deg, #87CEEB, #FFB6C1)',
    fabSpeechBg: 'white',
    fabSpeechText: '#2D3748',
    navRadius: 'rounded-2xl',
    isDark: false,
    micBg: 'linear-gradient(135deg, #FFB6C1, #E8799A)',
    micIcon: 'white',
    micActiveBg: 'linear-gradient(135deg, #FF8FAB, #D45F7A)',
    micSize: 'lg',
    listeningBg: 'linear-gradient(160deg, #FFE8ED 0%, #FFFBE8 50%, #DFF1FB 100%)',
    listeningRing: '#FFB6C1',
    listeningText: '#2D3748',
    listeningSubtext: '#718096',
    listeningWaveBg: '#FFB6C1',
  },
  liam: {
    defaultAge: '6-9 years',
    bg: 'linear-gradient(160deg, #DFF1FB 0%, #EBF8FF 50%, #E8F5E0 100%)',
    inputBg: 'white',
    inputBorder: '#87CEEB',
    inputText: '#2D3748',
    inputPlaceholder: '#CBD5E0',
    bannerBg: 'linear-gradient(135deg, rgba(87,206,235,0.22), rgba(157,193,131,0.15))',
    bannerBorder: 'rgba(87,206,235,0.4)',
    bannerTitle: '#2D3748',
    bannerSub: '#3BA3D0',
    tagBg: '#DFF1FB',
    tagText: '#2B6CB0',
    cardBg: 'white',
    cardBorder: 'transparent',
    titleColor: '#1A202C',
    subColor: '#718096',
    sectionTitle: '#1A202C',
    filterBtnBg: 'white',
    filterBtnActiveBg: 'linear-gradient(135deg, #87CEEB, #5BAED4)',
    filterPillBg: 'rgba(87,206,235,0.2)',
    filterPillText: '#2B6CB0',
    playBg: '#87CEEB',
    fabBg: 'linear-gradient(135deg, #87CEEB, #9DC183)',
    fabSpeechBg: 'white',
    fabSpeechText: '#2D3748',
    navRadius: 'rounded-2xl',
    isDark: false,
    micBg: 'linear-gradient(135deg, #87CEEB, #5BAED4)',
    micIcon: 'white',
    micActiveBg: 'linear-gradient(135deg, #5BAED4, #3A8DB8)',
    micSize: 'md',
    listeningBg: 'linear-gradient(160deg, #DFF1FB 0%, #EBF8FF 50%, #E8F5E0 100%)',
    listeningRing: '#87CEEB',
    listeningText: '#1A202C',
    listeningSubtext: '#718096',
    listeningWaveBg: '#87CEEB',
  },
  sophia: {
    defaultAge: '10-12 years',
    bg: 'linear-gradient(160deg, #1A2744 0%, #1E3A5F 50%, #162035 100%)',
    inputBg: '#1E2D4A',
    inputBorder: '#4A90D9',
    inputText: 'white',
    inputPlaceholder: '#4A6080',
    bannerBg: 'linear-gradient(135deg, rgba(74,144,217,0.2), rgba(108,99,212,0.15))',
    bannerBorder: 'rgba(74,144,217,0.4)',
    bannerTitle: 'white',
    bannerSub: '#6FB3F5',
    tagBg: '#1E3A6E',
    tagText: '#6FB3F5',
    cardBg: '#1E2D4A',
    cardBorder: '#2A3F60',
    titleColor: 'white',
    subColor: '#8BA3C4',
    sectionTitle: 'white',
    filterBtnBg: '#1E2D4A',
    filterBtnActiveBg: 'linear-gradient(135deg, #4A90D9, #6C63D4)',
    filterPillBg: 'rgba(74,144,217,0.2)',
    filterPillText: '#6FB3F5',
    playBg: '#4A90D9',
    fabBg: 'linear-gradient(135deg, #4A90D9, #6C63D4)',
    fabSpeechBg: '#1E2D4A',
    fabSpeechText: '#6FB3F5',
    navRadius: 'rounded-xl',
    isDark: true,
    micBg: 'linear-gradient(135deg, #4A90D9, #6C63D4)',
    micIcon: 'white',
    micActiveBg: 'linear-gradient(135deg, #6C63D4, #4A40B8)',
    micSize: 'sm',
    listeningBg: 'linear-gradient(160deg, #1A2744 0%, #1E3A5F 100%)',
    listeningRing: '#4A90D9',
    listeningText: 'white',
    listeningSubtext: '#8BA3C4',
    listeningWaveBg: '#4A90D9',
  },
};

// Distinct age badge colours per tier
const AGE_BADGE: Record<AgeTier, { bg: string; text: string }> = {
  'All Ages':    { bg: '#E2E8F0', text: '#718096' },
  '3-5 years':  { bg: '#FFE8ED', text: '#E8799A' },
  '6-9 years':  { bg: '#DFF1FB', text: '#3BA3D0' },
  '10-12 years':{ bg: '#E3EEFA', text: '#2B6CB0' },
};

// ── Filter Drawer ─────────────────────────────────────────────────────────────
function FilterDrawer({
  activeAge, setActiveAge,
  activeCategory, setActiveCategory,
  cfg, onClose,
}: {
  activeAge: AgeTier; setActiveAge: (a: AgeTier) => void;
  activeCategory: Category; setActiveCategory: (c: Category) => void;
  cfg: typeof PROFILE_CONFIG.emma;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl shadow-2xl overflow-hidden pb-8"
        style={cfg.isDark
          ? { backgroundColor: '#1A2744', border: '1px solid #2A3F60' }
          : { background: 'linear-gradient(160deg, #FFFBE8 0%, #DFF1FB 100%)' }
        }
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3
            className="text-lg"
            style={{ fontFamily: "'Fredoka One', cursive", color: cfg.titleColor }}
          >
            Filter Content
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: cfg.isDark ? '#1E2D4A' : 'rgba(255,255,255,0.7)', color: cfg.subColor }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 mb-5">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: cfg.subColor }}>Age Group</p>
          <div className="flex flex-wrap gap-2">
            {AGE_TIERS.map((age) => (
              <button
                key={age}
                onClick={() => setActiveAge(age)}
                className={`px-4 py-2 ${cfg.navRadius} text-sm font-semibold transition-all active:scale-95`}
                style={activeAge === age
                  ? { background: cfg.filterBtnActiveBg, color: 'white' }
                  : { backgroundColor: cfg.filterBtnBg, color: cfg.subColor, border: `1px solid ${cfg.cardBorder || '#E2E8F0'}` }
                }
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: cfg.subColor }}>Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 ${cfg.navRadius} text-sm font-semibold transition-all active:scale-95`}
                style={activeCategory === cat
                  ? { background: cfg.filterBtnActiveBg, color: 'white' }
                  : { backgroundColor: cfg.filterBtnBg, color: cfg.subColor, border: `1px solid ${cfg.cardBorder || '#E2E8F0'}` }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 mt-6">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full text-white font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: cfg.filterBtnActiveBg, boxShadow: '0 4px 14px rgba(87,206,235,0.35)' }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ── No Results ────────────────────────────────────────────────────────────────
function NoResults({ query, cfg }: { query: string; cfg: typeof PROFILE_CONFIG.emma }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-5 shadow-md"
        style={{ background: cfg.isDark ? '#1E3A6E' : 'linear-gradient(135deg, #FFE8ED, #FFB6C1)' }}
      >
        🔍
      </div>
      <h3
        className="text-xl mb-2"
        style={{ fontFamily: "'Fredoka One', cursive", color: cfg.titleColor }}
      >
        Oops! We couldn't find that.
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: cfg.subColor }}>
        No results for <span className="font-bold" style={{ color: cfg.titleColor }}>"{query}"</span>. Try something else!
      </p>
      <div
        className="mt-6 flex items-center gap-2 rounded-2xl px-5 py-3 shadow-sm"
        style={{ backgroundColor: cfg.cardBg, border: `1px solid ${cfg.cardBorder || '#E2E8F0'}` }}
      >
        <span className="text-2xl">🐾</span>
        <span className="text-sm font-semibold" style={{ color: cfg.bannerSub }}>Ask Poppy for suggestions</span>
        <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: cfg.bannerSub }} />
      </div>
    </div>
  );
}

// ── Listening Overlay ─────────────────────────────────────────────────────────
function ListeningOverlay({
  cfg,
  onDismiss,
  onResult,
}: {
  cfg: typeof PROFILE_CONFIG.emma;
  onDismiss: () => void;
  onResult: (text: string) => void;
}) {
  const [dots, setDots] = useState(0);
  const [waveScale, setWaveScale] = useState([1, 1, 1, 1, 1]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate wave bars and auto-dismiss after 2.5s with a demo result
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveScale([
        0.4 + Math.random() * 0.9,
        0.3 + Math.random() * 1.0,
        0.5 + Math.random() * 0.8,
        0.3 + Math.random() * 1.0,
        0.4 + Math.random() * 0.9,
      ]);
    }, 120);

    const dotInterval = setInterval(() => setDots((d) => (d + 1) % 4), 400);

    timerRef.current = setTimeout(() => {
      clearInterval(waveInterval);
      clearInterval(dotInterval);
      onResult('');          // empty = just close; real impl would fill query
      onDismiss();
    }, 2500);

    return () => {
      clearInterval(waveInterval);
      clearInterval(dotInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isEmma = cfg.micSize === 'lg';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: cfg.listeningBg }}
      onClick={onDismiss}
    >
      {/* Pulsing ring(s) behind mic */}
      <div className="relative flex items-center justify-center mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: isEmma ? 60 + i * 36 : 48 + i * 28,
              height: isEmma ? 60 + i * 36 : 48 + i * 28,
              backgroundColor: cfg.listeningRing,
              animation: `ping ${0.9 + i * 0.3}s cubic-bezier(0,0,0.2,1) infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
        {/* Central mic button */}
        <div
          className="relative flex items-center justify-center rounded-full shadow-2xl z-10"
          style={{
            width: isEmma ? 96 : cfg.micSize === 'md' ? 76 : 64,
            height: isEmma ? 96 : cfg.micSize === 'md' ? 76 : 64,
            background: cfg.micActiveBg,
          }}
        >
          <Mic
            style={{
              width: isEmma ? 44 : cfg.micSize === 'md' ? 34 : 28,
              height: isEmma ? 44 : cfg.micSize === 'md' ? 34 : 28,
              color: cfg.micIcon,
            }}
          />
        </div>
      </div>

      {/* Sound-wave bars */}
      <div className="flex items-center gap-1.5 mb-6" style={{ height: isEmma ? 48 : 36 }}>
        {waveScale.map((scale, i) => (
          <div
            key={i}
            style={{
              width: isEmma ? 6 : 5,
              height: isEmma ? 48 : 36,
              borderRadius: 999,
              backgroundColor: cfg.listeningWaveBg,
              transform: `scaleY(${scale})`,
              transition: 'transform 0.1s ease',
              opacity: 0.7 + scale * 0.3,
            }}
          />
        ))}
      </div>

      {/* Status text */}
      <p
        className="text-lg font-black mb-1"
        style={{
          color: cfg.listeningText,
          fontFamily: isEmma ? "'Fredoka One', cursive" : "'Nunito', sans-serif",
        }}
      >
        {isEmma ? '🎤 Listening' : 'Listening'}{'.'.repeat(dots)}
      </p>
      <p
        className="text-sm"
        style={{ color: cfg.listeningSubtext }}
      >
        {isEmma ? 'Say a movie name!' : cfg.micSize === 'md' ? 'Say a title or genre…' : 'Speak now'}
      </p>

      <button
        onClick={onDismiss}
        className="mt-8 px-5 py-2 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: cfg.isDark ? '#1E2D4A' : 'rgba(255,255,255,0.7)',
          color: cfg.listeningSubtext,
          border: `1px solid ${cfg.listeningRing}40`,
        }}
      >
        Cancel
      </button>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── SearchPage ────────────────────────────────────────────────────────────────
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const profileKey = (searchParams.get('profile') ?? 'emma') as ProfileKey;
  const cfg = PROFILE_CONFIG[profileKey] ?? PROFILE_CONFIG.emma;

  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [listening, setListening] = useState(false);
  const [activeAge, setActiveAge] = useState<AgeTier>(cfg.defaultAge);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const navigate = useNavigate();

  const filtered = ALL_MOVIES.filter((m) => {
    const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
    const matchesAge = activeAge === 'All Ages' || m.age === activeAge;
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesQuery && matchesAge && matchesCategory;
  });

  const hasActiveFilters = activeAge !== cfg.defaultAge || activeCategory !== 'All';

  return (
    <>
      <div
        className="min-h-full pb-28 relative"
        style={{ background: cfg.bg, fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="px-5 pt-8 pb-4">
          {/* Page title */}
          <h1
            className="text-2xl mb-5"
            style={{
              fontFamily: cfg.isDark ? "'Nunito', sans-serif" : "'Fredoka One', cursive",
              fontWeight: cfg.isDark ? 800 : 700,
              color: cfg.titleColor,
              letterSpacing: cfg.isDark ? '0.02em' : undefined,
            }}
          >
            Search
          </h1>

          {/* Search bar + mic + filter */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: cfg.subColor }}
              />
              <input
                type="text"
                placeholder="Search PoppyToons…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                /* extra right padding to make room for mic/clear button */
                className="w-full pl-11 py-3.5 text-sm focus:outline-none focus:ring-2 shadow-md"
                style={{
                  paddingRight: cfg.micSize === 'lg' ? '52px' : '44px',
                  backgroundColor: cfg.inputBg,
                  color: cfg.inputText,
                  borderRadius: cfg.isDark ? '10px' : '16px',
                  border: `1.5px solid ${cfg.isDark ? '#2A3F60' : 'transparent'}`,
                  caretColor: cfg.inputBorder,
                }}
              />

              {/* Clear button — shown only when there's text */}
              {query.length > 0 ? (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cfg.isDark ? '#2A3F60' : '#EDF2F7' }}
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" style={{ color: cfg.subColor }} />
                </button>
              ) : (
                /* Mic button — lives inside the input for Emma (large), inline for others */
                cfg.micSize === 'lg' ? (
                  /* Emma: large colourful mic pill inside bar */
                  <button
                    onClick={() => setListening(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-md active:scale-95 transition-all"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: cfg.micBg,
                    }}
                    aria-label="Voice search"
                  >
                    <Mic className="w-5 h-5" style={{ color: cfg.micIcon }} />
                  </button>
                ) : (
                  /* Liam & Sophia: clean mic icon inside bar */
                  <button
                    onClick={() => setListening(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center active:scale-95 transition-all"
                    style={{
                      width: cfg.micSize === 'md' ? 32 : 28,
                      height: cfg.micSize === 'md' ? 32 : 28,
                      borderRadius: cfg.isDark ? 8 : 9999,
                      background: cfg.micBg,
                    }}
                    aria-label="Voice search"
                  >
                    <Mic
                      style={{
                        width: cfg.micSize === 'md' ? 16 : 14,
                        height: cfg.micSize === 'md' ? 16 : 14,
                        color: cfg.micIcon,
                      }}
                    />
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setShowFilter(true)}
              className="w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-md transition-all active:scale-95 relative"
              style={{
                borderRadius: cfg.isDark ? '10px' : '16px',
                background: hasActiveFilters ? cfg.filterBtnActiveBg : cfg.inputBg,
                color: hasActiveFilters ? 'white' : cfg.subColor,
                border: cfg.isDark ? `1px solid #2A3F60` : 'none',
              }}
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {hasActiveFilters && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                  style={{ backgroundColor: cfg.isDark ? '#6C63D4' : '#FFB6C1', borderColor: cfg.isDark ? '#1A2744' : 'white' }}
                />
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeAge !== cfg.defaultAge && (
                <span
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: cfg.filterPillBg, color: cfg.filterPillText }}
                >
                  {activeAge}
                  <button onClick={() => setActiveAge(cfg.defaultAge)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeCategory !== 'All' && (
                <span
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: cfg.filterPillBg, color: cfg.filterPillText }}
                >
                  {activeCategory}
                  <button onClick={() => setActiveCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Ask Poppy banner */}
          <div
            className="flex items-center gap-3 px-4 py-3 mb-5 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
            style={{
              background: cfg.bannerBg,
              border: `1.5px solid ${cfg.bannerBorder}`,
              borderRadius: cfg.isDark ? '12px' : '16px',
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
              style={{
                background: cfg.fabBg,
                borderRadius: cfg.isDark ? '10px' : '12px',
              }}
            >
              🐾
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight" style={{ color: cfg.bannerTitle }}>Not sure what to watch?</p>
              <p className="text-xs font-semibold" style={{ color: cfg.bannerSub }}>Ask Poppy!</p>
            </div>
            <ChevronDown className="w-4 h-4 -rotate-90 flex-shrink-0" style={{ color: cfg.bannerSub }} />
          </div>

          {/* Results / empty state */}
          {filtered.length === 0 ? (
            <NoResults query={query} cfg={cfg} />
          ) : (
            <div className="space-y-2.5">
              {filtered.map((movie) => {
                const badge = AGE_BADGE[movie.age];
                return (
                  <button
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}?profile=${profileKey}`)}
                    className="w-full p-3.5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 active:scale-[0.99] focus:outline-none text-left"
                    style={{
                      backgroundColor: cfg.cardBg,
                      border: `1px solid ${cfg.cardBorder || 'transparent'}`,
                      borderRadius: cfg.isDark ? '12px' : '16px',
                    }}
                  >
                    <div
                      className="w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: movie.bgLight, borderRadius: cfg.isDark ? '10px' : '12px' }}
                    >
                      {movie.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate mb-1" style={{ color: cfg.titleColor }}>{movie.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: badge.bg, color: badge.text }}
                        >
                          {movie.age}
                        </span>
                        <span className="text-xs" style={{ color: cfg.subColor }}>{movie.category}</span>
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cfg.playBg, borderRadius: cfg.isDark ? '8px' : '9999px' }}
                    >
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ask Poppy FAB */}
        <div className="fixed bottom-24 right-5 flex flex-col items-end gap-2 z-30">
          <div
            className="text-sm font-bold px-4 py-2 shadow-lg"
            style={{
              backgroundColor: cfg.fabSpeechBg,
              color: cfg.fabSpeechText,
              borderRadius: cfg.isDark ? '10px' : '16px',
              border: cfg.isDark ? '1px solid #2A3F60' : 'none',
              fontFamily: "'Fredoka One', cursive",
            }}
          >
            Ask Poppy!
          </div>
          <button
            className="w-14 h-14 flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none"
            style={{
              background: cfg.fabBg,
              borderRadius: cfg.isDark ? '14px' : '9999px',
              boxShadow: `0 6px 20px ${cfg.playBg}55`,
            }}
            aria-label="Ask Poppy"
          >
            🐾
          </button>
        </div>

        <BottomNav />
      </div>

      {showFilter && (
        <FilterDrawer
          activeAge={activeAge} setActiveAge={setActiveAge}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          cfg={cfg}
          onClose={() => setShowFilter(false)}
        />
      )}

      {listening && (
        <ListeningOverlay
          cfg={cfg}
          onDismiss={() => setListening(false)}
          onResult={(text) => { if (text) setQuery(text); }}
        />
      )}
    </>
  );
}
