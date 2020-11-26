import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { SearchResult } from '../modules/search';
import { loadItem, loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';

export const Results = (): JSX.Element => {
  const results: SearchResult[] = useSelector((state: RootState) => state.search.results);
  const dispatch = useDispatch();

  return results ? (
    <div>
      <ul>
        {Object.values(results).map((result) => (
          <li><div className="item">
            <div
              key={`${result.name}-${result.iconId}`}
              onClick={() => (result.contents.length === 1
                ? dispatch(loadItem(result.contents[0]))
                : dispatch(loadMultipleItems(result.contents)))}
            >
              <Icon clothesId={result.iconId} />
              <div className="text">{result.name}</div>
            </div>
          </div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Results;
