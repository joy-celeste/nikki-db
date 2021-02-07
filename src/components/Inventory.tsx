import React from 'react';
import Results from './Results';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';
import Categories from './Categories';

export const Inventory = (): JSX.Element => (
  <div className="inventory-container">
    <SearchBar />
    <SearchOptions />
    <Categories />
    <Results />
  </div>
);

export default Inventory;
