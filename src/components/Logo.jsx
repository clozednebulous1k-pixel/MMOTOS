import React from 'react';

export default function Logo({ height = 48, light = true }) {
  const textColor = light ? '#111111' : '#ffffff';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        height={height} 
        viewBox="0 0 240 70" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* LOGO SYMBOL: M + MOTORCYCLE EMERGES */}
        <g transform="translate(5, 5)">
          {/* Stylized M */}
          {/* Left Vertical/Diagonal Stem of M (Dark/White depending on theme) */}
          <path 
            d="M5,48 L15,10 L28,25 L16,48 Z" 
            fill={light ? "#111111" : "#ffffff"} 
          />
          {/* Right Vertical/Diagonal Stem of M (Red) */}
          <path 
            d="M32,22 L42,10 L52,48 L39,48 Z" 
            fill="#d32f2f" 
          />

          {/* Motorcycle emerging from the center dip of the M */}
          <g transform="translate(18, 12) scale(0.65)">
            {/* Speed trails/lines coming out of the M */}
            <path d="M-15,15 L10,15" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <path d="M-22,25 L5,25" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M-10,35 L12,35" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" opacity="0.9" />

            {/* Front Wheel & Fork of the emerging bike */}
            <circle cx="52" cy="28" r="10" stroke="#d32f2f" strokeWidth="3" fill="none" />
            <circle cx="52" cy="28" r="6" stroke={light ? "#111" : "#fff"} strokeWidth="1.5" />
            <line x1="38" y1="12" x2="52" y2="28" stroke={light ? "#111" : "#fff"} strokeWidth="2.5" />
            
            {/* Handlebar */}
            <line x1="38" y1="12" x2="30" y2="15" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" />

            {/* Bodywork / Fuel tank / Fairing of the motorcycle speeding forward */}
            <path 
              d="M10,22 C10,14 26,10 34,12 L44,22 L36,32 L22,30 Z" 
              fill={light ? "#111111" : "#ffffff"} 
              stroke={light ? "#111111" : "#ffffff"}
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Red accent line on the bike */}
            <path d="M22,16 L34,14 L38,18" fill="none" stroke="#d32f2f" strokeWidth="2" />
          </g>
        </g>

        {/* LOGO TEXT */}
        {/* "M" */}
        <text 
          x="75" 
          y="35" 
          fill="#d32f2f" 
          fontFamily="'Outfit', sans-serif" 
          fontWeight="900" 
          fontSize="24"
          fontStyle="italic"
        >
          M
        </text>
        {/* "MOTOPEÇAS" */}
        <text 
          x="100" 
          y="35" 
          fill={textColor} 
          fontFamily="'Outfit', sans-serif" 
          fontWeight="800" 
          fontSize="22"
          fontStyle="italic"
          letterSpacing="0.5"
        >
          MOTOPEÇAS
        </text>
        {/* "E ACESSÓRIOS" */}
        <text 
          x="75" 
          y="50" 
          fill="#d32f2f" 
          fontFamily="'Inter', sans-serif" 
          fontWeight="700" 
          fontSize="9"
          letterSpacing="3"
        >
          E ACESSÓRIOS
        </text>
      </svg>
    </div>
  );
}
