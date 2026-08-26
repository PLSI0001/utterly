import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic } from 'lucide-react';

const toneExamples = {
    Professional: "I suggest we briefly postpone the launch to ensure everything is fully prepared.",
    Casual: "Maybe we should hold off on the launch for a bit just to be safe.",
    Persuasive: "We must pause the launch temporarily to ensure flawless execution."
};
type ToneOption = keyof typeof toneExamples;

export default function HowItWorksSection() {
    const [step1Tone, setStep1Tone] = useState<ToneOption>('Persuasive');

    // Typewriter effect state
    const [transcript, setTranscript] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // Fake Transformation state for Step 4
    const [transformationStep, setTransformationStep] = useState(0);

    // Auto cycle tone selection for Step 1
    useEffect(() => {
        const tones: ToneOption[] = ['Professional', 'Casual', 'Persuasive'];
        const interval = setInterval(() => {
            setStep1Tone(prev => {
                const currentIndex = tones.indexOf(prev);
                return tones[(currentIndex + 1) % tones.length];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Step 3 animation loop
    useEffect(() => {
        const fullText = "um, so I think we should probably launch the feature next week...";
        let currentText = "";
        let currentIndex = 0;

        setTranscript("");
        setIsTyping(true);

        const intervalId = setInterval(() => {
            if (currentIndex < fullText.length) {
                currentText += fullText[currentIndex];
                setTranscript(currentText);
                currentIndex++;
            } else {
                setIsTyping(false);
                setTimeout(() => {
                    // Restart animation
                    setTranscript("");
                    setIsTyping(true);
                    currentIndex = 0;
                    currentText = "";
                }, 3000);
            }
        }, 50);

        return () => clearInterval(intervalId);
    }, []);

    // Step 4 animation loop
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTransformationStep(prev => (prev + 1) % 4);
        }, 2500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section id="how-it-works" className="py-24 relative z-10">
            <div className="mb-24 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">How Utterly Works</h2>
                <p className="text-xl text-slate/80 max-w-2xl mx-auto">Four simple steps to transform the way you communicate.</p>
            </div>

            <div className="relative space-y-24 max-w-6xl mx-auto px-4 lg:pl-20">
                {/* Vertical Progress Rail */}
                <div className="absolute left-4 lg:left-8 top-12 bottom-12 w-[2px] bg-slate/10 hidden md:block">
                    {/* Simulated fill for the rail based on auto-cycling or just a static gradient for now */}
                    <div className="absolute top-0 w-full bg-gradient-to-b from-primary to-[#FF9A9E] rounded-full transition-all duration-1000" style={{ height: '75%' }} />
                </div>

                {/* Step 1 - Choose Your Tone */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                    <div className="md:col-span-5 order-2 md:order-1 relative flex justify-end">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-charcoal/5 translate-x-4 -translate-y-4 rounded-[2rem] -z-10 blur-xl"></div>
                            <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative">
                                <div className="flex items-center justify-between px-2 mb-4">
                                    <span className="text-xs font-bold text-slate uppercase tracking-widest">Select Tone</span>
                                </div>
                                <div className="relative flex flex-col space-y-1">
                                    {(['Professional', 'Casual', 'Persuasive'] as ToneOption[]).map((tone) => (
                                        <div
                                            key={tone}
                                            className="relative px-4 py-3 rounded-xl text-sm cursor-pointer z-10"
                                            onClick={() => setStep1Tone(tone)}
                                        >
                                            {step1Tone === tone && (
                                                <motion.div
                                                    layoutId="step1ToneHighlight"
                                                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className={`relative z-10 transition-colors font-semibold ${step1Tone === tone ? 'text-primary' : 'text-slate hover:text-charcoal'}`}>
                                                {tone}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2 relative">
                        <span className="font-display text-2xl font-bold text-primary/70 mb-2 block tracking-widest uppercase relative z-10">Step 01</span>
                        <h3 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">Choose Your Tone</h3>
                        <p className="text-xl text-slate leading-relaxed">Need to sound more authoritative? Or maybe friendly and casual? Select from our tone presets to set the exact context and vibe you want to convey.</p>
                    </div>
                </div>

                {/* Step 2 - Press your hotkey + speak */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                    <div className="md:col-span-7 relative">
                        <span className="font-display text-2xl font-bold text-primary/70 mb-2 block tracking-widest uppercase relative z-10">Step 02</span>
                        <h3 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">Press Your Hotkey & Speak</h3>
                        <p className="text-xl text-slate leading-relaxed">No need to open a new tab or switch windows. Press your custom hotkey combo from anywhere—Slack, email, or your browser—to start capturing your voice.</p>
                    </div>
                    <div className="md:col-span-5 relative flex justify-start">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-primary/5 -translate-x-4 translate-y-4 rounded-[2rem] -z-10 blur-xl"></div>
                            <div className="bg-white/90 backdrop-blur-md p-12 rounded-[2rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center relative">

                                {/* Keyboard keys */}
                                <div className="flex gap-3 justify-center items-center relative z-10 bg-slate/5 p-4 rounded-3xl border border-black/5">
                                    <motion.div
                                        whileHover={{ y: 2, scaleY: 0.95, boxShadow: "0px 2px 0px rgba(0,0,0,0.1)" }}
                                        transition={{ duration: 0.2 }}
                                        className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-black/10 relative shadow-[0px_6px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                                    >
                                        <span className="text-xl font-medium text-slate">⌘</span>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: 2, scaleY: 0.95, boxShadow: "0px 2px 0px rgba(0,0,0,0.1)" }}
                                        transition={{ duration: 0.2 }}
                                        className="w-16 h-14 bg-white rounded-xl flex items-center justify-center border border-black/10 relative shadow-[0px_6px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                                    >
                                        <span className="text-lg font-medium text-slate">⇧</span>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: 2, scaleY: 0.95, boxShadow: "0px 2px 0px rgba(0,0,0,0.1)" }}
                                        transition={{ duration: 0.2 }}
                                        className="w-24 h-14 bg-white rounded-xl flex items-center justify-center border border-black/10 relative shadow-[0px_6px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                                    >
                                        <div className="w-10 h-1 bg-slate/20 rounded-full"></div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 - Speak Naturally */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                    <div className="md:col-span-5 order-2 md:order-1 relative flex justify-end">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-[#FF9A9E]/10 translate-x-4 translate-y-4 rounded-[2rem] -z-10 blur-xl"></div>
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] min-h-[220px] flex flex-col relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-[#FF9A9E]/10 flex items-center justify-center text-[#FF9A9E] relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 rounded-full bg-[#FF9A9E]/30"
                                        />
                                        <Mic size={20} className="relative z-10" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-[#FF9A9E]" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[#FF9A9E]" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[#FF9A9E]" />
                                    </div>
                                </div>
                                <div className="text-slate/80 font-medium leading-relaxed italic border-l-2 border-[#FF9A9E]/30 pl-4 py-2 flex-grow relative z-10">
                                    "{transcript}{isTyping && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>|</motion.span>}"
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2 relative">
                        <span className="font-display text-2xl font-bold text-primary/70 mb-2 block tracking-widest uppercase relative z-10">Step 03</span>
                        <h3 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">Speak Naturally</h3>
                        <p className="text-xl text-slate leading-relaxed">Don't worry about "ums", "ahs", or finding the perfect word. Just talk through your thoughts as they come to you. Utterly captures everything with perfect accuracy in real-time.</p>
                    </div>
                </div>

                {/* Step 4 - AI Refines Instantly */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                    <div className="md:col-span-7 relative">
                        <span className="font-display text-2xl font-bold text-primary/70 mb-2 block tracking-widest uppercase relative z-10">Step 04</span>
                        <h3 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">AI Refines Instantly</h3>
                        <p className="text-xl text-slate leading-relaxed">Our engine strips away filler words, corrects grammar, and rewrites your rambling thoughts to match your selected tone—outputting polished text in milliseconds.</p>
                    </div>
                    <div className="md:col-span-5 relative flex justify-start">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-0 bg-slate/5 -translate-x-4 translate-y-4 rounded-[2rem] -z-10 blur-xl"></div>
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[220px] flex flex-col justify-between">

                                {/* Fake NLP Diffs State Machine Visual */}
                                <div className="relative flex-grow flex flex-col justify-center">
                                    <AnimatePresence mode="wait">
                                        {transformationStep === 0 && (
                                            <motion.div key="state1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate/60 text-lg leading-relaxed font-medium">
                                                Um, so I think we should probably launch the feature next week...
                                            </motion.div>
                                        )}
                                        {transformationStep === 1 && (
                                            <motion.div key="state2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate/60 text-lg leading-relaxed font-medium">
                                                <span className="bg-[#FF9A9E]/20 text-slate/40 line-through decoration-[#FF9A9E]/50 px-1 rounded">Um, so I think</span> we should <span className="bg-[#FF9A9E]/20 text-slate/40 line-through decoration-[#FF9A9E]/50 px-1 rounded">probably</span> launch the feature next week.
                                            </motion.div>
                                        )}
                                        {transformationStep === 2 && (
                                            <motion.div key="state3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate/80 text-lg leading-relaxed font-medium flex flex-wrap gap-1 items-center">
                                                <motion.span initial={{ y: 10, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="text-primary bg-primary/5 px-2 py-0.5 rounded-md font-semibold ring-1 ring-primary/20">We are ready to</motion.span>
                                                <span>launch the feature next week.</span>
                                            </motion.div>
                                        )}
                                        {transformationStep === 3 && (
                                            <motion.div key="state4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-charcoal font-semibold text-lg leading-relaxed relative">
                                                We are ready to launch the feature next week.
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: 'spring', delay: 0.2 }}
                                                    className="absolute -bottom-10 right-0 bg-charcoal text-white text-[11px] px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    Refined
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Progress bar indicator for loop */}
                                <div className="mt-6 flex gap-1.5 h-1">
                                    {[0, 1, 2, 3].map(step => (
                                        <div key={step} className={`flex-1 rounded-full transition-colors duration-500 ${step <= transformationStep ? 'bg-primary' : 'bg-slate/10'}`} />
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
