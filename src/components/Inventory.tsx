import React from 'react';
import BackgroundOptions from './BackgroundOptions';
import Results from './Results';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';
import './Inventory.css';
import Categories from './Categories';

export const Inventory = (): JSX.Element => (
  <div className="inventory-container">
    <SearchBar />
    <BackgroundOptions />
    <SearchOptions />
    <Categories />
    <Results />
  </div>
);

export default Inventory;
