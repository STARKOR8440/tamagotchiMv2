import React, { useState, useEffect, useRef, useCallback } from 'react';
import PetSprite from './PetSprite';
import MiniGame from './MiniGame';
import TamagotchiShell, { SHELL_SKINS } from './TamagotchiShell';
import EvolutionDexModal from './EvolutionDexModal';
import GuideModal from './GuideModal';
import ShareCardModal from './ShareCardModal';
import PlazaModal from './PlazaModal';
import { FIREBASE_DB_URL, isFirebaseConfigured } from './firebaseConfig';
import {
  SPECIES,
  SHELL_ITEMS,
  checkEvolutionStatus,
  evolveCrossRandom,
  reincarnateAdult,
  getRemainingEvoSeconds,
} from './evolutionTree';

import { sfx } from './sound';

const STORAGE_KEY = 'mobile_tamagotchi_pwa_v2';
const LEGACY_STORAGE_KEYS = ['mobile_tamagotchi_pwa_v1'];
const IR_BATTLE_STORAGE_KEY = 'tamagotchi_ir_battle_v1';

const MENU_IDS = ['FEED', 'PLAY', 'CLEAN', 'SHOP', 'STATUS', 'DEX'];
const DEV_PASSCODE = '8440';

const BIOME_LABEL_MAP = {
  land: '땅',
  forest: '숲',
  water: '바다',
  sky: '하늘',
};

const createEmptyDietCounts = () => ({
  MEAT: 0,
  WORM: 0,
  CARROT: 0,
  BAMBOO: 0,
  POMEGRANATE: 0,
  CORN: 0,
  SEAFOOD: 0,
  SEAWEED: 0,
  SHRIMP: 0,
  CHICKEN: 0,
  SYRUP: 0,
  COTTON_CANDY: 0,
});

const normalizeDietCounts = (raw = {}) => {
  const base = createEmptyDietCounts();
  Object.keys(base).forEach((key) => {
    base[key] = Number(raw?.[key]) || 0;
  });
  return base;
};

const createEmptyShells = () => ({
  forest: 0,
  land: 0,
  water: 0,
  sky: 0,
});

const normalizeShells = (raw = {}) => ({
  forest: Math.max(0, Number(raw?.forest) || 0),
  land: Math.max(0, Number(raw?.land) || 0),
  water: Math.max(0, Number(raw?.water) || 0),
  sky: Math.max(0, Number(raw?.sky) || 0),
});

const normalizeDexVisitedBiomes = (raw) => {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(raw.filter((b) => ['land', 'forest', 'water', 'sky'].includes(b)))
  );
};

const UNIFORM_FOOD_SPEC = {
  category: 'SNACK',
  price: 0,
  hunger: 15,
  happiness: 0,
  energy: 0,
  clean: 0,
  stat: 2,
  evoReduceSec: 60,
};

const FOOD_MENU = [
  // 0페이지: ⛰️ 땅 탭 (고기 · 지렁이 · 당근)
  { id: 'MEAT_STEAK', name: '🥩 고기', biome: 'land', diet: 'MEAT', ...UNIFORM_FOOD_SPEC },
  { id: 'WORM_SNACK', name: '🪱 지렁이', biome: 'land', diet: 'WORM', ...UNIFORM_FOOD_SPEC },
  { id: 'CARROT_BOWL', name: '🥕 당근', biome: 'land', diet: 'CARROT', ...UNIFORM_FOOD_SPEC },

  // 1페이지: 🌲 숲 탭 (대나무 · 석류 · 옥수수)
  { id: 'BAMBOO_SNACK', name: '🎋 대나무', biome: 'forest', diet: 'BAMBOO', ...UNIFORM_FOOD_SPEC },
  { id: 'POMEGRANATE_SNACK', name: '🍎 석류', biome: 'forest', diet: 'POMEGRANATE', ...UNIFORM_FOOD_SPEC },
  { id: 'CORN_SNACK', name: '🌽 옥수수', biome: 'forest', diet: 'CORN', ...UNIFORM_FOOD_SPEC },

  // 2페이지: 🌊 바다 탭 (해산물 · 미역 · 새우)
  { id: 'SEAFOOD_PLATE', name: '🐟 해산물', biome: 'water', diet: 'SEAFOOD', ...UNIFORM_FOOD_SPEC },
  { id: 'SEAWEED_SNACK', name: '🌿 미역', biome: 'water', diet: 'SEAWEED', ...UNIFORM_FOOD_SPEC },
  { id: 'SHRIMP_SNACK', name: '🦐 새우', biome: 'water', diet: 'SHRIMP', ...UNIFORM_FOOD_SPEC },

  // 3페이지: ☁️ 하늘 탭 (닭고기 · 시럽 · 솜사탕)
  { id: 'CHICKEN_SNACK', name: '🍗 닭고기', biome: 'sky', diet: 'CHICKEN', ...UNIFORM_FOOD_SPEC },
  { id: 'SYRUP_SNACK', name: '🍯 시럽', biome: 'sky', diet: 'SYRUP', ...UNIFORM_FOOD_SPEC },
  { id: 'COTTON_CANDY_SNACK', name: '🍭 솜사탕', biome: 'sky', diet: 'COTTON_CANDY', ...UNIFORM_FOOD_SPEC },
];

const normalizeCareStats = (raw = {}) => ({
  land: Math.max(1, Number(raw?.land) || 1),
  forest: Math.max(1, Number(raw?.forest) || 1),
  water: Math.max(1, Number(raw?.water) || 1),
  sky: Math.max(1, Number(raw?.sky) || 1),
});

const getStandardDateStr = (ts = Date.now()) => {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const hasPassedStandard24h = (adultEnteredAt, adultSeconds = 0, now = Date.now()) => {
  if (!adultEnteredAt) return (adultSeconds || 0) >= 86400;
  const enteredDay = getStandardDateStr(adultEnteredAt);
  const currentDay = getStandardDateStr(now);
  const elapsedMs = Math.max(0, now - adultEnteredAt);
  return currentDay !== enteredDay && elapsedMs >= 12 * 60 * 60 * 1000
    ? true
    : elapsedMs >= 86400 * 1000;
};

const createUserId = () => 'u_' + Math.random().toString(36).slice(2, 10);

const INITIAL_STATE = {
  userId: createUserId(),
  nickname: '다마친구',
  plazaAvatarId: 'BABY_MARUTCHI',
  hunger: 75,
  happiness: 75,
  cleanliness: 90,
  energy: 100,
  poopCount: 0,
  ageSeconds: 0,
  stageAgeSeconds: 0,
  evoTimeReduction: 0,
  eggTouches: 0,
  dexVisitedBiomes: [],
  shells: createEmptyShells(),
  adultSeconds: 0,
  adultEnteredAt: null,
  gameWins: 0,
  winStreak: 0,
  coins: 50,
  digestUntil: 0,
  snacksToday: 0,
  snackDate: getStandardDateStr(),
  speciesId: 'EGG',
  skin: 'SODA_BLUE',
  unlockedSkins: ['SODA_BLUE'],
  careStats: { land: 1, forest: 1, water: 1, sky: 1 },
  dietCounts: createEmptyDietCounts(),
  unlockedSpecies: ['EGG'],
  secretHistory: [],
};

const calcOptimalScale = () => {
  if (typeof window === 'undefined') return 1.55;
  const byWidth = (window.innerWidth - 16) / 252;
  const byHeight = (window.innerHeight - 108) / 322;
  return Math.max(1.25, Math.min(1.62, Number(Math.min(byWidth, byHeight).toFixed(2))));
};

const formatRemainClock = (sec = 0) => {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function App() {
  const [pet, setPet] = useState(() => {
    LEGACY_STORAGE_KEYS.forEach((oldKey) => {
      if (localStorage.getItem(oldKey)) {
        localStorage.removeItem(oldKey);
      }
    });

    const now = Date.now();
    const today = getStandardDateStr(now);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        ...INITIAL_STATE,
        userId: createUserId(),
        snackDate: today,
        careStats: normalizeCareStats(INITIAL_STATE.careStats),
        dietCounts: createEmptyDietCounts(),
        shells: createEmptyShells(),
        dexVisitedBiomes: [],
      };
    }

    const parsed = JSON.parse(saved);
    const elapsed = Math.max(0, Math.floor((now - (parsed.lastUpdated || now)) / 1000));
    const decay = Math.floor(elapsed / 90);
    const energyGain = Math.floor(elapsed / 15);
    const isAdult = SPECIES[parsed.speciesId]?.stage === 'ADULT';
    const nextClean = Math.max(0, (parsed.cleanliness ?? 90) - decay);

    return {
      ...INITIAL_STATE,
      ...parsed,
      userId: parsed.userId || createUserId(),
      nickname: parsed.nickname || '다마친구',
      plazaAvatarId:
        parsed.plazaAvatarId || (parsed.speciesId !== 'EGG' ? parsed.speciesId : 'BABY_MARUTCHI'),
      hunger: Math.max(0, (parsed.hunger ?? 75) - decay),
      happiness: Math.max(0, (parsed.happiness ?? 75) - decay),
      cleanliness: nextClean,
      energy: Math.min(100, (parsed.energy ?? 100) + energyGain),
      poopCount:
        SPECIES[parsed.speciesId]?.stage === 'EGG'
          ? 0
          : Math.min(
              3,
              (parsed.poopCount || 0) +
                (nextClean < 60
                  ? Math.min(3, Math.floor(elapsed / 1800) + (elapsed >= 900 ? 1 : 0))
                  : Math.floor(elapsed / 3600))
            ),
      ageSeconds: (parsed.ageSeconds || 0) + elapsed,
      stageAgeSeconds: (parsed.stageAgeSeconds ?? parsed.ageSeconds ?? 0) + elapsed,
      evoTimeReduction: parsed.evoTimeReduction || 0,
      eggTouches: parsed.eggTouches || 0,
      dexVisitedBiomes: normalizeDexVisitedBiomes(parsed.dexVisitedBiomes),
      shells: normalizeShells(parsed.shells),
      adultSeconds: isAdult ? (parsed.adultSeconds || 0) + elapsed : 0,
      adultEnteredAt: isAdult
        ? parsed.adultEnteredAt || now - ((parsed.adultSeconds || 0) + elapsed) * 1000
        : null,
      snacksToday: parsed.snackDate === today ? parsed.snacksToday || 0 : 0,
      snackDate: today,
      careStats: normalizeCareStats(parsed.careStats),
      dietCounts: normalizeDietCounts(parsed.dietCounts),
    };
  });

  const [lcdScreen, setLcdScreen] = useState('PET');
  const [foodPage, setFoodPage] = useState(0);
  const [shopTab, setShopTab] = useState('SKIN');
  const [skinPage, setSkinPage] = useState(0);
  const [itemPage, setItemPage] = useState(0);
  const [selectedMenuIdx, setSelectedMenuIdx] = useState(0);
  const [showDex, setShowDex] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlaza, setShowPlaza] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [actionState, setActionState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [nowTs, setNowTs] = useState(() => Date.now());
  const [shellScale, setShellScale] = useState(calcOptimalScale);

  const [irBattleMeta, setIrBattleMeta] = useState(() => {
    const today = getStandardDateStr();
    const saved = localStorage.getItem(IR_BATTLE_STORAGE_KEY);
    if (!saved) return { date: today, wins: 0 };
    try {
      const parsed = JSON.parse(saved);
      return parsed.date === today
        ? { date: today, wins: parsed.wins || 0 }
        : { date: today, wins: 0 };
    } catch {
      return { date: today, wins: 0 };
    }
  });

  const [tickerText, setTickerText] = useState('');
  const [tickerActive, setTickerActive] = useState(false);
  const [tickerHighlight, setTickerHighlight] = useState(false);
  const [tickerRunId, setTickerRunId] = useState(0);

  const [direction, setDirection] = useState(1);
  const [frame, setFrame] = useState(0);
  const [posX, setPosX] = useState(0);
  const [reaction, setReaction] = useState('');

  const lastHintAlertRef = useRef(0);
  const devTapRef = useRef({ count: 0, lastTime: 0 });
  const lastMsgKeyRef = useRef(null);
  const highlightTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setShellScale(calcOptimalScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...pet, lastUpdated: Date.now() }));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem(IR_BATTLE_STORAGE_KEY, JSON.stringify(irBattleMeta));
  }, [irBattleMeta]);

  const triggerSingleTicker = (singleMessage) => {
    setTickerText(singleMessage);
    setTickerActive(true);
    setTickerHighlight(true);
    setTickerRunId((id) => id + 1);

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => {
      setTickerHighlight(false);
    }, 6000);
  };

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const fetchLatestTicker = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/messages.json?orderBy="$key"&limitToLast=1`);
        const data = await res.json();
        if (!data) return;

        const keys = Object.keys(data);
        const latestKey = keys[keys.length - 1];
        if (!latestKey || latestKey === lastMsgKeyRef.current) return;

        lastMsgKeyRef.current = latestKey;
        const latestMsg = data[latestKey];
        if (latestMsg) {
          const text = latestMsg.isSystem
            ? latestMsg.text
            : `[${latestMsg.sender}] ${latestMsg.text}`;
          triggerSingleTicker(text);
        }
      } catch {
        // 무시
      }
    };

    fetchLatestTicker();
    const tickerTimer = setInterval(fetchLatestTicker, 3000);
    return () => clearInterval(tickerTimer);
  }, [showPlaza]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !pet.userId) return;

    const checkGifts = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${pet.userId}.json`);
        const gifts = await res.json();
        if (!gifts) return;

        await fetch(`${FIREBASE_DB_URL}/plaza/gifts/${pet.userId}.json`, { method: 'DELETE' });

        const list = Object.values(gifts);
        if (list.length > 0) {
          const latest = list[list.length - 1];
          sfx.win();
          triggerAction('HAPPY');
          setPet((p) => {
            let addHappiness = 0;
            let addHunger = 0;
            let addCoins = 0;
            list.forEach((g) => {
              if (g.type === 'HEART') addHappiness += 15;
              if (g.type === 'CAKE') addHunger += 15;
              if (g.type === 'COIN') addCoins += Math.max(1, Number(g.amount) || 20);
            });
            return {
              ...p,
              happiness: Math.min(100, p.happiness + addHappiness),
              hunger: Math.min(100, p.hunger + addHunger),
              coins: (p.coins || 0) + addCoins,
            };
          });
          triggerReaction(`🎁 [${latest.from}]님의 선물 도착!`);
        }
      } catch {
        // 무시
      }
    };

    const giftTimer = setInterval(checkGifts, 5000);
    return () => clearInterval(giftTimer);
  }, [pet.userId]);

  const handleSecretBadgeTap = () => {
    if (devUnlocked) return;
    const now = Date.now();
    if (now - devTapRef.current.lastTime < 600) {
      devTapRef.current.count += 1;
    } else {
      devTapRef.current.count = 1;
    }
    devTapRef.current.lastTime = now;

    if (devTapRef.current.count >= 5) {
      devTapRef.current.count = 0;
      const input = window.prompt('Developer Passcode:');
      if (input === DEV_PASSCODE) {
        sfx.confirm();
        setDevUnlocked(true);
        triggerReaction('DEV 모드 활성화 🛠️');
      }
    }
  };

  const applyEvolvedState = (prev, nextSpeciesId) => {
    const evolvedSpec = SPECIES[nextSpeciesId] || SPECIES.ADULT_LAND_MAMETCHI;
    const dexKey = nextSpeciesId;
    const nextUnlockedSpecies = prev.unlockedSpecies?.includes(dexKey)
      ? prev.unlockedSpecies
      : [...(prev.unlockedSpecies || ['EGG']), dexKey];

    let nextSecretHistory = prev.secretHistory || [];
    if (evolvedSpec.isSecretVariant && !nextSecretHistory.includes(nextSpeciesId)) {
      nextSecretHistory = [...nextSecretHistory, nextSpeciesId];
    }

    let nextSkin = prev.skin;
    let nextUnlockedSkins = prev.unlockedSkins || ['SODA_BLUE'];

    if (evolvedSpec.bonusSkin) {
      nextSkin = evolvedSpec.bonusSkin;
      if (!nextUnlockedSkins.includes(evolvedSpec.bonusSkin)) {
        nextUnlockedSkins = [...nextUnlockedSkins, evolvedSpec.bonusSkin];
      }
    }

    const nextDietCounts =
      String(prev.speciesId || '').startsWith('KID_') || prev.speciesId === 'BB_MARUTCHI'
        ? createEmptyDietCounts()
        : normalizeDietCounts(prev.dietCounts);

    return {
      speciesId: nextSpeciesId,
      plazaAvatarId: nextSpeciesId,
      unlockedSpecies: nextUnlockedSpecies,
      secretHistory: nextSecretHistory,
      skin: nextSkin,
      unlockedSkins: nextUnlockedSkins,
      dietCounts: nextDietCounts,
      stageAgeSeconds: 0,
      evoTimeReduction: 0,
      adultSeconds: evolvedSpec.stage === 'ADULT' ? (evolvedSpec.isSecretVariant ? 0 : prev.adultSeconds || 0) : 0,
      adultEnteredAt:
        evolvedSpec.stage === 'ADULT'
          ? evolvedSpec.isSecretVariant
            ? Date.now()
            : prev.adultEnteredAt || Date.now()
          : null,
      evolvedSpec,
    };
  };

  useEffect(() => {
    const loop = setInterval(() => {
      const tickNow = Date.now();
      const currentDay = getStandardDateStr(tickNow);
      setNowTs(tickNow);

      setPet((prev) => {
        const safeCare = normalizeCareStats(prev.careStats);
        const safeDiets = normalizeDietCounts(prev.dietCounts);
        const safeShells = normalizeShells(prev.shells);
        const safeDexBiomes = normalizeDexVisitedBiomes(prev.dexVisitedBiomes);
        const nextAge = prev.ageSeconds + 1;
        const nextStageAge = (prev.stageAgeSeconds ?? prev.ageSeconds ?? 0) + 1;
        const currentSpec = SPECIES[prev.speciesId] || SPECIES.EGG;
        const isAdult = currentSpec.stage === 'ADULT';
        const nextAdultSec = isAdult ? (prev.adultSeconds || 0) + 1 : 0;
        const nextAdultEnteredAt = isAdult
          ? prev.adultEnteredAt || tickNow - nextAdultSec * 1000
          : null;
        const nextSnacksToday = prev.snackDate === currentDay ? prev.snacksToday || 0 : 0;

        let evolvedPatch = {
          speciesId: prev.speciesId,
          plazaAvatarId: prev.plazaAvatarId,
          unlockedSpecies: prev.unlockedSpecies || ['EGG'],
          secretHistory: prev.secretHistory || [],
          skin: prev.skin,
          unlockedSkins: prev.unlockedSkins || ['SODA_BLUE'],
          dietCounts: safeDiets,
          stageAgeSeconds: nextStageAge,
          evoTimeReduction: prev.evoTimeReduction || 0,
          adultSeconds: nextAdultSec,
          adultEnteredAt: nextAdultEnteredAt,
        };

        const evoStatus = checkEvolutionStatus({
          ...prev,
          careStats: safeCare,
          dietCounts: safeDiets,
          shells: safeShells,
          dexVisitedBiomes: safeDexBiomes,
          ageSeconds: nextAge,
          stageAgeSeconds: nextStageAge,
        });

        if (evoStatus.ready) {
          const nextSpeciesId = evolveCrossRandom(currentSpec.stage, safeCare, {
            ...prev,
            careStats: safeCare,
            dietCounts: safeDiets,
            shells: safeShells,
            dexVisitedBiomes: safeDexBiomes,
          });
          const applied = applyEvolvedState(prev, nextSpeciesId);
          evolvedPatch = {
            speciesId: applied.speciesId,
            plazaAvatarId: applied.plazaAvatarId,
            unlockedSpecies: applied.unlockedSpecies,
            secretHistory: applied.secretHistory,
            skin: applied.skin,
            unlockedSkins: applied.unlockedSkins,
            dietCounts: applied.dietCounts,
            stageAgeSeconds: applied.stageAgeSeconds,
            evoTimeReduction: applied.evoTimeReduction,
            adultSeconds: applied.adultSeconds,
            adultEnteredAt: applied.adultEnteredAt,
          };
          sfx.evolve();
          triggerAction('HAPPY');
          triggerReaction(`${applied.evolvedSpec.name} 진화! ✨`);
        } else if (evoStatus.reason && tickNow - lastHintAlertRef.current > 45000) {
          triggerReaction(evoStatus.reason);
          lastHintAlertRef.current = tickNow;
        }

        const nextEnergy =
          nextAge % 15 === 0 ? Math.min(100, (prev.energy ?? 100) + 1) : (prev.energy ?? 100);

        if (nextAge % 90 === 0 && currentSpec.stage !== 'EGG') {
          const nextClean = Math.max(0, prev.cleanliness - 1);
          const poopChance = nextClean < 40 ? 0.35 : nextClean < 65 ? 0.2 : 0.08;
          const addPoop = Math.random() < poopChance ? 1 : 0;

          return {
            ...prev,
            ...evolvedPatch,
            shells: safeShells,
            dexVisitedBiomes: safeDexBiomes,
            careStats: safeCare,
            ageSeconds: nextAge,
            snacksToday: nextSnacksToday,
            snackDate: currentDay,
            energy: nextEnergy,
            hunger: Math.max(0, prev.hunger - 1),
            happiness: Math.max(0, prev.happiness - 1),
            cleanliness: nextClean,
            poopCount: Math.min(3, prev.poopCount + addPoop),
          };
        }

        return {
          ...prev,
          ...evolvedPatch,
          shells: safeShells,
          dexVisitedBiomes: safeDexBiomes,
          careStats: safeCare,
          ageSeconds: nextAge,
          snacksToday: nextSnacksToday,
          snackDate: currentDay,
          energy: nextEnergy,
        };
      });
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  // 메인 디스플레이 좌우 보행 · 반전 · 통통 점프 애니메이션
  useEffect(() => {
    let pauseTicks = 0;

    const animTimer = setInterval(() => {
      setFrame((f) => (f + 1) % 4);

      const stage = SPECIES[pet.speciesId]?.stage || 'EGG';
      const hour = new Date().getHours();
      const sleepingNow = hour >= 23 || hour < 6;

      if (stage === 'EGG') {
        setPosX(0);
        if (Math.random() < 0.25) {
          setDirection((d) => -d);
        }
        return;
      }

      if (sleepingNow) {
        setPosX(0);
        return;
      }

      if (pauseTicks > 0) {
        pauseTicks -= 1;
        return;
      }

      setPosX((prevX) => {
        const maxRange = 44;
        const step = 6.5;

        if (Math.random() < 0.1) {
          setDirection((d) => -d);
          pauseTicks = 1;
          return prevX;
        }

        let nextX = prevX + direction * step;

        if (nextX >= maxRange) {
          nextX = maxRange;
          setDirection(-1);
          pauseTicks = 1;
        } else if (nextX <= -maxRange) {
          nextX = -maxRange;
          setDirection(1);
          pauseTicks = 1;
        }

        return Number(nextX.toFixed(1));
      });
    }, 260);

    return () => clearInterval(animTimer);
  }, [pet.speciesId, direction]);

  const triggerReaction = (text) => {
    setReaction(text);
    setTimeout(() => setReaction(''), 2500);
  };

  const triggerAction = (state) => {
    setActionState(state);
    setTimeout(() => setActionState('IDLE'), 1800);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    sfx.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) sfx.beep();
  };

  const handleEggTap = () => {
    const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
    if (currentSpec.stage !== 'EGG') return;
    sfx.beep();
    triggerAction('HAPPY');
    setPet((p) => {
      const nextTouches = (p.eggTouches || 0) + 1;
      triggerReaction(
        nextTouches >= 3
          ? `알이 따뜻하게 반응! (비비마루치 조건 ${nextTouches}회) ✨`
          : `알을 쓰다듬었어요! (${nextTouches}/3) 🥚`
      );
      return {
        ...p,
        eggTouches: nextTouches,
      };
    });
  };

  const handleSelectDexBiomeTab = useCallback((biomeKey) => {
  if (!['land', 'forest', 'water', 'sky'].includes(biomeKey)) return;

  setPet((prev) => {
    const prevList = normalizeDexVisitedBiomes(prev.dexVisitedBiomes);
    if (prevList.includes(biomeKey)) return prev;

    const nextList = [...prevList, biomeKey];
    if (nextList.length === 4 && (SPECIES[prev.speciesId] || SPECIES.EGG).stage === 'EGG') {
      setTimeout(() => {
        triggerReaction('4개 필드 도감 탭 확인 완료! 비비마루치 조건 충족 ✨');
      }, 0);
    }

    return {
      ...prev,
      dexVisitedBiomes: nextList,
    };
  });
}, []);

  const startNextGeneration = (isHardReset = false) => {
    sfx.confirm();
    const today = getStandardDateStr();
    if (isHardReset) {
      setPet((prev) => ({
        ...INITIAL_STATE,
        userId: prev.userId,
        nickname: prev.nickname,
        snackDate: today,
        careStats: normalizeCareStats(INITIAL_STATE.careStats),
        dietCounts: createEmptyDietCounts(),
        shells: createEmptyShells(),
        dexVisitedBiomes: [],
      }));
    } else {
      setPet((prev) => ({
        ...INITIAL_STATE,
        userId: prev.userId,
        nickname: prev.nickname,
        plazaAvatarId: prev.plazaAvatarId,
        snackDate: today,
        careStats: normalizeCareStats(INITIAL_STATE.careStats),
        dietCounts: createEmptyDietCounts(),
        shells: createEmptyShells(),
        dexVisitedBiomes: [],
        coins: prev.coins + 50,
        skin: prev.skin,
        unlockedSkins: prev.unlockedSkins,
        unlockedSpecies: prev.unlockedSpecies,
        secretHistory: prev.secretHistory || [],
      }));
    }
    setLcdScreen('PET');
    setShowDex(false);
    setShowGuide(false);
    triggerReaction(isHardReset ? '처음부터 새 알! 🥚' : '독립 완료! 2세대 알 도착 🥚');
  };

  const feedPet = (foodItem) => {
    const now = Date.now();
    const today = getStandardDateStr(now);
    const currentSnacks = pet.snackDate === today ? pet.snacksToday : 0;
    const cost = foodItem.price || 0;
    const biomeKey = foodItem.biome || 'land';
    const biomeName = BIOME_LABEL_MAP[biomeKey] || '땅';
    const statGain = foodItem.stat || 2;
    const dietKey = foodItem.diet || 'MEAT';
    const reduceSec = foodItem.evoReduceSec || 60;

    if ((pet.coins || 0) < cost) {
      sfx.beep();
      triggerReaction(`코인 부족! (${cost}🪙 필요) 💸`);
      setLcdScreen('PET');
      return;
    }

    sfx.eat();
    triggerAction('EAT');
    setPet((p) => {
      const baseCare = normalizeCareStats(p.careStats);
      const baseDiets = normalizeDietCounts(p.dietCounts);
      return {
        ...p,
        coins: (p.coins || 0) - cost,
        hunger: Math.min(100, p.hunger + (foodItem.hunger ?? 15)),
        happiness: Math.min(100, p.happiness + (foodItem.happiness ?? 0)),
        energy: Math.min(100, (p.energy ?? 100) + (foodItem.energy ?? 0)),
        cleanliness: Math.min(100, p.cleanliness + (foodItem.clean ?? 0)),
        snacksToday: currentSnacks + 1,
        snackDate: today,
        evoTimeReduction: (p.evoTimeReduction || 0) + reduceSec,
        careStats: {
          ...baseCare,
          [biomeKey]: baseCare[biomeKey] + statGain,
        },
        dietCounts: {
          ...baseDiets,
          [dietKey]: (baseDiets[dietKey] || 0) + 1,
        },
      };
    });
    triggerReaction(`${foodItem.name} 포만+${foodItem.hunger ?? 15} · ${biomeName}+${statGain} · 진화 -${Math.floor(reduceSec / 60)}분`);
    setLcdScreen('PET');
  };

  const buyOrEquipSkin = (skinKey) => {
    const skinInfo = SHELL_SKINS[skinKey];
    const isUnlocked = pet.unlockedSkins?.includes(skinKey);

    if (isUnlocked) {
      sfx.confirm();
      setPet((p) => ({ ...p, skin: skinKey }));
      triggerReaction(`${skinInfo.name} 장착! 🎨`);
      return;
    }

    if (pet.coins < skinInfo.price) {
      sfx.beep();
      triggerReaction(`코인 부족! (${skinInfo.price}🪙 필요)`);
      return;
    }

    sfx.win();
    setPet((p) => ({
      ...p,
      coins: p.coins - skinInfo.price,
      skin: skinKey,
      unlockedSkins: [...(p.unlockedSkins || ['SODA_BLUE']), skinKey],
      evoTimeReduction: (p.evoTimeReduction || 0) + 300,
    }));
    triggerReaction(`${skinInfo.name} 해금! · 진화 -5분 🎉`);
  };

  const buyEnergyDrink = () => {
    const price = 15;
    if ((pet.energy ?? 100) >= 100) {
      sfx.beep();
      triggerReaction('이미 체력이 가득 찼어요! ⚡');
      return;
    }
    if (pet.coins < price) {
      sfx.beep();
      triggerReaction('15🪙가 필요해요!');
      return;
    }
    sfx.win();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      coins: p.coins - price,
      energy: Math.min(100, (p.energy ?? 100) + 50),
      evoTimeReduction: (p.evoTimeReduction || 0) + 300,
    }));
    triggerReaction('파워 충전! 체력+50 · 진화 -5분 ⚡');
    setLcdScreen('PET');
  };

  const buyReincarnationOrb = () => {
    const price = 10000;
    const curSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
    if (curSpec.stage === 'EGG') {
      sfx.beep();
      triggerReaction('알 상태에서는 환생할 수 없어요! 🥚');
      return;
    }
    if ((pet.coins || 0) < price) {
      sfx.beep();
      triggerReaction('10000🪙가 필요해요!');
      return;
    }

    const nextSpeciesId = reincarnateAdult(pet.speciesId);
    const applied = applyEvolvedState(pet, nextSpeciesId);

    sfx.evolve();
    triggerAction('HAPPY');
    setPet((p) => ({
      ...p,
      ...applied,
      coins: (p.coins || 0) - price,
      hunger: 100,
      happiness: 100,
      energy: 100,
      evoTimeReduction: (p.evoTimeReduction || 0) + 300,
    }));
    triggerReaction(`${applied.evolvedSpec.name} 환생! · 진화 -5분 🔮`);
    setLcdScreen('PET');
  };

  const executeMenuAction = (type) => {
    sfx.confirm();
    if (type === 'DEX') {
      setShowDex(true);
      return;
    }
    if (type === 'SHOP') {
      setLcdScreen('SHOP');
      return;
    }
    if (type === 'STATUS') {
      setLcdScreen('STATUS');
      return;
    }

    const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
    if (currentSpec.stage === 'EGG') {
      const remainSec = getRemainingEvoSeconds(pet);
      triggerReaction(`부화까지 ${formatRemainClock(remainSec)} 남음 🥚`);
      return;
    }

    if (type === 'FEED') {
      setNowTs(Date.now());
      setLcdScreen('FOOD');
    } else if (type === 'PLAY') {
      if ((pet.energy ?? 100) < 12) {
        sfx.beep();
        triggerReaction('체력 부족! 밥이나 간식 필요 ⚡');
        return;
      }
      setLcdScreen('GAME');
    } else if (type === 'CLEAN') {
      if (pet.poopCount === 0 && pet.cleanliness >= 90) {
        sfx.beep();
        triggerReaction('이미 깨끗해요! 🧹');
        setLcdScreen('PET');
        return;
      }
      const earnedCoins = pet.poopCount * 10;
      const hadPoop = pet.poopCount > 0;
      setPet((p) => {
        const baseCare = normalizeCareStats(p.careStats);
        return {
          ...p,
          cleanliness: 100,
          poopCount: 0,
          coins: p.coins + earnedCoins,
          evoTimeReduction: (p.evoTimeReduction || 0) + 120,
          careStats: {
            ...baseCare,
            water: baseCare.water + (hadPoop ? 1 : 0),
          },
        };
      });
      triggerAction('HAPPY');
      setLcdScreen('PET');
      triggerReaction(
        earnedCoins > 0 ? `청소 완료! +${earnedCoins}🪙 · 진화 -2분 ✨` : '상쾌해졌어! (진화 -2분) ✨'
      );
    }
  };

  const handlePressA = () => {
    sfx.beep();
    if (lcdScreen === 'FOOD') {
      setFoodPage((prev) => (prev + 1) % 4);
      return;
    }
    if (lcdScreen === 'SHOP') {
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    setSelectedMenuIdx((prev) => (prev + 1) % MENU_IDS.length);
  };

  const handlePressB = () => {
    if (lcdScreen === 'FOOD') {
      sfx.beep();
      setFoodPage((prev) => (prev + 1) % 4);
      return;
    }
    if (lcdScreen === 'SHOP') {
      sfx.beep();
      setShopTab((prev) => (prev === 'SKIN' ? 'ITEM' : 'SKIN'));
      return;
    }
    executeMenuAction(MENU_IDS[selectedMenuIdx]);
  };

  const handlePressC = () => {
    sfx.beep();
    setLcdScreen('PET');
  };

  const currentSpec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const safeCareStats = normalizeCareStats(pet.careStats);
  const safeShells = normalizeShells(pet.shells);
  const remainingEvoSec = getRemainingEvoSeconds(pet);
  const standardToday = getStandardDateStr(nowTs);
  const currentHour = new Date(nowTs).getHours();
  const isSleeping = currentHour >= 23 || currentHour < 6;
  const canGraduate =
    currentSpec.stage === 'ADULT' &&
    hasPassedStandard24h(pet.adultEnteredAt, pet.adultSeconds, nowTs);
  const irWinsToday = irBattleMeta.date === standardToday ? irBattleMeta.wins : 0;

  const availableShopSkins = Object.keys(SHELL_SKINS).filter(
    (k) => !SHELL_SKINS[k].isSecret || pet.unlockedSkins?.includes(k)
  );
  const totalSkinPages = Math.max(1, Math.ceil(availableShopSkins.length / 4));
  const safeSkinPage = skinPage >= totalSkinPages ? 0 : skinPage;
  const pagedSkins = availableShopSkins.slice(safeSkinPage * 4, safeSkinPage * 4 + 4);

  const itemCards = [
    { id: 'DRINK', label: '⚡드링크', price: 15, desc: '체력+50 · -5분', action: buyEnergyDrink },
    { id: 'ORB', label: '🔮환생구슬', price: 10000, desc: '다른 성체 · -5분', action: buyReincarnationOrb },
  ];
  const totalItemPages = Math.max(1, Math.ceil(itemCards.length / 4));
  const safeItemPage = itemPage >= totalItemPages ? 0 : itemPage;
  const pagedItems = itemCards.slice(safeItemPage * 4, safeItemPage * 4 + 4);

  // 0: 땅(land), 1: 숲(forest), 2: 바다(water), 3: 하늘(sky)
  const pageBiomeMap = ['land', 'forest', 'water', 'sky'];
  const currentFoodBiome = pageBiomeMap[foodPage] || 'land';
  const visibleFoods = FOOD_MENU.filter((f) => f.biome === currentFoodBiome).slice(0, 3);

  const digestRemainSec = Math.max(0, Math.ceil(((pet.digestUntil || 0) - nowTs) / 1000));
  const tickerDuration = Math.max(5.5, Math.round(tickerText.length * 0.22));
  const dexTotalCount = Object.keys(SPECIES).length;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 10px',
        boxSizing: 'border-box',
        position: 'relative',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes neonMarqueeLeftToRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes neonFlashPulse {
          0%, 100% {
            border-color: #facc15;
            box-shadow: 0 0 14px rgba(250, 204, 21, 0.9), inset 0 0 10px rgba(250, 204, 21, 0.45);
          }
          50% {
            border-color: #f43f5e;
            box-shadow: 0 0 18px rgba(244, 63, 94, 0.95), inset 0 0 12px rgba(244, 63, 94, 0.55);
          }
        }
      `}</style>

      {/* 상단 영역 */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <div
            onClick={handleSecretBadgeTap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: '#ffffff',
              border: '2px solid #bae6fd',
              borderRadius: '22px',
              padding: '6px 12px',
              color: '#0f172a',
              fontSize: '13px',
              fontWeight: '900',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: '#0284c7' }}>●</span>
            <span>{currentSpec.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
            <button
              onClick={() => {
                sfx.confirm();
                setShowPlaza(true);
              }}
              style={{ ...topBtnStyle, background: '#e0f2fe', borderColor: '#38bdf8', color: '#0369a1' }}
              title="실시간 광장 및 1:1 통신 대전"
            >
              📡 광장
            </button>
            <button
              onClick={() => {
                sfx.confirm();
                setShowShare(true);
              }}
              style={topBtnStyle}
              title="인증샷 저장 및 공유"
            >
              📸
            </button>
            <button
              onClick={() => {
                sfx.confirm();
                setShowGuide(true);
              }}
              style={topBtnStyle}
              title="사용 가이드"
            >
              ?
            </button>
            <button onClick={toggleMute} style={topBtnStyle} title="소리 켜기/끄기">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => {
                if (window.confirm('현재 캐릭터와 스킨을 초기화하고 새 알부터 시작할까요?')) {
                  startNextGeneration(true);
                }
              }}
              style={topBtnStyle}
              title="초기화"
            >
              🔄
            </button>
          </div>
        </div>

        {/* 실시간 광장 네온 LED 전광판 */}
        <div
          onClick={() => {
            sfx.beep();
            setTickerHighlight(false);
            setShowPlaza(true);
          }}
          title="터치하여 광장 채팅 열기"
          style={{
            width: '100%',
            height: '32px',
            background: 'linear-gradient(90deg, #090d16 0%, #111827 50%, #090d16 100%)',
            border: tickerHighlight ? '2px solid #facc15' : '2px solid #38bdf8',
            borderRadius: '14px',
            boxShadow: tickerHighlight
              ? '0 0 14px rgba(250, 204, 21, 0.9)'
              : '0 0 10px rgba(56, 189, 248, 0.3), inset 0 0 8px rgba(14, 165, 233, 0.22)',
            animation: tickerHighlight ? 'neonFlashPulse 0.85s ease-in-out infinite' : 'none',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: tickerHighlight ? '#f59e0b' : '#0284c7',
              color: tickerHighlight ? '#0f172a' : '#ffffff',
              fontSize: '10.5px',
              fontWeight: '900',
              letterSpacing: '0.5px',
              padding: '0 9px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              zIndex: 2,
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.6)',
              transition: 'background 0.25s',
            }}
          >
            {tickerHighlight ? 'NEW!' : 'LIVE'}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            {tickerActive && tickerText ? (
              <div
                key={tickerRunId}
                onAnimationEnd={() => {
                  setTickerActive(false);
                  setTickerHighlight(false);
                }}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  minWidth: '100%',
                  animation: `neonMarqueeLeftToRight ${tickerDuration}s linear 3`,
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: tickerHighlight ? '#fef08a' : '#7dd3fc',
                    textShadow: tickerHighlight
                      ? '0 0 7px #facc15, 0 0 14px #f59e0b'
                      : '0 0 6px #38bdf8, 0 0 12px #0284c7',
                  }}
                >
                  {tickerText}
                </span>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: '#94a3b8',
                  letterSpacing: '0.3px',
                }}
              >
                📡 광장 연결됨 · 터치하여 실시간 채팅 및 선물하기
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 중앙 다마고치 본체 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${shellScale})`,
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <TamagotchiShell
            skinKey={pet.skin}
            coins={pet.coins}
            isSleeping={isSleeping}
            selectedMenuIdx={selectedMenuIdx}
            onPressA={handlePressA}
            onPressB={handlePressB}
            onPressC={handlePressC}
            onSelectMenu={(idx) => {
              setSelectedMenuIdx(idx);
              executeMenuAction(MENU_IDS[idx]);
            }}
          >
            {/* LCD 식사 및 식단 메뉴 화면 (땅·숲·바다·하늘 4개 아이콘 탭) */}
            {lcdScreen === 'FOOD' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5px',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                {/* 상단 4개 필드 대표 아이콘 탭 */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5px',
                    width: '100%',
                    flexShrink: 0,
                  }}
                >
                  {[
                    { key: 'land', icon: '⛰️', label: '땅', pageIdx: 0 },
                    { key: 'forest', icon: '🌲', label: '숲', pageIdx: 1 },
                    { key: 'water', icon: '🌊', label: '바다', pageIdx: 2 },
                    { key: 'sky', icon: '☁️', label: '하늘', pageIdx: 3 },
                  ].map((tab) => {
                    const isActive = foodPage === tab.pageIdx;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        title={tab.label}
                        aria-label={tab.label}
                        onClick={() => {
                          sfx.beep();
                          setFoodPage(tab.pageIdx);
                        }}
                        style={{
                          background: isActive ? '#1e293b' : 'rgba(15,23,42,0.08)',
                          color: isActive ? '#f8fafc' : '#0f172a',
                          border: '1px solid #1e293b',
                          borderRadius: '2px',
                          fontSize: '8.5px',
                          fontWeight: '900',
                          padding: '1px 0',
                          lineHeight: 1.15,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 선택된 필드 탭의 먹이 목록 */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.5px',
                  }}
                >
                  {visibleFoods.map((item) => {
                    const canAfford = (pet.coins || 0) >= (item.price || 0);
                    const isMealCooling = item.category === 'MEAL' && digestRemainSec > 0;
                    const isReady = canAfford && !isMealCooling;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => feedPet(item)}
                        style={{
                          ...lcdBtnStyle,
                          flex: 1,
                          padding: '2px 4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textAlign: 'left',
                          lineHeight: 1.1,
                          overflow: 'hidden',
                          background: isReady ? 'rgba(255, 255, 255, 0.55)' : 'rgba(100, 116, 139, 0.22)',
                          border: isReady ? '1px solid #334155' : '1px dashed #64748b',
                          opacity: isReady ? 1 : 0.48,
                        }}
                      >
                        <span style={{ fontSize: '8px', fontWeight: '900', color: isReady ? '#0f172a' : '#475569' }}>
                          {item.name}
                        </span>
                        <span
                          style={{
                            background:
                              item.price === 0
                                ? 'rgba(22, 163, 74, 0.2)'
                                : canAfford
                                ? 'rgba(15, 23, 42, 0.12)'
                                : 'rgba(239, 68, 68, 0.22)',
                            color: !canAfford ? '#991b1b' : '#0f172a',
                            padding: '0 3px',
                            borderRadius: '2px',
                            fontSize: '7.2px',
                            fontWeight: '800',
                          }}
                        >
                          {item.price === 0 ? '무료' : `${item.price}🪙`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {lcdScreen === 'GAME' && (
              <MiniGame
                winStreak={pet.winStreak || 0}
                onFinish={(bonus, msg, customCoins, bonusWins, isWin) => {
                  const shellKeys = ['forest', 'land', 'water', 'sky'];
                  const droppedBiome = isWin
                    ? shellKeys[Math.floor(Math.random() * shellKeys.length)]
                    : null;
                  const droppedInfo = droppedBiome ? SHELL_ITEMS[droppedBiome] : null;

                  setPet((p) => {
                    const baseCare = normalizeCareStats(p.careStats);
                    const baseShells = normalizeShells(p.shells);
                    return {
                      ...p,
                      energy: Math.max(0, (p.energy ?? 100) - 12),
                      happiness: Math.min(100, p.happiness + bonus),
                      coins: p.coins + customCoins,
                      gameWins: (p.gameWins || 0) + bonusWins,
                      winStreak: isWin ? (p.winStreak || 0) + 1 : 0,
                      evoTimeReduction: (p.evoTimeReduction || 0) + (isWin ? 180 : 0),
                      shells: droppedBiome
                        ? {
                            ...baseShells,
                            [droppedBiome]: (baseShells[droppedBiome] || 0) + 1,
                          }
                        : baseShells,
                      careStats: {
                        ...baseCare,
                        sky: baseCare.sky + (isWin ? 2 : 1),
                      },
                    };
                  });
                  triggerAction('HAPPY');
                  setLcdScreen('PET');
                  if (droppedInfo) {
                    triggerReaction(`${droppedInfo.icon}${droppedInfo.name} 획득! +${customCoins}🪙 · -3분`);
                  } else {
                    triggerReaction(`${msg} +${customCoins}🪙`);
                  }
                }}
                onClose={() => setLcdScreen('PET')}
              />
            )}

            {lcdScreen === 'SHOP' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '2px',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', gap: '3px', width: '100%', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => { sfx.beep(); setShopTab('SKIN'); }}
                    style={{
                      flex: 1,
                      background: shopTab === 'SKIN' ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: shopTab === 'SKIN' ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8.2px',
                      fontWeight: '800',
                      padding: '1.5px 0',
                      cursor: 'pointer',
                    }}
                  >
                    스킨({availableShopSkins.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { sfx.beep(); setShopTab('ITEM'); }}
                    style={{
                      flex: 1,
                      background: shopTab === 'ITEM' ? '#1e293b' : 'rgba(15,23,42,0.08)',
                      color: shopTab === 'ITEM' ? '#f8fafc' : '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '3px',
                      fontSize: '8.2px',
                      fontWeight: '800',
                      padding: '1.5px 0',
                      cursor: 'pointer',
                    }}
                  >
                    아이템({itemCards.length})
                  </button>
                </div>

                {shopTab === 'SKIN' ? (
                  <div
                    style={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '2px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2px',
                        width: '100%',
                      }}
                    >
                      {pagedSkins.map((key) => {
                        const info = SHELL_SKINS[key];
                        const unlocked = pet.unlockedSkins?.includes(key);
                        const equipped = pet.skin === key;
                        const canAfford = unlocked || (pet.coins || 0) >= info.price;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => buyOrEquipSkin(key)}
                            style={{
                              background: equipped
                                ? '#1e293b'
                                : canAfford
                                ? 'rgba(255,255,255,0.55)'
                                : 'rgba(100, 116, 139, 0.22)',
                              color: equipped ? '#f8fafc' : canAfford ? '#0f172a' : '#475569',
                              border: canAfford ? '1px solid #334155' : '1px dashed #64748b',
                              borderRadius: '3px',
                              fontSize: '7.8px',
                              fontWeight: '800',
                              padding: '2px 2px',
                              cursor: 'pointer',
                              opacity: canAfford ? 1 : 0.48,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1.12,
                            }}
                          >
                            <span>{info.name.slice(0, 5)}</span>
                            <span
                              style={{
                                fontSize: '7px',
                                color: equipped ? '#bae6fd' : !canAfford ? '#991b1b' : '#334155',
                              }}
                            >
                              {unlocked ? (equipped ? '✓ 장착중' : '착용하기') : `${info.price}🪙`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => { sfx.beep(); setSkinPage((p) => (p + 1) % totalSkinPages); }}
                      style={{
                        width: '100%',
                        background: 'rgba(15,23,42,0.14)',
                        border: '1px solid #334155',
                        borderRadius: '3px',
                        fontSize: '7.8px',
                        fontWeight: '800',
                        padding: '1.5px',
                        cursor: 'pointer',
                        color: '#0f172a',
                        flexShrink: 0,
                      }}
                    >
                      다음 스킨 ▶ ({safeSkinPage + 1}/{totalSkinPages})
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '2.5px',
                    }}
                  >
                    {pagedItems.map((it) => {
                      const canAfford = (pet.coins || 0) >= it.price;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={it.action}
                          style={{
                            ...shopGridItemStyle,
                            padding: '4px 5px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1.5px',
                            lineHeight: 1.12,
                            background: canAfford ? 'rgba(255,255,255,0.62)' : 'rgba(100, 116, 139, 0.22)',
                            border: canAfford ? '1px solid #334155' : '1px dashed #64748b',
                            opacity: canAfford ? 1 : 0.48,
                          }}
                        >
                          <div style={{ fontSize: '7.8px', fontWeight: '900', color: canAfford ? '#0f172a' : '#475569' }}>
                            {it.label} ·{' '}
                            <span style={{ color: !canAfford ? '#991b1b' : '#0369a1' }}>{it.price}🪙</span>
                          </div>
                          <div style={{ fontSize: '6.8px', fontWeight: '700', color: canAfford ? '#1e293b' : '#475569' }}>
                            {it.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* LCD 상태 화면 (4종 쉘 획득 수량 단독 · 진화 남은시간 표시) */}
            {lcdScreen === 'STATUS' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  fontSize: '7.6px',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1px',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    borderBottom: '1px solid #334155',
                    paddingBottom: '1px',
                    fontWeight: '900',
                    fontSize: '7.6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentSpec.name} · 진화 {formatRemainClock(remainingEvoSec)}
                </div>

                <StatGauge label="포만" value={pet.hunger} />
                <StatGauge label="행복" value={pet.happiness} />
                <StatGauge label="체력" value={pet.energy ?? 100} />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1px',
                    width: '100%',
                  }}
                >
                  <div style={biomeBadgeStyle}>
                    <span>🌿</span>
                    <strong>{safeShells.forest}</strong>
                  </div>
                  <div style={biomeBadgeStyle}>
                    <span>🪨</span>
                    <strong>{safeShells.land}</strong>
                  </div>
                  <div style={biomeBadgeStyle}>
                    <span>💧</span>
                    <strong>{safeShells.water}</strong>
                  </div>
                  <div style={biomeBadgeStyle}>
                    <span>🌈</span>
                    <strong>{safeShells.sky}</strong>
                  </div>
                </div>

                {canGraduate ? (
                  <button
                    type="button"
                    onClick={() => startNextGeneration(false)}
                    style={{
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '7.4px',
                      fontWeight: '800',
                      padding: '1.5px',
                      cursor: 'pointer',
                    }}
                  >
                    🥚 2세대 알 물려받기
                  </button>
                ) : pet.speciesId === 'BB_MARUTCHI' ? (
                  <div style={{ fontSize: '6.6px', fontWeight: '800', textAlign: 'center', opacity: 0.92 }}>
                    4종 7개+식단→영 직행 · {pet.unlockedSpecies?.length || 1}/{dexTotalCount}
                  </div>
                ) : (
                  <div style={{ fontSize: '7px', fontWeight: '800', textAlign: 'center', opacity: 0.9 }}>
                    승리 {pet.gameWins || 0}회 · 도감 {pet.unlockedSpecies?.length || 1}/{dexTotalCount}
                  </div>
                )}
              </div>
            )}

            {lcdScreen === 'PET' && (
              <div
                onClick={handleEggTap}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: currentSpec.stage === 'EGG' ? 'pointer' : 'default',
                }}
              >
                {reaction && (
                  <div
                    style={{
                      fontSize: '8.4px',
                      fontWeight: '800',
                      color: '#0f172a',
                      background: 'rgba(255,255,255,0.88)',
                      border: '1px solid rgba(15,23,42,0.22)',
                      padding: '1.5px 6px',
                      borderRadius: '4px',
                      marginBottom: '1px',
                      textAlign: 'center',
                    }}
                  >
                    {reaction}
                  </div>
                )}
                <PetSprite
                  speciesId={pet.speciesId}
                  direction={direction}
                  frame={frame}
                  posX={posX}
                  actionState={actionState}
                  isSleeping={isSleeping}
                  isDirty={pet.cleanliness < 35}
                  lcdMode={false}
                />
                {pet.poopCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: -12,
                      fontSize: '13px',
                    }}
                  >
                    {'💩'.repeat(pet.poopCount)}
                  </span>
                )}
              </div>
            )}
          </TamagotchiShell>
        </div>
      </div>

      {/* 개발자 전용 숨겨진 테스트 바 */}
      {devUnlocked && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.92)',
            padding: '7px 12px',
            borderRadius: '14px',
            zIndex: 20,
          }}
        >
          <button
            onClick={() => {
              sfx.win();
              setPet((p) => ({ ...p, coins: (p.coins || 0) + 1000, energy: 100 }));
              triggerReaction('+1000🪙 & 풀충전');
            }}
            style={devBtnStyle}
          >
            +1000🪙
          </button>
          <button
            onClick={() => {
              sfx.win();
              setPet((p) => ({
                ...p,
                shells: { forest: 10, land: 10, water: 10, sky: 10 },
                evoTimeReduction: (p.evoTimeReduction || 0) + 3600,
              }));
              triggerReaction('쉘 10개씩 & 진화 -60분');
            }}
            style={devBtnStyle}
          >
            쉘10·시간단축
          </button>
          <button
            onClick={() => {
              const nextId = evolveCrossRandom(currentSpec.stage, safeCareStats, {
                ...pet,
                careStats: safeCareStats,
                dietCounts: normalizeDietCounts(pet.dietCounts),
                shells: safeShells,
                dexVisitedBiomes: normalizeDexVisitedBiomes(pet.dexVisitedBiomes),
              });
              const applied = applyEvolvedState(pet, nextId);
              sfx.evolve();
              setPet((p) => ({ ...p, ...applied, hunger: 100, happiness: 100, energy: 100 }));
              triggerReaction(`진화: ${applied.evolvedSpec.name}`);
            }}
            style={devBtnStyle}
          >
            즉시진화
          </button>
          <button
            onClick={() => {
              const secretByBiome = {
                land: 'SECRET_LAND_SPECIAL',
                forest: 'SECRET_FOREST_SPECIAL',
                water: 'SECRET_WATER_SPECIAL',
                sky: 'SECRET_SKY_SPECIAL',
              };
              const nextSec = secretByBiome[currentSpec.biome] || 'SECRET_LAND_SPECIAL';
              const applied = applyEvolvedState(pet, nextSec);
              sfx.evolve();
              setPet((p) => ({ ...p, ...applied, hunger: 100, happiness: 100, energy: 100 }));
              triggerReaction(`시크릿: ${applied.evolvedSpec.name}`);
            }}
            style={devBtnStyle}
          >
            계통시크릿
          </button>
          <button
            onClick={async () => {
              if (!isFirebaseConfigured()) {
                alert('Firebase DB가 연결되어 있지 않습니다.');
                return;
              }
              if (!window.confirm('서버의 광장 채팅·접속자·방 기록을 모두 초기화할까요?')) return;
              try {
                await fetch(`${FIREBASE_DB_URL}/plaza.json`, { method: 'DELETE' });
                lastMsgKeyRef.current = null;
                setTickerText('');
                setTickerActive(false);
                sfx.confirm();
                triggerReaction('광장 서버 DB 초기화 완료 🧹');
              } catch {
                alert('광장 초기화 중 오류가 발생했습니다.');
              }
            }}
            style={{ ...devBtnStyle, background: '#d97706' }}
          >
            광장초기화
          </button>
          <button
            onClick={() => setDevUnlocked(false)}
            style={{ ...devBtnStyle, background: '#ef4444' }}
          >
            닫기
          </button>
        </div>
      )}

      {/* 통합 통신 광장 모달 */}
      {showPlaza && (
        <PlazaModal
          userId={pet.userId}
          nickname={pet.nickname}
          avatarId={pet.plazaAvatarId || 'BABY_MARUTCHI'}
          mySpeciesId={pet.speciesId}
          petCoins={pet.coins}
          irBattleWinsToday={irWinsToday}
          irBattleDailyLimit={5}
          onUpdateProfile={(newNick, newAvatar) => {
            setPet((p) => ({ ...p, nickname: newNick, plazaAvatarId: newAvatar }));
          }}
          onSendGiftCoin={(cost) => {
            setPet((p) => ({ ...p, coins: Math.max(0, (p.coins || 0) - cost) }));
          }}
          onWinBattleCoin={(reward) => {
            const today = getStandardDateStr();
            const currentWins = irBattleMeta.date === today ? irBattleMeta.wins : 0;
            const shellKeys = ['forest', 'land', 'water', 'sky'];
            const droppedBiome = shellKeys[Math.floor(Math.random() * shellKeys.length)];
            const droppedInfo = SHELL_ITEMS[droppedBiome];

            if (currentWins >= 5) {
              sfx.beep();
              setPet((p) => {
                const baseShells = normalizeShells(p.shells);
                return {
                  ...p,
                  shells: {
                    ...baseShells,
                    [droppedBiome]: (baseShells[droppedBiome] || 0) + 1,
                  },
                };
              });
              triggerReaction(`${droppedInfo.icon}${droppedInfo.name} 쉘 획득!`);
              return;
            }
            sfx.win();
            setIrBattleMeta({ date: today, wins: currentWins + 1 });
            setPet((p) => {
              const baseShells = normalizeShells(p.shells);
              return {
                ...p,
                coins: (p.coins || 0) + reward,
                evoTimeReduction: (p.evoTimeReduction || 0) + 240,
                shells: {
                  ...baseShells,
                  [droppedBiome]: (baseShells[droppedBiome] || 0) + 1,
                },
              };
            });
            triggerReaction(`승리! +${reward}🪙 · ${droppedInfo.icon}${droppedInfo.name}`);
          }}
          onFuseSecret={(secretSpeciesId) => {
            const applied = applyEvolvedState(pet, secretSpeciesId);
            sfx.evolve();
            triggerAction('HAPPY');
            setPet((p) => ({
              ...p,
              ...applied,
              hunger: 100,
              happiness: 100,
              energy: 100,
            }));
            setShowPlaza(false);
            setLcdScreen('PET');
            triggerReaction(`🧬 IR 합성 성공! ${applied.evolvedSpec.name} 출현!`);
          }}
          onClose={() => {
            sfx.beep();
            setShowPlaza(false);
          }}
        />
      )}

      {showShare && (
        <ShareCardModal
          pet={pet}
          onClose={() => {
            sfx.beep();
            setShowShare(false);
          }}
        />
      )}

      {showGuide && (
        <GuideModal
          onClose={() => {
            sfx.beep();
            setShowGuide(false);
          }}
        />
      )}

      {showDex && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px',
            boxSizing: 'border-box',
          }}
        >
          <EvolutionDexModal
            unlockedSpecies={pet.unlockedSpecies}
            secretHistory={pet.secretHistory || []}
            currentSpeciesId={pet.speciesId}
            careStats={safeCareStats}
            onSelectBiomeTab={handleSelectDexBiomeTab}
            onClose={() => {
              sfx.beep();
              setShowDex(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function StatGauge({ label, value }) {
  const safeVal = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
      <span style={{ width: '24px', fontSize: '7.6px', fontWeight: '800' }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: '6px',
          border: '1px solid #1e293b',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.38)',
          padding: '0.5px',
        }}
      >
        <div
          style={{
            width: `${safeVal}%`,
            height: '100%',
            background: '#1e293b',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
      <span style={{ width: '20px', textAlign: 'right', fontSize: '7.4px', fontWeight: '800' }}>{safeVal}</span>
    </div>
  );
}

const topBtnStyle = {
  background: '#ffffff',
  border: '1.5px solid #cbd5e1',
  borderRadius: '11px',
  color: '#0f172a',
  fontSize: '12.5px',
  fontWeight: '800',
  padding: '6px 9px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(15, 23, 42, 0.08)',
};

const devBtnStyle = {
  background: '#0284c7',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '11px',
  fontWeight: '800',
  padding: '6px 9px',
  cursor: 'pointer',
};

const lcdBtnStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.45)',
  border: '1px solid #334155',
  borderRadius: '4px',
  padding: '3px 4px',
  fontSize: '8.5px',
  color: '#0f172a',
  cursor: 'pointer',
};

const shopGridItemStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.5)',
  border: '1px solid #334155',
  borderRadius: '3px',
  padding: '2px 2px',
  fontSize: '7.5px',
  color: '#0f172a',
  cursor: 'pointer',
  textAlign: 'center',
};

const biomeBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.5)',
  border: '1px solid #475569',
  borderRadius: '3px',
  padding: '1px 2px',
  fontSize: '6.3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#0f172a',
};
