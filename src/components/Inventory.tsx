import React from 'react';
import Results from './Results';
import SearchBar from './SearchBar';
import SearchOptions from './SearchOptions';
import Categories from './Categories';
import { NewFilters } from '../components/NewFilters';

export const Inventory = (): JSX.Element => (
  <div className="inventory-container">
    <SearchBar />
    <SearchOptions />
    <NewFilters />
    <Categories />
    <Results />
  </div>
);

export default Inventory;
