import React from 'react';
import './App.css';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { MenuState, setActive } from '../modules/editor';

export const MARGIN: number = 30;

const App = (): JSX.Element => {
  const minimizedMenus: MenuState = useSelector((state: RootState) => state.editor.minimizedMenus);
  const activeMenus: MenuState = useSelector((state: RootState) => state.editor.activeMenus);
  const dispatch = useDispatch();

  console.log(minimizedMenus, activeMenus);
  
  return (
    <div className="App">
      <div className="figure">
        <Draggable top="50%">
          <Figure />
        </Draggable>
      </div>

      <div className="menu" onClick={() => dispatch(setActive({closet: false, inventory: true}))}>
        <Draggable>
          <Menu minimized={minimizedMenus.inventory} active={activeMenus.inventory} top={MARGIN} left={MARGIN}>
            <Inventory />
          </Menu>
        </Draggable>
      </div>

      <div className="menu" onClick={() => dispatch(setActive({closet: true, inventory: false}))}>
        <Draggable>
          <Menu minimized={minimizedMenus.closet} active={activeMenus.closet} top={MARGIN} right={MARGIN}>
            <Closet />
          </Menu>
        </Draggable>
      </div>
    </div>
)};

export default App;
