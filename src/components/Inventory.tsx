import React from 'react';
import Results from './Results';
import SearchBar from './SearchBar';
import Categories from './Categories';
import NewFilters from './NewFilters';
import Sort from './Sort';

export const Inventory = (): JSX.Element => (
  <div className="inventory-container">
    <div style={{ width: '30%' }}><Sort /></div>
    <div style={{ width: '70%' }}><SearchBar /></div>
    <NewFilters />
    <Categories />
    <Results />
  </div>
);

export default Inventory;
