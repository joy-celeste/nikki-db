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
        {Object.values(results).map((result) => {
          const key = `${result.name}-${result.iconId}`;
          return (
            <li key={key}>
              <div className="item" key={result.name}>
                <button
                  type="button"
                  key={`${key}_result_container`}
                  onClick={() => (result.contents.length === 1
                    ? dispatch(loadItem(result.contents[0]))
                    : dispatch(loadMultipleItems(result.contents)))}
                >
                  <Icon key={`${key}_icon`} clothesId={result.iconId} />
                  <div key={`${key}_text`} className="text">{result.name}</div>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default Results;
