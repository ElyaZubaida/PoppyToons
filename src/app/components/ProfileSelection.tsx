import { useState, useRef, useEffect } from 'react';
import { Plus, Lock, Delete, X, Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';

// ── Shared avatar catalogue (4 starters shown in Add Profile) ────────────────
const STARTER_AVATARS = [
  { id: 'bear',    emoji: '🐻', label: 'Bear',    bg: '#FFE8ED', ring: '#FFB6C1' },
  { id: 'robot',   emoji: '🤖', label: 'Robot',   bg: '#DFF1FB', ring: '#87CEEB' },
  { id: 'bunny',   emoji: '🐰', label: 'Bunny',   bg: '#E8F5E0', ring: '#9DC183' },
  { id: 'cat',     emoji: '🐱', label: 'Cat',     bg: '#FFFBE8', ring: '#F6C94E' },
];

const AGE_TIERS = [
  { value: '3-5',   label: '3–5 years',   sublabel: 'Little Explorer',  color: '#FFB6C1', bg: '#FFE8ED' },
  { value: '6-9',   label: '6–9 years',   sublabel: 'Adventure Seeker', color: '#87CEEB', bg: '#DFF1FB' },
  { value: '10-12', label: '10–12 years', sublabel: 'Young Achiever',   color: '#9DC183', bg: '#E8F5E0' },
];

// ── PIN Modal ─────────────────────────────────────────────────────────────────
function PinModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const CORRECT_PIN = '1234';

  const handleKey = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) onSuccess();
        else setPin('');
      }, 300);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFBE8 0%, #DFF1FB 100%)' }}
      >
        <div className="relative flex flex-col items-center pt-7 pb-2 px-6">
          <button onClick={onClose} className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#718096] hover:bg-white transition-all" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-4" style={{ background: 'linear-gradient(135deg, #87CEEB, #5BAED4)' }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl text-[#2D3748]" style={{ fontFamily: "'Fredoka One', cursive" }}>Parent Controls</h2>
          <p className="text-sm text-[#718096] mt-1 mb-6">Enter your 4-digit PIN to continue</p>
        </div>

        <div className="flex justify-center gap-5 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 transition-all duration-200"
              style={{ borderColor: '#87CEEB', backgroundColor: i < pin.length ? '#87CEEB' : 'transparent', transform: i < pin.length ? 'scale(1.2)' : 'scale(1)' }} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 px-8 pb-6">
          {keys.map((k, idx) => {
            if (k === '') return <div key={idx} />;
            if (k === 'del') return (
              <button key={idx} onClick={() => setPin((p) => p.slice(0, -1))} disabled={pin.length === 0}
                className="h-16 rounded-2xl bg-white/70 flex items-center justify-center text-[#718096] hover:bg-white active:scale-95 transition-all disabled:opacity-30 shadow-sm" aria-label="Delete">
                <Delete className="w-5 h-5" />
              </button>
            );
            return (
              <button key={idx} onClick={() => handleKey(k)} disabled={pin.length >= 4}
                className="h-16 rounded-2xl bg-white shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center">
                <span className="text-2xl text-[#2D3748]" style={{ fontFamily: "'Fredoka One', cursive" }}>{k}</span>
              </button>
            );
          })}
        </div>

        <div className="text-center pb-8">
          <button onClick={onClose} className="text-sm font-semibold text-[#718096] hover:text-[#2D3748] transition-colors underline underline-offset-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Profile overlay ───────────────────────────────────────────────────────
function AddProfileOverlay({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState('');
  const [selectedTier, setSelectedTier] = useState(AGE_TIERS[0].value);
  const [selectedAvatar, setSelectedAvatar] = useState(STARTER_AVATARS[0].id);
  const [tierOpen, setTierOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 150); }, []);

  const tier = AGE_TIERS.find((t) => t.value === selectedTier)!;
  const avatar = STARTER_AVATARS.find((a) => a.id === selectedAvatar)!;

  const canSave = name.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(45,55,72,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        style={{ background: 'linear-gradient(160deg, #FFFBE8 0%, #FFE8ED 55%, #DFF1FB 100%)' }}
      >
        {/* ── Header ── */}
        <div className="relative flex items-center justify-center pt-6 pb-4 px-6 flex-shrink-0">
          <div className="flex flex-col items-center gap-2">
            {/* Live avatar preview */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all duration-200"
              style={{ backgroundColor: avatar.bg, boxShadow: `0 0 0 3px ${avatar.ring}` }}
            >
              {avatar.emoji}
            </div>
            <h2 className="text-xl text-[#2D3748]" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Create Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#718096] hover:bg-white transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-5 scrollbar-hide">

          {/* Name input */}
          <div>
            <label htmlFor="child-name" className="block text-xs font-bold text-[#718096] uppercase tracking-wide mb-2">
              Child's Name
            </label>
            <input
              id="child-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="Enter child's name"
              className="w-full px-4 py-3.5 rounded-2xl bg-white shadow-sm border-2 text-[#2D3748] font-bold text-base placeholder:text-[#CBD5E0] placeholder:font-normal focus:outline-none transition-all"
              style={{ fontFamily: "'Fredoka One', cursive", borderColor: name.length > 0 ? '#87CEEB' : '#E2E8F0' }}
            />
          </div>

          {/* Age tier selection */}
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wide mb-2">
              Age Group
            </label>
            {/* Custom dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setTierOpen((v) => !v)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border-2 transition-all focus:outline-none"
                style={{ borderColor: tierOpen ? tier.color : '#E2E8F0' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ backgroundColor: tier.bg }}>
                  {tier.value === '3-5' ? '🌱' : tier.value === '6-9' ? '⭐' : '🚀'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-[#2D3748]">{tier.label}</p>
                  <p className="text-xs text-[#A0AEC0]">{tier.sublabel}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#A0AEC0] transition-transform flex-shrink-0 ${tierOpen ? 'rotate-180' : ''}`} />
              </button>

              {tierOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-10 border border-[#E2E8F0]">
                  {AGE_TIERS.map((t) => {
                    const active = t.value === selectedTier;
                    return (
                      <button
                        key={t.value}
                        onClick={() => { setSelectedTier(t.value); setTierOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F7FAFC] ${active ? 'bg-[#F0F9FF]' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: t.bg }}>
                          {t.value === '3-5' ? '🌱' : t.value === '6-9' ? '⭐' : '🚀'}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-[#2D3748]">{t.label}</p>
                          <p className="text-xs text-[#A0AEC0]">{t.sublabel}</p>
                        </div>
                        {active && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tier pill row beneath dropdown for quick switching */}
            <div className="flex gap-2 mt-3">
              {AGE_TIERS.map((t) => {
                const active = t.value === selectedTier;
                return (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTier(t.value)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={active
                      ? { backgroundColor: t.color, color: '#fff', boxShadow: `0 3px 10px ${t.color}66` }
                      : { backgroundColor: t.bg, color: '#718096' }
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar grid — 4 starters */}
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wide mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {STARTER_AVATARS.map((av) => {
                const active = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none"
                    aria-label={av.label}
                    aria-pressed={active}
                  >
                    <div
                      className="w-full aspect-square rounded-2xl flex items-center justify-center text-4xl relative transition-all duration-150"
                      style={{
                        backgroundColor: av.bg,
                        boxShadow: active
                          ? `0 0 0 3px ${av.ring}, 0 4px 14px rgba(0,0,0,0.12)`
                          : '0 2px 6px rgba(0,0,0,0.06)',
                        transform: active ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {av.emoji}
                      {active && (
                        <div
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: av.ring }}
                        >
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

          {/* Save button */}
          <button
            onClick={() => { if (canSave) { onSave(name.trim()); onClose(); } }}
            disabled={!canSave}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-all active:scale-[0.98] disabled:opacity-40"
            style={{
              fontFamily: "'Fredoka One', cursive",
              background: 'linear-gradient(135deg, #87CEEB, #5BAED4)',
              boxShadow: canSave ? '0 5px 18px rgba(87,206,235,0.5)' : 'none',
            }}
          >
            Save Profile 🎉
          </button>

          {/* Cancel */}
          <div className="text-center pb-1">
            <button
              onClick={onClose}
              className="text-sm font-semibold text-[#A0AEC0] hover:text-[#718096] transition-colors underline underline-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile Selection screen ───────────────────────────────────────────────────
export function ProfileSelection() {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);

  const profiles = [
    { id: 'emma',   name: 'Emma',   age: '3-5 years old',   color: '#FFB6C1', emoji: '🧸' },
    { id: 'liam',   name: 'Liam',   age: '6-9 years old',   color: '#87CEEB', emoji: '🚀' },
    { id: 'sophia', name: 'Sophia', age: '10-12 years old', color: '#9DC183', emoji: '🎨' },
  ];

  return (
    <>
      <div className="min-h-full bg-gradient-to-br from-[#FFFDD0] via-[#FFB6C1]/20 to-[#87CEEB]/20 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-2" style={{
            background: 'linear-gradient(135deg, #87CEEB, #FFB6C1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Comic Sans MS, cursive',
          }}>
            PoppyToons
          </h1>
          <p className="text-xl text-[#2D3748] mt-4">Who's watching?</p>
          <p className="text-sm text-[#4A5568] mt-1.5 font-medium">
            Choose your profile to start watching
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-lg w-full">
          {profiles.map((profile) => (
            <button
              key={profile.name}
              onClick={() => navigate(`/home?profile=${profile.id}`)}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-4 transition-all hover:scale-105 hover:shadow-xl"
              style={{ borderColor: profile.color }}
            >
              <div
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-3"
                style={{ backgroundColor: profile.color }}
              >
                {profile.emoji}
              </div>
              <h3 className="text-lg text-[#2D3748] mb-1">{profile.name}</h3>
              <p className="text-sm text-[#718096]">{profile.age}</p>
            </button>
          ))}

          {/* Add Profile button */}
          <button
            onClick={() => setShowAddProfile(true)}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border-4 border-dashed border-[#CBD5E0] hover:border-[#87CEEB] transition-all hover:scale-105 flex flex-col items-center justify-center group focus:outline-none focus:border-[#87CEEB]"
          >
            <div className="w-24 h-24 rounded-full bg-[#EDF2F7] group-hover:bg-[#DFF1FB] flex items-center justify-center mb-3 transition-colors">
              <Plus className="w-12 h-12 text-[#A0AEC0] group-hover:text-[#5BAED4] transition-colors" />
            </div>
            <p className="text-sm text-[#718096] group-hover:text-[#3BA3D0] font-semibold transition-colors">Add Profile</p>
          </button>
        </div>

        <button
          onClick={() => setShowPin(true)}
          className="mt-12 flex items-center gap-2 px-6 py-3 bg-[#9DC183] text-white rounded-full hover:bg-[#8BAF72] transition-all"
        >
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>Parent Controls</span>
        </button>
      </div>

      {showPin && (
        <PinModal
          onClose={() => setShowPin(false)}
          onSuccess={() => { setShowPin(false); navigate('/parent-dashboard'); }}
        />
      )}

      {showAddProfile && (
        <AddProfileOverlay
          onClose={() => setShowAddProfile(false)}
          onSave={(name) => { console.log('New profile created:', name); }}
        />
      )}
    </>
  );
}
