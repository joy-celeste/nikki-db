import React, { CSSProperties } from 'react';
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { useDispatch } from 'react-redux';
import { DEFAULT_MAX_RESULTS_SEARCH, sortOptions } from '../modules/constants';
import { updateMaxResults, updateSortOption } from 'redux/actions/search-actions';

const dot = (color = '#ccc') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles: StylesConfig<any, boolean> = {
  control: (styles: CSSProperties) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled ? null : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled ? '#ccc' : isSelected ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  input: (styles: any) => ({ ...styles, ...dot() }),
  placeholder: (styles: any) => ({ ...styles, ...dot() }),
  singleValue: (styles: any, { data }: any) => ({ ...styles, ...dot(data.color) }),
};

export const Sort = (): JSX.Element => {
  let textInput: HTMLInputElement = null;
  const dispatch = useDispatch();

  return (
    <div className="advancedFilter">
      <div className="advancedFilterFirst" style={{ width: '20%' }}>Sort by</div>
      <div className="sortFilter" style={{ width: '25%' }}>
        <Select
          styles={colourStyles}
          defaultValue={sortOptions[0]}
          options={sortOptions}
          onChange={(options) => dispatch(updateSortOption(options.value))}
        />
      </div>
      <div style={{ width: '40%' }} />
      <div className="maxResultsLabel">Max results</div>
      <div className="maxResultsField">
        <input
          defaultValue={DEFAULT_MAX_RESULTS_SEARCH}
          onClick={() => textInput.focus()}
          ref={(input) => textInput = input}
          onChange={(e) => dispatch(updateMaxResults(parseInt(e.target.value, 10)))}
        />
      </div>
    </div>
  );
};

export default Sort;
