import { ChevronRight, LogOut, UserPen, RefreshCw, Tv2, Clock, Star, X, Check } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useNavigate, useParams } from 'react-router';
import { useState, useRef, useEffect } from 'react';

// ── Avatar catalogue ──────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'bear',    emoji: '🐻', label: 'Bear',    bg: '#FFE8ED', ring: '#FFB6C1' },
  { id: 'bunny',   emoji: '🐰', label: 'Bunny',   bg: '#E8F5E0', ring: '#9DC183' },
  { id: 'robot',   emoji: '🤖', label: 'Robot',   bg: '#DFF1FB', ring: '#87CEEB' },
  { id: 'cat',     emoji: '🐱', label: 'Cat',     bg: '#FFFBE8', ring: '#F6C94E' },
  { id: 'dino',    emoji: '🦕', label: 'Dino',    bg: '#E8F5E0', ring: '#9DC183' },
  { id: 'alien',   emoji: '👾', label: 'Alien',   bg: '#EDE8FB', ring: '#B39DDB' },
  { id: 'fox',     emoji: '🦊', label: 'Fox',     bg: '#FFE8ED', ring: '#FFB6C1' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin', bg: '#DFF1FB', ring: '#87CEEB' },
];

// ── Per-profile seed data ─────────────────────────────────────────────────────
const PROFILES: Record<string, {
  name: string;
  defaultAvatarId: string;
  color: string;
  tierLabel: string;
  ageTier: string;
  moviesThisWeek: number;
  totalMinutes: number;
  favoriteGenre: string;
  statsGradient: string;
}> = {
  emma: {
    name: 'Emma',
    defaultAvatarId: 'bear',
    color: '#FFB6C1',
    tierLabel: '3–5',
    ageTier: '3-5 years old',
    moviesThisWeek: 5,
    totalMinutes: 142,
    favoriteGenre: 'Sing Along',
    statsGradient: 'linear-gradient(135deg, #FFB6C1, #E8799A)',
  },
  liam: {
    name: 'Liam',
    defaultAvatarId: 'robot',
    color: '#87CEEB',
    tierLabel: '6–9',
    ageTier: '6-9 years old',
    moviesThisWeek: 8,
    totalMinutes: 210,
    favoriteGenre: 'Animation',
    statsGradient: 'linear-gradient(135deg, #87CEEB, #5BAED4)',
  },
  sophia: {
    name: 'Sophia',
    defaultAvatarId: 'fox',
    color: '#9DC183',
    tierLabel: '10–12',
    ageTier: '10-12 years old',
    moviesThisWeek: 11,
    totalMinutes: 310,
    favoriteGenre: 'Educational',
    statsGradient: 'linear-gradient(135deg, #9DC183, #6AAF55)',
  },
};

// ── Edit Profile modal ────────────────────────────────────────────────────────
function EditProfileModal({
  currentName,
  currentAvatarId,
  onSave,
  onClose,
}: {
  currentName: string;
  currentAvatarId: string;
  onSave: (name: string, avatarId: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

  const chosen = AVATARS.find((a) => a.id === selectedAvatar) ?? AVATARS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFBE8 0%, #FFE8ED 60%, #DFF1FB 100%)' }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center pt-7 pb-1 px-6">
          <h2 className="text-xl text-[#2D3748]" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#718096] hover:bg-white transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-md transition-all duration-200"
            style={{ backgroundColor: chosen.bg, boxShadow: `0 0 0 4px ${chosen.ring}` }}
          >
            {chosen.emoji}
          </div>
          <p className="text-xs font-bold text-[#A0AEC0] mt-2">{chosen.label}</p>
        </div>

        <div className="px-6 pb-6 pt-2 space-y-5">
          {/* Name input */}
          <div>
            <label htmlFor="profile-name" className="block text-xs font-bold text-[#718096] uppercase tracking-wide mb-2">
              Name
            </label>
            <input
              id="profile-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Enter a name…"
              className="w-full px-4 py-3.5 rounded-2xl bg-white shadow-sm border-2 text-[#2D3748] font-bold text-base placeholder:text-[#CBD5E0] focus:outline-none transition-all"
              style={{ fontFamily: "'Fredoka One', cursive", borderColor: name.length > 0 ? '#87CEEB' : '#E2E8F0' }}
            />
          </div>

          {/* Avatar grid */}
          <div>
            <p className="text-xs font-bold text-[#718096] uppercase tracking-wide mb-3">Choose Avatar</p>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((av) => {
                const active = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className="flex flex-col items-center gap-1 focus:outline-none"
                    aria-label={av.label}
                    aria-pressed={active}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative transition-all duration-150"
                      style={{
                        backgroundColor: av.bg,
                        boxShadow: active ? `0 0 0 3px ${av.ring}, 0 4px 12px rgba(0,0,0,0.12)` : '0 2px 6px rgba(0,0,0,0.06)',
                        transform: active ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {av.emoji}
                      {active && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: av.ring }}>
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: active ? '#2D3748' : '#A0AEC0' }}>
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={() => { if (name.trim()) onSave(name.trim(), selectedAvatar); }}
            disabled={name.trim().length === 0}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ fontFamily: "'Fredoka One', cursive", background: 'linear-gradient(135deg, #FFB6C1, #E8799A)', boxShadow: '0 5px 18px rgba(232,121,154,0.45)' }}
          >
            Save Changes 🎉
          </button>

          {/* Cancel */}
          <div className="text-center">
            <button onClick={onClose} className="text-sm font-semibold text-[#A0AEC0] hover:text-[#718096] transition-colors underline underline-offset-2">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Log Out Confirmation modal ────────────────────────────────────────────────
function LogoutModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(45,55,72,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFBE8 0%, #FFE8ED 55%, #DFF1FB 100%)' }}
      >
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md text-3xl"
            style={{ background: 'linear-gradient(135deg, #FFB6C1, #E8799A)' }}
          >
            👋
          </div>
        </div>

        {/* Text */}
        <div className="px-7 pt-3 pb-6 text-center">
          <h2
            className="text-xl text-[#2D3748] mb-2"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Leaving so soon?
          </h2>
          <p className="text-sm text-[#718096] leading-relaxed">
            Are you sure you want to log out? You can always come back and watch more! 🌟
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-[#E2E8F0]" />

        {/* Action buttons */}
        <div className="flex gap-3 p-5">
          {/* Cancel — soft secondary */}
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-[#718096] bg-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all border border-[#E2E8F0]"
          >
            Stay & Watch
          </button>

          {/* Confirm — prominent destructive */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white active:scale-[0.98] transition-all"
            style={{
              background: 'linear-gradient(135deg, #FFB6C1, #E8799A)',
              boxShadow: '0 4px 14px rgba(232,121,154,0.45)',
            }}
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
export function ProfilePage() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();

  const seed = PROFILES[profileId ?? ''] ?? PROFILES.emma;

  const [displayName, setDisplayName] = useState(seed.name);
  const [avatarId, setAvatarId] = useState(seed.defaultAvatarId);
  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Reset local state when profile changes (navigation between profiles)
  useEffect(() => {
    setDisplayName(seed.name);
    setAvatarId(seed.defaultAvatarId);
  }, [profileId]);

  const currentAvatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];

  return (
    <>
      <div
        className="min-h-full pb-28"
        style={{ background: 'linear-gradient(160deg, #FFE8ED 0%, #FFFBE8 50%, #DFF1FB 100%)', fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="px-5 pt-8">
          <h1 className="text-2xl text-[#2D3748] mb-6" style={{ fontFamily: "'Fredoka One', cursive" }}>
            My Profile
          </h1>

          {/* ── Avatar card ── */}
          <div className="bg-white rounded-3xl p-6 shadow-md mb-4 text-center relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: seed.color }} />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15" style={{ backgroundColor: seed.color }} />

            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 shadow-md relative transition-all duration-300"
              style={{ backgroundColor: currentAvatar.bg, boxShadow: `0 0 0 4px ${currentAvatar.ring}` }}
            >
              {currentAvatar.emoji}
            </div>

            <h2 className="text-2xl text-[#2D3748] mb-3 relative" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {displayName}
            </h2>

            {/* Age tier badge */}
            <div className="inline-flex flex-col items-center gap-0.5 relative">
              <div
                className="px-6 py-2 rounded-2xl shadow-sm"
                style={{ background: seed.statsGradient }}
              >
                <span
                  className="text-2xl font-black text-white tracking-wide leading-none"
                  style={{ fontFamily: "'Fredoka One', cursive", textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                >
                  {seed.tierLabel} years
                </span>
              </div>
              <span className="text-xs font-semibold text-[#A0AEC0] mt-1">Content Level</span>
            </div>
          </div>

          {/* ── Fun stats card ── */}
          <div
            className="rounded-3xl p-5 mb-4 shadow-md relative overflow-hidden"
            style={{ background: seed.statsGradient }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/15" />
            <div className="absolute -bottom-5 -left-3 w-16 h-16 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎉</span>
                <p className="text-white text-base font-black leading-snug" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {displayName} watched {seed.moviesThisWeek} movies this week!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/25 rounded-2xl p-3 text-center">
                  <Tv2 className="w-5 h-5 text-white mx-auto mb-1" />
                  <p className="text-white text-lg font-black leading-none" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {seed.moviesThisWeek}
                  </p>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">Movies</p>
                </div>
                <div className="bg-white/25 rounded-2xl p-3 text-center">
                  <Clock className="w-5 h-5 text-white mx-auto mb-1" />
                  <p className="text-white text-lg font-black leading-none" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {seed.totalMinutes}m
                  </p>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">Watched</p>
                </div>
                <div className="bg-white/25 rounded-2xl p-3 text-center">
                  <Star className="w-5 h-5 text-white mx-auto mb-1 fill-white" />
                  <p className="text-white text-sm font-black leading-none mt-0.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {seed.favoriteGenre}
                  </p>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">Fave</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Action options ── */}
          <div className="space-y-3">
            {/* Edit Profile */}
            <button
              onClick={() => setShowEdit(true)}
              className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DFF1FB' }}>
                  <UserPen className="w-5 h-5 text-[#3BA3D0]" />
                </div>
                <span className="font-bold text-[#2D3748]">Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A0AEC0]" />
            </button>

            {/* Switch Profile */}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E0' }}>
                  <RefreshCw className="w-5 h-5 text-[#6AAF55]" />
                </div>
                <span className="font-bold text-[#2D3748]">Switch Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A0AEC0]" />
            </button>

            {/* Log Out */}
            <button
              onClick={() => setShowLogout(true)}
              className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#FFB6C1]"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#FFE8ED]">
                  <LogOut className="w-5 h-5 text-[#E8799A]" />
                </div>
                <span className="font-bold text-[#E8799A]">Log Out</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#E8799A]/50" />
            </button>
          </div>
        </div>

        <BottomNav />
      </div>

      {showEdit && (
        <EditProfileModal
          currentName={displayName}
          currentAvatarId={avatarId}
          onSave={(name, av) => { setDisplayName(name); setAvatarId(av); setShowEdit(false); }}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showLogout && (
        <LogoutModal
          onConfirm={() => navigate('/')}
          onClose={() => setShowLogout(false)}
        />
      )}
    </>
  );
}
