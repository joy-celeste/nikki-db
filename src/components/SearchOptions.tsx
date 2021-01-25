import React from 'react';
import { Filters } from '../components/Filters';
import { Sort } from '../components/Sort';

export const SearchOptions = (): JSX.Element => (
  <div className="searchOptions">
    <div style={{ width: '70%' }}><Filters /></div>
    <div style={{ width: '30%' }}><Sort /></div>
  </div>
);

export default SearchOptions;
