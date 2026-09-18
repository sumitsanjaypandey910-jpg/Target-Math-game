import React from 'react';
import { UnderwaterBackground3D } from './UnderwaterBackground3D';

interface UnderwaterSceneProps {
  children?: React.ReactNode;
}

export const UnderwaterScene: React.FC<UnderwaterSceneProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Outer ambient underwater background with light rays and 3D ocean depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e5c9f] via-[#094178] to-[#041f40]">
        {/* Soft sun rays streaming from top */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(165, 243, 252, 0.4) 0%, transparent 60%),
                              repeating-linear-gradient(75deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 35px, transparent 35px, transparent 90px)`
          }}
        />

        {/* 3D Depth Layer for Outer Deep Ocean with drifting seaweed, rising 3D bubbles, and subtle marine particles */}
        <UnderwaterBackground3D density="normal" interactive={true} className="opacity-90" />
      </div>

      {/* Main Game Container - Fixed aspect ratio matching portrait mobile game */}
      <div className="relative w-full max-w-[480px] h-full max-h-[860px] flex flex-col items-center justify-between p-2 sm:p-4 z-10">
        {/* The Ornate Golden Pirate Frame */}
        <div className="relative w-full flex-1 rounded-[24px] p-2.5 sm:p-3 bg-gradient-to-b from-[#e89b43] via-[#b6681f] to-[#7f3d0a] shadow-[0_12px_35px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,230,160,0.6),inset_0_-3px_5px_rgba(50,20,0,0.8)] border-[3px] border-[#ffd580]/60">
          
          {/* Ornate Ruby Corner Gem 1: Top-Left */}
          <div className="absolute -top-1.5 -left-1.5 z-30 pointer-events-none">
            <div className="w-12 h-12 rounded-tl-xl rounded-br-2xl bg-gradient-to-br from-[#ffd778] via-[#c97d24] to-[#7b3e0e] p-1.5 shadow-[2px_3px_8px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#ffeaa7]">
              {/* Ruby gem */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff385c] via-[#b50a29] to-[#5e0212] shadow-[inset_0_2px_4px_rgba(255,180,180,0.9),inset_0_-2px_4px_rgba(0,0,0,0.8),0_2px_5px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 transform -rotate-30 filter blur-[0.3px]" />
                <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-red-300/50" />
              </div>
            </div>
            {/* Golden bolt */}
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-300 border border-amber-800 shadow-sm" />
          </div>

          {/* Ornate Ruby Corner Gem 2: Top-Right */}
          <div className="absolute -top-1.5 -right-1.5 z-30 pointer-events-none">
            <div className="w-12 h-12 rounded-tr-xl rounded-bl-2xl bg-gradient-to-bl from-[#ffd778] via-[#c97d24] to-[#7b3e0e] p-1.5 shadow-[-2px_3px_8px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#ffeaa7]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff385c] via-[#b50a29] to-[#5e0212] shadow-[inset_0_2px_4px_rgba(255,180,180,0.9),inset_0_-2px_4px_rgba(0,0,0,0.8),0_2px_5px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 transform -rotate-30 filter blur-[0.3px]" />
                <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-red-300/50" />
              </div>
            </div>
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-300 border border-amber-800 shadow-sm" />
          </div>

          {/* Ornate Corner Gem 3: Bottom-Left */}
          <div className="absolute -bottom-1.5 -left-1.5 z-30 pointer-events-none">
            <div className="w-9 h-9 rounded-bl-xl rounded-tr-2xl bg-gradient-to-tr from-[#ffd778] via-[#c97d24] to-[#7b3e0e] p-1.5 shadow-[2px_-2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center border border-[#ffeaa7]">
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-800 shadow-inner flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
              </div>
            </div>
          </div>

          {/* Ornate Corner Gem 4: Bottom-Right */}
          <div className="absolute -bottom-1.5 -right-1.5 z-30 pointer-events-none">
            <div className="w-9 h-9 rounded-br-xl rounded-tl-2xl bg-gradient-to-tl from-[#ffd778] via-[#c97d24] to-[#7b3e0e] p-1.5 shadow-[-2px_-2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center border border-[#ffeaa7]">
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-800 shadow-inner flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
              </div>
            </div>
          </div>

          {/* Inner Playfield Window (Deep ocean view with sunken ship and seabed) */}
          <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-gradient-to-b from-[#0b64a8] via-[#084883] to-[#042852] shadow-[inset_0_6px_16px_rgba(0,0,0,0.8),inset_0_0_4px_rgba(0,0,0,0.9)]">
            {/* 3D Depth Layer inside playfield: procedural 3D drifting seaweed, buoyant bubbles & marine particles */}
            <UnderwaterBackground3D density="subtle" interactive={true} className="opacity-65 z-0" />
            
            {/* SVG Illustration Layer: Shipwreck, Chest, Rocks, Seaweed */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              viewBox="0 0 400 650"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sunken Ship Wood Gradients */}
                <linearGradient id="shipWood" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c59146" />
                  <stop offset="50%" stopColor="#966122" />
                  <stop offset="100%" stopColor="#5f370f" />
                </linearGradient>
                <linearGradient id="shipDeck" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8d5619" />
                  <stop offset="100%" stopColor="#442507" />
                </linearGradient>
                <linearGradient id="ghostSail" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(180, 230, 220, 0.45)" />
                  <stop offset="60%" stopColor="rgba(120, 195, 190, 0.28)" />
                  <stop offset="100%" stopColor="rgba(70, 150, 150, 0.15)" />
                </linearGradient>
                <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af62" />
                  <stop offset="40%" stopColor="#ba9343" />
                  <stop offset="100%" stopColor="#825e21" />
                </linearGradient>
                <linearGradient id="seaweedDark" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e8a4a" />
                  <stop offset="100%" stopColor="#0c4f28" />
                </linearGradient>
                <linearGradient id="seaweedLight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#41b667" />
                  <stop offset="100%" stopColor="#1a6e38" />
                </linearGradient>
                <linearGradient id="chestWood" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b47834" />
                  <stop offset="100%" stopColor="#673909" />
                </linearGradient>
                <linearGradient id="goldCoin" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffea79" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="glowEyes" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Distant background underwater hills / blue silhouettes */}
              <path
                d="M-20 480 Q60 360 160 410 T380 370 T420 450 L420 650 L-20 650 Z"
                fill="#073b6b"
                opacity="0.6"
              />
              <path
                d="M-20 520 Q120 440 240 480 T420 460 L420 650 L-20 650 Z"
                fill="#0a467e"
                opacity="0.75"
              />

              {/* SUNKEN PIRATE SHIP (Centered in mid-background like the screenshot) */}
              <g id="shipwreck" transform="translate(10, 20)">
                {/* Ship Masts & Rigging */}
                {/* Central main mast */}
                <rect x="175" y="210" width="10" height="230" fill="#4d2c0b" rx="2" transform="rotate(-6 180 325)" />
                <rect x="145" y="270" width="65" height="5" fill="#3b2005" rx="1.5" transform="rotate(-6 180 272)" />
                <rect x="150" y="325" width="60" height="4.5" fill="#3b2005" rx="1.5" transform="rotate(-6 180 327)" />
                
                {/* Crow's nest */}
                <ellipse cx="187" cy="245" rx="12" ry="4" fill="#6a3c0e" />
                <rect x="176" y="240" width="22" height="6" fill="#4f2b09" rx="1" />

                {/* Left/fore mast */}
                <rect x="145" y="280" width="7" height="150" fill="#432408" rx="1.5" transform="rotate(-12 148 355)" />

                {/* Tattered Ghostly Sails (Layered frayed rags) */}
                <path
                  d="M 148 274 Q 170 286 210 271 Q 200 295 208 322 Q 185 315 152 322 Q 155 298 148 274 Z"
                  fill="url(#ghostSail)"
                  stroke="rgba(190,240,230,0.5)"
                  strokeWidth="1"
                />
                {/* Tattered sail fringes */}
                <path
                  d="M 152 322 L 155 340 L 162 323 L 170 346 L 178 324 L 186 348 L 195 323 L 202 342 L 208 322"
                  fill="url(#ghostSail)"
                  stroke="rgba(190,240,230,0.4)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 150 250 Q 175 240 200 248 Q 192 268 198 273 Q 174 270 148 274 Q 146 260 150 250 Z"
                  fill="url(#ghostSail)"
                  stroke="rgba(190,240,230,0.4)"
                  strokeWidth="0.8"
                />

                {/* Ship Hull (Tilted wooden galleon bow) */}
                <path
                  d="M 130 350 Q 145 340 170 348 Q 230 365 260 415 Q 268 470 230 520 Q 170 540 120 480 Q 110 405 130 350 Z"
                  fill="url(#shipWood)"
                  stroke="#472608"
                  strokeWidth="2.5"
                />
                {/* Planks & wood grain seams */}
                <path
                  d="M 135 385 Q 180 395 252 440"
                  stroke="#562e0a"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M 125 425 Q 170 440 246 475"
                  stroke="#562e0a"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M 120 460 Q 165 480 230 505"
                  stroke="#562e0a"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Deck cabin / upper stern details */}
                <path
                  d="M 230 395 L 265 410 L 262 455 L 235 440 Z"
                  fill="url(#shipDeck)"
                  stroke="#381b05"
                  strokeWidth="1.5"
                />
                {/* Cabin square barred windows */}
                <rect x="238" y="415" width="6" height="6" fill="#120c05" rx="1" />
                <rect x="247" y="419" width="6" height="6" fill="#120c05" rx="1" />
                <rect x="256" y="423" width="5" height="6" fill="#120c05" rx="1" />

                {/* Dark gaping cannonball hull breach hole */}
                <path
                  d="M 210 448 Q 235 450 238 475 Q 230 500 208 495 Q 195 470 210 448 Z"
                  fill="#150d06"
                  stroke="#442509"
                  strokeWidth="2"
                />

                {/* Eerie glowing yellow eyes peeking out from the dark hull breach */}
                <circle cx="218" cy="468" r="2.5" fill="#fef08a" filter="url(#glowEyes)" />
                <circle cx="228" cy="469" r="2.5" fill="#fef08a" filter="url(#glowEyes)" />
                <circle cx="218.5" cy="468" r="1" fill="#ca8a04" />
                <circle cx="228.5" cy="469" r="1" fill="#ca8a04" />
              </g>

              {/* SEABED & SAND DUNES (Bottom) */}
              <path
                d="M -10 560 Q 90 535 200 555 Q 310 575 410 540 L 410 660 L -10 660 Z"
                fill="url(#sandGrad)"
              />
              <path
                d="M -10 590 Q 110 565 240 595 Q 340 615 410 580 L 410 660 L -10 660 Z"
                fill="#b8913e"
                opacity="0.9"
              />

              {/* ROCKS FORMATION (Bottom Right, exactly like screenshot) */}
              <g id="rocks" transform="translate(235, 485)">
                {/* Base large rock */}
                <path
                  d="M 5 65 Q 20 25 55 28 Q 95 32 105 65 Q 110 85 60 90 Q 5 88 5 65 Z"
                  fill="#8c7756"
                  stroke="#574428"
                  strokeWidth="2"
                />
                {/* Highlight rock shelf */}
                <path
                  d="M 12 55 Q 28 32 58 35 Q 88 38 95 60 Q 60 68 12 55 Z"
                  fill="#bfab7d"
                />
                {/* Top stacked round smooth boulder */}
                <ellipse cx="60" cy="32" rx="30" ry="14" fill="#dfcb97" stroke="#675333" strokeWidth="2" />
                <ellipse cx="58" cy="30" rx="22" ry="9" fill="#f3e2b8" />
              </g>

              {/* PINK/PURPLE CORALS & SEA ANEMONES (Bottom right corner) */}
              <g id="corals" transform="translate(315, 490)">
                <path
                  d="M 15 75 Q 10 35 20 25 Q 30 18 35 32 Q 40 45 42 75 Z"
                  fill="#f472b6"
                  stroke="#db2777"
                  strokeWidth="2"
                />
                <circle cx="20" cy="24" r="5" fill="#fbcfe8" />
                <path
                  d="M 32 75 Q 38 40 48 30 Q 58 22 62 38 Q 62 55 60 75 Z"
                  fill="#ec4899"
                  stroke="#be185d"
                  strokeWidth="2"
                />
                <circle cx="48" cy="30" r="4.5" fill="#fce7f3" />
                <path
                  d="M 50 75 Q 60 50 72 42 Q 80 40 78 55 Q 75 65 72 75 Z"
                  fill="#f43f5e"
                  stroke="#9f1239"
                  strokeWidth="1.5"
                />
              </g>

              {/* TREASURE CHEST (Bottom Left, open brimming with vibrant gems!) */}
              <g id="treasureChest" transform="translate(25, 440)">
                {/* Chest shadow */}
                <ellipse cx="52" cy="112" rx="46" ry="10" fill="rgba(0,0,0,0.4)" />

                {/* Chest lower wooden body */}
                <path
                  d="M 10 60 L 95 55 L 88 110 L 18 112 Z"
                  fill="url(#chestWood)"
                  stroke="#3b2108"
                  strokeWidth="2.5"
                />

                {/* Chest metallic silver/gold reinforced corner straps */}
                <path d="M 10 60 L 22 60 L 25 111 L 18 112 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                <path d="M 85 56 L 95 55 L 88 110 L 78 110 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                <path d="M 48 58 L 58 57 L 54 111 L 46 111 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

                {/* Skull lock / keyhole plate */}
                <rect x="46" y="70" width="14" height="18" fill="#e2e8f0" rx="3" stroke="#475569" strokeWidth="1.5" />
                <circle cx="53" cy="77" r="3.5" fill="#1e293b" />
                <polygon points="51,80 55,80 54,84 52,84" fill="#1e293b" />

                {/* Open lid (swung open towards back left) */}
                <path
                  d="M 5 58 L 78 30 L 92 10 L 15 35 Z"
                  fill="#784510"
                  stroke="#3b2108"
                  strokeWidth="2.5"
                />
                <path
                  d="M 15 35 L 92 10 L 88 14 L 18 38 Z"
                  fill="#cbd5e1"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                {/* PILE OF SPARKLING GEMS & GOLD INSIDE CHEST */}
                {/* Gold coins spilling */}
                <circle cx="38" cy="54" r="5.5" fill="url(#goldCoin)" stroke="#b45309" strokeWidth="1" />
                <circle cx="46" cy="52" r="5" fill="url(#goldCoin)" stroke="#b45309" strokeWidth="1" />
                <circle cx="58" cy="53" r="5" fill="url(#goldCoin)" stroke="#b45309" strokeWidth="1" />
                <circle cx="68" cy="55" r="5" fill="url(#goldCoin)" stroke="#b45309" strokeWidth="1" />
                <circle cx="52" cy="48" r="4.5" fill="url(#goldCoin)" stroke="#b45309" strokeWidth="1" />

                {/* Vibrant faceted gems: Ruby, Sapphire, Emerald */}
                {/* Red Ruby */}
                <polygon points="32,45 42,42 45,50 35,53" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
                <polygon points="35,43 40,43 38,47" fill="#fca5a5" />

                {/* Blue Sapphire */}
                <polygon points="62,44 72,40 76,48 66,51" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" />
                <polygon points="65,42 70,41 68,46" fill="#93c5fd" />

                {/* Green Emerald */}
                <polygon points="46,40 56,38 58,45 48,47" fill="#10b981" stroke="#065f46" strokeWidth="1" />
                <polygon points="48,39 53,39 51,43" fill="#a7f3d0" />

                {/* Violet Amethyst */}
                <polygon points="74,48 83,45 84,52 75,54" fill="#a855f7" stroke="#6b21a8" strokeWidth="1" />
              </g>

              {/* TALL SWAYING GREEN SEAWEED / KELP (Left, Middle, Right) */}
              {/* Left seaweed cluster behind/beside chest */}
              <g id="seaweedLeft" className="animate-sway-slow origin-bottom">
                <path
                  d="M 12 550 Q 0 460 18 390 Q 32 320 12 250 Q 2 200 16 150 Q 22 205 18 260 Q 38 330 22 400 Q 8 470 20 550 Z"
                  fill="url(#seaweedDark)"
                  opacity="0.85"
                />
                <path
                  d="M 38 560 Q 55 480 35 410 Q 20 340 40 270 Q 50 220 38 180 Q 48 230 35 285 Q 15 355 30 425 Q 45 495 32 560 Z"
                  fill="url(#seaweedLight)"
                />
              </g>

              {/* Center green sea tube corals (in front of ship) */}
              <g id="centerSeaSponges" transform="translate(155, 465)">
                <path d="M 5 65 Q 4 30 10 20 Q 16 12 18 25 Q 18 45 15 65 Z" fill="#10b981" stroke="#047857" strokeWidth="2" />
                <ellipse cx="12" cy="18" rx="4.5" ry="2" fill="#34d399" />
                <path d="M 18 65 Q 19 18 26 10 Q 34 5 35 18 Q 33 40 28 65 Z" fill="#059669" stroke="#065f46" strokeWidth="2" />
                <ellipse cx="30" cy="9" rx="5" ry="2" fill="#6ee7b7" />
                <path d="M 34 65 Q 38 28 44 20 Q 52 14 50 28 Q 46 45 42 65 Z" fill="#10b981" stroke="#047857" strokeWidth="2" />
                <ellipse cx="47" cy="19" rx="4" ry="2" fill="#34d399" />
              </g>

              {/* Right tall seaweed cluster */}
              <g id="seaweedRight" className="animate-sway-med origin-bottom">
                <path
                  d="M 360 560 Q 375 480 350 410 Q 335 340 358 260 Q 368 200 352 160 Q 364 210 350 275 Q 330 350 342 420 Q 360 490 355 560 Z"
                  fill="url(#seaweedLight)"
                />
                <path
                  d="M 380 570 Q 395 490 380 430 Q 365 370 385 300 Q 395 240 382 190 Q 395 245 378 315 Q 360 380 372 445 Q 388 510 376 570 Z"
                  fill="url(#seaweedDark)"
                  opacity="0.9"
                />
              </g>
            </svg>

            {/* Content Slot (Interactive bubbles, pop particles, score floaters) */}
            <div className="relative w-full h-full z-20">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom Seabed Sandy Shelf Detail (matching bottom of screenshot with gold coins and pirate sword) */}
        <div className="w-full mt-1.5 px-3 py-1 flex items-center justify-between pointer-events-none text-amber-200/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold drop-shadow">🪙</span>
            <span className="text-sky-200/80 font-medium">Undersea Adventure</span>
          </div>
          <div className="text-sky-300/70 text-[11px]">
            Target Match Game
          </div>
        </div>
      </div>
    </div>
  );
};
