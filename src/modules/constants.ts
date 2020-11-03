import { AmputationParts, ItemId } from './data';

export const BODY_ITEM_ID = 1;

export const ACTION_CONSTANTS = {
  DATA_ADD_ITEMS: 'data/ADD_ITEMS',
  CHARACTER_ADD_TO_HISTORY: 'character/ADD_TO_HISTORY',
  CHARACTER_REMOVE_FROM_HISTORY: 'character/REMOVE_FROM_HISTORY',
  SEARCH_UPDATE_RESULTS: 'search/UPDATE_RESULTS',
};

export const API_CONSTANTS = {
  CLOTHES: 'clothes',
  SUITS: 'suits',
};

export const SEARCH_RESULT_TYPES = {
  ITEM: 'Item',
  SUIT: 'Suit',
}

export const UNDERWEAR: Record<number, Record<string, number>> = {
  1: { bra: 4, panty: 5 },
  2: { bra: 15, panty: 16 },
  3: { bra: 17, panty: 18 },
  4: { bra: 19, panty: 20 },
  5: { bra: 21, panty: 22 },
};

// random value between 1-5 inc
// const randomUnderwear = UNDERWEAR[Math.floor(Math.random() * (5) + 1)]
const randomUnderwear = UNDERWEAR[1];

export const BODY = {
  ARM: 9,
  BODY: 1,
  TORSO: 12,
  BRA: randomUnderwear.bra,
  BRASKIN: 13,
  BREAST: 2,
  HEAD: 11,
  LEG: 10,
  PANTY: randomUnderwear.panty,
  PANTY_SKIN: 14,
  VEST: 3,
  HAIR_TOP: 6,
  HAIR_BOTTOM: 7,
  TORSO_HEAD: 8,
};

export const DEFAULT_BODY = new Set([BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG, BODY.HEAD, BODY.TORSO]);
export const DEFAULT_CLOTHES = { 1: 10001 };

export const DEFAULT_AMPUTATIONS_LIST = [BODY.TORSO, BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG] as const;
export const DEFAULT_AMPUTATIONS: Record<AmputationParts, ItemId[]> = {};
DEFAULT_AMPUTATIONS_LIST.forEach((bodyPart) => {
  DEFAULT_AMPUTATIONS[bodyPart] = [];
});

export const SUBTYPES = {
  ACCESSORY: 8,
  ACCESSORY_COUNT: 8,
  ACCESSORY_END: 17,
  ACCESSORY_START: 10,
  BOTTOM: 5,
  BRACELET: 13,
  COAT: 3,
  COUNT: 10,
  DRESS: 2,
  EARRING: 11,
  HAIR: 1,
  HANDHELD: 14,
  HEADWEAR: 10,
  MAKEUP: 9,
  MIRACLE_SOUL: 88,
  NECKLACE: 12,
  SHOES: 7,
  SKIN: 17,
  SOCKS: 6,
  SPECIAL: 16,
  TOP: 4,
  WAIST_DECO: 15,
};

export const SUBTYPES_LIST = Object.values(SUBTYPES);

export const DEPTHTYPES = {
  BADGE: 33,
  BODY: 59,
  BOOTS: 17,
  BOTTOM: 11,
  BOTTOM_EFFECT: 38,
  BOTTOM_EFFECT_SPEC: 55,
  BOTTOM_HIGH_WAIST: 12,
  BOTTOM_IN_BOOTS: 13,
  BOTTOM_SPEC: 57,
  BRACELET1: 25,
  BRACELET1_UNDER_CLOTHES: 39,
  BRACELET2: 26,
  BRACELET2_UNDER_CLOTHES: 40,
  COAT: 6,
  COAT_AC: 7,
  COAT_AC_SPEC: 52,
  COAT_SPEC: 48,
  COMPOSITE_DRESS: 62,
  COMPOSITE_COAT: 63,
  COUNT: 68,
  DRESS: 3,
  DRESS_AC: 4,
  DRESS_AC_SPEC: 54,
  DRESS_SPEC: 41,
  DRESS_WITH_HAT: 56,
  EAR: 44,
  EARRING: 21,
  FACE_COVER: 32,
  FLOATING_BALL: 61,
  FOOT_EFFECT: 51,
  GLOVES: 27,
  GLOVES_AOVE_COAT: 53,
  GLOVES_SPEC: 45,
  GLOVES_SPEC2: 46,
  GLOVES_SPEC3: 67,
  GLOVES_SPEC4: 68,
  HAIR: 1,
  HAIR_COVER: 2,
  HAIR_WEAR: 43,
  HANDHELD1: 28,
  HANDHELD2: 29,
  HANDS_PROPS: 58,
  HEAD_COVER: 31,
  HEAD_HAT: 20,
  HEADWEAR: 19,
  HOODED_COAT: 65,
  JUMPSUIT: 5,
  LEGLET: 14,
  MAKEUP: 18,
  NECKLACE: 23,
  NECKLACE_UNDER_CLOTHES: 24,
  SCARF: 22,
  SHOES: 16,
  SOCKS: 15,
  SPECIAL_COAT: 64,
  STRING: 49,
  TAIL: 36,
  TAIL2: 47,
  TATTOO: 34,
  TATTOO_SPEC: 50,
  TOP: 8,
  TOP_AC: 9,
  TOP_EFFECT: 37,
  TOP_WITH_HAT: 10,
  UMBRELLA: 66,
  VOICE: 60,
  WAIST_DECO: 30,
  WING: 35,
  WING_SPEC: 42,
};

export const BODY_PARTS_DEPTHS = {
  sub_type: null as number,
  depth: {
    1: 10000,
    2: 10020,
    3: 24000,
    4: 10040,
    5: 10030,
    8: 10000,
    9: 10000,
    10: 10000,
    11: 10000,
    12: 10000,
    13: 10400,
    14: 10400,
    15: 10040,
    16: 10030,
    17: 10040,
    18: 10030,
    19: 10040,
    20: 10030,
    21: 10040,
    22: 10030,
  },
};

export const BODY_ITEM_DATA = {
  id: 1,
  position: {
    1: { posx: -22.5, posy: -29.5 },
    2: { posy: 239.5, posx: -11.5 },
    3: { posy: 128.5, posx: -21 },
    4: { posy: 253.5, posx: -11.5 },
    5: { posy: 56, posx: -9.5 },
    8: { posx: -24, posy: 260 },
    9: { posx: -22.5, posy: 146 },
    10: { posx: -9.5, posy: -204.5 },
    11: { posx: -21.5, posy: 417.5 },
    12: { posy: 205.5, posx: -24 },
    13: { posx: -11.5, posy: 253.5 },
    14: { posy: 56, posx: -9.5 },
    15: { posy: 257.5, posx: -18, pot_scale: 1 },
    16: { pot_scale: 1, posx: -9.5, posy: 62 },
    17: { posx: -23, pot_scale: 1, posy: 254 },
    18: { pot_scale: 1, posx: -7, posy: 73.5 },
    19: { posx: -26, posy: 238.5, pot_scale: 1 },
    20: { pot_scale: 1, posx: -11, posy: 66.5 },
    21: { pot_scale: 1, posy: 258, posx: -12.5 },
    22: { posx: -7.5, posy: 62, pot_scale: 1 },
    23: { posx: -18, pot_scale: 1, posy: 257.5 },
    24: { posx: -9.5, posy: 62, pot_scale: 1 },
    25: { posy: 254, posx: -23, pot_scale: 1 },
    26: { pot_scale: 1, posx: -7, posy: 73.5 },
    27: { posy: 238.5, posx: -26, pot_scale: 1 },
    28: { posy: 66.5, pot_scale: 1, posx: -11 },
    29: { posx: -12.5, posy: 258, pot_scale: 1 },
    30: { pot_scale: 1, posx: -7.5, posy: 62 },
  },
};

export const DEPTHTYPE_TO_SUBTYPES: Record<string, any> = {
  1: {
    sub_type: 1,
    depth: {
      1: 33000,
      2: 3500,
      7: 38000,
      8: 37200,
      9: 3510,
    },
  },
  2: {
    sub_type: 1,
    depth: {
      1: 36000,
      2: 1000,
    },
  },
  3: {
    sub_type: 2,
    depth: {
      1: 24000,
      2: 17000,
      3: 6000,
      9: 10220,
    },
  },
  4: {
    sub_type: 2,
    depth: {
      1: 23500,
      2: 6000,
    },
  },
  5: {
    sub_type: 2,
    depth: {
      1: 13000,
      2: 7000,
    },
  },
  6: {
    sub_type: 3,
    depth: {
      1: 27000,
      2: 19000,
      3: 5000,
    },
  },
  7: {
    sub_type: 3,
    depth: {
      1: 27000,
      2: 5000,
    },
  },
  8: {
    sub_type: 4,
    depth: {
      1: 24000,
      2: 18000,
      3: 6000,
    },
  },
  9: {
    sub_type: 4,
    depth: {
      1: 24000,
      2: 6000,
    },
  },
  10: {
    sub_type: 4,
    depth: {
      1: 34500,
      2: 24000,
      3: 18000,
      4: 3200,
    },
  },
  11: {
    sub_type: 5,
    depth: {
      1: 21000,
      2: 7000,
    },
  },
  12: {
    sub_type: 5,
    depth: {
      1: 24500,
      2: 7000,
    },
  },
  13: {
    sub_type: 5,
    depth: {
      1: 13800,
      2: 13550,
      3: 7000,
    },
  },
  14: {
    sub_type: 6,
    depth: {
      1: 14000,
      2: 13600,
      3: 8500,
      6: 13400,
      7: 21500,
      8: 15500,
    },
  },
  15: {
    sub_type: 7,
    depth: {
      1: 13700,
      2: 13200,
    },
  },
  16: {
    sub_type: 8,
    depth: {
      1: 13750,
      2: 13500,
      3: 9000,
      9: 10220,
    },
  },
  17: {
    sub_type: 8,
    depth: {
      1: 15000,
      2: 13650,
      3: 8000,
    },
  },
  18: {
    sub_type: 9,
    depth: {
      1: 11000,
    },
  },
  19: {
    sub_type: 10,
    depth: {
      1: 36000,
      2: 3000,
      6: 35150,
      7: 890,
      8: 37300,
    },
  },
  20: {
    sub_type: 20,
    depth: {
      1: 34700,
      2: 27500,
      3: 3100,
    },
  },
  21: {
    sub_type: 11,
    depth: {
      1: 34000,
      2: 31000,
      3: 9500,
      4: 3700,
    },
  },
  22: {
    sub_type: 12,
    depth: {
      1: 30000,
      2: 4000,
      3: 2950,
    },
  },
  23: {
    sub_type: 13,
    depth: {
      1: 26000,
      2: 4050,
      7: 27100,
      8: 29010,
    },
  },
  24: {
    sub_type: 13,
    depth: {
      1: 23000,
    },
  },
  25: {
    sub_type: 14,
    depth: {
      1: 25500,
      2: 18000,
    },
  },
  26: {
    sub_type: 15,
    depth: {
      1: 18000,
    },
  },
  27: {
    sub_type: 16,
    depth: {
      1: 22000,
      2: 16000,
      12: 10210,
      13: 10180,
      14: 9890,
    },
  },
  28: {
    sub_type: 17,
    depth: {
      1: 28000,
      2: 2800,
    },
  },
  29: {
    sub_type: 18,
    depth: {
      1: 20000,
      2: 1500,
    },
  },
  30: {
    sub_type: 19,
    depth: {
      1: 25000,
      2: 5500,
      7: 27100,
      8: 20900,
    },
  },
  31: {
    sub_type: 20,
    depth: {
      1: 37000,
      2: 900,
    },
  },
  32: {
    sub_type: 21,
    depth: {
      1: 35000,
      2: 32000,
      3: 29400,
      4: 3800,
      7: 37300,
    },
  },
  33: {
    sub_type: 22,
    depth: {
      1: 29000,
      2: 3850,
      3: 870,
      6: 27000,
      7: 5100,
    },
  },
  34: {
    sub_type: 23,
    depth: {
      1: 12000,
    },
  },
  35: {
    sub_type: 24,
    depth: {
      1: 2500,
      6: 3600,
    },
  },
  36: {
    sub_type: 25,
    depth: {
      1: 2000,
    },
  },
  37: {
    sub_type: 26,
    depth: {
      1: 39000,
      2: 810,
      6: 39010,
      7: 39010,
      8: 39010,
      11: 39000,
      12: 39000,
    },
  },
  38: {
    sub_type: 27,
    depth: {
      1: 800,
      2: 790,
      6: 37450,
      11: 800,
      12: 800,
    },
  },
  39: {
    sub_type: 14,
    depth: {
      1: 22500,
      2: 18800,
    },
  },
  40: {
    sub_type: 15,
    depth: {
      1: 16500,
    },
  },
  41: {
    sub_type: 2,
    depth: {
      1: 36600,
      2: 24000,
      3: 18000,
      4: 6000,
      5: 850,
      8: 27150,
      9: 10220,
      12: 10200,
      13: 10170,
      14: 9900,
      21: 24000,
      22: 24000,
    },
  },
  42: {
    sub_type: 24,
    depth: {
      1: 38000,
      2: 850,
      22: 860,
    },
  },
  43: {
    sub_type: 28,
    depth: {
      1: 35250,
      2: 3300,
      7: 23200,
      8: 3650,
    },
  },
  44: {
    sub_type: 29,
    depth: {
      1: 35750,
      2: 3050,
      3: 2990,
    },
  },
  45: {
    sub_type: 16,
    depth: {
      1: 28500,
      2: 16000,
      12: 10210,
      13: 10180,
      14: 9890,
    },
  },
  46: {
    sub_type: 16,
    depth: {
      1: 25800,
      2: 18800,
      4: 2900,
      7: 37400,
      12: 10210,
      13: 10180,
      14: 9890,
    },
  },
  47: {
    sub_type: 25,
    depth: {
      1: 3750,
      7: 29500,
    },
  },
  48: {
    sub_type: 3,
    depth: {
      1: 36700,
      2: 27000,
      3: 19000,
      4: 5000,
      5: 840,
      12: 10190,
      13: 10160,
      14: 9880,
    },
  },
  49: {
    sub_type: 30,
    depth: {
      1: 38500,
      2: 12200,
      3: 800,
    },
  },
  50: {
    sub_type: 32,
    depth: {
      1: 10310,
      2: 10300,
    },
  },
  51: {
    sub_type: 31,
    depth: {
      1: 37500,
      2: 820,
      3: 800,
      4: 790,
      7: 6200,
      11: 37500,
      12: 37500,
    },
  },
  52: {
    sub_type: 3,
    depth: {
      1: 36700,
      2: 27000,
      3: 5000,
      4: 840,
    },
  },
  53: {
    sub_type: 16,
    depth: {
      1: 27250,
      2: 19500,
    },
  },
  54: {
    sub_type: 2,
    depth: {
      1: 36600,
      2: 23500,
      3: 6000,
    },
  },
  55: {
    sub_type: 27,
    depth: {
      1: 35650,
      2: 800,
      7: 7010,
      8: 860,
    },
  },
  56: {
    sub_type: 2,
    depth: {
      1: 36500,
      2: 24000,
      3: 17000,
      4: 3200,
    },
  },
  57: {
    sub_type: 5,
    depth: {
      1: 21000,
      2: 16750,
      3: 7000,
    },
  },
  58: {
    sub_type: 33,
    depth: {
      1: 28000,
      2: 20000,
      3: 1500,
    },
  },
  59: {
    sub_type: 0,
    depth: {
      1: 10000,
      2: 10020,
      3: 24000,
      4: 10040,
      5: 10030,
      8: 10000,
      9: 10000,
      10: 10000,
      11: 10000,
      12: 10000,
      13: 10400,
      14: 10400,
    },
  },
  60: {
    sub_type: 0,
    depth: {
      1: 99990,
    },
  },
  61: {
    sub_type: 34,
    depth: {
      1: 60000,
    },
  },
  62: {
    sub_type: 2,
    depth: {
      1: 24050,
      2: 24000,
      3: 18000,
      4: 6000,
    },
  },
  63: {
    sub_type: 3,
    depth: {
      1: 27050,
      2: 27000,
      3: 19000,
      4: 5000,
    },
  },
  64: {
    sub_type: 4,
    depth: {
      1: 36600,
      2: 24000,
      3: 18000,
      4: 6000,
      5: 840,
      9: 10220,
      13: 10180,
      14: 9890,
    },
  },
  65: {
    sub_type: 3,
    depth: {
      1: 36600,
      2: 27000,
      3: 19000,
      4: 2900,
    },
  },
  66: {
    sub_type: 33,
    depth: {
      1: 32100,
      2: 830,
      7: 36300,
    },
  },
  67: {
    sub_type: 16,
    depth: {
      1: 37000,
      2: 19500,
      4: 2900,
      12: 10210,
      13: 10180,
      14: 9890,
    },
  },
  68: {
    sub_type: 16,
    depth: {
      1: 22000,
      2: 16000,
      12: 10210,
      13: 10180,
      14: 9890,
    },
  },
};

export {};
