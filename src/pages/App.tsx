import React from 'react';
import './App.css';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';

export const MARGIN: number = 30;

const App = (): JSX.Element => (
  <div className="App">
    <div className="figure">
      <Draggable top="50%">
        <Figure />
      </Draggable>
    </div>

    <div className="menu">
      <Draggable>
        <Menu minimized={false} active={false} top={MARGIN} left={MARGIN}>
          <Inventory />
        </Menu>
      </Draggable>
    </div>

    <div className="menu">
      <Draggable>
        <Menu minimized={false} active={false} top={MARGIN} right={MARGIN}>
          <Closet />
        </Menu>
      </Draggable>
    </div>
  </div>
);

export default App;
