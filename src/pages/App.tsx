import React, { useEffect, useRef } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Equipped from '../components/Equipped';
import Inventory from '../components/Inventory';
import { loadItem } from '../modules/data';

const App = (): JSX.Element => {
  const canvasRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => { dispatch(loadItem(10001)); }, [dispatch]);

  return (
    <div className="App">
      <div ref={canvasRef} className="figure">
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
};

export default App;
