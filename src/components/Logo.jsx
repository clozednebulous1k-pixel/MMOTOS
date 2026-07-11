import React from 'react';

export default function Logo({ height = 48, light = true }) {
  const textColor = light ? '#111111' : '#ffffff';
  const brandColor = '#d32f2f'; // Red
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        height={height} 
        viewBox="0 0 245 70" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* LOGO SYMBOL: The official motorcycle M symbol from the user's logo */}
        <g transform="translate(5, 8) scale(1.15)">
          {/* Rear Wheel Guard (Left Arc) */}
          <path 
            d="M8,32 C8,21 16,12 28,12 C32,12 36,13 39,15" 
            stroke={brandColor} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          {/* Front Wheel Guard (Right Arc) */}
          <path 
            d="M62,15 C65,13 69,12 73,12 C85,12 93,21 93,32" 
            stroke={brandColor} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          
          {/* Seat / Tail Section */}
          <path 
            d="M23,17 L35,12 L43,15 L32,23 Z" 
            fill={textColor} 
          />
          
          {/* Front Fork / Handlebars */}
          <path 
            d="M57,9 L64,10 L78,28 L72,29 Z" 
            fill={textColor} 
          />
          
          {/* Stylized M Chassis */}
          <path 
            d="M30,32 L42,16 L49,24 L56,16 L67,32 H58 L52,24 L49,28 L46,24 L40,32 Z" 
            fill={brandColor} 
          />
        </g>

        {/* LOGO TEXT */}
        {/* "M" */}
        <text 
          x="125" 
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
          x="150" 
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
          x="125" 
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
