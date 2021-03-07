import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { ItemId, removeItemFromCloset, ItemsData, removeAllUnwornFromCloset } from '../modules/data';
import { wearItem } from '../modules/character';
import Icon from './Icon';
import { SUBTYPES_MAP } from '../modules/constants';
import BackgroundOptions from './BackgroundOptions';
import { CLOSET, focusMenu } from '../modules/editor';

export const Closet = (): JSX.Element => {
  const [useSubtypeSort, setToggle] = useState(false);
  const itemsData: ItemsData = useSelector((state: RootState) => state.data.itemsData);
  const { clothes } = useSelector((state: RootState) => state.character.history[state.character.step]);
  const currentlyWorn = new Set<ItemId>(Object.values(clothes));
  const dispatch = useDispatch();

  const chronoSort = (a: string, b: string) => itemsData[parseInt(a, 10)].loadedTime - itemsData[parseInt(b, 10)].loadedTime;
  const subtypeSort = (a: string, b: string) => itemsData[parseInt(a, 10)].subType - itemsData[parseInt(b, 10)].subType || chronoSort(a, b);

  return (
    <div className="closet" onClick={() => dispatch(focusMenu(CLOSET))}>
      <div className="row closet-items">
        <ul>
          {(Object.keys(itemsData).sort(useSubtypeSort ? subtypeSort : chronoSort) as Array<string>).map((itemId) => {
            const clothesId = parseInt(itemId, 10);
            const itemName = `${itemsData[clothesId]?.name} (${SUBTYPES_MAP[itemsData[clothesId]?.subType].replace(/_/g, ' ')})`;

            return (
              <li key={`${clothesId}_wrapper`}>
                <div className="closet-item">
                  <div className="closet-icon-container">
                    <button
                      type="button"
                      className="closet-trash"
                      key={`${clothesId}_trash`}
                      onClick={() => dispatch(removeItemFromCloset(clothesId))}
                    >
                      <span role="img" aria-label="trash">🗑️</span>
                    </button>
                    <button type="button" className="closet-info" key={`${clothesId}_info`}>
                      <span role="img" aria-label="info">🔎</span>
                    </button>
                    {currentlyWorn.has(clothesId)
                      ? <span className="closet-equipped" key={`${clothesId}_equipped`} /> : null}
                    <button
                      type="button"
                      className="closet-icon"
                      key={`${clothesId}_icon`}
                      onClick={() => dispatch(wearItem(clothesId))}
                    >
                      <Icon clothesId={clothesId} disabled={!currentlyWorn.has(clothesId)} />
                    </button>
                  </div>
                  <div className="closet-text" key={`${clothesId}_text`}>{itemName}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="row closet-toolbar">
        <div>
          <label className="switch" htmlFor="checkbox">
            <input id="checkbox" type="checkbox" onClick={() => setToggle(!useSubtypeSort)} checked={useSubtypeSort} readOnly />
            <span className="slider round" />
          </label>
          {useSubtypeSort ? ' sort by subtype + chronological order' : 'sort by chronological order'}
          <button type="button" className="closet-all-trash" key="all_trash" onClick={() => dispatch(removeAllUnwornFromCloset())}>
            <span role="img" aria-label="trash">🗑️</span>
          </button>
        </div>
      </div>
      <BackgroundOptions />
    </div>
  );
};

export default Closet;

