import React, { CSSProperties } from 'react';
import { GroupedOptionsType, OptionTypeBase, StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import { generalOptions, rarityOptions, genreOptions, specialOptions } from '../modules/constants';

export const groupedOptions: GroupedOptionsType<OptionTypeBase> = [
  { label: 'Colours', options: generalOptions },
  { label: 'Genre', options: genreOptions },
  { label: 'Special', options: specialOptions },
  { label: 'Rarity', options: rarityOptions },
];

export const colourStyles: StylesConfig<any, boolean> = {
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
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles: CSSProperties, { data }: any) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles: CSSProperties, { data }: any) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles: CSSProperties, { data }: any) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

export const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const groupBadgeStyles: CSSProperties = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data: any) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.label === 'Colours' ? data.options.length / 2 : data.options.length}</span>
  </div>
);