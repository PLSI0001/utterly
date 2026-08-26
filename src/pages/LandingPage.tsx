import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Shield, Sparkles, ChevronDown, CheckCircle2, Activity, BarChart2 } from 'lucide-react';
import { SiSlack, SiNotion, SiGmail, SiLinear, SiJira, SiDiscord, SiGooglechrome, SiSalesforce, SiGithub, SiTrello, SiFigma, SiZoom, SiStripe, SiAsana, SiHubspot, SiZendesk } from 'react-icons/si';
import HowItWorksSection from '../components/HowItWorksSection';

const faqs = [
  { question: "Is this secure?", answer: "Yes. All voice processing is encrypted and we never use your personal data to train public models." },
  { question: "How is data handled & who owns it?", answer: "You own all your data. We do not use your recordings or transcripts to train our AI models." },
  { question: "What is the typical latency?", answer: "Utterly aims for real-time processing, with most speech-to-refined-text output appearing in less than 3 seconds." },
  { question: "Is the accuracy really that good?", answer: "We use top-tier models for transcription. Combined with our instantly refined output, the final text boasts exceptionally high accuracy, seamlessly cutting out stutters and filler words." },
  { question: "Does it work in any website?", answer: "Yes! If you can type in it, the Utterly Chrome extension will work exactly at your cursor position." },
];

const toneExamples = {
  Professional: "I suggest we briefly postpone the launch to ensure everything is fully prepared.",
  Casual: "Maybe we should hold off on the launch for a bit just to be safe.",
  Persuasive: "I recommend pausing the launch temporarily to ensure flawless execution and mitigate potential risk."
};
type ToneOption = keyof typeof toneExamples;

const MOTION = { duration: { fast: 0.2, medium: 0.4, slow: 1 }, ease: [0.25, 1, 0.5, 1] as const };

const integrationLogosTop = [
  { name: 'Discord', color: '#5865F2', icon: SiDiscord },
  { name: 'Chrome', color: '#4285F4', icon: SiGooglechrome },
  { name: 'Salesforce', color: '#00A1E0', icon: SiSalesforce },
  { name: 'Slack', color: '#E01E5A', icon: SiSlack },
  { name: 'Notion', color: '#000000', icon: SiNotion },
  { name: 'Gmail', color: '#EA4335', icon: SiGmail },
  { name: 'Linear', color: '#5E6AD2', icon: SiLinear },
  { name: 'Jira', color: '#0052CC', icon: SiJira }
];

const integrationLogosBottom = [
  { name: 'Figma', color: '#F24E1E', icon: SiFigma },
  { name: 'GitHub', color: '#181717', icon: SiGithub },
  { name: 'Trello', color: '#0052CC', icon: SiTrello },
  { name: 'Asana', color: '#273347', icon: SiAsana },
  { name: 'Zoom', color: '#0B5CFF', icon: SiZoom },
  { name: 'Stripe', color: '#008CDD', icon: SiStripe },
  { name: 'HubSpot', color: '#FF7A59', icon: SiHubspot },
  { name: 'Zendesk', color: '#03363D', icon: SiZendesk }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [demoTone, setDemoTone] = useState<ToneOption>('Persuasive');
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'faq'];
      let current = 'home';

      for (const section of sections) {
        if (section === 'home') continue;
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-primary/20" onMouseMove={handleMouseMove}>
      {/* Background Interactive Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-tr from-primary/15 to-[#FF9A9E]/15 pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 100, mass: 0.8 }}
      />

      {/* Grid Pattern overlaid on top of glow */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-10" />
      <div className="absolute inset-0 bg-noise pointer-events-none z-50" />

      {/* Floating Shell */}
      <div className="max-w-[1600px] mx-auto min-h-screen relative z-10 px-4 sm:px-6 lg:px-8 py-6 flex flex-col">

        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-black/5 rounded-full px-6 py-4 flex items-center justify-between sticky top-6 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-charcoal tracking-tight italic">Utterly.</span>
          </div>

          <nav className="hidden md:flex items-center gap-2 bg-slate/5 p-1 rounded-full border border-black/5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'how-it-works', label: 'How it Works' },
              { id: 'faq', label: 'FAQ' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ${activeSection === link.id
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-slate hover:text-charcoal hover:bg-black/5'
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-slate hover:text-charcoal transition-colors hidden sm:block">Log in</Link>
            <Link to="/auth?mode=signup" className="btn-premium px-6 py-2.5 text-sm">
              Sign Up for Beta
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main id="home" className="flex-1 flex flex-col justify-center mt-20 mb-20 relative">

          {/* Massive soft pink/orange blur behind the hero section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-[#FF9A9E]/30 to-[#FFD194]/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/10 mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Currently in Private Beta</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-[84px] leading-[0.95] font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FFD194] pb-3"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
              >
                Write at the <br />
                Speed of Thought
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay: 0.2 }}
                className="text-xl text-slate max-w-2xl mb-6 leading-relaxed"
              >
                Speak naturally and let Utterly transform your raw speech into polished, professional text instantly across any website.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.duration.slow, ease: MOTION.ease, delay: 0.25 }}
                className="text-lg font-medium text-slate-600 mb-10 flex flex-wrap items-center gap-2"
              >
                <span>Speak at 160+ WPM</span>
                <span className="text-slate-300">→</span>
                <span>polished text in seconds</span>
                <span className="text-slate-300">→</span>
                <span>inserts anywhere you type.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Link to="/auth?mode=signup" className="w-full sm:w-auto btn-premium px-10 py-4 text-lg flex items-center justify-center transition-all duration-500 font-semibold ring-1 ring-white/20">
                    Start New Session
                  </Link>
                </motion.div>
                <span className="text-sm text-slate/70 px-4 font-medium flex items-center gap-2">
                  <Shield size={14} className="opacity-50" />
                  No credit card. Private beta.
                </span>
              </motion.div>
            </div>

            {/* Right Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Chrome Extension Mockup */}
                <div className="glass-card p-6 w-full max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#FF9A9E]"></div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-charcoal">Utterly is listening...</h3>
                        <p className="text-xs text-slate">Speak naturally</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-slate/5 rounded-full w-3/4"></div>
                    <div className="h-4 bg-slate/5 rounded-full w-full"></div>
                    <div className="h-4 bg-slate/5 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate/5 rounded-full w-1/2"></div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/40 border border-white/60">
                    <p className="text-sm text-charcoal font-medium leading-relaxed">
                      "I need to send an update to the team about the new design system. It's looking great, but we should probably tweak the border radiuses to be a bit softer."
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate font-medium">
                      <Sparkles size={14} className="text-primary" />
                      Auto-polishing
                    </div>
                    <button className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-charcoal/90 transition-colors">
                      Insert Text
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements behind mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[80px] -z-10"></div>
            </div>
          </div>

          <div className="mt-32 pt-16 border-t border-black/5 relative z-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4 text-center">Works everywhere you write.</h2>
            <p className="text-lg text-slate text-center mb-12">No copy/paste. Inserts at your cursor in any text field.</p>

            <div className="relative overflow-hidden flex flex-col gap-8 py-6 group">
              {/* Fade Masks */}
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-offwhite via-offwhite/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-offwhite via-offwhite/80 to-transparent z-10 pointer-events-none"></div>

              {/* Top Row moving Left */}
              <div
                className="flex items-center gap-8 whitespace-nowrap w-max animate-[marqueeLeft_40s_linear_infinite] group-hover:[animation-play-state:paused] pr-8"
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8">
                    {integrationLogosTop.map((logo, idx) => {
                      const Icon = logo.icon;
                      return (
                        <div key={idx} className="group/pill relative flex items-center gap-3 px-7 py-3.5 bg-white/95 backdrop-blur-xl border border-black/5 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate/5 transition-colors duration-300 group-hover/pill:bg-[var(--hover-color)]" style={{ '--hover-color': `${logo.color}15` } as React.CSSProperties}>
                            <Icon size={18} className="text-slate transition-colors duration-300 group-hover/pill:text-[var(--hover-color)]" style={{ '--hover-color': logo.color } as React.CSSProperties} />
                          </div>
                          <span className="font-display font-semibold text-lg text-charcoal">{logo.name}</span>

                          {/* Hover Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Works in: {logo.name}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal rotate-45"></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Bottom Row moving Right */}
              <div
                className="flex items-center gap-8 whitespace-nowrap w-max animate-[marqueeRight_45s_linear_infinite] group-hover:[animation-play-state:paused] pr-8"
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-8">
                    {integrationLogosBottom.map((logo, idx) => {
                      const Icon = logo.icon;
                      return (
                        <div key={idx} className="group/pill relative flex items-center gap-3 px-7 py-3.5 bg-white/95 backdrop-blur-xl border border-black/5 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer scale-95 origin-center">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate/5 transition-colors duration-300 group-hover/pill:bg-[var(--hover-color)]" style={{ '--hover-color': `${logo.color}15` } as React.CSSProperties}>
                            <Icon size={18} className="text-slate transition-colors duration-300 group-hover/pill:text-[var(--hover-color)]" style={{ '--hover-color': logo.color } as React.CSSProperties} />
                          </div>
                          <span className="font-display font-semibold text-lg text-charcoal">{logo.name}</span>

                          {/* Hover Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Works in: {logo.name}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal rotate-45"></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Dashboard Preview Section */}
        <section className="py-40 relative">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-20 items-center">

            <div className="xl:col-span-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate/5 text-slate text-xs font-bold uppercase tracking-widest mb-6">
                <BarChart2 size={14} /> Analytics First
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-charcoal mb-8 leading-[1.1]">Track Your <br />Communication <br />Performance</h2>
              <p className="text-xl text-slate mb-10 leading-relaxed">
                Utterly is more than just dictation. It's an analytics-driven productivity tool that helps you understand how much time you're saving and how your communication clarity improves over time.
              </p>
              <div className="space-y-6">
                <div className="flex flex-col gap-1 border-l-2 border-primary pl-4">
                  <span className="text-charcoal font-bold">Monitor your speed</span>
                  <span className="text-slate text-sm">Track your average speaking WPM over weeks.</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-[#FF9A9E] pl-4">
                  <span className="text-charcoal font-bold">Clarity score improvements</span>
                  <span className="text-slate text-sm">See how your natural articulation gets better.</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-black/20 pl-4">
                  <span className="text-charcoal font-bold">Time saved</span>
                  <span className="text-slate text-sm">Quantify exactly how many hours you save weekly.</span>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7 relative max-w-[900px] w-full mx-auto">
              <div className="absolute inset-0 bg-slate/5 rounded-[2rem] transform rotate-3 scale-105 -z-10 blur-sm"></div>
              <div className="bg-white rounded-[2rem] border border-black/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 relative z-10 overflow-hidden transform -rotate-1 hover:rotate-0 hover:scale-[1.01] transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-[#FF9A9E]"></div>

                {/* Mockup Top Bar */}
                <div className="flex items-center justify-between mb-10 pb-4 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-sm font-semibold text-slate uppercase tracking-widest">Dashboard</div>
                  <div className="w-8 h-8 rounded-full bg-slate/10"></div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Top KPIs */}
                  <div className="col-span-1 bg-offwhite rounded-2xl p-6 border border-black/5">
                    <div className="text-sm font-semibold text-slate mb-2">Time Saved This Week</div>
                    <div className="text-4xl font-bold text-charcoal">4h 12m</div>
                    <div className="text-xs font-medium text-emerald-600 mt-2">↑ 12% vs last week</div>
                  </div>
                  <div className="col-span-1 bg-offwhite rounded-2xl p-6 border border-black/5">
                    <div className="text-sm font-semibold text-slate mb-2">Clarity Score</div>
                    <div className="text-4xl font-bold text-charcoal">96<span className="text-lg text-slate/50">/100</span></div>
                    <div className="text-xs font-medium text-emerald-600 mt-2">↑ 2.4 points</div>
                  </div>
                  <div className="col-span-1 bg-offwhite rounded-2xl p-6 border border-black/5 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="text-sm font-semibold text-slate mb-2">Avg Speed</div>
                      <div className="text-4xl font-bold text-charcoal">160+ <span className="text-lg text-slate/50">WPM</span></div>
                    </div>
                    {/* Gauge Visual */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 -mb-4 -mr-4">
                      <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 10 50 A 40 40 0 0 1 75 25" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="col-span-3 bg-offwhite rounded-2xl p-6 border border-black/5 h-48 flex flex-col">
                    <div className="text-sm font-semibold text-slate mb-4">Usage & Clarity Trend</div>
                    <div className="flex-1 w-full relative flex items-end gap-2 px-2">
                      {/* Fake bars for a chart */}
                      {[40, 60, 45, 80, 50, 90, 75, 85, 60, 100, 80, 95].map((h, i) => (
                        <div key={i} className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-gradient-to-t from-primary/80 to-[#FF9A9E]/80 rounded-t-sm" style={{ height: `${h * 0.4}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 border-t border-black/5">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">Everything you need to <br />communicate better.</h2>
            <p className="text-lg text-slate max-w-2xl">Utterly combines advanced speech recognition with AI-powered text refinement to make you sound your best.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[320px]">
            {/* Tone Selection Highlight (2 cols, 2 rows) */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2rem] border border-black/5 shadow-md p-8 flex flex-col relative overflow-hidden group">

              <div className="w-12 h-12 rounded-2xl bg-slate/5 shadow-inner flex items-center justify-center text-charcoal mb-6 relative z-10">
                <Activity size={24} />
              </div>
              <h3 className="text-3xl font-bold text-charcoal mb-4 relative z-10">Transform Your Tone</h3>
              <p className="text-slate mb-10 relative z-10 max-w-sm text-lg">Shift from casual meandering to persuasive authority with a single click.</p>

              <div className="mt-auto relative z-10 flex flex-col gap-6">

                {/* Before text */}
                <div className="bg-offwhite rounded-2xl p-5 border border-black/5 opacity-60">
                  <div className="text-xs font-bold text-slate uppercase tracking-widest mb-2 flex justify-between">
                    <span>Raw Input</span>
                    <span className="text-red-400">12s</span>
                  </div>
                  <div className="text-slate font-medium text-sm leading-relaxed">
                    "So um, I was thinking like maybe we should wait a bit on the launch... you know, just to be sure?"
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-center -my-9 z-20 relative">
                  <div className="bg-white p-2 rounded-full shadow-lg border border-black/10">
                    <ChevronDown size={20} className="text-primary" />
                  </div>
                </div>

                {/* After text */}
                <div className="relative">
                  <div className="absolute inset-x-0 -bottom-2 h-full bg-gradient-to-r from-primary to-[#FF9A9E] opacity-20 blur-xl -z-10 rounded-2xl transition-opacity duration-500 group-hover:opacity-40"></div>
                  <div className="bg-charcoal rounded-2xl p-6 border border-black/10 shadow-xl shadow-primary/10 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        {demoTone} Output
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                          className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors bg-white/10 px-2 py-1 rounded-md"
                        >
                          Change Tone <ChevronDown size={12} className={`transition-transform ${isDemoDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isDemoDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 top-full mt-2 w-36 bg-[#2a2a2a] rounded-lg border border-white/10 shadow-xl overflow-hidden z-20"
                            >
                              {(['Professional', 'Casual', 'Persuasive'] as ToneOption[]).map(tone => (
                                <button
                                  key={tone}
                                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${demoTone === tone ? 'bg-primary/20 text-primary font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                                  onClick={() => {
                                    setDemoTone(tone);
                                    setIsDemoDropdownOpen(false);
                                  }}
                                >
                                  {tone}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="text-white font-medium text-lg leading-relaxed min-h-[5rem] flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={demoTone}
                          initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={{ opacity: 0, filter: "blur(4px)", y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          "{toneExamples[demoTone]}"
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Medium Feature Card (2 cols, 1 row) */}
            <div className="md:col-span-2 glass-card p-8 flex flex-col relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-[#FF9A9E] mb-4">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">3-4x Faster than Typing</h3>
                </div>

                {/* RPM Gauge Visualization */}
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 50 A 40 40 0 0 1 85 20" fill="none" stroke="#0D9488" strokeWidth="8" strokeLinecap="round" className="drop-shadow-md" />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className="block text-2xl font-bold text-charcoal leading-none">160+</span>
                    <span className="text-[10px] font-semibold text-slate uppercase tracking-wider">WPM</span>
                  </div>
                </div>
              </div>
              <p className="text-slate text-sm relative z-10 mt-auto">Speak at your natural pace. High-accuracy transcription with instant refinement saves you hours of typing every week.</p>
            </div>

            {/* Small Feature Card (1 col, 1 row) */}
            <div className="glass-card p-8 flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-primary mb-4 relative z-10">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2 relative z-10">Private & Secure</h3>
              <p className="text-slate text-sm relative z-10 mt-auto">Your voice data is processed securely and never used to train public models.</p>
            </div>

            {/* Small Feature Card (1 col, 1 row) */}
            <div className="glass-card p-8 flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-purple-500 mb-4 relative z-10">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2 relative z-10">Works Anywhere</h3>
              <p className="text-slate text-sm relative z-10 mt-auto">Use Utterly in Gmail, Notion, Slack, or any text field on the web.</p>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="pt-40 pb-16 relative">
          {/* Subtle background tint for the entire section to override the grid slightly */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF9A9E]/[0.02] to-transparent pointer-events-none -z-10"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">

            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-charcoal mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-slate-600">Everything you need to know about Utterly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">

              {/* Left Column: Questions List (6 cols) */}
              <div className="md:col-span-6 flex flex-col relative z-10">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-black/5 rounded-full"></div>

                {faqs.map((faq, index) => {
                  const isActive = openFaq === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setOpenFaq(index)}
                      className={`relative pl-8 pr-4 py-4 text-left transition-all duration-300 group rounded-r-xl
                        ${isActive ? 'bg-primary/5 translate-x-0.5' : 'hover:pl-9'}`}
                    >
                      {/* Gradient Accent Rail (4px width) */}
                      {isActive && (
                        <motion.div
                          layoutId="active-faq-rail"
                          className="absolute left-[0px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-primary to-[#FF9A9E] rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <span className={`block font-display text-lg transition-all duration-300 ${isActive ? 'text-charcoal font-semibold opacity-100' : 'text-slate group-hover:text-charcoal font-medium opacity-75'}`}>
                        {faq.question}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Right Column: Answers Display (6 cols) */}
              <div className="md:col-span-6 py-5 relative z-10 flex min-h-[220px] md:mt-3">

                {/* Answer Container w/ subtle glow behind */}
                <div className="relative w-full">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-primary/10 to-[#FF9A9E]/10 rounded-full blur-[60px] -z-10"></div>

                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] w-full flex flex-col justify-center relative overflow-hidden h-full">

                    {/* Subtle Top Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-[#FF9A9E] opacity-50"></div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={openFaq ?? 'empty'}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex flex-col h-full justify-center"
                      >
                        {openFaq !== null && (
                          <>
                            <h3 className="text-2xl font-display font-bold text-charcoal mb-4">
                              {faqs[openFaq].question}
                            </h3>
                            <p className="text-lg text-slate leading-[1.7] opacity-90">
                              {faqs[openFaq].answer}
                            </p>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Massive Bottom CTA */}
        <section className="py-24">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#FF9A9E]/10 to-blue-500/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF9A9E]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">Communicate 3-4x faster starting today.</h2>
              <p className="text-xl text-slate mb-10">Get early access to the Chrome extension + dashboard.</p>

              <div>
                <form className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto mb-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 rounded-full bg-white/80 border border-black/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-charcoal placeholder:text-slate/50 shadow-sm"
                    required
                  />
                  <button type="submit" className="w-full sm:w-auto btn-premium px-8 py-4 whitespace-nowrap min-w-fit">
                    Get Early Access
                  </button>
                </form>
                <span className="text-sm font-medium text-slate/70 flex items-center justify-center gap-2">
                  <Shield size={14} className="opacity-50" />
                  No credit card. Private beta.
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
