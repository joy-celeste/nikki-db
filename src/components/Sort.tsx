import React from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import { sortOptions } from '../modules/constants';

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
  
const colourStyles2 = {
	control: (styles: any) => ({ ...styles, backgroundColor: 'white' }),
	option: (styles: { [x: string]: any; }, { data, isDisabled, isFocused, isSelected }: any) => {
		const color = chroma(data.color);
		return {
			...styles,
			backgroundColor: isDisabled
				? null
				: isSelected
				? data.color
				: isFocused
				? color.alpha(0.1).css()
				: null,
			color: isDisabled
				? '#ccc'
				: isSelected
				? chroma.contrast(color, 'white') > 2
					? 'white'
					: 'black'
				: data.color,
			cursor: isDisabled ? 'not-allowed' : 'default',

			':active': {
				...styles[':active'],
				backgroundColor:
					!isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
			},
		};
	},
	input: (styles: any) => ({ ...styles, ...dot() }),
	placeholder: (styles: any) => ({ ...styles, ...dot() }),
	singleValue: (styles: any, { data }: any) => ({ ...styles, ...dot(data.color) }),
};
    
export const Sort = (): JSX.Element => 
	<Select
	defaultValue={sortOptions[0]}
	label="Single select"
	options={sortOptions}
	styles={colourStyles2}
/>

export default Sort;