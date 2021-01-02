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
  EDITOR_CHANGE_HIDDEN_ITEM_LIST: 'editor/CHANGE_HIDDEN_ITEM_LIST',
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

export const SUBTYPES = Object.freeze(subtypesJSON);
export const SUBTYPES_LIST = Object.values(SUBTYPES);
export const BODY_ITEM_DATA = Object.freeze(bodyItemPositionDataJSON);
export const DEFAULT_BODY = new Set([BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG, BODY.HEAD, BODY.TORSO]);
export const DEFAULT_AMPUTATIONS_LIST = [BODY.TORSO, BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG] as const;
export const DEPTHTYPE_TO_SUBTYPES: Record<string, SubtypeInfo> = Object.freeze(depthTypeToSubtypesJSON);
export const BODY_PARTS_DEPTHS = Object.freeze(DEPTHTYPE_TO_SUBTYPES[59]); // 59 = body's depthtype
export const DEFAULT_CLOTHES = { [SUBTYPES.HAIR]: 10001 }; // 10001 = Nikki's Pinky
export const CLOTHES_DATA: {[key: string]: any} = clothesDataJSON;
export const MENU_DATA: ReadonlyArray<MenuItem> = Object.freeze(menuDataJSON);
export const SUIT_NAME_TO_ID: Record<string, string | string[]> = Object.freeze(SuitNameToIDJSON);
export const SUBTYPES_MAP: Record<number, string> = Object.freeze(SubtypesNumberToNamesJSON);
