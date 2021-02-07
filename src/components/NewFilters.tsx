import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import Select, { GroupedOptionsType, OptionTypeBase, StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { colourStyles, groupStyles, groupBadgeStyles } from './Filters';
import { generalOptions, rarityOptions, genreOptions, specialOptions } from '../modules/constants';

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

  const addFilter = () => {
    console.log('added filter');
  };

  const addFilterGroup = () => {
    console.log('addFilterGroup');
  };

  return (
    <div className="newSearchOptions">
      <div className="filtersSection" />

      <div className="addFilterOptions">
        <div onClick={addFilter}>+ Add Filter</div>
        <div onClick={addFilterGroup}>+ Add Filter Group</div>
      </div>
    </div>
  );
};

export default NewFilters;
