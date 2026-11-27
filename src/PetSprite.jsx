// src/PetSprite.jsx — Forest / Land / Sky / Water 성체 & 시크릿 PNG 연동 + 키드·영·비비마루치 벡터(SVG) 폴백
import React, { useState, useEffect, useMemo } from 'react';
import { SPECIES } from './evolutionTree';

const EXACT_SPRITE_MAP = {
  // 숲(Forest) 16성체 + 시크릿
  ADULT_FOREST_HORHOTCHI: '/sprites/Forest/호르호치.png',
  ADULT_FOREST_KONKOTCHI: '/sprites/Forest/콘코치.png',
  ADULT_FOREST_TIGAOTCHI: '/sprites/Forest/티가오치.png',
  ADULT_FOREST_TANOONTCHI: '/sprites/Forest/타눈치.png',
  ADULT_FOREST_LESSAPANTCHI: '/sprites/Forest/레사판치.png',
  ADULT_FOREST_KANEKOTCHI: '/sprites/Forest/카네코치.png',
  ADULT_FOREST_SUIGYUTCHI: '/sprites/Forest/스이규치.png',
  ADULT_FOREST_PANBOOTCHI: '/sprites/Forest/판부치.png',
  ADULT_FOREST_KACHITCHI: '/sprites/Forest/카치치.png',
  ADULT_FOREST_TOKIPATCHI: '/sprites/Forest/토키파치.png',
  ADULT_FOREST_KUCHIPATCHI: '/sprites/Forest/쿠치파치.png',
  ADULT_FOREST_SPARROTCHI: '/sprites/Forest/스페로치.png',
  ADULT_FOREST_SHITAKECHI: '/sprites/Forest/시타게치.png',
  ADULT_FOREST_PEATCHI: '/sprites/Forest/피치.png',
  ADULT_FOREST_NAPPATCHI: '/sprites/Forest/나파치.png',
  ADULT_FOREST_RUSHRADITCHI: '/sprites/Forest/러시래디치.png',
  SECRET_FOREST_SPECIAL: '/sprites/Forest/s타츠치.png',

  // 땅(Land) 16성체 + 시크릿
  ADULT_LAND_MEOWTCHI: '/sprites/Land/먀우치.png',
  ADULT_LAND_POCHITCHI: '/sprites/Land/포치치.png',
  ADULT_LAND_GUMAX: '/sprites/Land/구맥스.png',
  ADULT_LAND_RATCHI: '/sprites/Land/래치.png',
  ADULT_LAND_MAMETCHI: '/sprites/Land/마메치.png',
  ADULT_LAND_MIMITCHI: '/sprites/Land/미미치.png',
  ADULT_LAND_MOLMOTCHI: '/sprites/Land/몰모치.png',
  ADULT_LAND_SHEEPTCHI: '/sprites/Land/시피치.png',
  ADULT_LAND_LEOPATCHI: '/sprites/Land/레오파치.png',
  ADULT_LAND_SEBIRETCHI: '/sprites/Land/세비레치.png',
  ADULT_LAND_ELIZARDOTCHI: '/sprites/Land/엘리자도치.png',
  ADULT_LAND_HEAVYTTCHI: '/sprites/Land/헤비치.png',
  ADULT_LAND_VIOLETCHI: '/sprites/Land/비올레치.png',
  ADULT_LAND_POTSUNENTCHI: '/sprites/Land/포츠넨치.png',
  ADULT_LAND_TUSTUSTCHI: '/sprites/Land/츠츠치.png',
  ADULT_LAND_SHIGEMI_SAN: '/sprites/Land/시게미상.png',
  SECRET_LAND_SPECIAL: '/sprites/Land/s초드라코치.png',

  // 하늘(Sky) 16성체 + 시크릿
  ADULT_SKY_HORHOTCHI: '/sprites/Sky/호르호치.png',
  ADULT_SKY_MONGATCHI: '/sprites/Sky/몽가치.png',
  ADULT_SKY_EAGLETCHI: '/sprites/Sky/이글치.png',
  ADULT_SKY_BATCHI: '/sprites/Sky/뱃치.png',
  ADULT_SKY_PEACOTCHI: '/sprites/Sky/피코치.png',
  ADULT_SKY_BATATCHI: '/sprites/Sky/바타치.png',
  ADULT_SKY_KUCHIPATCHI: '/sprites/Sky/쿠치파치.png',
  ADULT_SKY_KIWITCHI: '/sprites/Sky/키위치.png',
  ADULT_SKY_PAPILLOTCHI: '/sprites/Sky/파필로치.png',
  ADULT_SKY_KABUTOTCHI: '/sprites/Sky/카부토치.png',
  ADULT_SKY_TENLOTCHI: '/sprites/Sky/텐로치.png',
  ADULT_SKY_HATCHITCHI: '/sprites/Sky/하치치.png',
  ADULT_SKY_GEMTCHI: '/sprites/Sky/젬치.png',
  ADULT_SKY_OROTATCHI: '/sprites/Sky/오로타치.png',
  ADULT_SKY_ISHIKOROTCHI: '/sprites/Sky/이시코로치.png',
  ADULT_SKY_MAGMATCHI: '/sprites/Sky/마그마치.png',
  SECRET_SKY_SPECIAL: '/sprites/Sky/s야야콘치.png',

  // 바다(Water) 16성체 + 시크릿
  ADULT_WATER_IRUKATCHI: '/sprites/Water/이루카치.png',
  ADULT_WATER_KAMETCHI: '/sprites/Water/카메치.png',
  ADULT_WATER_KUJIRATCHI: '/sprites/Water/쿠지라치.png',
  ADULT_WATER_URUOTCHI: '/sprites/Water/우루오치.png',
  ADULT_WATER_AXOLOPATCHI: '/sprites/Water/아홀로파치.png',
  ADULT_WATER_IMORITCHI: '/sprites/Water/이모리치.png',
  ADULT_WATER_KAWAZUTCHI: '/sprites/Water/카와즈치.png',
  ADULT_WATER_BEAVERTCHI: '/sprites/Water/비버치.png',
  ADULT_WATER_TACHUTCHI: '/sprites/Water/타추치.png',
  ADULT_WATER_SHARKTCHI: '/sprites/Water/샤크치.png',
  ADULT_WATER_ANKOTCHI: '/sprites/Water/안코치.png',
  ADULT_WATER_OTOTOTCHI: '/sprites/Water/오토토치.png',
  ADULT_WATER_KURARATCHI: '/sprites/Water/쿠라라치.png',
  ADULT_WATER_MENDAKOTCHI: '/sprites/Water/멘다코치.png',
  ADULT_WATER_AMEFURATCHI: '/sprites/Water/아메후라치.png',
  ADULT_WATER_GUSOKUTCHI: '/sprites/Water/구소쿠치.png',
  SECRET_WATER_SPECIAL: '/sprites/Water/s머마린치.png',
};

const BIOME_PALETTE = {
  land: { body: '#fef08a', stroke: '#1d4ed8', cheek: '#f472b6', accent: '#f59e0b' },
  forest: { body: '#99f6e4', stroke: '#1d4ed8', cheek: '#fda4af', accent: '#22c55e' },
  water: { body: '#bae6fd', stroke: '#1d4ed8', cheek: '#f9a8d4', accent: '#38bdf8' },
  sky: { body: '#ddd6fe', stroke: '#1d4ed8', cheek: '#fda4af', accent: '#facc15' },
};

function getSpriteCandidates(speciesId, spec) {
  const exact = EXACT_SPRITE_MAP[speciesId];
  if (exact) {
    const lower = exact.replace(/\/(Forest|Land|Sky|Water)\//, (_, dir) => `/${dir.toLowerCase()}/`);
    return [exact, lower].map((p) => encodeURI(p.normalize('NFC')));
  }

  if (!spec || spec.stage !== 'ADULT') return [];

  const folderMap = {
    forest: 'Forest',
    land: 'Land',
    sky: 'Sky',
    water: 'Water',
  };
  const folder = folderMap[spec.biome];
  if (!folder) return [];

  const rawName = spec.name;
  const trimmedName = rawName.replace(/^포레스트/, '').replace(/\(숲\)$/, '').replace(/\(하늘\)$/, '');
  const list = [`/sprites/${folder}/${rawName}.png`];
  if (trimmedName && trimmedName !== rawName) {
    list.push(`/sprites/${folder}/${trimmedName}.png`);
  }
  return list.map((p) => encodeURI(p.normalize('NFC')));
}

function renderBbMarutchiVector(strokeMain, lcdMode) {
  const s = (c) => (lcdMode ? '#1e293b' : c);
  const st = lcdMode ? '#0f172a' : strokeMain;

  return (
    <g>
      <defs>
        <linearGradient id="bbSpriteGrad" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor={s('#dff6ff')} />
          <stop offset="55%" stopColor={s('#93e1ff')} />
          <stop offset="100%" stopColor={s('#c4b5fd')} />
        </linearGradient>
        <linearGradient id="bbLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={s('#a7f3d0')} />
          <stop offset="100%" stopColor={s('#34d399')} />
        </linearGradient>
      </defs>

      <path
        d="M40 20 L40 14"
        stroke={st}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 15 C34 9, 25 10, 27 16 C29 20, 36 19, 40 15 Z"
        fill="url(#bbLeafGrad)"
        stroke={st}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M40 15 C46 9, 55 10, 53 16 C51 20, 44 19, 40 15 Z"
        fill="url(#bbLeafGrad)"
        stroke={st}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <polygon
        points="49,9 50.2,11.8 53,13 50.2,14.2 49,17 47.8,14.2 45,13 47.8,11.8"
        fill={lcdMode ? '#0f172a' : '#ffffff'}
      />

      <path
        d="M40 20
           C22 20 14 32 14 46
           C14 55 19 60 26 61
           L26 65.5
           C26 68.5 33 68.5 33 65
           L33 62
           C38 62.8 42 62.8 47 62
           L47 65
           C47 68.5 54 68.5 54 65.5
           L54 61
           C61 60 66 55 66 46
           C66 32 58 20 40 20 Z"
        fill="url(#bbSpriteGrad)"
        stroke={st}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {!lcdMode && (
        <>
          <ellipse
            cx="26"
            cy="30"
            rx="5.5"
            ry="2.8"
            transform="rotate(-28 26 30)"
            fill="#ffffff"
            opacity="0.78"
          />
          <polygon
            points="55,29 56,31.2 58.2,32.2 56,33.2 55,35.4 54,33.2 51.8,32.2 54,31.2"
            fill="#ffffff"
            opacity="0.9"
          />
          <polygon
            points="23,51 23.8,52.8 25.6,53.6 23.8,54.4 23,56.2 22.2,54.4 20.4,53.6 22.2,52.8"
            fill="#ffffff"
            opacity="0.85"
          />
          <circle cx="48" cy="52" r="1.4" fill="#ffffff" opacity="0.8" />
          <ellipse cx="23.5" cy="44" rx="4.2" ry="2.4" fill="#fb7185" opacity="0.72" />
          <ellipse cx="56.5" cy="44" rx="4.2" ry="2.4" fill="#fb7185" opacity="0.72" />
        </>
      )}
    </g>
  );
}

function renderCharacterShape(speciesId, strokeMain, lcdMode) {
  const s = (c) => (lcdMode ? '#1e293b' : c);

  switch (speciesId) {
    case 'BABY_MARUTCHI':
      return (
        <ellipse
          cx="40"
          cy="41"
          rx="28"
          ry="25"
          transform="rotate(-8 40 41)"
          fill={s('#fef0a8')}
          stroke={lcdMode ? '#0f172a' : '#0b4f8a'}
          strokeWidth="4"
        />
      );
    case 'BB_MARUTCHI':
      return renderBbMarutchiVector(strokeMain, lcdMode);
    case 'KID_LAND':
      return (
        <path
          d="M20 42 C20 22 60 22 60 42 C60 56 52 60 46 58 L46 64 L40 64 L40 58 L34 58 L34 64 L28 64 L28 58 C22 60 20 56 20 42 Z"
          fill={s('#f9c5d5')}
          stroke={strokeMain}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'KID_WATER':
      return (
        <g>
          <path d="M54 44 L65 39 L63 48 Z" fill={s('#bae6fd')} stroke={strokeMain} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="38" cy="43" rx="22" ry="19" fill={s('#bae6fd')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'KID_SKY':
      return (
        <g>
          <ellipse cx="60" cy="35" rx="7" ry="4.5" transform="rotate(-20 60 35)" fill={s('#c7d2fe')} stroke={strokeMain} strokeWidth="2.8" />
          <ellipse cx="61" cy="43" rx="7" ry="4.5" transform="rotate(15 61 43)" fill={s('#c7d2fe')} stroke={strokeMain} strokeWidth="2.8" />
          <circle cx="39" cy="42" r="21" fill={s('#c7d2fe')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'KID_FOREST':
      return (
        <path
          d="M36 18 L40 13 L44 18 C56 21 62 32 62 44 C62 56 52 62 40 62 C28 62 18 56 18 44 C18 32 24 21 36 18 Z"
          fill={s('#99f6e4')}
          stroke={strokeMain}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      );
    case 'TEEN_LAND_ROAR':
    case 'TEEN_FOREST_ROAR':
      return (
        <g>
          <path d="M22 44 L14 49 L18 54 L25 50" fill={s('#f472b6')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M58 44 L66 49 L62 54 L55 50" fill={s('#f472b6')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M22 40 C22 20 58 20 58 40 C58 52 52 57 48 58 L48 65 L42 65 L42 58 L38 58 L38 65 L32 65 L32 58 C28 57 22 52 22 40 Z" fill={s('#f472b6')} stroke={strokeMain} strokeWidth="3.2" strokeLinejoin="round" />
        </g>
      );
    case 'TEEN_LAND_TODDLE':
    case 'TEEN_FOREST_TODDLE':
      return (
        <g>
          <path d="M27 56 L27 64 M37 57 L37 65 M47 56 L47 64" stroke={strokeMain} strokeWidth="3.2" strokeLinecap="round" />
          <ellipse cx="40" cy="42" rx="24" ry="17" transform="rotate(-8 40 42)" fill={s('#99f6e4')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_LAND_LICK':
      return (
        <g>
          <path d="M30 57 L30 65 M46 57 L46 65" stroke={strokeMain} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M22 42 C22 20 56 20 56 40 C56 48 65 48 64 55 C63 59 54 58 48 57 C36 59 22 55 22 42 Z" fill={s('#fdba74')} stroke={strokeMain} strokeWidth="3.2" strokeLinejoin="round" />
        </g>
      );
    case 'TEEN_LAND_SPROUT':
    case 'TEEN_FOREST_SPROUT':
      return (
        <g>
          <ellipse cx="34" cy="15" rx="6" ry="3.5" transform="rotate(-25 34 15)" fill={s('#fbcfe8')} stroke={strokeMain} strokeWidth="2.5" />
          <ellipse cx="46" cy="15" rx="6" ry="3.5" transform="rotate(25 46 15)" fill={s('#fbcfe8')} stroke={strokeMain} strokeWidth="2.5" />
          <path d="M40 19 C26 25 20 36 22 48 C24 56 32 59 40 59 C48 59 56 56 58 48 C60 36 54 25 40 19 Z" fill={s('#fbcfe8')} stroke={strokeMain} strokeWidth="3.2" strokeLinejoin="round" />
        </g>
      );
    case 'TEEN_WATER_GLIDE':
      return (
        <g>
          <path d="M54 34 C62 24 69 27 65 35 C70 37 67 44 57 41 Z" fill={s('#38bdf8')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="38" cy="41" rx="22" ry="17" fill={s('#38bdf8')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_WATER_LEAP':
      return (
        <g>
          <path d="M54 33 C56 21 67 22 65 33 C64 38 58 40 54 40 Z" fill={s('#fbcfe8')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M17 44 C17 30 34 27 46 34 C53 38 58 44 56 50 C52 55 38 56 24 54 C19 53 17 49 17 44 Z" fill={s('#fbcfe8')} stroke={strokeMain} strokeWidth="3.2" strokeLinejoin="round" />
        </g>
      );
    case 'TEEN_WATER_PADDLE':
      return (
        <g>
          <path d="M57 38 L66 33 L65 44 Z" fill={s('#60a5fa')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="39" cy="41" rx="22" ry="18" fill={s('#60a5fa')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_WATER_FLOAT':
      return (
        <g>
          <path d="M27 52 C24 60 28 65 32 62 M37 53 C36 62 40 66 43 62 M48 52 C51 60 48 65 45 62" fill="none" stroke={strokeMain} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 42 C20 22 60 22 60 42 C60 51 50 53 40 53 C30 53 20 51 20 42 Z" fill={s('#f87171')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_SKY_FLAP':
      return (
        <g>
          <path d="M23 39 L10 34 L13 42 L9 47 L22 46 Z" fill={s('#818cf8')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M57 38 L70 32 L67 41 L71 46 L58 46 Z" fill={s('#818cf8')} stroke={strokeMain} strokeWidth="2.8" strokeLinejoin="round" />
          <ellipse cx="40" cy="40" rx="20" ry="19" fill={s('#818cf8')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_SKY_CHIRP':
    case 'TEEN_FOREST_CHIRP':
      return (
        <g>
          <path d="M46 22 C50 14 57 16 52 24 Z" fill={s('#86efac')} stroke={strokeMain} strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M22 42 C22 24 44 20 52 30 C60 40 60 56 44 58 C28 60 22 52 22 42 Z" fill={s('#86efac')} stroke={strokeMain} strokeWidth="3.2" />
        </g>
      );
    case 'TEEN_SKY_BUMBLE':
      return (
        <path d="M18 43 C18 28 42 26 54 34 C64 40 64 51 48 52 C32 53 18 51 18 43 Z" fill={s('#facc15')} stroke={strokeMain} strokeWidth="3.2" />
      );
    case 'TEEN_SKY_ROCKY':
      return (
        <polygon points="27,22 53,22 64,40 53,58 27,58 16,40" fill={s('#cbd5e1')} stroke={strokeMain} strokeWidth="3.2" strokeLinejoin="round" />
      );
    default:
      return (
        <ellipse cx="40" cy="42" rx="22" ry="19" fill={s('#99f6e4')} stroke={strokeMain} strokeWidth="3.2" />
      );
  }
}

function renderFallbackSvg(speciesId, spec, palette, lcdMode, isSleeping, actionState) {
  const fillMain = lcdMode ? '#1e293b' : palette.body;
  const strokeMain = lcdMode ? '#0f172a' : palette.stroke;
  const accentFill = lcdMode ? '#334155' : palette.accent;

  return (
    <svg viewBox="0 0 80 80" width="72" height="72" style={{ overflow: 'visible' }} aria-label={spec.name}>
      <ellipse cx="40" cy="70" rx="18" ry="3.8" fill={lcdMode ? 'rgba(15,23,42,0.22)' : 'rgba(15,23,42,0.12)'} />
      {spec.stage === 'EGG' ? (
        <g>
          <path d="M40 12 C22 12 16 36 16 50 C16 62 26 68 40 68 C54 68 64 62 64 50 C64 36 58 12 40 12 Z" fill={fillMain} stroke={strokeMain} strokeWidth="3.2" />
          <circle cx="31" cy="28" r="3" fill={accentFill} opacity="0.8" />
        </g>
      ) : (
        <g>
          {renderCharacterShape(speciesId, strokeMain, lcdMode)}
          {isSleeping ? (
            <>
              <path d="M27 38 Q31 42 35 38" fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M45 38 Q49 42 53 38" fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />
            </>
          ) : actionState === 'HAPPY' ? (
            <>
              <path d="M27 39 Q31 34 35 39" fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M45 39 Q49 34 53 39" fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="31" cy="37.5" r="3" fill={strokeMain} />
              <circle cx="49" cy="37.5" r="3" fill={strokeMain} />
            </>
          )}
          {actionState === 'EAT' ? (
            <ellipse cx="40" cy="46" rx="4.5" ry="5" fill="#ef4444" stroke={strokeMain} strokeWidth="2.2" />
          ) : (
            <path d="M35.5 44 Q40 48.5 44.5 44" fill="none" stroke={strokeMain} strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>
      )}
    </svg>
  );
}

export default function PetSprite({
  speciesId = 'EGG',
  direction = 1,
  frame = 0,
  posX = 0,
  actionState = 'IDLE',
  isSleeping = false,
  isDirty = false,
  lcdMode = false,
}) {
  const spec = SPECIES[speciesId] || SPECIES.EGG;
  const palette = BIOME_PALETTE[spec.biome] || BIOME_PALETTE.land;

  const isEgg = spec.stage === 'EGG';
  const isWalking = !isEgg && !isSleeping;
  const stepPhase = frame % 4;

  let bounceY = 0;
  let walkTilt = 0;
  let squashX = 1;
  let squashY = 1;

  if (isEgg) {
    bounceY = stepPhase === 2 ? -2 : 0;
    walkTilt = (stepPhase === 1 ? -6 : stepPhase === 3 ? 6 : 0) * direction;
  } else if (isSleeping) {
    bounceY = stepPhase % 2 === 0 ? 0 : -1.2;
    squashY = stepPhase % 2 === 0 ? 0.97 : 1.02;
  } else if (actionState === 'HAPPY') {
    bounceY = stepPhase % 2 === 1 ? -11 : 0;
    squashX = stepPhase % 2 === 1 ? 0.94 : 1.06;
    squashY = stepPhase % 2 === 1 ? 1.07 : 0.93;
  } else if (isWalking) {
    if (stepPhase === 0) {
      bounceY = 0;
      walkTilt = -4 * direction;
      squashX = 1.04;
      squashY = 0.95;
    } else if (stepPhase === 1) {
      bounceY = -4.5;
      walkTilt = 2 * direction;
      squashX = 0.98;
      squashY = 1.02;
    } else if (stepPhase === 2) {
      bounceY = -8;
      walkTilt = 6 * direction;
      squashX = 0.95;
      squashY = 1.05;
    } else {
      bounceY = -3;
      walkTilt = -2 * direction;
      squashX = 1;
      squashY = 1;
    }
  }

  const shadowScale = Math.max(0.62, 1 - Math.abs(bounceY) * 0.035);

  const candidates = useMemo(
    () => getSpriteCandidates(speciesId, spec),
    [speciesId, spec]
  );
  const [candidateIdx, setCandidateIdx] = useState(0);

  useEffect(() => {
    setCandidateIdx(0);
  }, [speciesId, candidates]);

  const currentSrc = candidateIdx < candidates.length ? candidates[candidateIdx] : null;

  return (
    <div
      style={{
        width: '72px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${posX}px)`,
        transition: 'transform 0.25s linear',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          width: '34px',
          height: '6px',
          borderRadius: '50%',
          background: lcdMode ? 'rgba(15, 23, 42, 0.25)' : 'rgba(15, 23, 42, 0.16)',
          transform: `scaleX(${shadowScale})`,
          transition: 'transform 0.2s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${bounceY}px) scaleX(${-direction * squashX}) scaleY(${squashY}) rotate(${walkTilt}deg)`,
          transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {currentSrc ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={spec.name}
            onError={() => setCandidateIdx((prev) => prev + 1)}
            style={{
              width: '62px',
              height: '62px',
              objectFit: 'contain',
              filter: lcdMode ? 'grayscale(100%) contrast(1.25)' : 'none',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        ) : (
          renderFallbackSvg(speciesId, spec, palette, lcdMode, isSleeping, actionState)
        )}
      </div>

      {isDirty && (
        <span
          style={{
            position: 'absolute',
            top: '0px',
            right: '2px',
            fontSize: '11px',
            fontWeight: '900',
            color: lcdMode ? '#0f172a' : '#dc2626',
          }}
        >
          !
        </span>
      )}
    </div>
  );
}
