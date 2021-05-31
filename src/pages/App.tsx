import React, { useEffect } from 'react';
import './base.css';
import './App.css';
import './items.css';
import './filters.css';

import Phone from '../components/Phone';
import Closet from '../components/Closet';
import Inventory from '../components/Inventory';

const App = (): JSX.Element => {
  return (
    <div id="content">
      <div id="phone" className="window"><Phone/></div>
      <div id="inventory" className="window"><Inventory /></div>
      <div id="closet" className="window"><Closet /></div>
    </div>
  );
};

export default App;