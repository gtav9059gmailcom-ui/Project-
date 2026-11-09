import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const ringSizes = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-18 h-18',
    xl: 'w-26 h-26',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Catchy, colorful "AI" logo on vibrant background with holographic rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing halo */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 opacity-70 blur-md animate-pulse-glow`} />
        
        {/* Holographic targeting ring */}
        <div className={`absolute rounded-2xl border border-cyan-400/40 pointer-events-none ${ringSizes[size] || 'w-14 h-14'}`} />

        {/* Main Icon Vessel */}
        <div className={`${sizeClasses[size]} relative rounded-2xl bg-gradient-to-br from-[#0e172a] via-[#1a103c] to-[#0b2447] p-[2px] shadow-2xl flex items-center justify-center overflow-hidden border border-white/20`}>
          {/* Internal vibrant iridescent background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/25 via-fuchsia-500/25 to-emerald-400/25 backdrop-blur-sm" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-20 hud-grid" />

          {/* Catchy stylized "AI" typography */}
          <div className="relative z-10 flex items-center justify-center font-black tracking-tighter">
            <span className="bg-gradient-to-b from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,240,255,0.8)]">
              A
            </span>
            <span className="bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,82,119,0.8)] ml-[1px]">
              I
            </span>
          </div>

          {/* Corner Stark HUD micro-accents */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75" />
          <div className="absolute bottom-1 left-1 w-1.5 h-[1.5px] bg-pink-400" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-white text-base sm:text-lg flex items-center">
              F.R.I.D.A.Y.
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              v4.8
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium tracking-tight">
            Stark Neural OS // ColorOS Hybrid
          </span>
        </div>
      )}
    </div>
  );
};
