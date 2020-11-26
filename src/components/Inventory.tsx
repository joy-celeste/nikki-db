import React from 'react';
import './Icon.css';
import './Inventory.css';
import Results from './Results';
import SearchBar from './SearchBar';

export const Inventory = (): JSX.Element => (
  <div className="wrapper">
    <div className="searchbar"><SearchBar /></div>
    <div className="categories">
      <ul>
        <li>Hair</li>
        <li>Dress</li>
        <li>Coat</li>
        <li>Makeup</li>
        <li>Skin</li>
      </ul>
    </div>
    <div className="items">
      <Results />
    </div>
  </div>
);

export default Inventory;
