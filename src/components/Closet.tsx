import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { wearItem } from '../modules/character';
import { toggleItemVisibility } from '../modules/editor';
import Icon from './Icon';
import './Closet.css';
import { SUBTYPES_MAP } from '../modules/constants';
import { ItemsData } from '../modules/data';

export const Closet = (): JSX.Element => {
  const itemsData: ItemsData = useSelector((state: RootState) => state.data.itemsData);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);

  const dispatch = useDispatch();
  
  return (
    <div className="closet">
      <ul>
        {(Object.keys(itemsData).sort((a, b) => itemsData[parseInt(a, 10)].subType - itemsData[parseInt(b, 10)].subType) as Array<string>).map((itemId) => {
          const clothesId = parseInt(itemId, 10);
          const itemName = `${itemsData[clothesId]?.name} (${SUBTYPES_MAP[itemsData[clothesId]?.subType].replace(/_/g, ' ')})`
          
          return (
          <li key={`${clothesId}_wrapper`}>
            <div className="closet-item">
                <div className="closet-icon-container">
                  <button className="closet-trash" key={`${clothesId}_trash`}
                    onClick={() => dispatch(wearItem(clothesId))}>🗑️</button>
                  <button className="closet-info" key={`${clothesId}_info`}>🔎</button>
                  <button className="closet-icon" key={`${clothesId}_icon`}
                    onClick={() => dispatch(toggleItemVisibility(clothesId))}>
                    <Icon clothesId={clothesId} disabled={hiddenList.has(clothesId)} />
                  </button>
                  <div className="closet-text" key={`${clothesId}_text`}>{itemName}</div>
                </div>
            </div>
          </li>
        )})}
      </ul>
    </div>
  );
};

export default Closet;