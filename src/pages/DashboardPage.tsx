import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Settings,
  Download,
  LogOut,
  Clock,
  Zap,
  Sparkles,
  FileText,
  TrendingUp,
  Activity,
  Calendar,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { supabase } from '../lib/supabase';

const mockClarityData = [
  { name: 'Mon', score: 82 },
  { name: 'Tue', score: 85 },
  { name: 'Wed', score: 84 },
  { name: 'Thu', score: 89 },
  { name: 'Fri', score: 92 },
  { name: 'Sat', score: 94 },
  { name: 'Sun', score: 96 },
];

const mockUsageData = [
  { name: 'Mon', words: 1200 },
  { name: 'Tue', words: 1800 },
  { name: 'Wed', words: 1500 },
  { name: 'Thu', words: 2200 },
  { name: 'Fri', words: 2800 },
  { name: 'Sat', words: 900 },
  { name: 'Sun', words: 1100 },
];

// Generate 30 days of heatmap data
const mockHeatmapData = Array.from({ length: 30 }, (_, i) => {
  const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
  return { id: i, intensity, date: `Day ${i + 1}`, sessions: intensity * 3 };
});

export default function DashboardPage() {
  const [usageFilter, setUsageFilter] = useState('7 days');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
  };

  const clarityData = mockClarityData;
  const usageData = mockUsageData;
  const heatmapData = mockHeatmapData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-offwhite relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#FF9A9E]/20 to-[#FECFEF]/20 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-black/5 flex flex-col h-screen sticky top-0 z-20">
        <div className="p-6 flex flex-col gap-4 mb-2">
          <span className="font-display font-bold text-2xl text-charcoal tracking-tight italic">Utterly.</span>
          <div className="w-full bg-primary/10 text-primary py-2 px-3 rounded-xl font-medium flex items-center gap-2 text-sm border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            Extension Active
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/5 text-primary font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate hover:bg-black/5 hover:text-charcoal transition-colors font-medium">
            <Settings size={18} />
            Settings
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate hover:bg-black/5 hover:text-charcoal transition-colors font-medium w-full text-left">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 h-screen overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto">

          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-charcoal">Welcome back, {user?.user_metadata?.display_name?.split(' ')[0] || 'there'}</h1>
              <p className="text-slate">Here's how you're communicating today.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-black/5 overflow-hidden shadow-sm flex items-center justify-center text-charcoal font-bold text-lg">
              {user?.user_metadata?.display_name ? user.user_metadata.display_name.charAt(0).toUpperCase() : 'U'}
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* PRIMARY PERFORMANCE - HERO */}
            <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 via-[#FF9A9E]/5 to-transparent rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

              <div className="flex-1 relative z-10 mb-8 md:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate/5 text-slate text-sm font-semibold uppercase tracking-widest border border-black/5">
                    <Clock size={16} /> Time Saved
                  </div>

                  <div className="relative hidden md:block">
                    <select
                      value={usageFilter}
                      onChange={(e) => setUsageFilter(e.target.value)}
                      className="appearance-none bg-white px-5 py-2 pr-10 rounded-full border border-black/5 text-sm text-charcoal font-semibold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-offwhite transition-colors"
                    >
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal pointer-events-none" />
                  </div>
                </div>

                <h2 className="text-7xl md:text-[5.5rem] font-bold text-charcoal tracking-tight leading-none mb-4">4h 12m</h2>
                <p className="text-xl text-slate font-medium">Extra time recovered this week vs. manual typing.</p>
              </div>

              <div className="w-full md:w-auto flex flex-row md:flex-col gap-4 relative z-10 border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-10">
                <div className="flex-1 md:flex-none">
                  <div className="text-slate text-sm font-semibold uppercase tracking-widest mb-1">Avg Speed</div>
                  <div className="text-4xl font-bold text-charcoal mb-1">145<span className="text-lg text-slate/50 font-medium ml-1">WPM</span></div>
                  <div className="text-sm font-semibold text-primary">Above typing average</div>
                </div>
                <div className="hidden md:block w-full h-px bg-black/5 my-2"></div>
                <div className="flex-1 md:flex-none">
                  <div className="text-slate text-sm font-semibold uppercase tracking-widest mb-1">Clarity Score</div>
                  <div className="text-4xl font-bold text-charcoal mb-1">96<span className="text-lg text-slate/50 font-medium ml-1">/100</span></div>
                  <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp size={14} /> +2.4 in 30 days
                  </div>
                </div>
              </div>

              <div className="w-full relative mt-6 md:hidden">
                <select
                  value={usageFilter}
                  onChange={(e) => setUsageFilter(e.target.value)}
                  className="w-full appearance-none bg-white px-5 py-3 pr-10 rounded-full border border-black/5 text-sm text-charcoal font-semibold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-offwhite transition-colors"
                >
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal pointer-events-none" />
              </div>
            </div>

            {/* YOUR COMMUNICATION GROWTH - SIDE BY SIDE */}
            <div className="bg-white/40 rounded-[2.5rem] p-8 border border-black/5">
              <h3 className="text-2xl font-bold text-charcoal mb-8 border-b border-black/5 pb-4">Your Communication Growth</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Usage Chart */}
                <div className="flex flex-col h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-semibold text-slate uppercase tracking-widest">Volume Processed</div>
                    <div className="text-2xl font-bold text-charcoal">11.5k <span className="text-sm font-medium text-slate">words</span></div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={usageData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dx={-10} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                          itemStyle={{ color: '#0D9488', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="words" stroke="url(#growthGradient)" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                        <defs>
                          <linearGradient id="growthGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0D9488" />
                            <stop offset="100%" stopColor="#FF9A9E" />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Clarity Chart */}
                <div className="flex flex-col h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-semibold text-slate uppercase tracking-widest">Clarity Score</div>
                    <div className="text-2xl font-bold text-charcoal">96 <span className="text-sm font-medium text-slate">avg</span></div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={clarityData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dx={-10} />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                          itemStyle={{ color: '#FF9A9E', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="url(#growthGradient)" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

            {/* ENGAGEMENT & HISTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Heatmap (Dominant Left) */}
              <div className="lg:col-span-8 bg-white/40 rounded-[2.5rem] p-8 border border-black/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-charcoal">Consistency</h3>
                  <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                    7 Day Streak
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {heatmapData.map((day) => {
                    let bgColor = 'bg-slate/10';
                    if (day.intensity === 1) bgColor = 'bg-[#0D9488]/30';
                    if (day.intensity === 2) bgColor = 'bg-[#0D9488]/50';
                    if (day.intensity === 3) bgColor = 'bg-[#0D9488]/70';
                    if (day.intensity === 4) bgColor = 'bg-[#0D9488]';

                    return (
                      <div
                        key={day.id}
                        className={`w-6 h-6 rounded-md ${bgColor} cursor-pointer hover:ring-2 hover:ring-charcoal/20 transition-all relative group/tooltip`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-xs font-medium rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                          {day.date}: {day.sessions} sessions
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm text-slate font-medium">Daily habit building over the last 30 days.</div>
              </div>

              {/* Lifetime & App Usage (Stacked Right) */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-white/40 rounded-[2.5rem] p-8 border border-black/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate uppercase tracking-widest mb-1">Lifetime Words</div>
                    <div className="text-3xl font-bold text-charcoal">48.2k</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate/5 flex items-center justify-center text-slate">
                    <FileText size={20} />
                  </div>
                </div>

                <div className="bg-white/40 rounded-[2.5rem] p-8 border border-black/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate uppercase tracking-widest mb-1">Avg Session</div>
                    <div className="text-3xl font-bold text-charcoal">4m 12s</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate/5 flex items-center justify-center text-slate">
                    <Clock size={20} />
                  </div>
                </div>

                {/* Subtle Integration Breakdown */}
                <div className="px-4 py-2 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="text-xs font-semibold text-slate uppercase tracking-widest mb-3">Top Platforms</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-sm text-charcoal font-medium">Gmail (45%)</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF9A9E]"></div><span className="text-sm text-charcoal font-medium">Notion (30%)</span></div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
