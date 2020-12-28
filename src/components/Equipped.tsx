import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { wearItem } from '../modules/character';
import { toggleItemVisibility } from '../modules/editor';
import Icon from './Icon';
import './Equipped.css';
import { SUBTYPES_MAP } from '../modules/constants';

export const Equipped = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const clothes = useSelector((state: RootState) => state.character.history[state.character.step].clothes);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);

  const dispatch = useDispatch();

  return (
    <div>
      {Object.values(clothes).map((clothesId) => (
        <div className="equipped-wrapper" key={`${clothesId}_wrapper`}>
          <button
            type="button"
            className="equipped-icon"
            key={`${clothesId}_icon`}
            onClick={() => dispatch(toggleItemVisibility(clothesId))}
          >
            <Icon clothesId={clothesId} disabled={hiddenList.has(clothesId)} />
          </button>
          <div className="equipped-text" key={`${clothesId}_text`}>
            {itemsData[clothesId]?.name}{` (${SUBTYPES_MAP[itemsData[clothesId]?.subType].replace(/_/g, ' ')})`}
          </div>
          <button
            type="button"
            className="equipped-trash"
            key={`${clothesId}_trash`}
            onClick={() => dispatch(wearItem(clothesId))}
          >🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default Equipped;
