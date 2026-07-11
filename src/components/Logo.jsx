import React from 'react';

export default function Logo({ height = 48, light = true }) {
  const textColor = light ? '#111111' : '#ffffff';
  const brandColor = '#d32f2f'; // Red
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        height={height} 
        viewBox="0 0 250 70" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* HIGH-FIDELITY SILHOUETTE LOGO SYMBOL FROM USER IMAGE */}
        <g transform="translate(5, 8) scale(0.95)" color={brandColor}>
          {/* Rear Wheel Arch (Left) */}
          <path 
            d="M20,54 C16,39 26,26 41,24 C48,23 55,26 60,30" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none" 
          />
          {/* Front Wheel Arch (Right) */}
          <path 
            d="M106,30 C111,26 118,23 125,24 C140,26 150,39 146,54" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none" 
          />
          
          {/* Seat / Tail Cowl Section */}
          <path 
            d="M29,26 C41,26 58,32 68,36 L78,36 L62,24 L44,22 Z" 
            fill="currentColor" 
          />
          
          {/* Front Fork / Steering Handlebars */}
          <path 
            d="M108,18 L114,18 L138,53 L132,53 Z" 
            fill="currentColor" 
          />
          
          {/* Main "M" Chassis Frame */}
          <path 
            d="M46,58 L72,26 L81,42 L90,26 L116,58 H103 L90,38 L81,52 L72,38 L59,58 Z" 
            fill="currentColor" 
          />
        </g>

        {/* LOGO TEXT */}
        {/* "M" */}
        <text 
          x="145" 
          y="35" 
          fill={brandColor} 
          fontFamily="'Outfit', sans-serif" 
          fontWeight="900" 
          fontSize="24"
          fontStyle="italic"
        >
          M
        </text>
        {/* "MOTO" */}
        <text 
          x="170" 
          y="35" 
          fill={textColor} 
          fontFamily="'Outfit', sans-serif" 
          fontWeight="800" 
          fontSize="22"
          fontStyle="italic"
          letterSpacing="0.5"
        >
          MOTO
        </text>
        {/* "PEÇAS E ACESSÓRIOS" */}
        <text 
          x="145" 
          y="50" 
          fill={textColor} 
          fontFamily="'Inter', sans-serif" 
          fontWeight="600" 
          fontSize="8.5"
          letterSpacing="2.5"
          opacity="0.85"
        >
          PEÇAS E ACESSÓRIOS
        </text>
      </svg>
    </div>
  );
}
