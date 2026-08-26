import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Github, Facebook, Sparkles, Shield, Lock, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') !== 'signup';
  const [isLogin, setIsLogin] = useState(initialMode);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: fullName }
          }
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message);
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

      {/* Soft radial white glow centered behind the grid to elevate the auth area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
        <div className="w-[100vw] h-[100vh] bg-white/70 blur-[150px] rounded-full"></div>
      </div>

      {/* Grid Pattern overlaid on top of glow */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-10" />
      <div className="absolute inset-0 bg-noise pointer-events-none z-20" />

      {/* Semi-transparent backdrop to selectively fade the grid and create depth separation for the auth area */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none z-20" />

      {/* Floating Shell */}
      <div className="max-w-[1600px] mx-auto min-h-screen relative z-30 px-4 sm:px-6 lg:px-12 xl:px-24 py-6 flex flex-col">

        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border border-black/[0.04] rounded-full px-6 py-3.5 flex items-center justify-between sticky top-8 z-50 shadow-none w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-slate hover:text-charcoal transition-colors font-medium">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-charcoal tracking-tight italic">Utterly.</span>
          </div>
          <div className="w-[80px] sm:w-[130px]" /> {/* Spacer to balance flex-between */}
        </header>

        {/* calc(100vh - nav height) min height with optical center adjustment */}
        <main className="flex-1 flex flex-col justify-center my-12 lg:my-0 pb-12 lg:-translate-y-8 min-h-[calc(100vh-100px)]">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">

            {/* Unified subtle glow behind BOTH cards to bridge them visually */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/60 blur-[100px] rounded-[4rem] pointer-events-none -z-10 hidden lg:block"></div>

            {/* Left Side: Form */}
            <div className="flex justify-center lg:justify-end lg:col-span-5 lg:col-start-1 lg:max-w-[520px] w-full mx-auto lg:mx-0 lg:-mr-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white/90 backdrop-blur-md rounded-[2rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-10 sm:p-12 relative overflow-hidden"
              >
                {/* Top decorative gradient line */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#FF9A9E]"></div>

                <div className="mb-10">
                  <h1 className="text-4xl font-display font-bold text-charcoal mb-3">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h1>
                  <p className="text-slate text-sm leading-relaxed">
                    {isLogin
                      ? 'Enter your details to access your account.'
                      : 'Start writing at the speed of thought today.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                      {errorMsg}
                    </div>
                  )}
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate uppercase tracking-wider block ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-offwhite border border-black/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-charcoal placeholder:text-slate/40"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate uppercase tracking-wider block ml-1">Email</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-offwhite border border-black/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-charcoal placeholder:text-slate/40"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold text-slate uppercase tracking-wider block">Password</label>
                      {isLogin && <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">Forgot password?</a>}
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-offwhite border border-black/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-charcoal placeholder:text-slate/40"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate uppercase tracking-wider block ml-1">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-offwhite border border-black/5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-charcoal placeholder:text-slate/40"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-[#FF9A9E] text-white hover:opacity-90 transition-opacity flex items-center justify-center mt-10 shadow-sm font-semibold text-[15px] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
                  </button>
                </form>

                <div className="mt-8 mb-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/5"></div>
                  </div>
                  <div className="relative bg-white px-4 text-xs font-semibold text-slate uppercase tracking-wider">
                    Or continue with
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleOAuthLogin('google')} className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-black/5 hover:bg-slate/5 transition-colors text-sm font-semibold text-charcoal">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button type="button" onClick={() => handleOAuthLogin('github')} className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-black/5 hover:bg-slate/5 transition-colors text-sm font-semibold text-charcoal">
                    <Github size={18} className="shrink-0" />
                    GitHub
                  </button>
                  <button type="button" onClick={() => handleOAuthLogin('facebook')} className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-white border border-black/5 hover:bg-slate/5 transition-colors text-sm font-semibold text-charcoal">
                    <Facebook size={18} className="text-[#1877F2] shrink-0" />
                    Facebook
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-bold text-primary hover:text-primary-hover transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </motion.div>
            </div>

            {/* Right Side: Product Panel */}
            <div className="hidden lg:flex flex-col justify-start relative lg:col-span-6 lg:col-start-7 lg:pl-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full relative"
              >
                {/* Subtle inner glow behind the right card */}
                <div className="absolute inset-0 bg-white/80 rounded-[2.5rem] blur-xl -z-20"></div>

                {/* White unifying background container with stronger shadow */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] -z-10"></div>

                {/* Background glow for mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[60px] -z-10"></div>

                <div className="p-10 sm:p-12">
                  <div className="mb-8 flex items-center justify-center gap-4">
                    <div className="h-[1px] bg-slate/30 flex-1"></div>
                    <span className="text-[14px] font-[900] text-slate/90 uppercase tracking-[0.3em]">Why Utterly?</span>
                    <div className="h-[1px] bg-slate/30 flex-1"></div>
                  </div>

                  {/* Live Preview Mock*/}
                  <div className="glass-card p-8 w-full rounded-[1.5rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden bg-white/90 transform scale-[1.02]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#FF9A9E]"></div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <div className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-charcoal">Utterly is listening...</h3>
                          <p className="text-[11px] text-slate font-medium">Auto-polishing speech</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="h-4 bg-slate/10 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate/10 rounded-full w-full"></div>
                      <div className="h-4 bg-slate/10 rounded-full w-5/6"></div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/80 border border-white shadow-sm">
                      <p className="text-sm text-charcoal font-medium leading-relaxed">
                        "We should reconsider the design tokens before we merge this PR to ensure consistency across the dashboard."
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate font-medium">
                        <Sparkles size={14} className="text-primary" />
                        Instantly Refined
                      </div>
                    </div>
                  </div>

                  {/* Trust Card Stack */}
                  <div className="mt-8 flex flex-col gap-4 px-3">
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-charcoal shrink-0">
                        <Lock size={18} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-charcoal font-bold text-[15px]">Private Beta</span>
                        <span className="text-slate text-[13px] font-medium mt-0.5">Access by invitation only</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-charcoal shrink-0">
                        <Shield size={18} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-charcoal font-bold text-[15px]">Session history is opt-in</span>
                        <span className="text-slate text-[13px] font-medium mt-0.5">Your data is never used for training</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-charcoal shrink-0">
                        <Zap size={18} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-charcoal font-bold text-[15px]">Works in any text field</span>
                        <span className="text-slate text-[13px] font-medium mt-0.5">Type automatically via Chrome extension</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
