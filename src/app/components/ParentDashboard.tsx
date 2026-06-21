import { ChevronLeft, Clock, Shield, Activity, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const childProfiles = [
  { name: 'Emma', age: '3-5 years', emoji: '🧸', color: '#FFB6C1' },
  { name: 'Liam', age: '6-9 years', emoji: '🚀', color: '#87CEEB' },
  { name: 'Sophia', age: '10-12 years', emoji: '🎨', color: '#9DC183' },
];

const categories = ['Movies', 'Sing Along', 'Educational', 'Animation'];

export function ParentDashboard() {
  const navigate = useNavigate();
  const [screenTime, setScreenTime] = useState('1 hour');
  const [ageFilter, setAgeFilter] = useState('3-5 years');
  const [selectedProfile, setSelectedProfile] = useState(childProfiles[0]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Movies', 'Educational']);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const recentActivity = [
    { title: 'Magical Forest', image: '🌳', time: '45 min' },
    { title: 'Space Adventure', image: '🚀', time: '30 min' },
    { title: 'Underwater World', image: '🐠', time: '25 min' },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-[#FFB6C1]/20 to-[#9DC183]/20">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg mr-4"
          >
            <ChevronLeft className="w-6 h-6 text-[#2D3748]" />
          </button>
          <h1 className="text-2xl text-[#2D3748]">Parent Control</h1>
        </div>

        <div className="space-y-6">

          {/* Child profile selector */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="w-full flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: selectedProfile.color }}
              >
                {selectedProfile.emoji}
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-[#718096] font-semibold uppercase tracking-wide leading-none mb-0.5">Managing</p>
                <p className="text-sm font-bold text-[#2D3748]">
                  {selectedProfile.name}, {selectedProfile.age}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#718096] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20 border border-[#E2E8F0]">
                {childProfiles.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { setSelectedProfile(p); setShowProfileMenu(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F7FAFC] transition-colors ${
                      selectedProfile.name === p.name ? 'bg-[#F0F9FF]' : ''
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.emoji}
                    </div>
                    <span className="text-sm font-semibold text-[#2D3748]">{p.name}, {p.age}</span>
                    {selectedProfile.name === p.name && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#87CEEB]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FFB6C1]/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#FFB6C1]" />
              </div>
              <h2 className="text-lg text-[#2D3748]">Set Screen Time</h2>
            </div>
            <select
              value={screenTime}
              onChange={(e) => setScreenTime(e.target.value)}
              className="w-full p-4 bg-[#FFB6C1]/20 rounded-2xl text-[#2D3748] border-none"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>3 hours</option>
              <option>Unlimited</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#87CEEB]/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#87CEEB]" />
              </div>
              <h2 className="text-lg text-[#2D3748]">Filter Content</h2>
            </div>
            <div className="flex gap-3 mb-4">
              {['3-5 years', '6-9 years', '10-12 years'].map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeFilter(age)}
                  className={`flex-1 py-3 rounded-2xl text-sm transition-all ${
                    ageFilter === age
                      ? 'bg-[#87CEEB] text-white shadow-lg'
                      : 'bg-[#87CEEB]/20 text-[#2D3748]'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                      active
                        ? 'text-white shadow-sm'
                        : 'bg-[#EDF2F7] text-[#718096] hover:bg-[#E2E8F0]'
                    }`}
                    style={active ? { background: 'linear-gradient(135deg, #87CEEB, #5BAED4)' } : {}}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9DC183]/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#9DC183]" />
              </div>
              <h2 className="text-lg text-[#2D3748]">Recent Activity Report</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#9DC183]/10 rounded-xl"
                >
                  <div className="w-12 h-12 bg-[#9DC183]/30 rounded-xl flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#2D3748]">{item.title}</p>
                    <p className="text-xs text-[#718096]">{item.time} watched</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-4 py-3.5 text-white rounded-full font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #6DBF52, #4EA63A)',
                boxShadow: '0 4px 14px rgba(78,166,58,0.45)',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
