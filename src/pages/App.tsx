import React, { useEffect, useState } from 'react';
import './App.css';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Equipped from '../components/Equipped';
import Inventory from '../components/Inventory';
import { loadItem } from '../modules/data';
import { useDispatch } from 'react-redux';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;

const App = (): JSX.Element => {
  const [background, setBackground] = useState(DEFAULT_BACKGROUND_IMAGE_NAME);
  const dispatch = useDispatch();

  useEffect(() => {dispatch(loadItem(10001))}, []);
  useEffect(() => {
    document.body.style.backgroundImage = getAssetImg(background);
  }, [background]);

  return (
    <div className="App">
      <div className="backgroundOptions">
        {DEFAULT_BACKGROUND_OPTIONS.map((backgroundName) => (
          <button type="button" onClick={() => setBackground(backgroundName)}>
            {backgroundName}
          </button>
        ))}
      </div>
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
