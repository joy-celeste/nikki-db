import React, { CSSProperties } from 'react';
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { useDispatch } from 'react-redux';
import { sortOptions } from '../modules/constants';
import { searchInventory, updateSortOption } from '../modules/search';

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
  const dispatch = useDispatch();
  return (
    <Select
      defaultValue={sortOptions[0]}
      label="Single select"
      options={sortOptions}
      styles={colourStyles}
      onChange={(options: any) => {
        dispatch(updateSortOption(options.value));
        dispatch(searchInventory());
      }}
    />
  );
};

export default Sort;
