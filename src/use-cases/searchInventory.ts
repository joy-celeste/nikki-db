import { generateSimpleSearchString } from '../use-cases/generateSimpleSearchString';
import { ITEM_SUFFIX, OPTIONS, REF_TO_SEARCH_DATA } from '../modules/constants';
import { RootState } from '../reducers/store';
import { SearchResult } from '../models/SearchResult';
import { updateSearchResults } from '../actions/search-actions';

/* istanbul ignore next */ /* branch not passing coverage check for MAX_RESULT? */
export const searchInventory = () =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const searchState = getState().search;
    const { index, filterSet, sortOption, simpleSearchString, useAdvancedSearch, maxResults } = searchState;

    let initialResults: string[];
    if (!useAdvancedSearch) {
      const searchTerm = generateSimpleSearchString(simpleSearchString);
      initialResults = index.searchWithTerm(searchTerm, maxResults);
    } else {
      initialResults = filterSet.search(index);
    }
    initialResults = Array.from(new Set(initialResults));

    let parsedResults: SearchResult[] = initialResults.flatMap((key: string) => {
      const suitData = REF_TO_SEARCH_DATA[key];
      let displayName = suitData?.name;

      if (suitData?.isSuit) {
        if (suitData?.posed) {
          displayName += ITEM_SUFFIX.POSED_SUIT;
        } else {
          displayName += ITEM_SUFFIX.SUIT;
        }
      }

      if (suitData?.variation) {
        return {
          key: `${suitData?.iconId}-${displayName}-${suitData?.variation}`,
          displayName,
          iconId: suitData?.iconId,
          contents: suitData?.contents,
          posed: suitData?.posed,
          variation: suitData?.variation,
          isSuit: suitData?.isSuit,
        };
      }
      return {
        key: `${suitData?.iconId}-${displayName}`,
        displayName,
        iconId: suitData?.iconId,
        contents: suitData?.contents,
      };
    });

    switch (sortOption) {
      case OPTIONS.NAME:
        parsedResults.sort((a, b) => a.displayName?.localeCompare(b.displayName));
        break;
      case OPTIONS.ID:
        parsedResults.sort((a, b) => a.iconId - b.iconId);
        break;
      case OPTIONS.RELEVANCE:
      default:
        break;
    }

    if (maxResults) {
      parsedResults = parsedResults.slice(0, maxResults);
    }
    dispatch(updateSearchResults(parsedResults));
};
