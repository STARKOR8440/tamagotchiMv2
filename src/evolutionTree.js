// src/evolutionTree.js — 4대 필드 쉘 수집 · 비비마루치(4종 쉘 각 7개 이상 + 식단 영 직행) · 키드 상위 2종 조합/불규칙 영 진화 · 성체 4단계 순차진화 · IR 1:1 시크릿 합성

export const FIELD_CELL_TYPES = ['land', 'forest', 'water', 'sky'];

export const SHELL_ITEMS = {
  forest: { key: 'forest', name: '나뭇가지', icon: '🌿', targetKid: 'KID_FOREST' },
  land: { key: 'land', name: '조약돌', icon: '🪨', targetKid: 'KID_LAND' },
  water: { key: 'water', name: '물방울', icon: '💧', targetKid: 'KID_WATER' },
  sky: { key: 'sky', name: '무지개', icon: '🌈', targetKid: 'KID_SKY' },
};

export const SHELL_TARGET_COUNT = 10;
export const BB_SHELL_EACH_TARGET_COUNT = 7;

export const DIET_TYPES = [
  'MEAT',
  'WORM',
  'CARROT',
  'BAMBOO',
  'POMEGRANATE',
  'CORN',
  'SEAFOOD',
  'SEAWEED',
  'SHRIMP',
  'CHICKEN',
  'SYRUP',
  'COTTON_CANDY',
];

export const DIET_TO_TEEN_MAP = {
  // 땅 식단 -> 땅 영
  MEAT: 'TEEN_LAND_ROAR',
  WORM: 'TEEN_LAND_TODDLE',
  CARROT: 'TEEN_LAND_LICK',

  // 숲 식단 -> 숲 영
  BAMBOO: 'TEEN_FOREST_ROAR',
  POMEGRANATE: 'TEEN_FOREST_TODDLE',
  CORN: 'TEEN_FOREST_CHIRP',

  // 바다 식단 -> 바다 영
  SEAFOOD: 'TEEN_WATER_GLIDE',
  SEAWEED: 'TEEN_WATER_LEAP',
  SHRIMP: 'TEEN_WATER_PADDLE',

  // 하늘 식단 -> 하늘 영
  CHICKEN: 'TEEN_SKY_FLAP',
  SYRUP: 'TEEN_SKY_CHIRP',
  COTTON_CANDY: 'TEEN_SKY_BUMBLE',
};

export const FIELD_DIET_GROUPS = {
  land: [
    { label: '고기+지렁이 조합', pair: ['MEAT', 'WORM'], teenId: 'TEEN_LAND_ROAR' },
    { label: '지렁이+당근 조합', pair: ['WORM', 'CARROT'], teenId: 'TEEN_LAND_TODDLE' },
    { label: '고기+당근 조합', pair: ['MEAT', 'CARROT'], teenId: 'TEEN_LAND_LICK' },
  ],
  forest: [
    { label: '대나무+석류 조합', pair: ['BAMBOO', 'POMEGRANATE'], teenId: 'TEEN_FOREST_ROAR' },
    { label: '석류+옥수수 조합', pair: ['POMEGRANATE', 'CORN'], teenId: 'TEEN_FOREST_TODDLE' },
    { label: '대나무+옥수수 조합', pair: ['BAMBOO', 'CORN'], teenId: 'TEEN_FOREST_CHIRP' },
  ],
  water: [
    { label: '해산물+미역 조합', pair: ['SEAFOOD', 'SEAWEED'], teenId: 'TEEN_WATER_GLIDE' },
    { label: '미역+새우 조합', pair: ['SEAWEED', 'SHRIMP'], teenId: 'TEEN_WATER_LEAP' },
    { label: '해산물+새우 조합', pair: ['SEAFOOD', 'SHRIMP'], teenId: 'TEEN_WATER_PADDLE' },
  ],
  sky: [
    { label: '닭고기+시럽 조합', pair: ['CHICKEN', 'SYRUP'], teenId: 'TEEN_SKY_FLAP' },
    { label: '시럽+솜사탕 조합', pair: ['SYRUP', 'COTTON_CANDY'], teenId: 'TEEN_SKY_CHIRP' },
    { label: '닭고기+솜사탕 조합', pair: ['CHICKEN', 'COTTON_CANDY'], teenId: 'TEEN_SKY_BUMBLE' },
  ],
};

export const IRREGULAR_TEEN_BY_BIOME = {
  land: 'TEEN_LAND_SPROUT',
  forest: 'TEEN_FOREST_SPROUT',
  water: 'TEEN_WATER_FLOAT',
  sky: 'TEEN_SKY_ROCKY',
};

export const ADULT_LINE_POOLS = {
  // 숲 필드 16성체 (1단계 -> 2단계 -> 3단계 -> 4단계 순차 진화)
  TEEN_FOREST_ROAR: [
    'ADULT_FOREST_HORHOTCHI',
    'ADULT_FOREST_KONKOTCHI',
    'ADULT_FOREST_TIGAOTCHI',
    'ADULT_FOREST_TANOONTCHI',
  ],
  TEEN_FOREST_TODDLE: [
    'ADULT_FOREST_LESSAPANTCHI',
    'ADULT_FOREST_KANEKOTCHI',
    'ADULT_FOREST_SUIGYUTCHI',
    'ADULT_FOREST_PANBOOTCHI',
  ],
  TEEN_FOREST_CHIRP: [
    'ADULT_FOREST_KACHITCHI',
    'ADULT_FOREST_TOKIPATCHI',
    'ADULT_FOREST_KUCHIPATCHI',
    'ADULT_FOREST_SPARROTCHI',
  ],
  TEEN_FOREST_SPROUT: [
    'ADULT_FOREST_SHITAKECHI',
    'ADULT_FOREST_PEATCHI',
    'ADULT_FOREST_NAPPATCHI',
    'ADULT_FOREST_RUSHRADITCHI',
  ],

  // 땅 필드 16성체 (1단계 -> 2단계 -> 3단계 -> 4단계 순차 진화)
  TEEN_LAND_ROAR: [
    'ADULT_LAND_MEOWTCHI',
    'ADULT_LAND_POCHITCHI',
    'ADULT_LAND_GUMAX',
    'ADULT_LAND_RATCHI',
  ],
  TEEN_LAND_TODDLE: [
    'ADULT_LAND_MAMETCHI',
    'ADULT_LAND_MIMITCHI',
    'ADULT_LAND_MOLMOTCHI',
    'ADULT_LAND_SHEEPTCHI',
  ],
  TEEN_LAND_LICK: [
    'ADULT_LAND_LEOPATCHI',
    'ADULT_LAND_SEBIRETCHI',
    'ADULT_LAND_ELIZARDOTCHI',
    'ADULT_LAND_HEAVYTTCHI',
  ],
  TEEN_LAND_SPROUT: [
    'ADULT_LAND_VIOLETCHI',
    'ADULT_LAND_POTSUNENTCHI',
    'ADULT_LAND_TUSTUSTCHI',
    'ADULT_LAND_SHIGEMI_SAN',
  ],

  // 바다 필드 16성체 (1단계 -> 2단계 -> 3단계 -> 4단계 순차 진화)
  TEEN_WATER_GLIDE: [
    'ADULT_WATER_IRUKATCHI',
    'ADULT_WATER_KAMETCHI',
    'ADULT_WATER_KUJIRATCHI',
    'ADULT_WATER_URUOTCHI',
  ],
  TEEN_WATER_LEAP: [
    'ADULT_WATER_AXOLOPATCHI',
    'ADULT_WATER_IMORITCHI',
    'ADULT_WATER_KAWAZUTCHI',
    'ADULT_WATER_BEAVERTCHI',
  ],
  TEEN_WATER_PADDLE: [
    'ADULT_WATER_TACHUTCHI',
    'ADULT_WATER_SHARKTCHI',
    'ADULT_WATER_ANKOTCHI',
    'ADULT_WATER_OTOTOTCHI',
  ],
  TEEN_WATER_FLOAT: [
    'ADULT_WATER_KURARATCHI',
    'ADULT_WATER_MENDAKOTCHI',
    'ADULT_WATER_AMEFURATCHI',
    'ADULT_WATER_GUSOKUTCHI',
  ],

  // 하늘 필드 16성체 (1단계 -> 2단계 -> 3단계 -> 4단계 순차 진화)
  TEEN_SKY_FLAP: [
    'ADULT_SKY_HORHOTCHI',
    'ADULT_SKY_MONGATCHI',
    'ADULT_SKY_EAGLETCHI',
    'ADULT_SKY_BATCHI',
  ],
  TEEN_SKY_CHIRP: [
    'ADULT_SKY_PEACOTCHI',
    'ADULT_SKY_BATATCHI',
    'ADULT_SKY_KUCHIPATCHI',
    'ADULT_SKY_KIWITCHI',
  ],
  TEEN_SKY_BUMBLE: [
    'ADULT_SKY_PAPILLOTCHI',
    'ADULT_SKY_KABUTOTCHI',
    'ADULT_SKY_TENLOTCHI',
    'ADULT_SKY_HATCHITCHI',
  ],
  TEEN_SKY_ROCKY: [
    'ADULT_SKY_GEMTCHI',
    'ADULT_SKY_OROTATCHI',
    'ADULT_SKY_ISHIKOROTCHI',
    'ADULT_SKY_MAGMATCHI',
  ],
};

const SPECIES_BASE = {
  EGG: {
    id: 'EGG',
    name: '신비한 알',
    stage: 'EGG',
    stageLabel: '알',
    biome: 'land',
    hint: '알을 3회 이상 쓰다듬거나 진화도감에서 4개 필드(땅·숲·바다·하늘) 탭을 확인하면 비비마루치로 부화합니다.',
    desc: '새로운 생명이 잠든 알입니다.',
  },
  BABY_MARUTCHI: {
    id: 'BABY_MARUTCHI',
    name: '베이비마루치',
    stage: 'BABY',
    stageLabel: '베이비',
    biome: 'land',
    hint: '미니게임에서 승리해 특수 쉘(나뭇가지·조약돌·물방울·무지개) 1종을 10개 모으세요.',
    desc: '조용한 알에서 태어난 기본 베이비입니다.',
  },
  BB_MARUTCHI: {
    id: 'BB_MARUTCHI',
    name: '비비마루치',
    stage: 'BABY',
    stageLabel: '베이비(특수)',
    biome: 'sky',
    hint: '4종 쉘을 각각 7개 이상 모으고 식단을 먹이면 키드를 건너뛰고 해당 필드 영(TEEN)으로 진화합니다!',
    desc: '알 시절 교감 또는 4필드 도감 탐색으로 태어난 특수 베이비입니다. 4종 쉘 7개 이상 + 식단으로 영(TEEN) 직행합니다.',
  },

  // 4대 키드 단계
  KID_FOREST: {
    id: 'KID_FOREST',
    name: '포레스트키드',
    stage: 'KID',
    stageLabel: '숲 필드',
    biome: 'forest',
    biomeLabel: '숲',
    hint: '대나무·석류·옥수수 중 상위 2가지 조합을 노려보세요. 방치하거나 3종을 골고루 먹으면 불규칙 영으로 진화합니다.',
    desc: '나뭇가지 쉘 10개를 모아 탄생한 숲 필드 키드입니다.',
  },
  KID_LAND: {
    id: 'KID_LAND',
    name: '랜드키드',
    stage: 'KID',
    stageLabel: '땅 필드',
    biome: 'land',
    biomeLabel: '땅',
    hint: '고기·지렁이·당근 중 상위 2가지 조합을 노려보세요. 방치하거나 3종을 골고루 먹으면 불규칙 영으로 진화합니다.',
    desc: '조약돌 쉘 10개를 모아 탄생한 땅 필드 키드입니다.',
  },
  KID_WATER: {
    id: 'KID_WATER',
    name: '워터키드',
    stage: 'KID',
    stageLabel: '바다 필드',
    biome: 'water',
    biomeLabel: '바다',
    hint: '해산물·미역·새우 중 상위 2가지 조합을 노려보세요. 방치하거나 3종을 골고루 먹으면 불규칙 영으로 진화합니다.',
    desc: '물방울 쉘 10개를 모아 탄생한 바다 필드 키드입니다.',
  },
  KID_SKY: {
    id: 'KID_SKY',
    name: '스카이키드',
    stage: 'KID',
    stageLabel: '하늘 필드',
    biome: 'sky',
    biomeLabel: '하늘',
    hint: '닭고기·시럽·솜사탕 중 상위 2가지 조합을 노려보세요. 방치하거나 3종을 골고루 먹으면 불규칙 영으로 진화합니다.',
    desc: '무지개 쉘 10개를 모아 탄생한 하늘 필드 키드입니다.',
  },

  // 숲 필드 영(Young)
  TEEN_FOREST_ROAR: {
    id: 'TEEN_FOREST_ROAR',
    name: '로어영(숲)',
    stage: 'TEEN',
    stageLabel: '영 · 대나무+석류 조합',
    biome: 'forest',
    biomeLabel: '숲',
    dietComboLabel: '대나무 + 석류 상위 조합',
    hint: '숲 키드에서 대나무·석류 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '대나무와 석류 조합을 중심으로 자란 숲 영입니다.',
  },
  TEEN_FOREST_TODDLE: {
    id: 'TEEN_FOREST_TODDLE',
    name: '토들영(숲)',
    stage: 'TEEN',
    stageLabel: '영 · 석류+옥수수 조합',
    biome: 'forest',
    biomeLabel: '숲',
    dietComboLabel: '석류 + 옥수수 상위 조합',
    hint: '숲 키드에서 석류·옥수수 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '석류와 옥수수 조합을 중심으로 자란 숲 영입니다.',
  },
  TEEN_FOREST_CHIRP: {
    id: 'TEEN_FOREST_CHIRP',
    name: '처프영(숲)',
    stage: 'TEEN',
    stageLabel: '영 · 대나무+옥수수 조합',
    biome: 'forest',
    biomeLabel: '숲',
    dietComboLabel: '대나무 + 옥수수 상위 조합',
    hint: '숲 키드에서 대나무·옥수수 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '대나무와 옥수수 조합을 중심으로 자란 숲 영입니다.',
  },
  TEEN_FOREST_SPROUT: {
    id: 'TEEN_FOREST_SPROUT',
    name: '스프라우트영(숲)',
    stage: 'TEEN',
    stageLabel: '영 · 불규칙 식단',
    biome: 'forest',
    biomeLabel: '숲',
    dietComboLabel: '방치 또는 3종 골고루 섭취(불규칙)',
    hint: '숲 키드에서 먹이를 방치하거나 3종을 골고루 섭취했을 때 등장하는 불규칙 영입니다.',
    desc: '불규칙한 식단 흐름 속에서 숲의 기운을 받아 자란 영입니다.',
  },

  // 땅 필드 영(Young)
  TEEN_LAND_ROAR: {
    id: 'TEEN_LAND_ROAR',
    name: '로어영(땅)',
    stage: 'TEEN',
    stageLabel: '영 · 고기+지렁이 조합',
    biome: 'land',
    biomeLabel: '땅',
    dietComboLabel: '고기 + 지렁이 상위 조합',
    hint: '땅 키드에서 고기·지렁이 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '고기와 지렁이 조합을 중심으로 자란 땅 영입니다.',
  },
  TEEN_LAND_TODDLE: {
    id: 'TEEN_LAND_TODDLE',
    name: '토들영(땅)',
    stage: 'TEEN',
    stageLabel: '영 · 지렁이+당근 조합',
    biome: 'land',
    biomeLabel: '땅',
    dietComboLabel: '지렁이 + 당근 상위 조합',
    hint: '땅 키드에서 지렁이·당근 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '지렁이와 당근 조합을 중심으로 자란 땅 영입니다.',
  },
  TEEN_LAND_LICK: {
    id: 'TEEN_LAND_LICK',
    name: '릭영(땅)',
    stage: 'TEEN',
    stageLabel: '영 · 고기+당근 조합',
    biome: 'land',
    biomeLabel: '땅',
    dietComboLabel: '고기 + 당근 상위 조합',
    hint: '땅 키드에서 고기·당근 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '고기와 당근 조합을 중심으로 자란 땅 영입니다.',
  },
  TEEN_LAND_SPROUT: {
    id: 'TEEN_LAND_SPROUT',
    name: '스프라우트영(땅)',
    stage: 'TEEN',
    stageLabel: '영 · 불규칙 식단',
    biome: 'land',
    biomeLabel: '땅',
    dietComboLabel: '방치 또는 3종 골고루 섭취(불규칙)',
    hint: '땅 키드에서 먹이를 방치하거나 3종을 골고루 섭취했을 때 등장하는 불규칙 영입니다.',
    desc: '불규칙한 식단 흐름 속에서 대지의 기운을 받아 자란 영입니다.',
  },

  // 바다 필드 영(Young)
  TEEN_WATER_GLIDE: {
    id: 'TEEN_WATER_GLIDE',
    name: '글라이드영(바다)',
    stage: 'TEEN',
    stageLabel: '영 · 해산물+미역 조합',
    biome: 'water',
    biomeLabel: '바다',
    dietComboLabel: '해산물 + 미역 상위 조합',
    hint: '바다 키드에서 해산물·미역 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '해산물과 미역 조합을 중심으로 자란 바다 영입니다.',
  },
  TEEN_WATER_LEAP: {
    id: 'TEEN_WATER_LEAP',
    name: '리프영(바다)',
    stage: 'TEEN',
    stageLabel: '영 · 미역+새우 조합',
    biome: 'water',
    biomeLabel: '바다',
    dietComboLabel: '미역 + 새우 상위 조합',
    hint: '바다 키드에서 미역·새우 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '미역과 새우 조합을 중심으로 자란 바다 영입니다.',
  },
  TEEN_WATER_PADDLE: {
    id: 'TEEN_WATER_PADDLE',
    name: '패들영(바다)',
    stage: 'TEEN',
    stageLabel: '영 · 해산물+새우 조합',
    biome: 'water',
    biomeLabel: '바다',
    dietComboLabel: '해산물 + 새우 상위 조합',
    hint: '바다 키드에서 해산물·새우 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '해산물과 새우 조합을 중심으로 자란 바다 영입니다.',
  },
  TEEN_WATER_FLOAT: {
    id: 'TEEN_WATER_FLOAT',
    name: '플로트영(바다)',
    stage: 'TEEN',
    stageLabel: '영 · 불규칙 식단',
    biome: 'water',
    biomeLabel: '바다',
    dietComboLabel: '방치 또는 3종 골고루 섭취(불규칙)',
    hint: '바다 키드에서 먹이를 방치하거나 3종을 골고루 섭취했을 때 등장하는 불규칙 영입니다.',
    desc: '불규칙한 식단 흐름 속에서 바다의 기운을 받아 자란 영입니다.',
  },

  // 하늘 필드 영(Young)
  TEEN_SKY_FLAP: {
    id: 'TEEN_SKY_FLAP',
    name: '플랩영(하늘)',
    stage: 'TEEN',
    stageLabel: '영 · 닭고기+시럽 조합',
    biome: 'sky',
    biomeLabel: '하늘',
    dietComboLabel: '닭고기 + 시럽 상위 조합',
    hint: '하늘 키드에서 닭고기·시럽 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '닭고기와 시럽 조합을 중심으로 자란 하늘 영입니다.',
  },
  TEEN_SKY_CHIRP: {
    id: 'TEEN_SKY_CHIRP',
    name: '처프영(하늘)',
    stage: 'TEEN',
    stageLabel: '영 · 시럽+솜사탕 조합',
    biome: 'sky',
    biomeLabel: '하늘',
    dietComboLabel: '시럽 + 솜사탕 상위 조합',
    hint: '하늘 키드에서 시럽·솜사탕 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '시럽과 솜사탕 조합을 중심으로 자란 하늘 영입니다.',
  },
  TEEN_SKY_BUMBLE: {
    id: 'TEEN_SKY_BUMBLE',
    name: '범블영(하늘)',
    stage: 'TEEN',
    stageLabel: '영 · 닭고기+솜사탕 조합',
    biome: 'sky',
    biomeLabel: '하늘',
    dietComboLabel: '닭고기 + 솜사탕 상위 조합',
    hint: '하늘 키드에서 닭고기·솜사탕 상위 조합으로 진화한 영입니다. 식사와 미니게임으로 성체 진화를 가속할 수 있습니다.',
    desc: '닭고기와 솜사탕 조합을 중심으로 자란 하늘 영입니다.',
  },
  TEEN_SKY_ROCKY: {
    id: 'TEEN_SKY_ROCKY',
    name: '로키영(하늘)',
    stage: 'TEEN',
    stageLabel: '영 · 불규칙 식단',
    biome: 'sky',
    biomeLabel: '하늘',
    dietComboLabel: '방치 또는 3종 골고루 섭취(불규칙)',
    hint: '하늘 키드에서 먹이를 방치하거나 3종을 골고루 섭취했을 때 등장하는 불규칙 영입니다.',
    desc: '불규칙한 식단 흐름 속에서 하늘의 기운을 받아 자란 영입니다.',
  },
};

const createAdultEntries = (teenKey, names) => {
  const ids = ADULT_LINE_POOLS[teenKey];
  const parentTeen = SPECIES_BASE[teenKey];
  const entries = {};
  ids.forEach((id, idx) => {
    const stepNum = idx + 1;
    entries[id] = {
      id,
      name: names[idx],
      stage: 'ADULT',
      adultTier: stepNum,
      stageLabel: `성체(${parentTeen.biomeLabel}) · ${stepNum}/4단계`,
      biome: parentTeen.biome,
      parentTeenId: teenKey,
      nextAdultId: idx < ids.length - 1 ? ids[idx + 1] : null,
      hint:
        idx < ids.length - 1
          ? `식사와 미니게임으로 ${stepNum + 1}단계 성체 진화를 가속할 수 있습니다.`
          : `최종 4단계 성체! 광장 IR 1:1 통신에서 같은 필드 성체와 합성하면 시크릿이 출현합니다.`,
      desc: `${parentTeen.name} 계통의 ${stepNum}단계 성체 ${names[idx]}입니다.`,
    };
  });
  return entries;
};

export const SPECIES = {
  ...SPECIES_BASE,

  // 숲 16성체 (1->2->3->4단계)
  ...createAdultEntries('TEEN_FOREST_ROAR', [
    '포레스트호르호치',
    '콘코치',
    '티가오치',
    '타눈치',
  ]),
  ...createAdultEntries('TEEN_FOREST_TODDLE', [
    '레사판치',
    '카네코치',
    '스이규치',
    '판부치',
  ]),
  ...createAdultEntries('TEEN_FOREST_CHIRP', [
    '카치치',
    '토키파치',
    '쿠치파치',
    '스패로치',
  ]),
  ...createAdultEntries('TEEN_FOREST_SPROUT', [
    '시타게치',
    '피치',
    '나파치',
    '러시래디치',
  ]),

  // 땅 16성체 (1->2->3->4단계)
  ...createAdultEntries('TEEN_LAND_ROAR', [
    '먀우치',
    '포치치',
    '구맥스',
    '래치',
  ]),
  ...createAdultEntries('TEEN_LAND_TODDLE', [
    '마메치',
    '미미치',
    '몰모치',
    '시피치',
  ]),
  ...createAdultEntries('TEEN_LAND_LICK', [
    '레오파치',
    '세비레치',
    '엘리자도치',
    '헤비치',
  ]),
  ...createAdultEntries('TEEN_LAND_SPROUT', [
    '비올레치',
    '포츠넨치',
    '츠츠치',
    '시게미상',
  ]),

  // 바다 16성체 (1->2->3->4단계)
  ...createAdultEntries('TEEN_WATER_GLIDE', [
    '이루카치',
    '카메치',
    '쿠지라치',
    '우루오치',
  ]),
  ...createAdultEntries('TEEN_WATER_LEAP', [
    '아홀로파치',
    '이모리치',
    '카와즈치',
    '비버치',
  ]),
  ...createAdultEntries('TEEN_WATER_PADDLE', [
    '타추치',
    '샤크치',
    '안코치',
    '오토토치',
  ]),
  ...createAdultEntries('TEEN_WATER_FLOAT', [
    '쿠라라치',
    '멘다코치',
    '아메후라치',
    '구소쿠치',
  ]),

  // 하늘 16성체 (1->2->3->4단계)
  ...createAdultEntries('TEEN_SKY_FLAP', [
    '호르호치',
    '몽가치',
    '이글치',
    '뱃치',
  ]),
  ...createAdultEntries('TEEN_SKY_CHIRP', [
    '피코치',
    '바타치',
    '쿠치파치',
    '키위치',
  ]),
  ...createAdultEntries('TEEN_SKY_BUMBLE', [
    '파필로치',
    '카부토치',
    '텐로치',
    '하치치',
  ]),
  ...createAdultEntries('TEEN_SKY_ROCKY', [
    '젬치',
    '오로타치',
    '이시코로치',
    '마그마치',
  ]),

  // IR 1:1 합성 시크릿 4종 (`s<캐릭명>.png`)
  SECRET_FOREST_SPECIAL: {
    id: 'SECRET_FOREST_SPECIAL',
    name: '타츠치',
    stage: 'ADULT',
    adultTier: 5,
    stageLabel: '숲 IR 합성 시크릿',
    biome: 'forest',
    isSecretVariant: true,
    hint: '광장 IR 1:1 통신에서 숲 성체끼리 합성하면 출현합니다.',
    desc: '숲 성체들의 공명으로 탄생한 시크릿 캐릭터(타츠치)입니다.',
  },
  SECRET_LAND_SPECIAL: {
    id: 'SECRET_LAND_SPECIAL',
    name: '초드라코치',
    stage: 'ADULT',
    adultTier: 5,
    stageLabel: '땅 IR 합성 시크릿',
    biome: 'land',
    isSecretVariant: true,
    hint: '광장 IR 1:1 통신에서 땅 성체끼리 합성하면 출현합니다.',
    desc: '땅 성체들의 공명으로 탄생한 시크릿 캐릭터(초드라코치)입니다.',
  },
  SECRET_SKY_SPECIAL: {
    id: 'SECRET_SKY_SPECIAL',
    name: '야야콘치',
    stage: 'ADULT',
    adultTier: 5,
    stageLabel: '하늘 IR 합성 시크릿',
    biome: 'sky',
    isSecretVariant: true,
    hint: '광장 IR 1:1 통신에서 하늘 성체끼리 합성하면 출현합니다.',
    desc: '하늘 성체들의 공명으로 탄생한 시크릿 캐릭터(야야콘치)입니다.',
  },
  SECRET_WATER_SPECIAL: {
    id: 'SECRET_WATER_SPECIAL',
    name: '머마린치',
    stage: 'ADULT',
    adultTier: 5,
    stageLabel: '바다 IR 합성 시크릿',
    biome: 'water',
    isSecretVariant: true,
    hint: '광장 IR 1:1 통신에서 바다 성체끼리 합성하면 출현합니다.',
    desc: '바다 성체들의 공명으로 탄생한 시크릿 캐릭터(머마린치)입니다.',
  },
};

export const SECRET_BY_BIOME = {
  forest: 'SECRET_FOREST_SPECIAL',
  land: 'SECRET_LAND_SPECIAL',
  water: 'SECRET_WATER_SPECIAL',
  sky: 'SECRET_SKY_SPECIAL',
};

// IR 1:1 합성 시 두 성체의 필드가 일치하면 시크릿 ID 반환
export const resolveIrFusionSecret = (mySpeciesId, partnerSpeciesId) => {
  const mySpec = SPECIES[mySpeciesId];
  const partnerSpec = SPECIES[partnerSpeciesId];
  if (!mySpec || !partnerSpec) return null;
  if (mySpec.stage !== 'ADULT' || partnerSpec.stage !== 'ADULT') return null;
  if (mySpec.isSecretVariant || partnerSpec.isSecretVariant) return null;
  if (mySpec.biome !== partnerSpec.biome) return null;
  return SECRET_BY_BIOME[mySpec.biome] || null;
};

// 10개 이상 모인 특수 쉘 확인 (베이비마루치 키드 진화용)
export const findCompletedShellBiome = (shells = {}) => {
  const order = ['forest', 'land', 'water', 'sky'];
  for (const key of order) {
    if ((Number(shells?.[key]) || 0) >= SHELL_TARGET_COUNT) {
      return key;
    }
  }
  return null;
};

// 4종 쉘 모두 각각 7개 이상 달성 여부 확인 (비비마루치 영 직행용)
export const hasAllFourShellsAtLeast = (shells = {}, targetCount = BB_SHELL_EACH_TARGET_COUNT) => {
  const order = ['forest', 'land', 'water', 'sky'];
  return order.every((key) => (Number(shells?.[key]) || 0) >= targetCount);
};

// 식단 성취 조건 판별: 먹은 식단(dietCounts) 중 1회 이상 달성한 최다 식단 반환
export const getAchievedDominantDiet = (dietCounts = {}) => {
  let bestDiet = null;
  let bestCount = 0;

  for (const diet of DIET_TYPES) {
    const cnt = Number(dietCounts?.[diet]) || 0;
    if (cnt > bestCount) {
      bestCount = cnt;
      bestDiet = diet;
    }
  }
  return bestCount > 0 ? bestDiet : null;
};

export const pickDominantBiome = (careStats = {}) => {
  const entries = [
    { key: 'land', val: careStats.land || 1 },
    { key: 'forest', val: careStats.forest || 1 },
    { key: 'water', val: careStats.water || 1 },
    { key: 'sky', val: careStats.sky || 1 },
  ];
  entries.sort((a, b) => b.val - a.val);
  return entries[0].key;
};

// 키드 단계 상위 2가지 식단 조합 판별 (방치 또는 3종 골고루 섭취 시 불규칙 영)
export const resolveKidTeenByTopTwoDiet = (kidBiome, dietCounts = {}) => {
  const biome = FIELD_DIET_GROUPS[kidBiome] ? kidBiome : 'land';
  const groups = FIELD_DIET_GROUPS[biome];
  const candidateDiets = [...new Set(groups.flatMap((g) => g.pair))];

  const ranked = candidateDiets
    .map((diet) => ({ diet, count: Number(dietCounts?.[diet]) || 0 }))
    .sort((a, b) => b.count - a.count);

  const positiveCount = ranked.filter((item) => item.count > 0).length;

  // 0회 섭취(방치) 또는 3종 모두 섭취(골고루 불규칙) -> 4번째 불규칙 영 진화
  if (positiveCount === 0 || positiveCount >= 3) {
    return IRREGULAR_TEEN_BY_BIOME[biome];
  }

  const topTwoSet = new Set([ranked[0].diet, ranked[1].diet]);
  const matched = groups.find(
    (g) => topTwoSet.has(g.pair[0]) && topTwoSet.has(g.pair[1])
  );

  return matched ? matched.teenId : IRREGULAR_TEEN_BY_BIOME[biome];
};

export const resolveDominantDietForKid = (kidBiome, dietCounts = {}) => {
  const teenId = resolveKidTeenByTopTwoDiet(kidBiome, dietCounts);
  return SPECIES_BASE[teenId]?.dietComboLabel || '';
};

const REQUIRED_DEX_BIOMES = ['land', 'forest', 'water', 'sky'];

export const hasVisitedAllFourDexBiomes = (visitedBiomes = []) => {
  const visitedSet = new Set(Array.isArray(visitedBiomes) ? visitedBiomes : []);
  return REQUIRED_DEX_BIOMES.every((biome) => visitedSet.has(biome));
};

export const isIrregularYoung = (speciesId = '') =>
  speciesId.endsWith('_SPROUT') ||
  speciesId === 'TEEN_WATER_FLOAT' ||
  speciesId === 'TEEN_SKY_ROCKY';

// 단계별 기본 진화 소요 시간 (초)
export const BASE_STAGE_DURATION_SEC = {
  EGG: 600,       // 알 -> 베이비/비비마루치 (테스트 여유 확보용 10분)
  BABY: 600,      // 베이비/비비마루치 -> 키드/영 (10분)
  KID: 1800,      // 키드 -> 영 (30분)
  TEEN: 3600,     // 영 -> 성체 1단계 (1시간)
  ADULT_1: 3600,  // 성체 1단계 -> 2단계 (1시간)
  ADULT_2: 3600,  // 성체 2단계 -> 3단계 (1시간)
  ADULT_3: 3600,  // 성체 3단계 -> 4단계 (1시간)
};

// 현재 단계에서 진화까지 남은 시간(초) 계산
export const getRemainingEvoSeconds = (pet = {}) => {
  const spec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const stageAge = pet.stageAgeSeconds ?? pet.ageSeconds ?? 0;
  const reduction = pet.evoTimeReduction || 0;

  if (spec.stage === 'EGG') {
    return Math.max(0, BASE_STAGE_DURATION_SEC.EGG - stageAge);
  }
  if (spec.stage === 'BABY') {
    if (pet.speciesId === 'BB_MARUTCHI') {
      return Math.max(0, BASE_STAGE_DURATION_SEC.BABY - (stageAge + reduction));
    }
    return Math.max(0, BASE_STAGE_DURATION_SEC.BABY - stageAge);
  }
  if (spec.stage === 'KID') {
    return Math.max(0, BASE_STAGE_DURATION_SEC.KID - (stageAge + reduction));
  }
  if (spec.stage === 'TEEN') {
    return Math.max(0, BASE_STAGE_DURATION_SEC.TEEN - (stageAge + reduction));
  }
  if (spec.stage === 'ADULT' && spec.nextAdultId) {
    const base = BASE_STAGE_DURATION_SEC[`ADULT_${spec.adultTier}`] || 3600;
    return Math.max(0, base - (stageAge + reduction));
  }
  return 0;
};

export const checkEvolutionStatus = (pet) => {
  const spec = SPECIES[pet.speciesId] || SPECIES.EGG;
  const remain = getRemainingEvoSeconds(pet);

  if (spec.stage === 'EGG') {
    return { ready: remain <= 0, reason: '' };
  }

  if (spec.stage === 'BABY') {
    // 비비마루치: 4종 쉘 각각 7개 이상 + 식단 성취 조건 달성 시 키드 건너뛰고 영(TEEN) 직행
    if (pet.speciesId === 'BB_MARUTCHI') {
      const hasFourShells = hasAllFourShellsAtLeast(pet.shells, BB_SHELL_EACH_TARGET_COUNT);
      const achievedDiet = getAchievedDominantDiet(pet.dietCounts);

      if (remain <= 0 && hasFourShells && achievedDiet) {
        return { ready: true, reason: '' };
      }
      if (remain <= 0 && (!hasFourShells || !achievedDiet)) {
        return {
          ready: false,
          reason: !hasFourShells
            ? `4종 쉘을 각각 ${BB_SHELL_EACH_TARGET_COUNT}개 이상 모아야 영(TEEN)으로 진화합니다!`
            : '식단을 1회 이상 먹이면 해당 식단에 맞는 영(TEEN)으로 진화합니다!',
        };
      }
      return { ready: false, reason: '' };
    }

    // 기본 베이비마루치: 특수 쉘 1종 10개 달성 시 해당 필드 키드로 진화
    const completedBiome = findCompletedShellBiome(pet.shells);
    if (remain <= 0 && completedBiome) {
      return { ready: true, reason: '' };
    }
    if (remain <= 0 && !completedBiome) {
      return {
        ready: false,
        reason: '특수 쉘(나뭇가지·조약돌·물방울·무지개) 1종을 10개 모아야 키드로 진화합니다!',
      };
    }
    return { ready: false, reason: '' };
  }

  if (spec.stage === 'KID' || spec.stage === 'TEEN') {
    return { ready: remain <= 0, reason: '' };
  }

  // 성체 1~3단계는 4단계까지 순차 진화 가능
  if (spec.stage === 'ADULT' && spec.nextAdultId) {
    return { ready: remain <= 0, reason: '' };
  }

  return { ready: false, reason: '' };
};

export const evolveCrossRandom = (currentStage, careStats = {}, pet = {}) => {
  const spec = SPECIES[pet.speciesId] || SPECIES.EGG;

  // 1. 알 -> 베이비마루치 vs 비비마루치 (쓰다듬기 3회 이상 또는 진화도감 4개 필드 탭 모두 방문)
  if (currentStage === 'EGG') {
    const hasEggStroke = (pet.eggTouches || 0) >= 3;
    const hasAllDexBiomes = hasVisitedAllFourDexBiomes(pet.dexVisitedBiomes);
    return hasEggStroke || hasAllDexBiomes ? 'BB_MARUTCHI' : 'BABY_MARUTCHI';
  }

  // 2. 베이비 -> 비비마루치는 4종 쉘 각 7개 이상 + 식단으로 영(TEEN) 직행 / 베이비마루치는 쉘 1종 10개 필드 키드 진화
  if (currentStage === 'BABY') {
    if (pet.speciesId === 'BB_MARUTCHI') {
      const achievedDiet = getAchievedDominantDiet(pet.dietCounts) || 'MEAT';
      return DIET_TO_TEEN_MAP[achievedDiet] || 'TEEN_LAND_ROAR';
    }

    const completedBiome = findCompletedShellBiome(pet.shells) || pickDominantBiome(careStats);
    return SHELL_ITEMS[completedBiome]?.targetKid || 'KID_LAND';
  }

  // 3. 키드 -> 필드별 상위 2가지 식단 조합 기반 영(TEEN), 방치/골고루 섭취 시 불규칙 영
  if (currentStage === 'KID') {
    const kidBiome = spec.biome || pickDominantBiome(careStats);
    return resolveKidTeenByTopTwoDiet(kidBiome, pet.dietCounts || {});
  }

  // 4. 영 -> 해당 계통 성체 1단계 진입
  if (currentStage === 'TEEN') {
    const linePool = ADULT_LINE_POOLS[pet.speciesId];
    if (linePool && linePool.length > 0) {
      return linePool[0];
    }
    return 'ADULT_LAND_MAMETCHI';
  }

  // 5. 성체 1단계 -> 2단계 -> 3단계 -> 4단계 순차 진화
  if (currentStage === 'ADULT' && spec.nextAdultId) {
    return spec.nextAdultId;
  }

  return pet.speciesId || 'ADULT_LAND_MAMETCHI';
};

export const reincarnateAdult = (currentSpeciesId) => {
  const tier1Adults = Object.values(ADULT_LINE_POOLS)
    .map((pool) => pool[0])
    .filter((id) => id !== currentSpeciesId);
  return tier1Adults[Math.floor(Math.random() * tier1Adults.length)] || 'ADULT_LAND_MIMITCHI';
};
