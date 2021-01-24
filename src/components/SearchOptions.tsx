import React from 'react';
import { Filters } from '../components/Filters';
import { Sort } from '../components/Sort';

export const SearchOptions = (): JSX.Element => {
  return (
    <div className="searchOptions">
      <div style={{width: '80%'}}><Filters /></div>
      <div style={{width: '20%'}}><Sort /></div>
    </div>
  );
};

export default SearchOptions;