import { Play, Download, ChevronLeft, BookOpen, Star, ChevronRight } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useNavigate } from 'react-router';

// "More Like This" shows sibling 6-9 titles to match the main feature's age tier
const SIMILAR_MOVIES = [
  { id: 201, title: 'Boboiboy Galaxy',       emoji: '⚡', bg: '#DFF1FB', color: '#87CEEB', genre: 'Action'  },
  { id: 202, title: 'Ejen Ali The Movie',    emoji: '🕵️', bg: '#E8F5E0', color: '#9DC183', genre: 'Sci-Fi'  },
  { id: 203, title: 'Encanto',               emoji: '🌺', bg: '#FFE8ED', color: '#FFB6C1', genre: 'Fantasy' },
  { id: 103, title: 'Bluey',                 emoji: '🐕', bg: '#DFF1FB', color: '#87CEEB', genre: 'Comedy'  },
];

// Cartoon movie poster built purely from CSS/SVG — Upin & Ipin inspired
function MoviePoster() {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #5BBDE4 0%, #3498C8 40%, #1A6FA0 100%)' }}>
      {/* Sky & clouds */}
      <div className="absolute top-6 left-8 w-20 h-8 bg-white/40 rounded-full blur-sm" />
      <div className="absolute top-4 left-16 w-14 h-6 bg-white/30 rounded-full blur-sm" />
      <div className="absolute top-8 right-10 w-16 h-6 bg-white/35 rounded-full blur-sm" />

      {/* Sun */}
      <div className="absolute top-5 right-8 w-12 h-12 rounded-full shadow-lg" style={{ background: 'radial-gradient(circle, #FFE87C, #F6C94E)' }} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-24 rounded-t-3xl" style={{ background: 'linear-gradient(180deg, #6DBF52, #4EA63A)' }} />

      {/* Trees */}
      <div className="absolute bottom-14 left-4 flex flex-col items-center">
        <div className="w-0 h-0" style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid #3A8C28' }} />
        <div className="w-2 h-4 bg-[#8B5E3C]" />
      </div>
      <div className="absolute bottom-16 left-10 flex flex-col items-center">
        <div className="w-0 h-0" style={{ borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '28px solid #4EA63A' }} />
        <div className="w-2.5 h-5 bg-[#8B5E3C]" />
      </div>
      <div className="absolute bottom-14 right-5 flex flex-col items-center">
        <div className="w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '24px solid #3A8C28' }} />
        <div className="w-2 h-4 bg-[#8B5E3C]" />
      </div>

      {/* Character 1 — round head, bald, white baju */}
      <div className="absolute bottom-16 left-1/2 -translate-x-8 flex flex-col items-center">
        {/* head */}
        <div className="w-10 h-10 rounded-full bg-[#F5C5A3] border-2 border-[#E8A882] relative shadow-sm">
          {/* eyes */}
          <div className="absolute top-3 left-2 w-1.5 h-1.5 rounded-full bg-[#2D1A0E]" />
          <div className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-[#2D1A0E]" />
          {/* smile */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-[#B87A5A] rounded-b-full" />
        </div>
        {/* body — white baju melayu */}
        <div className="w-9 h-10 rounded-xl mt-0.5 shadow-sm" style={{ background: 'linear-gradient(180deg, #fff 60%, #E8E8E8)' }} />
        {/* legs */}
        <div className="flex gap-1 mt-0.5">
          <div className="w-3 h-5 rounded-b-lg bg-[#1A5296]" />
          <div className="w-3 h-5 rounded-b-lg bg-[#1A5296]" />
        </div>
      </div>

      {/* Character 2 — slightly taller, next to first */}
      <div className="absolute bottom-16 left-1/2 translate-x-2 flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-[#F5C5A3] border-2 border-[#E8A882] relative shadow-sm">
          <div className="absolute top-2.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#2D1A0E]" />
          <div className="absolute top-2.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2D1A0E]" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-1.5 border-b-2 border-[#B87A5A] rounded-b-full" />
        </div>
        <div className="w-8 h-10 rounded-xl mt-0.5 shadow-sm" style={{ background: 'linear-gradient(180deg, #FFD166 60%, #F6B800)' }} />
        <div className="flex gap-1 mt-0.5">
          <div className="w-2.5 h-4 rounded-b-lg bg-[#1A5296]" />
          <div className="w-2.5 h-4 rounded-b-lg bg-[#1A5296]" />
        </div>
      </div>

      {/* Title lettering */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span
          className="text-white font-black text-lg tracking-wide"
          style={{
            fontFamily: "'Fredoka One', cursive",
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.2)',
          }}
        >
          Upin & Ipin
        </span>
      </div>

      {/* Sparkle stars */}
      {[[12, 30], [85, 18], [70, 45], [20, 55]].map(([x, y], i) => (
        <div key={i} className="absolute text-yellow-300 text-xs font-bold animate-pulse" style={{ left: `${x}%`, top: `${y}%` }}>✦</div>
      ))}
    </div>
  );
}

export function MovieDetail() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-full pb-28"
      style={{ background: 'linear-gradient(160deg, #DFF1FB 0%, #FFFBE8 50%, #FFE8ED 100%)', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Hero poster ── */}
      <div className="relative h-72">
        <MoviePoster />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#2D3748]" />
        </button>

        {/* Age tier badge — specific, accurate */}
        <div
          className="absolute top-5 right-5 z-10 px-4 py-1.5 rounded-full shadow-md"
          style={{ background: 'linear-gradient(135deg, #87CEEB, #5BAED4)' }}
        >
          <span className="text-white text-xs font-black tracking-wide" style={{ fontFamily: "'Fredoka One', cursive" }}>
            3–5 years
          </span>
        </div>
      </div>

      {/* ── Detail card ── */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl">

          {/* Title + meta */}
          <div className="mb-4">
            <h1 className="text-2xl text-[#2D3748] leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Upin & Ipin: The Lone Gibbon Kris
            </h1>
            <p className="text-sm text-[#A0AEC0] mt-1 flex items-center gap-3">
              <span>2019</span>
              <span>·</span>
              <span>1h 42m</span>
              <span>·</span>
              <span className="font-semibold text-[#6AAF55]">G</span>
            </p>
          </div>

          {/* Play + Download */}
          <div className="flex gap-3 mb-5">
            <button
              className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #87CEEB, #5BAED4)', boxShadow: '0 4px 14px rgba(87,206,235,0.45)' }}
            >
              <Play className="w-5 h-5 fill-white" />
              Play
            </button>
            <button
              className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #9DC183, #6AAF55)', boxShadow: '0 4px 14px rgba(106,175,85,0.4)' }}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>

          {/* Description */}
          <div className="bg-[#FFFBE8] rounded-2xl p-4 mb-4">
            <p className="text-sm text-[#2D3748] leading-relaxed">
              Upin and Ipin stumble upon an ancient keris with magical powers, sending them on a thrilling quest across mystical lands. Filled with Malaysian folklore, laughter, and heart — a perfect family adventure for young viewers!
            </p>
          </div>

          {/* Learning Mode preview */}
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(157,193,131,0.18), rgba(107,175,85,0.12))', border: '1.5px solid rgba(157,193,131,0.45)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #9DC183, #6AAF55)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-[#4EA63A] uppercase tracking-wide leading-none mb-0.5">Learning Mode</p>
              <p className="text-sm font-bold text-[#2D3748] leading-snug">
                After watching: Learn about Malaysian folklore! 🗡️
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9DC183] flex-shrink-0" />
          </div>

          {/* Tags row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#87CEEB]/15 rounded-2xl p-3 text-center">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-[#2D3748]">4.8</p>
              <p className="text-xs text-[#A0AEC0]">Rating</p>
            </div>
            <div className="bg-[#FFB6C1]/15 rounded-2xl p-3 text-center">
              <span className="text-2xl block mb-1">🎬</span>
              <p className="text-xs font-bold text-[#2D3748]">Animation</p>
            </div>
            <div className="bg-[#9DC183]/15 rounded-2xl p-3 text-center">
              <span className="text-2xl block mb-1">🌍</span>
              <p className="text-xs font-bold text-[#2D3748]">Adventure</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── More Like This ── */}
      <section className="mt-6 px-4 pb-4">
        <h2
          className="text-lg font-black text-[#2D3748] mb-3"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          More Like This
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {SIMILAR_MOVIES.map((m) => (
            <button
              key={m.id}
              className="flex-shrink-0 w-36 rounded-2xl overflow-hidden shadow-md hover:scale-[1.04] active:scale-95 transition-all focus:outline-none bg-white text-left"
              aria-label={`Watch ${m.title}`}
            >
              {/* Mini poster */}
              <div
                className="h-24 flex items-center justify-center text-5xl relative"
                style={{ backgroundColor: m.bg }}
              >
                {m.emoji}
                {/* Genre pill */}
                <div
                  className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                  style={{ backgroundColor: m.color }}
                >
                  {m.genre}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-[#2D3748] leading-snug">{m.title}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
