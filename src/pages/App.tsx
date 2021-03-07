import React from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';
import { RootState } from '../modules';
import { MenuState, setActive, setMinimized } from '../modules/editor';
import MinimizedMenus from '../components/MinimizedMenus';

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

      {minimizedMenus.inventory ? null : (
      <div onClick={() => dispatch(setActive({ closet: false, inventory: true }))}>
        <Menu minimized={minimizedMenus.inventory} active={activeMenus.inventory} top={MARGIN} left={MARGIN}>
          {activeMenus.inventory ? <a className="minimize" id="minimize" onClick={() => {dispatch(setMinimized({...minimizedMenus, inventory: true}))}} /> : null}
          <Inventory />
        </Menu>
      </div>)}

      {minimizedMenus.closet ? null : (
      <div onClick={() => dispatch(setActive({ closet: true, inventory: false }))}>
        <Menu minimized={minimizedMenus.closet} active={activeMenus.closet} top={MARGIN} right={MARGIN}>
          {activeMenus.closet ? <a className="minimize" id="minimize" onClick={() =>dispatch(setMinimized({...minimizedMenus, closet: true}))} /> : null}
          <Closet />
        </Menu>
      </div>)}

      <MinimizedMenus/>
    </div>
  );
};

export default App;
