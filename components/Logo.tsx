import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 240 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Foreground Stream Gradient */}
        <linearGradient id="stream-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" /> {/* Cyan 400 */}
          <stop offset="100%" stopColor="#2563EB" /> {/* Blue 600 */}
        </linearGradient>

        {/* Background Depth Gradient */}
        <linearGradient id="stream-back" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo 600 */}
          <stop offset="100%" stopColor="#EC4899" /> {/* Pink 500 */}
        </linearGradient>

        {/* Premium Glow Filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* The Abstract 'S' Monogram
        Uses precise large-arc SVG commands to create a continuous, overlapping 3D ribbon 
      */}

      {/* Background Ribbon (Shifted down and right for 3D depth) */}
      <path 
        d="M 39 15 A 10 10 0 1 0 32 32 A 10 10 0 1 1 25 49" 
        stroke="url(#stream-back)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        opacity="0.5"
      />

      {/* Foreground Ribbon */}
      <path 
        d="M 35 13 A 10 10 0 1 0 28 30 A 10 10 0 1 1 21 47" 
        stroke="url(#stream-front)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        filter="url(#glow)"
      />

      {/* Glowing Data Node (Represents the active 'Bot' or 'Stream') */}
      <circle cx="35" cy="13" r="4" fill="#A5F3FC" />

      {/* Typography 
        Uses modern system fonts. 'Sleep' automatically switches between black and white in light/dark mode.
      */}
      <text 
        x="62" 
        y="38" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="24" 
        letterSpacing="-0.03em"
      >
        <tspan className="font-extrabold fill-slate-900 dark:fill-white">
          Sleep
        </tspan>
        <tspan className="font-light fill-blue-600 dark:fill-blue-400">
          Stream
        </tspan>
      </text>
    </svg>
  );
}