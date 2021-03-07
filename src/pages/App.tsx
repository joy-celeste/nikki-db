import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';
import { RootState } from '../modules';
import { CLOSET, INVENTORY, maximizeMenu, MenuState, minimizeMenu } from '../modules/editor';

export const MARGIN = 30;

const App = (): JSX.Element => {
  const minimizedMenus: MenuState = useSelector((state: RootState) => state.editor.minimizedMenus);
  const activeMenus: MenuState = useSelector((state: RootState) => state.editor.activeMenus);
  const dispatch = useDispatch();
  
  return (
    <div className="App">
      <div className="figure">
        <Draggable top="50%">
          <Figure />
        </Draggable>
      </div>

      {minimizedMenus.inventory ? null : 
        (<Menu minimized={minimizedMenus.inventory} active={activeMenus.inventory} top={MARGIN} left={MARGIN}>
          {activeMenus.inventory ? <a className="minimize" id="minimize" onClick={() => dispatch(minimizeMenu(INVENTORY))} /> : null}
          <Inventory />
        </Menu>)}

      {minimizedMenus.closet ? null : 
        <Menu minimized={minimizedMenus.closet} active={activeMenus.closet} top={MARGIN} right={MARGIN}>
          {activeMenus.closet ? <a className="minimize" id="minimize" onClick={() => dispatch(minimizeMenu(CLOSET))} /> : null}
          <Closet />
        </Menu>}

      <div className="minimizedMenus" style={{bottom: MARGIN, right: MARGIN}}>
        {minimizedMenus.inventory ? (<img src="/assets/btn_searchcloth.png" onClick={() => dispatch(maximizeMenu(INVENTORY))}/>) : null}
        {minimizedMenus.closet ? (<img src="/assets/btn_goitems.png" onClick={() => dispatch(maximizeMenu(CLOSET))}/>) : null}
      </div>
    </div>
  );
};

export default App;
