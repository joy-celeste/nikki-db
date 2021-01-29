import { SubtypeInfo } from './data';
import clothesDataJSON from '../data/clothes_data.json';
import subtypesJSON from '../data/subtypes_names_to_number.json';
import depthTypeToSubtypesJSON from '../data/depth_type_to_subtype.json';
import underwearDataJSON from '../data/underwear_data.json';
import bodyItemPositionDataJSON from '../data/body_item_position_data.json';
import menuDataJSON from '../data/menu_data.json';
import SuitNameToIDJSON from '../data/suit_name_to_suit_id.json';
import SubtypesNumberToNamesJSON from '../data/subtypes_number_to_names.json';
import { MenuItem } from './editor';

export const BODY_ITEM_ID = 1;

export const ACTION_CONSTANTS = {
  DATA_ADD_ITEMS: 'data/ADD_ITEMS',
  DATA_SET_ITEMDATA: 'data/SET_ITEMDATA',
  CHARACTER_ADD_TO_HISTORY: 'character/ADD_TO_HISTORY',
  CHARACTER_REMOVE_FROM_HISTORY: 'character/REMOVE_FROM_HISTORY',
  SEARCH_UPDATE_RESULTS: 'search/UPDATE_RESULTS',
  SEARCH_UPDATE_SEARCH_FILTERS: 'search/UPDATE_SEARCH_FILTERS',
  SEARCH_UPDATE_SEARCH_STRING: 'search/UPDATE_SEARCH_STRING',
  SEARCH_UPDATE_SEARCH_SUBTYPE: 'search/UPDATE_SEARCH_SUBTYPE',
  SEARCH_UPDATE_SUITS_ONLY: 'search/UPDATE_SUITS_ONLY',
  SEARCH_UPDATE_SORT_OPTION: 'search/UPDATE_SORT_OPTION',
  EDITOR_CHANGE_HIDDEN_ITEM_LIST: 'editor/CHANGE_HIDDEN_ITEM_LIST',
  EDITOR_CHANGE_MINIMIZED_MENUS: 'editor/EDITOR_CHANGE_MINIMIZED_MENUS',
  EDITOR_CHANGE_ACTIVE_MENUS: 'editor/EDITOR_CHANGE_ACTIVE_MENUS',
  EDITOR_UPDATE_MENU: 'editor/UPDATE_MENU',
  EDITOR_SET_DOWNLOAD_NAME: 'editor/SET_DOWNLOAD_NAME',
  EDITOR_SET_ALREADY_DOWNLOADED_ITEM: 'editor/SET_ALREADY_DOWNLOADED_ITEM',
};

export const API_CONSTANTS = {
  CLOTHES: 'clothes',
  SUITS: 'suits',
};

export const SEARCH_RESULT_TYPES = {
  ITEM: 'Item',
  SUIT: 'Suit',
};

export const ITEM_SUFFIX = {
  SUIT: ' (Suit)',
  POSED_SUIT: ' (Posed Suit)',
};

export const UNDERWEAR: ReadonlyArray<Record<string, number>> = Object.freeze(underwearDataJSON);
// const randomUnderwear = UNDERWEAR[Math.floor(Math.random() * UNDERWEAR.length)]; // picks random value from UNDERWEAR
const randomUnderwear = UNDERWEAR[0];

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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CLOTHES_DATA: {[key: string]: any} = clothesDataJSON;
export const SUBTYPES = Object.freeze(subtypesJSON);
export const SUBTYPES_LIST = Object.values(SUBTYPES);
export const BODY_ITEM_DATA = Object.freeze(bodyItemPositionDataJSON);
export const DEFAULT_BODY = new Set([BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG, BODY.HEAD, BODY.TORSO]);
export const DEFAULT_AMPUTATIONS_LIST = [BODY.TORSO, BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG] as const;
export const DEPTHTYPE_TO_SUBTYPES: Record<string, SubtypeInfo> = Object.freeze(depthTypeToSubtypesJSON);
export const BODY_PARTS_DEPTHS = Object.freeze(DEPTHTYPE_TO_SUBTYPES[59]); // 59 = body's depthtype
export const DEFAULT_CLOTHES = { [SUBTYPES.HAIR]: 10001 }; // 10001 = Nikki's Pinky
export const MENU_DATA: ReadonlyArray<MenuItem> = Object.freeze(menuDataJSON);
export const SUIT_NAME_TO_ID: Record<string, string | string[]> = Object.freeze(SuitNameToIDJSON);
export const SUBTYPES_MAP: Record<number, string> = Object.freeze(SubtypesNumberToNamesJSON);

export const OPTIONS = {
  RELEVANCE: 'relevance',
  ID: 'id',
  NAME: 'name',
  POSED: 'posed',
  IS_SUIT: 'isSuit',
  TRUE: 'true',
  FALSE: 'false',
};

export const sortOptions = [
  { value: 'relevance', label: 'Relevancy', color: '#00B8D9' },
  { value: 'id', label: 'ID', color: '#00B8D9' },
  { value: 'name', label: 'Name', color: '#0052CC' },
];

export const generalOptions = [
  { value: 'posed', label: 'Posed', type: 'true', color: '#00B8D9' },
  { value: 'isSuit', label: 'Suit', type: 'true', color: '#0052CC' },
  { value: 'posed', label: 'Unposed', type: 'false', color: '#0052CC' },
  { value: 'isSuit', label: 'Items', type: 'false', color: '#5243AA' },
];

export const rarityOptions = [
  { value: '1', label: '❤️', type: 'rare', color: 'grey' },
  { value: '2', label: '❤️❤️', type: 'rare', color: 'brown' },
  { value: '3', label: '❤️❤️❤️', type: 'rare', color: 'pink' },
  { value: '4', label: '❤️❤️❤️❤️', type: 'rare', color: 'orange' },
  { value: '5', label: '❤️❤️❤️❤️❤️', type: 'rare', color: 'orange' },
  { value: '6', label: '❤️❤️❤️❤️❤️❤️', type: 'rare', color: 'orange' },
];

export const genreOptions = [
  { value: 5, label: 'Others', type: 'genre', color: '#0052CC' },
  { value: 6, label: '7 Nations', type: 'genre', color: '#0052CC' },
  { value: 7, label: 'Festivals', type: 'genre', color: '#0052CC' },
  { value: 8, label: 'Troupe', type: 'genre', color: '#0052CC' },
  { value: 9, label: '4 Seasons', type: 'genre', color: '#0052CC' },
  { value: 11, label: 'Apple', type: 'genre', color: '#00B8D9' },
  { value: 12, label: 'Lilith', type: 'genre', color: '#00B8D9' },
  { value: 13, label: 'Cloud', type: 'genre', color: '#00B8D9' },
  { value: 14, label: 'Pigeon', type: 'genre', color: '#00B8D9' },
  { value: 15, label: 'North', type: 'genre', color: '#0052CC' },
  { value: 16, label: 'Wasteland', type: 'genre', color: '#00B8D9' },
  { value: 17, label: 'Ruin', type: 'genre', color: '#00B8D9' },
  { value: 18, label: 'Happiness', type: 'genre', color: '#00B8D9' },
  { value: 10, label: 'Stars', type: 'genre', color: '#00B8D9' },
  { value: 19, label: 'Story Suit', type: 'genre', color: '#00B8D9' },
  { value: 21, label: 'Museum', type: 'genre', color: '#00B8D9' },
  { value: 22, label: 'Ancient Fossil Hall', type: 'genre', color: '#00B8D9' },
  { value: 23, label: 'Constellation Hall', type: 'genre', color: '#00B8D9' },
];

export const specialOptions = [
  { value: 11, label: 'Sports', type: 'spec', color: '#00B8D9' },
  { value: 12, label: 'Pop', type: 'spec', color: '#00B8D9' },
  { value: 13, label: 'Homewear', type: 'spec', color: '#00B8D9' },
  { value: 14, label: 'Chinese Classical', type: 'spec', color: '#00B8D9' },
  { value: 15, label: 'Office', type: 'spec', color: '#00B8D9' },
  { value: 16, label: 'Preppy', type: 'spec', color: '#00B8D9' },
  { value: 17, label: 'Unisex', type: 'spec', color: '#00B8D9' },
  { value: 18, label: 'Fairy', type: 'spec', color: '#00B8D9' },
  { value: 19, label: 'European', type: 'spec', color: '#0052CC' },
  { value: 20, label: 'Denim', type: 'spec', color: '#00B8D9' },
  { value: 21, label: 'Pajama', type: 'spec', color: '#00B8D9' },
  { value: 22, label: 'Dancer', type: 'spec', color: '#00B8D9' },
  { value: 23, label: 'Britain', type: 'spec', color: '#00B8D9' },
  { value: 24, label: 'Rock', type: 'spec', color: '#0052CC' },
  { value: 25, label: 'Dryad', type: 'spec', color: '#00B8D9' },
  { value: 26, label: 'Goddess', type: 'spec', color: '#00B8D9' },
  { value: 27, label: 'Shower', type: 'spec', color: '#00B8D9' },
  { value: 28, label: 'Pet', type: 'spec', color: '#00B8D9' },
  { value: 29, label: 'Rain', type: 'spec', color: '#00B8D9' },
  { value: 30, label: 'Swimsuit', type: 'spec', color: '#00B8D9' },
  { value: 31, label: 'Floral', type: 'spec', color: '#00B8D9' },
  { value: 32, label: 'Sun Care', type: 'spec', color: '#00B8D9' },
  { value: 33, label: 'Apron', type: 'spec', color: '#00B8D9' },
  { value: 34, label: 'Paramedics', type: 'spec', color: '#00B8D9' },
  { value: 35, label: 'Evening Gown', type: 'spec', color: '#00B8D9' },
  { value: 36, label: 'Bunny', type: 'spec', color: '#00B8D9' },
  { value: 37, label: 'Gothic', type: 'spec', color: '#00B8D9' },
  { value: 38, label: 'Lady', type: 'spec', color: '#00B8D9' },
  { value: 39, label: 'Maiden', type: 'spec', color: '#00B8D9' },
  { value: 40, label: 'Winter', type: 'spec', color: '#00B8D9' },
  { value: 41, label: 'Bohemia', type: 'spec', color: '#00B8D9' },
  { value: 42, label: 'Swordsman', type: 'spec', color: '#0052CC' },
  { value: 43, label: 'Modern China', type: 'spec', color: '#00B8D9' },
  { value: 44, label: 'Kimono', type: 'spec', color: '#0052CC' },
  { value: 45, label: 'Lolita', type: 'spec', color: '#00B8D9' },
  { value: 46, label: 'Wedding', type: 'spec', color: '#00B8D9' },
  { value: 47, label: 'Republic of China', type: 'spec', color: '#00B8D9' },
  { value: 48, label: 'Cheongsam', type: 'spec', color: '#0052CC' },
  { value: 49, label: 'Hindu', type: 'spec', color: '#00B8D9' },
  { value: 50, label: 'Traditional', type: 'spec', color: '#0052CC' },
  { value: 51, label: 'Army', type: 'spec', color: '#00B8D9' },
  { value: 52, label: 'Navy', type: 'spec', color: '#0052CC' },
  { value: 53, label: 'Future', type: 'spec', color: '#0052CC' },
  { value: 54, label: 'Harajuku', type: 'spec', color: '#0052CC' },
];
