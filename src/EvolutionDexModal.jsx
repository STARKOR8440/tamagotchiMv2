import React, { useState, useEffect, useMemo } from 'react';
import PetSprite from './PetSprite';
import { SPECIES, hasVisitedAllFourDexBiomes } from './evolutionTree';
import { sfx } from './sound';

const TEST_REVEAL_ALL = true;

const LANE_COLORS = [
  { line: '#f472b6', text: '#be185d' },
  { line: '#10b981', text: '#047857' },
  { line: '#3b82f6', text: '#1d4ed8' },
  { line: '#f97316', text: '#c2410c' },
];

const BIOME_TREE_CONFIG = {
  land: {
    key: 'land',
    label: '땅 필드',
    icon: '⛰️',
    accent: '#b45309',
    softBg: '#fef9c3',
    border: '#facc15',
    kidId: 'KID_LAND',
    secretId: 'SECRET_LAND_SPECIAL',
    branches: [
      {
        teenId: 'TEEN_LAND_ROAR',
        dietBadge: '고기+지렁이',
        adults: ['ADULT_LAND_MEOWTCHI', 'ADULT_LAND_POCHITCHI', 'ADULT_LAND_GUMAX', 'ADULT_LAND_RATCHI'],
      },
      {
        teenId: 'TEEN_LAND_TODDLE',
        dietBadge: '지렁이+당근',
        adults: ['ADULT_LAND_MAMETCHI', 'ADULT_LAND_MIMITCHI', 'ADULT_LAND_MOLMOTCHI', 'ADULT_LAND_SHEEPTCHI'],
      },
      {
        teenId: 'TEEN_LAND_LICK',
        dietBadge: '고기+당근',
        adults: ['ADULT_LAND_LEOPATCHI', 'ADULT_LAND_SEBIRETCHI', 'ADULT_LAND_ELIZARDOTCHI', 'ADULT_LAND_HEAVYTTCHI'],
      },
      {
        teenId: 'TEEN_LAND_SPROUT',
        dietBadge: '불규칙(방치/3종)',
        adults: ['ADULT_LAND_VIOLETCHI', 'ADULT_LAND_POTSUNENTCHI', 'ADULT_LAND_TUSTUSTCHI', 'ADULT_LAND_SHIGEMI_SAN'],
      },
    ],
  },
  forest: {
    key: 'forest',
    label: '숲 필드',
    icon: '🌲',
    accent: '#15803d',
    softBg: '#dcfce7',
    border: '#4ade80',
    kidId: 'KID_FOREST',
    secretId: 'SECRET_FOREST_SPECIAL',
    branches: [
      {
        teenId: 'TEEN_FOREST_ROAR',
        dietBadge: '대나무+석류',
        adults: ['ADULT_FOREST_HORHOTCHI', 'ADULT_FOREST_KONKOTCHI', 'ADULT_FOREST_TIGAOTCHI', 'ADULT_FOREST_TANOONTCHI'],
      },
      {
        teenId: 'TEEN_FOREST_TODDLE',
        dietBadge: '석류+옥수수',
        adults: ['ADULT_FOREST_LESSAPANTCHI', 'ADULT_FOREST_KANEKOTCHI', 'ADULT_FOREST_SUIGYUTCHI', 'ADULT_FOREST_PANBOOTCHI'],
      },
      {
        teenId: 'TEEN_FOREST_CHIRP',
        dietBadge: '대나무+옥수수',
        adults: ['ADULT_FOREST_KACHITCHI', 'ADULT_FOREST_TOKIPATCHI', 'ADULT_FOREST_KUCHIPATCHI', 'ADULT_FOREST_SPARROTCHI'],
      },
      {
        teenId: 'TEEN_FOREST_SPROUT',
        dietBadge: '불규칙(방치/3종)',
        adults: ['ADULT_FOREST_SHITAKECHI', 'ADULT_FOREST_PEATCHI', 'ADULT_FOREST_NAPPATCHI', 'ADULT_FOREST_RUSHRADITCHI'],
      },
    ],
  },
  water: {
    key: 'water',
    label: '바다 필드',
    icon: '🌊',
    accent: '#0284c7',
    softBg: '#e0f2fe',
    border: '#38bdf8',
    kidId: 'KID_WATER',
    secretId: 'SECRET_WATER_SPECIAL',
    branches: [
      {
        teenId: 'TEEN_WATER_GLIDE',
        dietBadge: '해산물+미역',
        adults: ['ADULT_WATER_IRUKATCHI', 'ADULT_WATER_KAMETCHI', 'ADULT_WATER_KUJIRATCHI', 'ADULT_WATER_URUOTCHI'],
      },
      {
        teenId: 'TEEN_WATER_LEAP',
        dietBadge: '미역+새우',
        adults: ['ADULT_WATER_AXOLOPATCHI', 'ADULT_WATER_IMORITCHI', 'ADULT_WATER_KAWAZUTCHI', 'ADULT_WATER_BEAVERTCHI'],
      },
      {
        teenId: 'TEEN_WATER_PADDLE',
        dietBadge: '해산물+새우',
        adults: ['ADULT_WATER_TACHUTCHI', 'ADULT_WATER_SHARKTCHI', 'ADULT_WATER_ANKOTCHI', 'ADULT_WATER_OTOTOTCHI'],
      },
      {
        teenId: 'TEEN_WATER_FLOAT',
        dietBadge: '불규칙(방치/3종)',
        adults: ['ADULT_WATER_KURARATCHI', 'ADULT_WATER_MENDAKOTCHI', 'ADULT_WATER_AMEFURATCHI', 'ADULT_WATER_GUSOKUTCHI'],
      },
    ],
  },
  sky: {
    key: 'sky',
    label: '하늘 필드',
    icon: '☁️',
    accent: '#4338ca',
    softBg: '#ede9fe',
    border: '#a78bfa',
    kidId: 'KID_SKY',
    secretId: 'SECRET_SKY_SPECIAL',
    branches: [
      {
        teenId: 'TEEN_SKY_FLAP',
        dietBadge: '닭고기+시럽',
        adults: ['ADULT_SKY_HORHOTCHI', 'ADULT_SKY_MONGATCHI', 'ADULT_SKY_EAGLETCHI', 'ADULT_SKY_BATCHI'],
      },
      {
        teenId: 'TEEN_SKY_CHIRP',
        dietBadge: '시럽+솜사탕',
        adults: ['ADULT_SKY_PEACOTCHI', 'ADULT_SKY_BATATCHI', 'ADULT_SKY_KUCHIPATCHI', 'ADULT_SKY_KIWITCHI'],
      },
      {
        teenId: 'TEEN_SKY_BUMBLE',
        dietBadge: '닭고기+솜사탕',
        adults: ['ADULT_SKY_PAPILLOTCHI', 'ADULT_SKY_KABUTOTCHI', 'ADULT_SKY_TENLOTCHI', 'ADULT_SKY_HATCHITCHI'],
      },
      {
        teenId: 'TEEN_SKY_ROCKY',
        dietBadge: '불규칙(방치/3종)',
        adults: ['ADULT_SKY_GEMTCHI', 'ADULT_SKY_OROTATCHI', 'ADULT_SKY_ISHIKOROTCHI', 'ADULT_SKY_MAGMATCHI'],
      },
    ],
  },
};

const BIOME_ORDER = ['land', 'forest', 'water', 'sky'];

export default function EvolutionDexModal({
  unlockedSpecies = ['EGG'],
  secretHistory = [],
  dexVisitedBiomes = [],
  currentSpeciesId = 'EGG',
  careStats = { land: 1, forest: 1, water: 1, sky: 1 },
  onSelectBiomeTab,
  onClose,
}) {
  const safeCare = {
    land: careStats?.land ?? 1,
    forest: careStats?.forest ?? 1,
    water: careStats?.water ?? 1,
    sky: careStats?.sky ?? 1,
  };

  const validCurrentId = SPECIES[currentSpeciesId] ? currentSpeciesId : 'EGG';
  const currentSpec = SPECIES[validCurrentId] || SPECIES.EGG;

  const initialBiome =
    currentSpec.biome &&
    BIOME_TREE_CONFIG[currentSpec.biome] &&
    currentSpec.stage !== 'EGG' &&
    currentSpec.stage !== 'BABY'
      ? currentSpec.biome
      : 'land';

  const [biomeFilter, setBiomeFilter] = useState(initialBiome);
  const [selectedId, setSelectedId] = useState(validCurrentId);

  useEffect(() => {
    setSelectedId(validCurrentId);
  }, [validCurrentId]);

  useEffect(() => {
    if (BIOME_ORDER.includes(initialBiome)) {
      onSelectBiomeTab?.(initialBiome);
    }
  }, [initialBiome, onSelectBiomeTab]);

  const unlockedSet = useMemo(() => {
    const ids = Array.isArray(unlockedSpecies) ? unlockedSpecies : ['EGG'];
    const secrets = Array.isArray(secretHistory)
      ? secretHistory.map((item) => (typeof item === 'string' ? item : item?.id)).filter(Boolean)
      : [];
    return new Set(['EGG', validCurrentId, ...ids, ...secrets]);
  }, [unlockedSpecies, secretHistory, validCurrentId]);

  const validSpeciesList = useMemo(() => Object.values(SPECIES), []);

  const totalCount = validSpeciesList.length;
  const unlockedCount = TEST_REVEAL_ALL
    ? totalCount
    : validSpeciesList.filter((sp) => unlockedSet.has(sp.id)).length;

  const selectedSpec = SPECIES[selectedId] || SPECIES.EGG;
  const maxCare = Math.max(10, safeCare.land, safeCare.forest, safeCare.water, safeCare.sky);
  const allFourVisited = hasVisitedAllFourDexBiomes(dexVisitedBiomes);

  const visibleBiomes =
    biomeFilter === 'ALL'
      ? BIOME_ORDER.map((k) => BIOME_TREE_CONFIG[k])
      : [BIOME_TREE_CONFIG[biomeFilter] || BIOME_TREE_CONFIG.land];

  const renderNodeCard = (speciesId, opts = {}) => {
    const {
      compact = false,
      subLabel = '',
      isSecret = false,
      accentColor = '#0284c7',
      borderColor = null,
    } = opts;
    const sp = SPECIES[speciesId];
    if (!sp) return null;

    const isCurrent = sp.id === validCurrentId;
    const isSelected = sp.id === selectedId;
    const isUnlocked = TEST_REVEAL_ALL || unlockedSet.has(sp.id);

    return (
      <button
        key={sp.id}
        type="button"
        onClick={() => {
          sfx.beep();
          setSelectedId(sp.id);
        }}
        style={{
          width: '100%',
          background: isCurrent
            ? '#dcfce7'
            : isSelected
            ? '#e0f2fe'
            : isSecret
            ? '#fdf4ff'
            : isUnlocked
            ? '#ffffff'
            : '#f8fafc',
          border: `2px solid ${
            isCurrent
              ? '#16a34a'
              : isSelected
              ? '#0284c7'
              : isSecret
              ? '#e879f9'
              : borderColor || '#e2e8f0'
          }`,
          borderRadius: '13px',
          padding: '5px 3px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1px',
          cursor: 'pointer',
          position: 'relative',
          minHeight: compact ? '66px' : '74px',
          boxSizing: 'border-box',
          opacity: isUnlocked ? 1 : 0.72,
        }}
      >
        {isCurrent && (
          <span
            style={{
              position: 'absolute',
              top: '-7px',
              right: '-2px',
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '9px',
              fontWeight: '900',
              padding: '1px 6px',
              borderRadius: '999px',
            }}
          >
            ★ NOW
          </span>
        )}
        <div
          style={{
            transform: compact ? 'scale(0.52)' : 'scale(0.6)',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.65)',
          }}
        >
          <PetSprite speciesId={sp.id} frame={0} lcdMode={false} />
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '900',
            color: isCurrent ? '#14532d' : '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {isUnlocked ? sp.name : '???'}
        </span>
        {subLabel && (
          <span
            style={{
              fontSize: '8.5px',
              fontWeight: '800',
              color: isCurrent ? '#15803d' : accentColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {subLabel}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '580px',
        maxHeight: '92dvh',
        background: '#ffffff',
        borderRadius: '26px',
        border: '3.5px solid #38bdf8',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.45)',
        padding: '15px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        color: '#0f172a',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '17px', fontWeight: '900', color: '#0369a1' }}>
            📖 파라다이스 진화도감
          </span>
          <span
            style={{
              background: '#e0f2fe',
              color: '#0284c7',
              fontSize: '12px',
              fontWeight: '800',
              padding: '3px 9px',
              borderRadius: '12px',
            }}
          >
            {unlockedCount} / {totalCount}
          </span>
          {TEST_REVEAL_ALL && (
            <span
              style={{
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #f59e0b',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 7px',
                borderRadius: '10px',
              }}
            >
              TEST 전체공개
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '7px 13px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          ✕ 닫기
        </button>
      </div>

      <div
        style={{
          background: '#ecfdf5',
          border: '2px solid #22c55e',
          borderRadius: '14px',
          padding: '7px 11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '900',
              padding: '2px 6px',
              borderRadius: '6px',
            }}
          >
            ★ NOW
          </span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#14532d' }}>
            {currentSpec.name}
          </span>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534' }}>
            ({currentSpec.stageLabel || currentSpec.stage})
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '800',
            color: allFourVisited ? '#15803d' : '#0369a1',
          }}
        >
          4필드 탭 {Array.isArray(dexVisitedBiomes) ? dexVisitedBiomes.length : 0}/4
        </span>
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '14px',
          padding: '7px 11px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '7px',
        }}
      >
        {BIOME_ORDER.map((key) => {
          const meta = BIOME_TREE_CONFIG[key];
          const val = safeCare[key] || 0;
          const pct = Math.min(100, Math.round((val / maxCare) * 100));
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                <span>
                  {meta.icon} {meta.label.replace(' 필드', '')}
                </span>
                <span style={{ color: meta.accent }}>{val}</span>
              </div>
              <div
                style={{
                  height: '5px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: `${pct}%`, height: '100%', background: meta.accent }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {BIOME_ORDER.map((key) => {
          const meta = BIOME_TREE_CONFIG[key];
          const active = biomeFilter === key;
          const visited = Array.isArray(dexVisitedBiomes) && dexVisitedBiomes.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                sfx.beep();
                setBiomeFilter(key);
                onSelectBiomeTab?.(key);
              }}
              style={{
                flex: 1,
                minWidth: '64px',
                padding: '6px 4px',
                borderRadius: '11px',
                border: active ? `2px solid ${meta.accent}` : '1px solid #cbd5e1',
                background: active ? meta.softBg : '#f8fafc',
                color: active ? meta.accent : '#475569',
                fontSize: '11.5px',
                fontWeight: '900',
                cursor: 'pointer',
              }}
            >
              {meta.icon} {meta.label.replace(' 필드', '')}
              {visited ? ' ✓' : ''}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            sfx.beep();
            setBiomeFilter('ALL');
          }}
          style={{
            flex: 1,
            minWidth: '58px',
            padding: '6px 4px',
            borderRadius: '11px',
            border: biomeFilter === 'ALL' ? '2px solid #0284c7' : '1px solid #cbd5e1',
            background: biomeFilter === 'ALL' ? '#e0f2fe' : '#f8fafc',
            color: biomeFilter === 'ALL' ? '#0369a1' : '#475569',
            fontSize: '11.5px',
            fontWeight: '900',
            cursor: 'pointer',
          }}
        >
          🌐 전체
        </button>
      </div>

      <div
        style={{
          background: '#f0f9ff',
          border: '2px solid #7dd3fc',
          borderRadius: '15px',
          padding: '8px 11px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '68px',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '13px',
            background: '#ffffff',
            border: '1.5px solid #bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ transform: 'scale(0.72)' }}>
            <PetSprite speciesId={selectedSpec.id} frame={0} lcdMode={false} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14.5px', fontWeight: '900' }}>{selectedSpec.name}</span>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: '800',
                padding: '2px 7px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#0369a1',
              }}
            >
              {selectedSpec.stageLabel || selectedSpec.stage}
            </span>
            {selectedSpec.dietComboLabel && (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '8px',
                  background: '#dcfce7',
                  color: '#15803d',
                }}
              >
                🍽️ {selectedSpec.dietComboLabel}
              </span>
            )}
          </div>
          <div style={{ fontSize: '11.5px', color: '#334155', marginTop: '2px' }}>
            {selectedSpec.desc || '도감 캐릭터입니다.'}
          </div>
          {selectedSpec.hint && (
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: '#0369a1',
                marginTop: '2px',
              }}
            >
              💡 {selectedSpec.hint}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '2px',
          paddingTop: '4px',
        }}
      >
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '9px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '11.5px', fontWeight: '900', color: '#475569' }}>
            🥚 알 → 베이비 분기
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {renderNodeCard('EGG', { compact: true, subLabel: '시작 알' })}
            {renderNodeCard('BABY_MARUTCHI', { compact: true, subLabel: '기본 베이비' })}
            {renderNodeCard('BB_MARUTCHI', { compact: true, subLabel: '특수 베이비' })}
          </div>
        </div>

        {visibleBiomes.map((biomeCfg) => (
          <div
            key={biomeCfg.key}
            style={{
              background: '#ffffff',
              border: `2px solid ${biomeCfg.border}`,
              borderRadius: '18px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: biomeCfg.softBg,
                borderRadius: '11px',
                padding: '5px 10px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '900', color: biomeCfg.accent }}>
                {biomeCfg.icon} {biomeCfg.label} 진화트리
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#475569' }}>
                키드 → 영(4) → 성체(16) → 시크릿
              </span>
            </div>

            <div style={{ width: '142px' }}>
              {renderNodeCard(biomeCfg.kidId, {
                compact: true,
                subLabel: '키드',
                accentColor: biomeCfg.accent,
                borderColor: biomeCfg.border,
              })}
            </div>

            <div style={{ width: '3px', height: '9px', background: biomeCfg.accent }} />
            <div style={{ width: '75%', height: '3px', background: biomeCfg.accent }} />

            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '7px',
                alignItems: 'start',
              }}
            >
              {biomeCfg.branches.map((branch, laneIdx) => {
                const lane = LANE_COLORS[laneIdx % LANE_COLORS.length];
                return (
                  <div
                    key={branch.teenId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <div style={{ width: '3px', height: '9px', background: lane.line }} />
                    {renderNodeCard(branch.teenId, {
                      compact: true,
                      subLabel: branch.dietBadge,
                      accentColor: lane.text,
                      borderColor: lane.line,
                    })}
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '50%',
                          width: '3px',
                          transform: 'translateX(-50%)',
                          background: lane.line,
                          zIndex: 0,
                        }}
                      />
                      <div style={{ height: '8px', zIndex: 1 }} />
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {branch.adults.map((adultId) =>
                          renderNodeCard(adultId, {
                            compact: true,
                            accentColor: lane.text,
                            borderColor: lane.line,
                          })
                        )}
                      </div>
                      <div style={{ height: '9px', zIndex: 1 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ width: '75%', height: '3px', background: '#d946ef' }} />
            <div style={{ width: '3px', height: '9px', background: '#d946ef' }} />

            <div style={{ width: '164px' }}>
              {renderNodeCard(biomeCfg.secretId, {
                compact: true,
                subLabel: '계통 시크릿',
                isSecret: true,
                accentColor: '#a21caf',
                borderColor: '#d946ef',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
