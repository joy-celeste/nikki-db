import subtypesJSON from '../data/subtypes_names_to_number.json';
import underwearDataJSON from '../data/underwear_data.json';
import SubtypesNumberToNamesJSON from '../data/subtypes_number_to_names.json';
import refToSearchResult from '../data/ref_to_search_result.json';
import SearchData from 'models/SearchData';

export const BODY_ITEM_ID = 1;
export const DEFAULT_MAX_RESULTS_SEARCH = 50;
export const DEFAULT_BOOST_FACTOR = 3;
export const SUITS_BOOST_TERM = `isSuit:true^${DEFAULT_BOOST_FACTOR}`;
export const DEFAULT_SEARCH_VALUE = '';

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
export const SUBTYPES = Object.freeze(subtypesJSON);
export const SUBTYPES_LIST = Object.values(SUBTYPES);
export const DEFAULT_BODY = new Set([BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG, BODY.HEAD, BODY.TORSO]);
export const DEFAULT_AMPUTATIONS_LIST = [BODY.TORSO, BODY.BREAST, BODY.BRA, BODY.PANTY, BODY.ARM, BODY.LEG] as const;
export const SUBTYPES_MAP: Record<number, string> = Object.freeze(SubtypesNumberToNamesJSON);
export const REF_TO_SEARCH_DATA: Record<string, SearchData> = JSON.parse(JSON.stringify(refToSearchResult));

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
  { value: 'relevance', label: 'relevancy', color: '#00B8D9' },
  { value: 'id', label: 'ID', color: '#00B8D9' },
  { value: 'name', label: 'name', color: '#0052CC' },
];

export const categoryOptions = [
  { value: '1', label: 'Hair', color: '#00B8D9' },
  { value: '2', label: 'Dress', color: '#00B8D9' },
  { value: '3', label: 'Coat', color: '#00B8D9' },
  { value: '4', label: 'Top', color: '#00B8D9' },
  { value: '5', label: 'Bottom', color: '#00B8D9' },
  { value: '6', label: 'Leglet', color: '#00B8D9' },
  { value: '7', label: 'Hosiery', color: '#00B8D9' },
  { value: '8', label: 'Shoes', color: '#00B8D9' },
  { value: '10', label: 'Hair Ornament', color: '#00B8D9' },
  { value: '20', label: 'Veil', color: '#00B8D9' },
  { value: '28', label: 'Hairpin', color: '#00B8D9' },
  { value: '29', label: 'Ear', color: '#00B8D9' },
  { value: '11', label: 'Earrings', color: '#00B8D9' },
  { value: '12', label: 'Scarf', color: '#00B8D9' },
  { value: '13', label: 'Necklace', color: '#00B8D9' },
  { value: '14', label: 'Right Hand Ornament', color: '#00B8D9' },
  { value: '15', label: 'Left Hand Ornament', color: '#00B8D9' },
  { value: '16', label: 'Gloves', color: '#00B8D9' },
  { value: '17', label: 'Right Hand Holding', color: '#00B8D9' },
  { value: '18', label: 'Left Hand Holding', color: '#00B8D9' },
  { value: '33', label: 'Both Hand Holding', color: '#00B8D9' },
  { value: '19', label: 'Waist', color: '#00B8D9' },
  { value: '21', label: 'Face', color: '#00B8D9' },
  { value: '22', label: 'Brooch', color: '#00B8D9' },
  { value: '23', label: 'Tattoo', color: '#00B8D9' },
  { value: '24', label: 'Wing', color: '#00B8D9' },
  { value: '25', label: 'Tail', color: '#00B8D9' },
  { value: '26', label: 'Foreground', color: '#00B8D9' },
  { value: '27', label: 'Background', color: '#00B8D9' },
  { value: '30', label: 'Hair Ornament', color: '#00B8D9' },
  { value: '31', label: 'Ground', color: '#00B8D9' },
  { value: '32', label: 'Skin', color: '#00B8D9' },
  { value: '9', label: 'Makeup', color: '#00B8D9' },
  { value: '34', label: 'Spirit', color: '#00B8D9' },
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
