import React from 'react';

// Hanging Marigold Toran / Garlands
export const MarigoldToran: React.FC = () => {
  return (
    <div className="w-full overflow-hidden leading-none pointer-events-none select-none relative h-4 bg-gradient-to-r from-[#C51C13] via-[#FFCB44] to-[#C51C13] flex justify-around items-end opacity-90 drop-shadow-md">
      {[...Array(24)].map((_, i) => (
        <span key={i} className="inline-block text-[10px] md:text-xs animate-bounce" style={{ animationDelay: `${i * 150}ms`, animationDuration: '3s' }}>
          🏮
        </span>
      ))}
    </div>
  );
};

// Animated Diwali Diya SVG
export const AnimatedDiya: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg viewBox="0 0 100 100" className={`${className} fill-none`} xmlns="http://www.w3.org/2000/svg">
      {/* Flame */}
      <path
        d="M50 10 C62 30 62 48 50 56 C38 48 38 30 50 10 Z"
        fill="url(#flameGrad)"
        className="animate-pulse origin-bottom"
        style={{ transformOrigin: '50px 56px', animationDuration: '1.5s' }}
      />
      {/* Glow */}
      <circle cx="50" cy="35" r="20" fill="url(#glowGrad)" opacity="0.4" className="animate-ping" style={{ animationDuration: '3s' }} />
      {/* Clay Pot Base / Diya Body */}
      <path
        d="M20 54 Q50 90 80 54 C80 54 85 48 70 48 Q50 54 30 48 C15 48 20 54 20 54 Z"
        fill="url(#diyaBody)"
        stroke="#FFB300"
        strokeWidth="2.5"
      />
      {/* Golden Ornamental Details */}
      <path d="M30 51 Q50 56 70 51" stroke="#FFD54F" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="50" cy="65" r="4" fill="#FFD54F" />
      <circle cx="40" cy="62" r="3" fill="#FFD54F" />
      <circle cx="60" cy="62" r="3" fill="#FFD54F" />

      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="30%" stopColor="#FFB300" />
          <stop offset="70%" stopColor="#FF3D00" />
          <stop offset="100%" stopColor="#B71C1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEA00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diyaBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="40%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Rangoli Mandala Graphic
export const RangoliMandala: React.FC<{ className?: string }> = ({ className = 'w-48 h-48 opacity-10' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`${className} transform animate-[spin_80s_linear_infinite]`} style={{ color: '#FFCB44' }}>
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5, 5" fill="none" />
      <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Petals */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <path
            key={i}
            d="M100 100 C110 50 130 50 100 15 C70 50 90 50 100 100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* Inner layer petals */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12 + 15;
        return (
          <path
            key={i}
            d="M100 100 C105 70 120 70 100 45 C80 70 95 70 100 100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.8"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* Inner Dots and Circles */}
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <circle
            key={i}
            cx="100"
            cy="68"
            r="3"
            fill="currentColor"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
    </svg>
  );
};
