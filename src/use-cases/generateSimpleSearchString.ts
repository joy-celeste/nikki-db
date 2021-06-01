import { SUITS_BOOST_TERM } from '../modules/constants';

export const generateSimpleSearchString = (simpleSearchString: string): string => {
  const userInput = simpleSearchString
    ? `+name:*_${simpleSearchString.split(' ').map((word: string) => `${word.toLowerCase()}`).join('_')}_*`
    : '';
  return [userInput, SUITS_BOOST_TERM].filter((x) => x).join(' ');
};