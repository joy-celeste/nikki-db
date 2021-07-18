import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { RootState } from 'redux/reducers/store';
import EmptyResults from './EmptyResults';
import { SearchResult } from 'models/SearchResult';
import { wearItems } from 'use-cases/wearItem';

export const Results = (): JSX.Element => {
  const results: SearchResult[] = useSelector((state: RootState) => state.search.results);
  const dispatch = useDispatch();

  return results?.length > 0 ? (
    <div className="search-results">
      <ul className="item-array">
        {Object.values(results).map((result) => {
          const key = result.key;
          return (
            <li className="item" key={key}>
              <button
                type="button"
                key={`${key}_result_container`}
                onClick={() => dispatch(wearItems(result.contents))}
              >
                <Icon key={`${key}_icon`} clothesId={result.iconId} />
                <div key={`${key}_text`}>{result.displayName}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ) : <EmptyResults />;
};

export default Results;
