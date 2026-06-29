import React from 'react';

export default function BrandLogo({ className = "w-10 h-10" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      {/* 1. Base Squircle - Solid Blue-600 (Foolproof) */}
      <rect 
        width="100" 
        height="100" 
        rx="28" 
        fill="#2563EB" 
      />

      {/* 2. Soft Inner Glow / Border */}
      <rect 
        x="4" 
        y="4" 
        width="92" 
        height="92" 
        rx="24" 
        stroke="white" 
        strokeOpacity="0.2" 
        strokeWidth="2" 
      />

      {/* 3. The Left Leg (Solid White) */}
      <path 
        d="M 50 25 L 30 75" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 4. The Right Leg (Solid White) */}
      <path 
        d="M 50 25 L 70 75" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* 5. The "Room" Orb (Vibrant Cyan-400) */}
      <circle 
        cx="50" 
        cy="58" 
        r="10" 
        fill="#22D3EE" 
      />
      
      {/* 6. Tiny inner accent dot in the orb */}
      <circle 
        cx="50" 
        cy="58" 
        r="4" 
        fill="#1E3A8A" 
      />
    </svg>
  );
}
