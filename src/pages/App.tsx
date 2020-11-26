import React, { useEffect } from 'react';
import './App.css';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Equipped from '../components/Equipped';
import Inventory from '../components/Inventory';
import { loadItem } from '../modules/data';
import { useDispatch } from 'react-redux';

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {dispatch(loadItem(10001))}, []);

  return (
    <div className="App">
      <div className="figure">
        <Draggable>
          <Figure />
        </Draggable>
      </div>

      <div className="menu">
        <Menu minimized={false} active={false} top={30} right={30}>
          <Equipped />
        </Menu>

        <Menu minimized={false} active={false} top={30} left={30}>
          <Inventory />
        </Menu>
      </div>
    </div>
  );
}

export default App;
