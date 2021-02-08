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

export const groupedOptions: GroupedOptionsType<OptionTypeBase> = [
  { label: 'Colours', options: generalOptions },
  { label: 'Genre', options: genreOptions },
  { label: 'Special', options: specialOptions },
  { label: 'Rarity', options: rarityOptions },
];

const formatGroupLabel = (data: any) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.label === 'Colours' ? data.options.length / 2 : data.options.length}</span>
  </div>
);

// <Select
//   formatGroupLabel={formatGroupLabel}
//   options={groupedOptions}
//   styles={colourStyles}
//   onChange={(options: any) => {
//     dispatch(updateSearchFilters(options));
//     dispatch(searchInventory());
//   }}
//   isSearchable
//   isMulti
// />

export const NewFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const filterSet = useSelector((state: RootState) => state.search.filterSet);

  const addFilter = () => {
    filterSet.addFilter(new Filter());
    dispatch(updateFilterSet(filterSet));
  };

  return (
    <div className="newSearchOptions">
      <div className="filtersSection">
        {filterSet.filters.map((f) => <FilterComponent id={f.id} />)}
      </div>

      <div className="addFilterOptions">
        <div onClick={addFilter}>+ Add Filter</div>
      </div>

      {/* <form onSubmit={() => dispatch(searchInventory())}>
        <span>
          <input type="submit" value="Search" />
        </span>
      </form> */}
    </div>
  );
};

export default NewFilters;
