import React from 'react';
import Icon from './Icon';
import { SearchResult } from '../modules/search';
import { ItemId } from '../modules/data';

export interface SearchResultProps {
  loadItem(itemId: ItemId): void,
  loadMultipleItems(itemIds: ItemId[]): void,
  result: SearchResult,
}

export const Result: React.FC<SearchResultProps> = (props: SearchResultProps) => {
  const { loadItem, loadMultipleItems, result } = props;

  return (
    <button
      key={`${result.name}-${result.iconId}`}
      type="button"
      onClick={() => (result.contents.length === 1
        ? loadItem(result.contents[0])
        : loadMultipleItems(result.contents))}
    >
      <Icon clothesId={result.iconId} />
      {result.name}
    </button>
  );
};

export default Result;
