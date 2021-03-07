import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { MenuState, setMinimized } from '../modules/editor';
import { MARGIN } from '../pages/App';

const MinimizedMenus = (): JSX.Element => {
	const minimizedMenus: MenuState = useSelector((state: RootState) => state.editor.minimizedMenus);
  const dispatch = useDispatch();

  return (
	<div className="minimizedMenus" style={{bottom: MARGIN, right: MARGIN}}>
		{minimizedMenus.inventory ? (<img src="/assets/btn_searchcloth.png" onClick={() => dispatch(setMinimized({...minimizedMenus, inventory: false}))}/>) : null}
		{minimizedMenus.closet ? (<img src="/assets/btn_goitems.png" onClick={() => dispatch(setMinimized({...minimizedMenus, closet: false}))}/>) : null}
	</div>
  );
};

export default MinimizedMenus;
