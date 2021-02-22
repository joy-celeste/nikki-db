import React from 'react';
import { useSelector } from 'react-redux';
import Results from './Results';
import SimpleSearch from './SimpleSearch';
import AdvancedSearch from './AdvancedSearch';
import { RootState } from '../modules';

export const Inventory = (): JSX.Element => {
  const useAdvancedSearch = useSelector((state: RootState) => state.search.useAdvancedSearch);

  return (
    <div className="inventory-container">
      { useAdvancedSearch ? <AdvancedSearch /> : <SimpleSearch />}
      <Results />
    </div>
  );
};

export default Inventory;
