import { Home, Search, User } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router';

/** Resolve the active profile slug from wherever it might live in the URL. */
function useProfileSlug(): string {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams<{ profileId?: string }>();

  // 1. /profile/:profileId route param
  if (params.profileId) return params.profileId;
  // 2. ?profile= query param (home, search)
  const qp = searchParams.get('profile');
  if (qp) return qp;
  // 3. Derive from pathname if it embeds the slug
  const match = location.pathname.match(/\/profile\/(\w+)/);
  if (match) return match[1];
  // 4. fallback
  return 'emma';
}

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = useProfileSlug();

  const navItems = [
    { icon: Home,   label: 'Home',    path: `/home?profile=${slug}` },
    { icon: Search, label: 'Search',  path: `/search?profile=${slug}` },
    { icon: User,   label: 'Profile', path: `/profile/${slug}` },
  ];

  const isActive = (path: string) => {
    const base = path.split('?')[0];
    return location.pathname === base;
  };

  // Sophia gets a dark nav bar to match her theme
  const isSophia = slug === 'sophia';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-sm rounded-t-3xl"
      style={isSophia
        ? { backgroundColor: 'rgba(20,30,50,0.96)', borderColor: '#2A3F60' }
        : { backgroundColor: 'rgba(157,193,131,0.3)', borderColor: 'rgba(157,193,131,0.3)' }
      }
    >
      <div className="flex justify-around items-center py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-6 py-2 transition-all ${
                isSophia ? 'rounded-xl' : 'rounded-2xl'
              } ${active ? 'scale-110' : 'hover:opacity-80'}`}
              style={active
                ? isSophia
                  ? { backgroundColor: '#1E3A6E', color: '#6FB3F5' }
                  : { backgroundColor: '#87CEEB', color: 'white' }
                : { color: isSophia ? '#8BA3C4' : '#2D3748' }
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
