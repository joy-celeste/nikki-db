import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import Select, { GroupedOptionsType, OptionTypeBase, StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { colourStyles, groupStyles, groupBadgeStyles } from './Filters';
import { generalOptions, rarityOptions, genreOptions, specialOptions } from '../modules/constants';
import { RootState } from '../modules';
import { Filter } from '../modules/filters';
import { Filter as FilterComponent } from '../components/Filter';
import { searchInventory, updateFilterSet } from '../modules/search';

export const NewFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const filterSet = useSelector((state: RootState) => state.search.filterSet);

  const addFilter = () => {
    filterSet.addFilter(new Filter());
    dispatch(updateFilterSet(filterSet));
  };

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    dispatch(searchInventory(50));
  };

  return (
    <div className="newSearchOptions">
      <div className="filtersSection">
        {filterSet.filters.map(f => <FilterComponent key={f.id} id={f.id} />)}
      </div>

      <div className="addFilterOptions">
        <div onClick={addFilter}>+ Add Filter</div>
      </div>

      <form onSubmit={handleSearchSubmit}>
        <span>
          <input type="submit" value="Search" />
        </span>
      </form>
    </div>
  );
};

export default NewFilters;
