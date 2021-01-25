import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { SearchResult } from '../modules/search';
import { ItemId, loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';
import { updateDownloadName } from '../modules/downloader';

export const Results = (): JSX.Element => {
  const results: SearchResult[] = useSelector((state: RootState) => state.search.results);
  const hiddenList: Set<ItemId> = useSelector((state: RootState) => state.editor.hiddenItems);
  const hideCategories = useSelector((state: RootState) => state.search.hideCategories);

  const [result, setResult] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateDownloadName(result));
  }, [result, hiddenList, dispatch]);

  return results ? (
    <div className={hideCategories ? 'items hideCategories' : 'items'}>
      <ul>
        {Object.values(results).map((result) => {
          const key = `${result.displayName}`;
          return (
            <li key={key}>
              <div className="item" key={result.displayName}>
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
  ) : null;
};

export default Results;
