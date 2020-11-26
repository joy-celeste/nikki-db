import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { toggleItemVisibility } from '../modules/editor';
import Icon from './Icon';
import './Icon.css';

export const Equipped = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const clothes = useSelector((state: RootState) => state.character.history[state.character.step].clothes);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);
  const dispatch = useDispatch();

  return (
    <div>
      {Object.values(clothes).map((clothesId) => (
        <div className="equipped-wrapper">
          <div className="equipped-icon" onClick={() => dispatch(toggleItemVisibility(clothesId))}>
            <Icon clothesId={clothesId} disabled={hiddenList.has(clothesId)} />
          </div>
          <div className="equipped-text">{itemsData[clothesId]?.name}</div>
          <div className="equipped-trash">Vis</div>
        </div>
      ))}
    </div>
  );
};

export default Equipped;
