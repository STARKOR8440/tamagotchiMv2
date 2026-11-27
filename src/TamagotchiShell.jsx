import React from 'react';

export const SHELL_SKINS = {
  SODA_BLUE: {
    id: 'SODA_BLUE',
    name: '소다 버블',
    price: 0,
    bodyBg: 'radial-gradient(circle at 35% 25%, #bae6fd 0%, #7dd3fc 55%, #38bdf8 100%)',
    border: '#0284c7',
    antenna: '#7dd3fc',
    irPort: '#7f1d1d',
    bezelBg: '#fef08a',
    bezelBorder: '#3b82f6',
    lcdBg: '#cbd5c0',
    btnColor: '#2dd4bf',
    btnBorder: '#0f766e',
    pattern: 'radial-gradient(rgba(255,255,255,0.55) 14%, transparent 15%), radial-gradient(rgba(14,116,144,0.25) 18%, transparent 19%)',
    patternSize: '36px 36px',
  },
  COMIC_POP: {
    id: 'COMIC_POP',
    name: '코믹 팝',
    price: 100,
    bodyBg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    border: '#0f172a',
    antenna: '#ef4444',
    irPort: '#0f172a',
    bezelBg: '#0f172a',
    bezelBorder: '#000000',
    lcdBg: '#d8dec8',
    btnColor: '#1d4ed8',
    btnBorder: '#0f172a',
    pattern: 'radial-gradient(rgba(15,23,42,0.12) 15%, transparent 16%)',
    patternSize: '10px 10px',
  },
  MATCHA_LATTE: {
    id: 'MATCHA_LATTE',
    name: '말차 라떼',
    price: 150,
    bodyBg: 'radial-gradient(circle at 35% 25%, #dcfce7 0%, #86efac 55%, #22c55e 100%)',
    border: '#15803d',
    antenna: '#86efac',
    irPort: '#7f1d1d',
    bezelBg: '#fef3c7',
    bezelBorder: '#b45309',
    lcdBg: '#d4dcc8',
    btnColor: '#fb923c',
    btnBorder: '#c2410c',
    pattern: 'radial-gradient(rgba(255,255,255,0.5) 16%, transparent 17%)',
    patternSize: '30px 30px',
  },
  RAINBOW_POP: {
    id: 'RAINBOW_POP',
    name: '레인보우 팝',
    price: 200,
    bodyBg: 'linear-gradient(135deg, #ef4444 0%, #ef4444 26%, #facc15 26%, #facc15 48%, #22c55e 48%, #22c55e 72%, #3b82f6 72%, #3b82f6 100%)',
    border: '#b91c1c',
    antenna: '#0284c7',
    irPort: '#7f1d1d',
    bezelBg: '#38bdf8',
    bezelBorder: '#0369a1',
    lcdBg: '#d4dcc8',
    btnColor: '#7e22ce',
    btnBorder: '#4c1d95',
    pattern: 'radial-gradient(rgba(255,255,255,0.35) 10%, transparent 11%)',
    patternSize: '28px 28px',
  },
  GRAPE_JELLY: {
    id: 'GRAPE_JELLY',
    name: '스낵 팝콘',
    price: 250,
    bodyBg: 'radial-gradient(circle at 35% 25%, rgba(251, 146, 60, 0.88) 0%, rgba(234, 88, 12, 0.92) 55%, rgba(154, 52, 18, 0.96) 100%)',
    border: '#9a3412',
    antenna: 'rgba(234, 88, 12, 0.85)',
    irPort: '#7c2d12',
    bezelBg: '#facc15',
    bezelBorder: '#ca8a04',
    lcdBg: '#e2e8f0',
    btnColor: '#ea580c',
    btnBorder: '#9a3412',
    pattern: 'radial-gradient(rgba(255,255,255,0.22) 10%, transparent 12%)',
    patternSize: '26px 26px',
  },
  CLEAR_90S: {
    id: 'CLEAR_90S',
    name: '1996 레트로',
    price: 300,
    bodyBg: 'radial-gradient(circle at 35% 45%, #ec4899 0%, #db2777 65%, #be185d 100%)',
    border: '#9d174d',
    antenna: 'rgba(203, 213, 225, 0.85)',
    irPort: '#1e3a8a',
    bezelBg: '#38bdf8',
    bezelBorder: '#0284c7',
    lcdBg: '#e2e8f0',
    btnColor: '#facc15',
    btnBorder: '#b45309',
    pattern: 'radial-gradient(rgba(255,255,255,0.45) 8%, transparent 10%)',
    patternSize: '24px 24px',
  },
  PINK_ICE: {
    id: 'PINK_ICE',
    name: '오로라 엔젤',
    price: 350,
    bodyBg: 'radial-gradient(circle at 45% 30%, rgba(248, 250, 252, 0.92) 0%, rgba(226, 232, 240, 0.88) 55%, rgba(203, 213, 225, 0.94) 100%)',
    border: '#94a3b8',
    antenna: 'rgba(241, 245, 249, 0.9)',
    irPort: '#cbd5e1',
    bezelBg: '#e2e8f0',
    bezelBorder: '#64748b',
    lcdBg: '#cce7f5',
    btnColor: '#ffffff',
    btnBorder: '#94a3b8',
    pattern: 'radial-gradient(rgba(255,255,255,0.85) 10%, transparent 12%), radial-gradient(rgba(244,114,182,0.22) 14%, transparent 16%)',
    patternSize: '22px 22px',
  },
  ANGEL_GARDEN: {
    id: 'ANGEL_GARDEN',
    name: '엔젤 가든',
    price: 500,
    bodyBg: 'radial-gradient(circle at 50% 25%, #273473 0%, #172052 55%, #0e1438 100%)',
    border: '#090d26',
    antenna: '#273473',
    irPort: '#1e1b4b',
    bezelBg: '#19225c',
    bezelBorder: '#38bdf8',
    lcdBg: '#cce7f5',
    btnColor: '#99f6e4',
    btnBorder: '#0d9488',
    pattern: 'radial-gradient(rgba(254,240,138,0.65) 6%, transparent 8%)',
    patternSize: '42px 42px',
  },

  // 시크릿 히든 전용 5종 콜라보 스킨
  SECRET_TOYSTORY: {
    id: 'SECRET_TOYSTORY',
    name: '토이스토리',
    price: 0,
    isSecret: true,
    bodyBg: 'radial-gradient(circle at 40% 25%, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%)',
    border: '#1e3a8a',
    antenna: '#facc15',
    irPort: '#dc2626',
    bezelBg: '#7dd3fc',
    bezelBorder: '#facc15',
    lcdBg: '#dbeafe',
    btnColor: '#ef4444',
    btnBorder: '#991b1b',
    pattern: 'radial-gradient(rgba(255,255,255,0.85) 16%, transparent 17%), radial-gradient(rgba(255,255,255,0.65) 12%, transparent 13%)',
    patternSize: '44px 44px',
  },
  SECRET_GROGU: {
    id: 'SECRET_GROGU',
    name: '그로구 에디션',
    price: 0,
    isSecret: true,
    bodyBg: 'radial-gradient(circle at 45% 25%, #bbf7d0 0%, #86efac 55%, #4ade80 100%)',
    border: '#15803d',
    antenna: '#86efac',
    irPort: '#166534',
    bezelBg: '#f59e0b',
    bezelBorder: '#b45309',
    lcdBg: '#dcfce7',
    btnColor: '#ffffff',
    btnBorder: '#ca8a04',
    pattern: 'radial-gradient(rgba(255,255,255,0.4) 10%, transparent 11%)',
    patternSize: '28px 28px',
  },
  SECRET_KITTY: {
    id: 'SECRET_KITTY',
    name: '헬로키티',
    price: 0,
    isSecret: true,
    bodyBg: 'radial-gradient(circle at 40% 25%, #ffffff 0%, #fff1f2 65%, #ffe4e6 100%)',
    border: '#f43f5e',
    antenna: '#ef4444',
    irPort: '#e11d48',
    bezelBg: '#bae6fd',
    bezelBorder: '#f472b6',
    lcdBg: '#fff1f2',
    btnColor: '#ffffff',
    btnBorder: '#ef4444',
    pattern: 'radial-gradient(rgba(244,63,94,0.22) 12%, transparent 13%), radial-gradient(rgba(250,204,21,0.25) 10%, transparent 11%)',
    patternSize: '30px 30px',
  },
  SECRET_R2D2: {
    id: 'SECRET_R2D2',
    name: 'R2-D2 드로이드',
    price: 0,
    isSecret: true,
    bodyBg: 'linear-gradient(180deg, #e2e8f0 0%, #f8fafc 35%, #ffffff 100%)',
    border: '#1d4ed8',
    antenna: '#2563eb',
    irPort: '#dc2626',
    bezelBg: '#1d4ed8',
    bezelBorder: '#0f172a',
    lcdBg: '#e0f2fe',
    btnColor: '#cbd5e1',
    btnBorder: '#1e3a8a',
    pattern: 'repeating-linear-gradient(90deg, rgba(37,99,235,0.12) 0px, rgba(37,99,235,0.12) 8px, transparent 8px, transparent 24px)',
    patternSize: '32px 32px',
  },
  // 5번째 시크릿 스킨: 피너츠 스누피 에디션 (7386.jpg 기반)
  SECRET_PEANUTS: {
    id: 'SECRET_PEANUTS',
    name: '피너츠 에디션',
    price: 0,
    isSecret: true,
    bodyBg: 'radial-gradient(circle at 38% 25%, #fef08a 0%, #facc15 58%, #eab308 100%)',
    border: '#ca8a04',
    antenna: '#facc15',
    irPort: '#1e293b',
    bezelBg: '#1e293b',
    bezelBorder: '#0f172a',
    lcdBg: '#fefce8',
    btnColor: '#1e293b',
    btnBorder: '#0f172a',
    pattern: 'radial-gradient(rgba(255,255,255,0.35) 12%, transparent 13%)',
    patternSize: '34px 34px',
  },
};

const MENU_ICONS = [
  { id: 'FEED', icon: '🍖', label: '식사' },
  { id: 'PLAY', icon: '🎾', label: '놀이' },
  { id: 'CLEAN', icon: '🧹', label: '청소' },
  { id: 'SHOP', icon: '🏪', label: '상점' },
  { id: 'STATUS', icon: '📊', label: '상태' },
  { id: 'DEX', icon: '📖', label: '도감' },
];

export default function TamagotchiShell({
  skinKey,
  coins = 0,
  isSleeping = false,
  selectedMenuIdx,
  onPressA,
  onPressB,
  onPressC,
  onSelectMenu,
  children,
}) {
  const skin = SHELL_SKINS[skinKey] || SHELL_SKINS.SODA_BLUE;

  return (
    <div
      style={{
        position: 'relative',
        width: '248px',
        height: '305px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* 그로구 에디션 전용 바디 외부 돌출 귀 몰드 */}
      {skinKey === 'SECRET_GROGU' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '76px',
              left: '-24px',
              width: '44px',
              height: '22px',
              background: '#86efac',
              border: '3px solid #15803d',
              borderRadius: '18px 4px 4px 18px',
              transform: 'rotate(-14deg)',
              boxShadow: 'inset 0 4px 4px #fbcfe8',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '76px',
              right: '-24px',
              width: '44px',
              height: '22px',
              background: '#86efac',
              border: '3px solid #15803d',
              borderRadius: '4px 18px 18px 4px',
              transform: 'rotate(14deg)',
              boxShadow: 'inset 0 4px 4px #fbcfe8',
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* 좌측 상단 안테나 */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '34px',
          width: '24px',
          height: '48px',
          background: skin.antenna,
          border: `3px solid ${skin.border}`,
          borderRadius: '14px 14px 4px 4px',
          boxShadow: 'inset 3px 3px 6px rgba(255,255,255,0.6)',
          zIndex: 1,
        }}
      />

      {/* 우측 상단 볼체인 고리 */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '36px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '3px solid #cbd5e1',
          background: 'rgba(255,255,255,0.4)',
          zIndex: 1,
        }}
      />

      {/* 달걀형 메인 바디 */}
      <div
        style={{
          position: 'relative',
          marginTop: '16px',
          width: '236px',
          height: '284px',
          borderRadius: '50% 50% 47% 47% / 56% 56% 44% 44%',
          backgroundColor: '#fff',
          backgroundImage: `${skin.pattern}, ${skin.bodyBg}`,
          backgroundSize: `${skin.patternSize}, 100% 100%`,
          border: `3.5px solid ${skin.border}`,
          boxShadow:
            '0 14px 28px rgba(0,0,0,0.45), inset 0 8px 14px rgba(255,255,255,0.65), inset 0 -10px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '10px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* 피너츠 에디션(SECRET_PEANUTS) 전용 커스텀 코믹 아트 오버레이 */}
        {skinKey === 'SECRET_PEANUTS' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            {/* 중앙 크림 화이트 원형 일러스트 패널 */}
            <ellipse cx="118" cy="146" rx="94" ry="114" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
            {/* 상단 스누피 & 우드스탁 스케치 포인트 */}
            <ellipse cx="136" cy="54" rx="14" ry="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.8" />
            <ellipse cx="147" cy="57" rx="4.5" ry="8" fill="#1e293b" transform="rotate(15 147 57)" />
            <circle cx="123" cy="52" r="2.2" fill="#1e293b" />
            {/* 좌측 우드스탁 */}
            <circle cx="94" cy="54" r="5" fill="#facc15" stroke="#1e293b" strokeWidth="1.4" />
            <path d="M 91 48 L 93 43 M 95 48 L 98 44" stroke="#1e293b" strokeWidth="1.4" />
            {/* 좌우 코믹 캐릭터 실루엣 라인 */}
            <circle cx="34" cy="126" r="10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 28 124 Q 34 129 40 124" fill="none" stroke="#1e293b" strokeWidth="1.4" />
            <circle cx="34" cy="176" r="10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 29 175 Q 34 180 39 175" fill="none" stroke="#1e293b" strokeWidth="1.4" />
            <circle cx="202" cy="126" r="10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="202" cy="176" r="10" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            {/* 하단 스누피 빨간 지붕 포인트 */}
            <polygon points="84,258 152,258 144,244 92,244" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
          </svg>
        )}

        {/* 기존 시크릿 스킨 4종 커스텀 아트 오버레이 */}
        {skinKey === 'SECRET_TOYSTORY' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <ellipse cx="42" cy="70" rx="22" ry="11" fill="#ffffff" opacity="0.9" />
            <circle cx="34" cy="64" r="9" fill="#ffffff" opacity="0.9" />
            <circle cx="48" cy="64" r="8" fill="#ffffff" opacity="0.9" />
            <ellipse cx="192" cy="76" rx="22" ry="11" fill="#ffffff" opacity="0.9" />
            <circle cx="184" cy="70" r="8" fill="#ffffff" opacity="0.9" />
            <circle cx="198" cy="70" r="9" fill="#ffffff" opacity="0.9" />
            <ellipse cx="38" cy="185" rx="20" ry="10" fill="#ffffff" opacity="0.88" />
            <ellipse cx="196" cy="185" rx="20" ry="10" fill="#ffffff" opacity="0.88" />
            <polygon points="118,224 122,233 132,233 124,239 127,248 118,242 109,248 112,239 104,233 114,233" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
          </svg>
        )}

        {skinKey === 'SECRET_GROGU' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <circle cx="96" cy="48" r="7" fill="#0f172a" />
            <circle cx="94" cy="46" r="2.2" fill="#ffffff" />
            <circle cx="140" cy="48" r="7" fill="#0f172a" />
            <circle cx="138" cy="46" r="2.2" fill="#ffffff" />
            <path d="M 18 205 Q 118 228 218 205 L 218 284 L 18 284 Z" fill="#e7e5e4" stroke="#78716c" strokeWidth="2.2" />
            <path d="M 55 212 L 118 232 L 181 212" fill="none" stroke="#a8a29e" strokeWidth="3" />
          </svg>
        )}

        {skinKey === 'SECRET_KITTY' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <ellipse cx="176" cy="44" rx="14" ry="10" fill="#ef4444" stroke="#991b1b" strokeWidth="1.8" transform="rotate(-20 176 44)" />
            <ellipse cx="196" cy="52" rx="14" ry="10" fill="#ef4444" stroke="#991b1b" strokeWidth="1.8" transform="rotate(-20 196 52)" />
            <circle cx="186" cy="48" r="5.5" fill="#facc15" stroke="#991b1b" strokeWidth="1.5" />
            <path d="M 32 165 C 24 156, 12 164, 22 175 L 32 184 L 42 175 C 52 164, 40 156, 32 165 Z" fill="#f43f5e" opacity="0.85" />
            <path d="M 204 165 C 196 156, 184 164, 194 175 L 204 184 L 214 175 C 224 164, 212 156, 204 165 Z" fill="#f43f5e" opacity="0.85" />
            <circle cx="48" cy="212" r="5" fill="#facc15" />
            <circle cx="188" cy="212" r="5" fill="#facc15" />
          </svg>
        )}

        {skinKey === 'SECRET_R2D2' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <rect x="20" y="38" width="196" height="16" rx="4" fill="#1d4ed8" />
            <circle cx="118" cy="46" r="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.2" />
            <circle cx="115" cy="43" r="3" fill="#38bdf8" />
            <circle cx="144" cy="59" r="3.5" fill="#ef4444" />
            <rect x="16" y="124" width="16" height="64" rx="4" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
            <rect x="204" y="124" width="16" height="64" rx="4" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
            <rect x="70" y="255" width="96" height="14" rx="4" fill="#1d4ed8" />
          </svg>
        )}

        {/* 기존 일반 커스텀 아트 오버레이 5종 */}
        {skinKey === 'PINK_ICE' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <polygon points="34,42 74,26 84,56 42,74" fill="#fbcfe8" opacity="0.68" />
            <polygon points="154,28 198,46 186,82 146,62" fill="#bae6fd" opacity="0.68" />
            <polygon points="18,162 56,174 48,224 14,208" fill="#a5f3fc" opacity="0.62" />
            <polygon points="182,166 220,158 216,214 176,204" fill="#f5d0fe" opacity="0.65" />
            <path d="M 42 104 C 14 92, 6 116, 24 126 C 10 132, 14 148, 34 146 C 24 156, 34 166, 44 156 Z" fill="#ffffff" stroke="#f9a8d4" strokeWidth="1.6" />
            <path d="M 194 104 C 222 92, 230 116, 212 126 C 226 132, 222 148, 202 146 C 212 156, 202 166, 192 156 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.6" />
          </svg>
        )}

        {skinKey === 'GRAPE_JELLY' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <polygon points="96,4 102,15 114,8 109,20 120,24 108,28 112,38 101,31 94,39 95,27 83,24 94,18" fill="#2563eb" />
            <path d="M 10 205 Q 118 228 226 205 L 226 284 L 10 284 Z" fill="#ffffff" />
            <path d="M 12 201 Q 118 224 224 201" fill="none" stroke="#fef08a" strokeWidth="4" />
          </svg>
        )}

        {skinKey === 'CLEAR_90S' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <path d="M 18 76 Q 118 96 218 76 L 218 0 L 18 0 Z" fill="rgba(226, 232, 240, 0.86)" />
            <polygon points="16,74 74,104 68,112 12,82" fill="#facc15" />
            <polygon points="220,74 162,104 168,112 224,82" fill="#facc15" />
            <polygon points="105,284 236,184 236,284" fill="rgba(226, 232, 240, 0.85)" />
            <text x="148" y="246" fontSize="15" fontWeight="900" fontStyle="italic" fill="#db2777" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke" transform="rotate(-28 168 238)">TMGC</text>
          </svg>
        )}

        {skinKey === 'ANGEL_GARDEN' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <path d="M 48 64 Q 118 28 188 64" fill="none" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M 38 112 C 14 102, 8 122, 24 130 C 12 136, 16 148, 32 146 C 24 154, 32 162, 42 154 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
            <path d="M 198 112 C 222 102, 228 122, 212 130 C 224 136, 220 148, 204 146 C 212 154, 204 162, 194 154 Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
            <ellipse cx="42" cy="215" rx="34" ry="26" fill="#34d399" opacity="0.45" />
            <ellipse cx="192" cy="215" rx="36" ry="28" fill="#2dd4bf" opacity="0.45" />
          </svg>
        )}

        {skinKey === 'COMIC_POP' && (
          <svg width="236" height="284" viewBox="0 0 236 284" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}>
            <polygon points="55,10 180,10 172,72 64,72" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="4,105 52,98 52,188 4,195" fill="#2563eb" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="184,96 232,105 232,192 184,184" fill="#2563eb" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="10,196 76,192 84,274 26,274" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="162,192 226,196 210,274 154,274" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
          </svg>
        )}

        {/* 상단 적외선 포트 */}
        {skinKey === 'CLEAR_90S' ? (
          <div style={{ fontSize: '11px', fontWeight: '900', color: '#0369a1', textShadow: '0 1px 0 #ffffff', letterSpacing: '1.5px', marginBottom: '1px', position: 'relative', zIndex: 2 }}>
            1996
          </div>
        ) : skinKey === 'SECRET_PEANUTS' ? (
          <div
            style={{
              background: '#1e293b',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '900',
              letterSpacing: '1.5px',
              padding: '2px 10px',
              borderRadius: '3px',
              transform: 'rotate(-5deg)',
              border: '1.5px dashed #facc15',
              marginBottom: '3px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            PEANUTS
          </div>
        ) : (
          <div
            style={{
              width: '74px',
              height: '11px',
              background: skin.irPort,
              borderRadius: '20px 20px 6px 6px',
              border: '2px solid rgba(0,0,0,0.28)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.45)',
              marginBottom: '4px',
              position: 'relative',
              zIndex: 2,
            }}
          />
        )}

        {/* 로고 */}
        <div
          style={{
            fontSize: skinKey === 'CLEAR_90S' ? '14px' : '12px',
            fontWeight: '900',
            fontStyle: 'italic',
            color:
              skinKey === 'CLEAR_90S' || skinKey === 'SECRET_KITTY'
                ? '#ec4899'
                : skinKey === 'SECRET_PEANUTS'
                ? '#1e293b'
                : '#fff',
            textShadow:
              skinKey === 'SECRET_KITTY'
                ? '0 1.5px 0 #ffffff, -1px -1px 0 #f43f5e, 1px -1px 0 #f43f5e'
                : skinKey === 'SECRET_PEANUTS'
                ? '0 1px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff'
                : '0 1.5px 0 #1e3a8a, -1px -1px 0 #1e3a8a, 1px -1px 0 #1e3a8a, -1px 1px 0 #1e3a8a',
            letterSpacing: '0.3px',
            marginBottom: '6px',
            lineHeight: 1.05,
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {skinKey === 'SECRET_TOYSTORY'
            ? 'TOY STORY'
            : skinKey === 'SECRET_GROGU'
            ? 'STAR WARS'
            : skinKey === 'SECRET_KITTY'
            ? 'HELLO KITTY'
            : skinKey === 'SECRET_R2D2'
            ? 'R2-D2'
            : skinKey === 'SECRET_PEANUTS'
            ? 'SNOOPY'
            : 'Tamagotchi'}
          {skinKey !== 'CLEAR_90S' && (
            <div
              style={{
                fontSize: '7.5px',
                letterSpacing: '1.2px',
                color:
                  skinKey === 'SECRET_KITTY'
                    ? '#ef4444'
                    : skinKey === 'SECRET_PEANUTS'
                    ? '#dc2626'
                    : '#fef08a',
              }}
            >
              {skin.isSecret ? 'SECRET EDITION' : 'CONNECTION'}
            </div>
          )}
        </div>

        {/* 중앙 사각 컬러 베젤 */}
        <div
          style={{
            width: '148px',
            height: '146px',
            background: skin.bezelBg,
            border: `3px solid ${skin.bezelBorder}`,
            borderRadius: '12px',
            padding: '7px',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* LCD 액정 화면 */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: isSleeping ? '#94a3b8' : skin.lcdBg,
              border: '2px solid #64748b',
              borderRadius: '6px',
              boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.28)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '3px 4px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 상단 6개 메뉴 아이콘 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px dashed rgba(30,41,59,0.25)',
                paddingBottom: '2px',
              }}
            >
              {MENU_ICONS.map((m, idx) => {
                const isSelected = selectedMenuIdx === idx;
                return (
                  <span
                    key={m.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMenu(idx);
                    }}
                    title={m.label}
                    style={{
                      fontSize: '10.5px',
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.35,
                      transform: isSelected ? 'scale(1.2)' : 'scale(0.95)',
                      filter: 'grayscale(100%) contrast(160%)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.icon}
                  </span>
                );
              })}
            </div>

            {/* 중앙 콘텐츠 영역 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {children}
            </div>

            {/* 하단 메뉴명 & 보유 코인 표시 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px dashed rgba(30,41,59,0.25)',
                paddingTop: '1px',
                fontSize: '8.5px',
                fontWeight: '800',
                color: '#1e293b',
              }}
            >
              <span>
                [{MENU_ICONS[selectedMenuIdx].label}] {isSleeping ? '🌙' : ''}
              </span>
              <span>🪙{coins}</span>
            </div>
          </div>
        </div>

        {/* 하단 물리 버튼 3개 */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <PhysicalButton label="A" title="메뉴 이동" color={skin.btnColor} border={skin.btnBorder} onClick={onPressA} />
          <PhysicalButton
            label="B"
            title="선택 / 실행"
            color={skin.btnColor}
            border={skin.btnBorder}
            onClick={onPressB}
            offsetY={4}
          />
          <PhysicalButton label="C" title="취소 / 닫기" color={skin.btnColor} border={skin.btnBorder} onClick={onPressC} />
        </div>
      </div>
    </div>
  );
}

function PhysicalButton({ label, title, color, border, onClick, offsetY = 0 }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: color,
        border: `2.5px solid ${border}`,
        boxShadow: '0 3px 0 rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.65)',
        cursor: 'pointer',
        transform: `translateY(${offsetY}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        fontWeight: '900',
        color: color === '#1e293b' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)',
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}
