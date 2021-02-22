import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { SearchResult } from '../modules/search';
import { loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';
import { updateDownloadName } from '../modules/downloader';
import EmptyResults from './EmptyResults';

export const Results = (): JSX.Element => {
  const results: SearchResult[] = useSelector((state: RootState) => state.search.results);

  const [result, setResult] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateDownloadName(result));
  }, [result, dispatch]);

  return results?.length > 0 ? (
    <div className="search-results">
      <ul>
        {Object.values(results).map((result) => {
          const key = `${result.key}`;
          return (
            <li key={key}>
              <div className="item" key={result.key}>
                <button
                  type="button"
                  key={`${key}_result_container`}
                  onClick={() => { setResult(result); dispatch(loadMultipleItems(result.contents)); }}
                >
                  <Icon key={`${key}_icon`} clothesId={result.iconId} />
                  <div key={`${key}_text`} className="text">{result.displayName}</div>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : <EmptyResults />;
};

export default Results;
