import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { wearItem } from 'use-cases/wearItem';
import { createPresentableCloset, PresentableClosetItem } from 'presenters/closet-presenter';
import { RootState } from 'redux/reducers/store';
import { setSubtypeSort } from 'redux/actions/editor-actions';

export const Closet = (): JSX.Element => {
  const useSubtypeSort: boolean = useSelector((state: RootState) => state.editor.useSubtypeSort);
  const closet: PresentableClosetItem[] = useSelector(createPresentableCloset);
  const dispatch = useDispatch();

  const renderItemArray = () => {
    return closet.map((item: PresentableClosetItem) => {
        return (
          <li key={`${item.itemId}_wrapper`}>
            <div className="item">
              <div className="closet-icon-container">
                <button
                  type="button"
                  className="closet-trash"
                  key={`${item.itemId}_trash`}
                  onClick={() => {
                    // dispatch(removeItemFromCloset(item.itemId))}
                  }}
                >
                  <span role="img" aria-label="trash">🗑️</span>
                </button>
                <button type="button" className="closet-info" key={`${item.itemId}_info`}>
                  <span role="img" aria-label="info">🔎</span>
                </button>
                {item.isWorn ? <span className="closet-equipped" key={`${item.itemId}_equipped`} /> : null}
                <button
                  type="button"
                  className="closet-icon"
                  key={`${item.itemId}_icon`}
                  onClick={() => dispatch(wearItem(item.itemId))}
                >
                  <Icon clothesId={item.itemId} disabled={!item.isWorn} />
                </button>
              </div>
              <div key={`${item.itemId}_text`}>{item.displayLabel}</div>
            </div>
          </li>
        );
      })
  };

  return (
    <div className="closet">
      <div className="row closet-items">
      <ul className="item-array">
        {renderItemArray()}
      </ul>
      </div>
      <div className="row closet-toolbar">
        <div>
          <label className="switch" htmlFor="checkbox">
            <input id="checkbox" type="checkbox" onClick={() => {
              document.getElementById('closet').scrollTop = 4000;
              dispatch(setSubtypeSort(!useSubtypeSort))
              document.getElementById('closet').scrollTop = 4000;
            }} checked={useSubtypeSort} />
            <span className="slider round" />
          </label>
          {useSubtypeSort ? ' sort by subtype + chronological order' : 'sort by chronological order'}
          <button type="button" className="closet-all-trash" key="all_trash">
          {/* <button type="button" className="closet-all-trash" key="all_trash" onClick={() => dispatch(removeAllUnwornFromCloset())}> */}
            <span role="img" aria-label="trash">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Closet;

