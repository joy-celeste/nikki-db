import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { RootState } from '../modules';
import { Filter, FilterSet } from '../modules/filters';
import { Filter as FilterComponent } from '../components/Filter';
import { searchInventory, updateFilterSet } from '../modules/search';
import SearchToggle from './SearchToggle';
import Sort from './Sort';

export const AdvancedSearch = (): JSX.Element => {
  const dispatch = useDispatch();
  const filterSet: FilterSet = useSelector((state: RootState) => state.search.filterSet);
  const searchResults = useSelector((state: RootState) => state.search.results);
  const [submitMessage, setSubmitMessage] = useState(filterSet.generateSubmitMessage());

  const addFilter = () => {
    filterSet.addFilter(new Filter());
    setSubmitMessage(filterSet.generateSubmitMessage());
    dispatch(updateFilterSet(filterSet));
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    dispatch(searchInventory());
  };

  return (
    <div className="advancedSearch">
      <div className="advancedFilters">
        {filterSet.filters.map((f) => <FilterComponent setSubmitMessage={setSubmitMessage} key={f.id} id={f.id} />)}
        <Sort />
      </div>
      <div className="advancedFilterToolbar">
        <span className="advancedFilterToolbarLeft">
          <input type="submit" value="+ Add Filter" onClick={addFilter} />
          {searchResults ? (<b> ... found {searchResults.length} results!</b>) : null}
        </span>
        <span className="advancedFilterToolbarRight">
          <form onSubmit={handleSearchSubmit}>
            <SearchToggle initialValue />
            <input type="submit" value={submitMessage} disabled={submitMessage !== 'Search'} />
          </form>
        </span>
      </div>
    </div>
  );
};

export default AdvancedSearch;
