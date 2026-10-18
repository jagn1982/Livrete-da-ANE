import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Ícone Oficial Livrete da ANE:
 * Fiel à imagem fornecida pelo utilizador:
 * - Marcador de localização (Map Pin) em branco perolado 3D com duplo rebordo dourado metálico polido;
 * - Câmara interior circular em âmbar dourado com efeito de profundidade radial (sunburst);
 * - Carro desportivo de luxo visto de frente em preto obsidiana brilhante com reflexos panorâmicos;
 * - Faróis amendoados de alta intensidade com halo âmbar brilhante;
 * - Frisos LED horizontais dourados na grelha superior e no difusor do para-choques inferior.
 */
export const OfficialMapPinCarIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = 'w-full h-full', size }) => {
  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: (size * 130) / 100 } : undefined}
      aria-label="Livrete da ANE - Marcador GPS Dourado com Carro Frontal"
    >
      <defs>
        {/* Sombra de contacto inferior da ponta do marcador */}
        <radialGradient id="pin-ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Gradiente Dourado Metálico do Rebordo Exterior */}
        <linearGradient id="gold-metal-outer" x1="10" y1="5" x2="90" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.2" stopColor="#EAB308" />
          <stop offset="0.45" stopColor="#CA8A04" />
          <stop offset="0.7" stopColor="#FACC15" />
          <stop offset="0.9" stopColor="#B45309" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>

        {/* Gradiente do Corpo Branco Perolado 3D */}
        <linearGradient id="pin-pearl-body" x1="50" y1="6" x2="50" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#F8FAFC" />
          <stop offset="0.8" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Efeito de Bisel Dourado Interior do Pino */}
        <linearGradient id="gold-metal-inner" x1="20" y1="10" x2="80" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.3" stopColor="#D97706" />
          <stop offset="0.6" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>

        {/* Anel de Relevo Dourado da Câmara Central */}
        <linearGradient id="gold-bezel-ring" x1="22" y1="14" x2="78" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.25" stopColor="#CA8A04" />
          <stop offset="0.5" stopColor="#FDE047" />
          <stop offset="0.8" stopColor="#B45309" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>

        {/* Fundo Âmbar Dourado Brilhante (Sunburst Interior) */}
        <radialGradient id="chamber-amber-sunburst" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="90%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>

        {/* Vinheta Superior de Profundidade */}
        <linearGradient id="chamber-depth-vignette" x1="50" y1="16" x2="50" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#451A03" stopOpacity="0.5" />
          <stop offset="1" stopColor="#451A03" stopOpacity="0" />
        </linearGradient>

        {/* Corpo do Carro - Preto Obsidiana Brilhante */}
        <linearGradient id="car-gloss-obsidian" x1="50" y1="26" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="0.3" stopColor="#0F172A" />
          <stop offset="0.75" stopColor="#050811" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>

        {/* Brilho Intenso dos Faróis (Headlight Glow) */}
        <radialGradient id="headlight-intense-glow" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF9C3" />
          <stop offset="70%" stopColor="#FDE047" />
          <stop offset="92%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>

        {/* Filtro de Halo Brilhante para os Faróis */}
        <filter id="headlight-halo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Sombra Suave no Solo sob a ponta do marcador */}
      <ellipse cx="50" cy="123" rx="14" ry="3.5" fill="url(#pin-ground-shadow)" />

      {/* 2. Moldura Dourada Metálica Exterior do Pino */}
      <path
        d="M50 120 C46.8 112.5 12 75 12 42 C12 21 29 4 50 4 C71 4 88 21 88 42 C88 75 53.2 112.5 50 120 Z"
        fill="url(#gold-metal-outer)"
      />

      {/* 3. Corpo Principal do Pino em Branco Perolado com Bisel */}
      <path
        d="M50 116.5 C47.2 109.8 15.5 73.5 15.5 42 C15.5 22.8 31 7.2 50 7.2 C69 7.2 84.5 22.8 84.5 42 C84.5 73.5 52.8 109.8 50 116.5 Z"
        fill="url(#pin-pearl-body)"
      />

      {/* 4. Rebordo Dourado Interior do Bisel Perolado */}
      <path
        d="M50 113 C47.5 107.5 18 72 18 42 C18 24.3 32.3 10 50 10 C67.7 10 82 24.3 82 42 C82 72 52.5 107.5 50 113 Z"
        fill="none"
        stroke="url(#gold-metal-inner)"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />

      {/* 5. Anel Dourado Metálico em Relevo ao Redor da Câmara Circular */}
      <circle cx="50" cy="42" r="29.2" fill="url(#gold-bezel-ring)" />
      <circle cx="50" cy="42" r="27.8" fill="#92400E" />

      {/* 6. Fundo Âmbar Dourado Brilhante (Sunburst) */}
      <circle cx="50" cy="42" r="27" fill="url(#chamber-amber-sunburst)" />

      {/* Sombra de Profundidade na parte superior da câmara */}
      <path
        d="M23 42 C23 27.1 35.1 15 50 15 C64.9 15 77 27.1 77 42 Z"
        fill="url(#chamber-depth-vignette)"
      />

      {/* 7. O CARRO EM 2D VISTO DE FRENTE (Estilo Fiel à Imagem) */}
      <g id="car-front-view">
        {/* Sombra suave do carro sobre o piso dourado */}
        <ellipse cx="50" cy="55.5" rx="17" ry="2.2" fill="#581C87" fillOpacity="0.4" />
        <ellipse cx="50" cy="55" rx="14.5" ry="1.8" fill="#451A03" fillOpacity="0.6" />

        {/* Pneus Dianteiros em Preto (Largo e Apoiado) */}
        <rect x="33.8" y="47.5" width="5.4" height="8.5" rx="2.4" fill="#050811" />
        <rect x="60.8" y="47.5" width="5.4" height="8.5" rx="2.4" fill="#050811" />

        {/* Espelhos Retrovisores Aerodinâmicos Arredondados */}
        {/* Espelho Esquerdo */}
        <path
          d="M37.8 34.5 C34.5 34 32.5 35.5 32.5 37.5 C32.5 39.2 34.5 40.2 37.8 38.6 Z"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="0.6"
        />
        <ellipse cx="34.8" cy="36.8" rx="1.2" ry="0.8" fill="#475569" fillOpacity="0.65" />

        {/* Espelho Direito */}
        <path
          d="M62.2 34.5 C65.5 34 67.5 35.5 67.5 37.5 C67.5 39.2 65.5 40.2 62.2 38.6 Z"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="0.6"
        />
        <ellipse cx="65.2" cy="36.8" rx="1.2" ry="0.8" fill="#475569" fillOpacity="0.65" />

        {/* Silhueta da Carroçaria em Preto Obsidiana */}
        <path
          d="M42 27 C46 26.1 54 26.1 58 27 C61.2 27.8 63.5 32 64.6 35.5 C67 37.2 68 40.2 68 43.5 L68 49.5 C68 51 66 52.2 64.5 52.2 L60.5 52.2 C59.6 52.2 59 51.5 59 50.5 L59 49 C59 48 58 47.2 57 47.2 L43 47.2 C42 47.2 41 48 41 49 L41 50.5 C41 51.5 40.4 52.2 39.5 52.2 L35.5 52.2 C34 52.2 32 51 32 49.5 L32 43.5 C32 40.2 33 37.2 35.4 35.5 C36.5 32 38.8 27.8 42 27 Z"
          fill="url(#car-gloss-obsidian)"
          stroke="#334155"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Reflexo Especular Curvo no Teto */}
        <path
          d="M42.5 27.5 C46.5 26.8 53.5 26.8 57.5 27.5"
          stroke="#94A3B8"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Para-brisas Panorâmico Escurecido */}
        <path
          d="M42.6 28.2 C46 27.6 54 27.6 57.4 28.2 L61.8 35.5 C56.5 36.8 43.5 36.8 38.2 35.5 Z"
          fill="#02040A"
          stroke="#0F172A"
          strokeWidth="0.5"
        />

        {/* Reflexo Branco Curvo Dinâmico no Vidro (como na imagem!) */}
        <path
          d="M43.5 29 C47.5 28.4 52.5 28.4 55.5 29 C50.5 31.5 44.5 33.5 40 35.2 C41 33 42.2 30.6 43.5 29 Z"
          fill="#FFFFFF"
          fillOpacity="0.26"
        />

        {/* FARÓIS AMENDOA DOS ILUMINADOS (Intensidade Dourada/Âmbar) */}
        {/* Farol Esquerdo */}
        <g filter="url(#headlight-halo)">
          <path
            d="M34.8 40 C37.8 38.8 42.6 39.4 43.6 41.2 C44.1 42.8 42.6 44.6 39.6 44.8 C36.6 44.8 34.5 42.8 34.8 40 Z"
            fill="url(#headlight-intense-glow)"
          />
          <ellipse cx="39.2" cy="41.8" rx="2" ry="1" fill="#FFFFFF" />
        </g>

        {/* Farol Direito */}
        <g filter="url(#headlight-halo)">
          <path
            d="M65.2 40 C62.2 38.8 57.4 39.4 56.4 41.2 C55.9 42.8 57.4 44.6 60.4 44.8 C63.4 44.8 65.5 42.8 65.2 40 Z"
            fill="url(#headlight-intense-glow)"
          />
          <ellipse cx="60.8" cy="41.8" rx="2" ry="1" fill="#FFFFFF" />
        </g>

        {/* FRISO LED SUPERIOR DOURADO (Entre os faróis) */}
        <rect
          x="44.6"
          y="42.6"
          width="10.8"
          height="1.6"
          rx="0.8"
          fill="#FDE047"
          stroke="#D97706"
          strokeWidth="0.3"
        />
        <rect x="45.5" y="43" width="9" height="0.8" rx="0.4" fill="#FFFFFF" fillOpacity="0.9" />

        {/* FRISO LED INFERIOR DOURADO CURVO (No difusor do para-choques) */}
        <path
          d="M39.5 48.5 C44.5 49.8 55.5 49.8 60.5 48.5"
          stroke="#FBBF24"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M40.5 48.5 C44.8 49.6 55.2 49.6 59.5 48.5"
          stroke="#FEF08A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M43 48.6 C46.5 49.4 53.5 49.4 57 48.6"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

// Aliases para compatibilidade em todos os componentes existentes
export const CarPinTargetIcon = OfficialMapPinCarIcon;
export const CarFront2DIcon = OfficialMapPinCarIcon;

export const AppLogoIcon: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-9 h-9',
  className = '',
}) => {
  return (
    <div
      className={`relative ${sizeClass} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${className}`}
    >
      <OfficialMapPinCarIcon className="w-full h-full drop-shadow-md" />
    </div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-8', text: 'text-base', sub: 'text-[9px]', tag: 'text-[10px]' },
    md: { icon: 'w-9 h-11', text: 'text-lg', sub: 'text-[10px]', tag: 'text-xs' },
    lg: { icon: 'w-11 h-13', text: 'text-xl', sub: 'text-xs', tag: 'text-xs' },
    xl: { icon: 'w-14 h-16', text: 'text-2xl', sub: 'text-xs', tag: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AppLogoIcon sizeClass={currentSize.icon} />
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              } ${currentSize.text}`}
            >
              Livrete <span className="text-slate-400 font-semibold text-sm">da</span>{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold">
                ANE
              </span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider">
              PT
            </span>
          </div>
          <span
            className={`block ${currentSize.sub} ${
              variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
            } font-semibold tracking-wider uppercase`}
          >
            Registo Digital · Portaria n.º 7/2022
          </span>
        </div>
      )}
    </div>
  );
};
