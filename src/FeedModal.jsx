// src/FeedModal.jsx — 땅·숲·바다·하늘 4개 필드 아이콘 탭 전용 식사/식단 모달
import React, { useState, useMemo } from 'react';
import { sfx } from './sound';

export const FIELD_TABS = [
  {
    key: 'land',
    icon: '⛰️',
    label: '땅',
    accent: '#b45309',
    softBg: '#fef9c3',
    border: '#facc15',
  },
  {
    key: 'forest',
    icon: '🌲',
    label: '숲',
    accent: '#15803d',
    softBg: '#dcfce7',
    border: '#4ade80',
  },
  {
    key: 'water',
    icon: '🌊',
    label: '바다',
    accent: '#0284c7',
    softBg: '#e0f2fe',
    border: '#38bdf8',
  },
  {
    key: 'sky',
    icon: '☁️',
    label: '하늘',
    accent: '#4338ca',
    softBg: '#ede9fe',
    border: '#a78bfa',
  },
];

export const DEFAULT_FIELD_FOODS = [
  // 땅(land) 필드 식단 (고기 / 당근 / 지렁이)
  { id: 'land_meat', biome: 'land', diet: 'MEAT', name: '두툼한 고기', icon: '🥩', hunger: 25, happy: 10 },
  { id: 'land_carrot', biome: 'land', diet: 'CARROT', name: '아삭한 당근', icon: '🥕', hunger: 20, happy: 12 },
  { id: 'land_worm', biome: 'land', diet: 'WORM', name: '싱싱한 지렁이', icon: '🪱', hunger: 18, happy: 14 },
  { id: 'land_bento', biome: 'land', diet: 'MEAT', name: '들판 도시락', icon: '🍱', hunger: 30, happy: 15 },

  // 숲(forest) 필드 식단 (고기 / 대나무 / 석류)
  { id: 'forest_meat', biome: 'forest', diet: 'MEAT', name: '숲속 꼬치구이', icon: '🍖', hunger: 24, happy: 12 },
  { id: 'forest_bamboo', biome: 'forest', diet: 'BAMBOO', name: '연한 대나무순', icon: '🎋', hunger: 22, happy: 14 },
  { id: 'forest_pomegranate', biome: 'forest', diet: 'POMEGRANATE', name: '달콤한 석류', icon: '🍎', hunger: 20, happy: 16 },
  { id: 'forest_berry', biome: 'forest', diet: 'BAMBOO', name: '이슬 맺힌 열매', icon: '🫐', hunger: 18, happy: 15 },

  // 바다(water) 필드 식단 (해산물 / 미역 / 새우)
  { id: 'water_seafood', biome: 'water', diet: 'SEAFOOD', name: '신선한 생선구이', icon: '🐟', hunger: 25, happy: 12 },
  { id: 'water_seaweed', biome: 'water', diet: 'SEAWEED', name: '바다 미역국', icon: '🌿', hunger: 20, happy: 14 },
  { id: 'water_shrimp', biome: 'water', diet: 'SHRIMP', name: '통통한 새우튀김', icon: '🦐', hunger: 24, happy: 15 },
  { id: 'water_shell', biome: 'water', diet: 'SEAFOOD', name: '조개 스튜', icon: '🦪', hunger: 22, happy: 13 },

  // 하늘(sky) 필드 식단 (닭고기 / 옥수수 / 시럽)
  { id: 'sky_chicken', biome: 'sky', diet: 'CHICKEN', name: '구름 닭다리구이', icon: '🍗', hunger: 25, happy: 14 },
  { id: 'sky_corn', biome: 'sky', diet: 'CORN', name: '노란 옥수수', icon: '🌽', hunger: 20, happy: 12 },
  { id: 'sky_syrup', biome: 'sky', diet: 'SYRUP', name: '무지개 시럽팬케이크', icon: '🍯', hunger: 22, happy: 18 },
  { id: 'sky_puff', biome: 'sky', diet: 'SYRUP', name: '솜사탕 슈', icon: '🧁', hunger: 18, happy: 16 },
];

export default function FeedModal({
  foods = DEFAULT_FIELD_FOODS,
  initialBiome = 'land',
  onFeed,
  onSelectFood,
  onClose,
}) {
  const validInitial = FIELD_TABS.some((t) => t.key === initialBiome) ? initialBiome : 'land';
  const [selectedBiome, setSelectedBiome] = useState(validInitial);

  const activeTab = useMemo(
    () => FIELD_TABS.find((t) => t.key === selectedBiome) || FIELD_TABS[0],
    [selectedBiome]
  );

  const items = useMemo(() => {
    const source = Array.isArray(foods) && foods.length > 0 ? foods : DEFAULT_FIELD_FOODS;
    const matched = source.filter((item) => (item.biome || item.field || 'land') === selectedBiome);
    return matched.length > 0 ? matched : DEFAULT_FIELD_FOODS.filter((i) => i.biome === selectedBiome);
  }, [foods, selectedBiome]);

  const handlePick = (food) => {
    sfx.beep();
    if (typeof onFeed === 'function') {
      onFeed(food, selectedBiome);
    } else if (typeof onSelectFood === 'function') {
      onSelectFood(food, selectedBiome);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff',
        borderRadius: '26px',
        border: `3.5px solid ${activeTab.border}`,
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.42)',
        padding: '15px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '11px',
        color: '#0f172a',
        userSelect: 'none',
      }}
    >
      {/* 상단 4개 필드 대표 아이콘 탭 (땅 / 숲 / 바다 / 하늘) */}
      <div
        role="tablist"
        aria-label="필드 식사 탭"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {FIELD_TABS.map((tab) => {
          const isActive = tab.key === selectedBiome;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              title={tab.label}
              onClick={() => {
                sfx.beep();
                setSelectedBiome(tab.key);
              }}
              style={{
                height: '48px',
                borderRadius: '15px',
                border: isActive ? `2.5px solid ${tab.accent}` : '1.5px solid #cbd5e1',
                background: isActive ? tab.softBg : '#f8fafc',
                boxShadow: isActive ? `0 4px 12px ${tab.border}77` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '23px',
                lineHeight: 1,
                cursor: 'pointer',
                transform: isActive ? 'translateY(-1px)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span aria-hidden="true">{tab.icon}</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 필드의 먹이/식단 목록 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          maxHeight: '320px',
          overflowY: 'auto',
          paddingRight: '2px',
        }}
      >
        {items.map((food) => (
          <button
            key={food.id || `${food.biome}_${food.name}`}
            type="button"
            onClick={() => handlePick(food)}
            style={{
              background: '#f8fafc',
              border: `1.5px solid ${activeTab.border}`,
              borderRadius: '15px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>
              {food.icon || '🍽️'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '900',
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {food.name}
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: activeTab.accent }}>
                포만 +{food.hunger ?? 20} · 행복 +{food.happy ?? 10}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 하단 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        style={{
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          borderRadius: '13px',
          padding: '8px 14px',
          fontSize: '12.5px',
          fontWeight: '800',
          cursor: 'pointer',
        }}
      >
        ✕ 닫기
      </button>
    </div>
  );
}