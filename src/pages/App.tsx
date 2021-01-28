import React from 'react';
import './App.css';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
// import Equipped from '../components/Equipped';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';

const App = (): JSX.Element => (
  <div className="App">
    <div className="figure">
      <Draggable>
        <Figure />
      </Draggable>
    </div>

    <div className="menu">
    <Draggable>
      <Menu minimized={false} active={false} top={30} right={30}>
        <Closet />
      </Menu>
    </Draggable>

      <Menu minimized={false} active={false} top={30} left={30}>
        <Inventory />
      </Menu>
    </div>
  </div>
);

export default App;
