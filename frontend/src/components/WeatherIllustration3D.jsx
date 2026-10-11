import React from 'react';

export const WeatherIllustration3D = ({ condition = 'Heavy Rain', className = 'w-36 h-36' }) => {
  const cond = (condition || '').toLowerCase();

  // 1. Rain / Heavy Rain / Showers / Thunderstorm
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || cond.includes('thunder')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Sun Gradients */}
            <radialGradient id="sunGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF385" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            {/* Cloud Gradients */}
            <linearGradient id="cloudFrontGrad" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="cloudBackGrad" x1="80" y1="40" x2="160" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Rain Drop Gradients */}
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Cloud Soft Shadow */}
            <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.15" />
            </filter>
            <filter id="sunBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing Sun in Background */}
          <g className="animate-pulse-subtle">
            <circle cx="135" cy="65" r="38" fill="url(#sunGlow)" />
            {/* Sun Rays */}
            <g stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" opacity="0.8">
              <line x1="135" y1="18" x2="135" y2="26" />
              <line x1="135" y1="104" x2="135" y2="112" />
              <line x1="94" y1="65" x2="86" y2="65" />
              <line x1="176" y1="65" x2="184" y2="65" />
              <line x1="106" y1="36" x2="100" y2="30" />
              <line x1="164" y1="94" x2="170" y2="100" />
              <line x1="164" y1="36" x2="170" y2="30" />
              <line x1="106" y1="94" x2="100" y2="100" />
            </g>
            <circle cx="135" cy="65" r="30" fill="url(#sunGrad)" filter="url(#sunBloom)" />
          </g>

          {/* Back Cloud Layer */}
          <path
            d="M85 85 C85 70, 102 60, 118 68 C128 55, 148 58, 155 72 C168 74, 175 88, 168 100 C162 108, 150 110, 140 110 L95 110 C85 110, 78 100, 85 85 Z"
            fill="url(#cloudBackGrad)"
            opacity="0.9"
          />

          {/* Front 3D Fluffy Cloud with Shadow */}
          <g filter="url(#cloudShadow)">
            <path
              d="M50 115 
                 C35 115, 25 102, 30 88 
                 C33 76, 45 70, 56 73 
                 C61 58, 79 50, 94 56 
                 C104 60, 110 68, 112 76 
                 C122 72, 136 78, 138 90 
                 C144 95, 144 105, 138 112 
                 C133 115, 128 115, 122 115 
                 Z"
              fill="url(#cloudFrontGrad)"
            />
            {/* Glossy highlight on top puff */}
            <path
              d="M68 64 C76 56, 92 56, 100 64 C92 60, 76 60, 68 64 Z"
              fill="#FFFFFF"
              opacity="0.7"
            />
          </g>

          {/* 3D Stylized Rain Drops */}
          <g className="animate-pulse">
            <line x1="52" y1="126" x2="44" y2="148" stroke="url(#rainGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="72" y1="128" x2="64" y2="152" stroke="url(#rainGrad)" strokeWidth="5" strokeLinecap="round" />
            <line x1="92" y1="126" x2="84" y2="150" stroke="url(#rainGrad)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="112" y1="128" x2="104" y2="152" stroke="url(#rainGrad)" strokeWidth="5" strokeLinecap="round" />
            <line x1="130" y1="126" x2="122" y2="148" stroke="url(#rainGrad)" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // 2. Sunny / Clear Sky
  if (cond.includes('clear') || cond.includes('sun')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sunOnlyGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <radialGradient id="sunOnlyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <filter id="sunShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#D97706" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Glow */}
          <circle cx="100" cy="90" r="75" fill="url(#sunOnlyGlow)" />

          {/* Radiant Sun Rays */}
          <g stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" opacity="0.9" className="animate-spin-slow origin-center">
            <line x1="100" y1="20" x2="100" y2="35" />
            <line x1="100" y1="145" x2="100" y2="160" />
            <line x1="30" y1="90" x2="45" y2="90" />
            <line x1="155" y1="90" x2="170" y2="90" />
            <line x1="50" y1="40" x2="62" y2="52" />
            <line x1="138" y1="128" x2="150" y2="140" />
            <line x1="150" y1="40" x2="138" y2="52" />
            <line x1="62" y1="128" x2="50" y2="140" />
          </g>

          {/* Main 3D Sun Sphere */}
          <circle cx="100" cy="90" r="46" fill="url(#sunOnlyGrad)" filter="url(#sunShadow)" />
          {/* Sphere highlight */}
          <circle cx="86" cy="74" r="14" fill="#FFFFFF" opacity="0.4" />
        </svg>
      </div>
    );
  }

  // 3. Clouds / Partly Cloudy / Overcast (Default)
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunPartGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="45%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          <linearGradient id="cloudGrad" x1="40" y1="50" x2="160" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <filter id="cloudSoftShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Sun peeking from top-right */}
        <circle cx="130" cy="65" r="32" fill="url(#sunPartGrad)" />
        <g stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
          <line x1="130" y1="22" x2="130" y2="28" />
          <line x1="165" y1="40" x2="171" y2="35" />
          <line x1="172" y1="65" x2="178" y2="65" />
        </g>

        {/* Big Puffy Cloud */}
        <g filter="url(#cloudSoftShadow)">
          <path
            d="M50 120 
               C32 120, 20 106, 26 90 
               C30 76, 44 68, 58 72 
               C64 54, 85 45, 104 52 
               C116 57, 124 66, 128 76 
               C140 72, 156 80, 158 94 
               C164 100, 164 112, 156 118 
               C150 120, 142 120, 136 120 
               Z"
            fill="url(#cloudGrad)"
          />
          <path
            d="M75 62 C85 54, 102 54, 112 62 C102 58, 85 58, 75 62 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
