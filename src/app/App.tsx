import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProfileSelection } from './components/ProfileSelection';
import { Homepage } from './components/Homepage';
import { SearchPage } from './components/SearchPage';
import { MovieDetail } from './components/MovieDetail';
import { ParentDashboard } from './components/ParentDashboard';
import { ProfilePage } from './components/ProfilePage';

// ── Phone frame constants ─────────────────────────────────────────────────────
const FRAME_W = 375;
const FRAME_H = 812;

export default function App() {
  return (
    <BrowserRouter>
      {/* Desktop canvas */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          padding: '24px',
        }}
      >
        {/* Phone chrome shell */}
        <div
          style={{
            position: 'relative',
            width: FRAME_W,
            height: FRAME_H,
            borderRadius: 48,
            boxShadow: [
              '0 0 0 2px rgba(255,255,255,0.08)',     // inner rim
              '0 0 0 10px #1a1a2a',                   // bezel
              '0 0 0 12px rgba(255,255,255,0.06)',     // outer rim
              '0 40px 100px rgba(0,0,0,0.7)',          // shadow
              '0 10px 30px rgba(0,0,0,0.5)',
            ].join(', '),
            flexShrink: 0,
          }}
        >
          {/* ── Screen area ─────────────────────────────────────────────────
              transform: translateZ(0) is the KEY:
              it makes this element the "containing block" for all
              position:fixed descendants, scoping BottomNav, FABs, and
              modals to the 375×812 frame instead of the viewport.
          ─────────────────────────────────────────────────────────────────── */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 42,
              overflow: 'hidden',
              position: 'relative',
              transform: 'translateZ(0)',  // scopes position:fixed children
              background: '#FFFEF7',       // fallback before first route paints
            }}
          >
            {/* Status bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 44,
                zIndex: 999,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: '0 28px 6px',
                pointerEvents: 'none',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 100%)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em', fontFamily: 'system-ui' }}>
                9:41
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                  {[0,1,2,3].map((i) => (
                    <rect key={i} x={i * 4.5} y={12 - (i + 1) * 3} width="3" height={(i + 1) * 3} rx="0.8"
                      fill={`rgba(255,255,255,${i < 3 ? 0.85 : 0.35})`} />
                  ))}
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="rgba(255,255,255,0.85)" />
                  <path d="M4.5 7C5.9 5.6 6.9 5 8 5s2.1.6 3.5 2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M1.5 4C3.5 2 5.6 1 8 1s4.5 1 6.5 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {/* Battery */}
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="rgba(255,255,255,0.5)" />
                  <rect x="2" y="2" width="16" height="8" rx="1.5" fill="rgba(255,255,255,0.85)" />
                  <path d="M22.5 4v4a2 2 0 0 0 0-4Z" fill="rgba(255,255,255,0.5)" />
                </svg>
              </div>
            </div>

            {/* Dynamic Island pill */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 120,
                height: 34,
                backgroundColor: '#000',
                borderRadius: 20,
                zIndex: 1000,
                pointerEvents: 'none',
              }}
            />

            {/* Scrollable app content
                height: 100% fills the screen area so min-h-full in each
                screen component resolves to exactly 812px (minus status bar).
            */}
            <div
              style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                // Pass height context down so `min-h-full` in screens works
                display: 'flex',
                flexDirection: 'column',
              }}
              className="scrollbar-hide"
            >
              <Routes>
                <Route path="/"                    element={<ProfileSelection />} />
                <Route path="/home"                element={<Homepage />} />
                <Route path="/search"              element={<SearchPage />} />
                <Route path="/movie/:id"           element={<MovieDetail />} />
                <Route path="/parent-dashboard"    element={<ParentDashboard />} />
                <Route path="/profile/:profileId"  element={<ProfilePage />} />
                <Route path="*"                    element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
