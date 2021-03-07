import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Results from './Results';
import SimpleSearch from './SimpleSearch';
import AdvancedSearch from './AdvancedSearch';
import { RootState } from '../modules';
import { focusMenu, INVENTORY } from '../modules/editor';

export const Inventory = (): JSX.Element => {
  const useAdvancedSearch = useSelector((state: RootState) => state.search.useAdvancedSearch);
  const dispatch = useDispatch();

  return (
    <div className="inventory-container"  onClick={() => dispatch(focusMenu(INVENTORY))}>
      { useAdvancedSearch ? <AdvancedSearch /> : <SimpleSearch />}
      <Results />
    </div>
  );
};

export default Inventory;
