import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { wearItem } from '../modules/character';
import { toggleItemVisibility } from '../modules/editor';
import Icon from './Icon';
import './Equipped.css';

export const Equipped = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const clothes = useSelector((state: RootState) => state.character.history[state.character.step].clothes);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);
  const dispatch = useDispatch();

  return (
    <div>
      {Object.values(clothes).map((clothesId) => (
        <div className="equipped-wrapper" key={`${clothesId}_wrapper`}>
          <div className="equipped-icon" key={`${clothesId}_icon`} onClick={() => dispatch(toggleItemVisibility(clothesId))}>
            <Icon clothesId={clothesId} disabled={hiddenList.has(clothesId)} />
          </div>
          <div className="equipped-text" key={`${clothesId}_text`}>{itemsData[clothesId]?.name}</div>
          <div className="equipped-trash" key={`${clothesId}_trash`} onClick={() => dispatch(wearItem(clothesId))}>🗑️</div>
        </div>
      ))}
    </div>
  );
};

export default Equipped;
