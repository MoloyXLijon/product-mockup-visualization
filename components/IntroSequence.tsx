
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Package, SprayCan } from 'lucide-react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'wait' | 'spray' | 'admire' | 'exit' | 'prism' | 'explode'>('enter');

  useEffect(() => {
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },
      { t: 1800, fn: () => setPhase('wait') },
      { t: 2400, fn: () => setPhase('spray') },
      { t: 4000, fn: () => setPhase('admire') },
      { t: 5000, fn: () => setPhase('exit') },
      { t: 5600, fn: () => setPhase('prism') },
      { t: 7800, fn: () => setPhase('explode') },
      { t: 8500, fn: () => onComplete() }
    ];

    const timers = schedule.map(s => setTimeout(s.fn, s.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans select-none
      ${phase === 'explode' ? 'animate-[fadeOut_1s_ease-out_forwards] pointer-events-none' : ''}
    `}>
      <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ease-out ${phase === 'explode' ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>
      <div className="relative w-full max-w-4xl h-96 flex items-center justify-center scale-[0.6] md:scale-100">
        {(phase !== 'prism' && phase !== 'explode') && (
          <div className={`relative z-10 flex flex-col items-center transition-transform will-change-transform
             ${phase === 'enter' ? 'animate-[hopIn_1.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]' : ''}
             ${phase === 'exit' ? 'animate-[anticipateSprint_0.8s_ease-in_forwards]' : ''}
          `}>
             <div className={`w-32 h-36 bg-zinc-100 rounded-xl relative overflow-hidden shadow-2xl transition-all duration-300 border-4
                ${phase === 'spray' || phase === 'admire' || phase === 'exit' 
                  ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)]' 
                  : 'border-zinc-300'}
             `}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-zinc-200/50 border-x border-zinc-300/50 transition-opacity duration-200 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-zinc-800 rounded-md flex items-center justify-center gap-4 overflow-hidden border border-zinc-700 shadow-inner z-20">
                   <div className={`w-2 h-2 bg-cyan-400 rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                   <div className={`w-2 h-2 bg-cyan-400 rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 transition-opacity duration-500 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute inset-0 bg-white mix-blend-overlay pointer-events-none ${phase === 'spray' ? 'animate-[flash_0.2s_ease-out]' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 transform z-20
                   ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                   <div className="w-10 h-10 bg-white text-indigo-600 rounded flex items-center justify-center shadow-lg">
                      <Package size={24} strokeWidth={3} />
                   </div>
                </div>
             </div>
             <div className="flex gap-10 -mt-1 z-0">
                <div className={`w-3 h-8 bg-zinc-800 rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate]' : ''}`}></div>
                <div className={`w-3 h-8 bg-zinc-800 rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate-reverse]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate-reverse]' : ''}`}></div>
             </div>
          </div>
        )}
        {phase === 'spray' && (
          <div className="absolute z-20 animate-[swoopIn_0.4s_cubic-bezier(0.17,0.67,0.83,0.67)_forwards]" style={{ right: '22%', top: '5%' }}>
             <div className="relative animate-[shake_0.15s_infinite]">
                <SprayCan size={80} className="text-zinc-300 fill-zinc-800 rotate-[-15deg] drop-shadow-2xl" />
                <div className="absolute top-0 -left-4 w-6 h-6 bg-white rounded-full blur-md animate-ping"></div>
                <div className="absolute top-4 -left-8 w-40 h-40 pointer-events-none overflow-visible">
                   {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-[sprayParticle_0.4s_linear_forwards]"
                        style={{ 
                           top: Math.random() * 20, 
                           left: 0,
                           animationDelay: `${Math.random() * 0.3}s`,
                        }}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}
        {(phase === 'prism' || phase === 'explode') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
             <div className={`relative w-32 h-32 animate-[spinAppear_1.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                   <defs>
                      <linearGradient id="prismStroke" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#6366f1" />
                         <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                   </defs>
                   <path 
                      d="M50 10 L90 85 L10 85 Z" 
                      fill="none" 
                      stroke="url(#prismStroke)" 
                      strokeWidth="4" 
                      strokeLinejoin="round"
                      className="animate-[drawStroke_1s_ease-out_forwards]"
                   />
                </svg>
             </div>
             <div className="text-center animate-[popIn_0.8s_cubic-bezier(0.17,0.67,0.83,0.67)_0.5s_forwards] opacity-0">
                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">SKU FOUNDRY</h1>
                <p className="text-sm text-indigo-400 font-mono tracking-[0.3em] uppercase">AI Product Visualization</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
