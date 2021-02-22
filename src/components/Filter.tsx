import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { GroupedOptionsType, OptionsType, OptionTypeBase } from 'react-select';
import { generalOptions, rarityOptions, genreOptions, specialOptions, categoryOptions as subtypeOptions } from '../modules/constants';
import { Filter as FilterClass, FilterType, Operator, SelectType } from '../modules/filters';
import { RootState } from '../modules';

export interface Options {
  value: string;
  label: string;
  type?: FilterType;
}

export const operatorOptions: Options[] = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

export const filterValueOptions: Options[] = [
  { value: 'name', label: 'name', type: 'userInput' },
  { value: 'subtype', label: 'category', type: 'select' },
  { value: 'posed', label: 'is Posed', type: 'checkbox' },
  { value: 'isSuit', label: 'is Suit', type: 'checkbox' },
  { value: 'genre', label: 'genre', type: 'select' },
  { value: 'spec', label: 'special', type: 'select' },
  { value: 'rare', label: 'rarity', type: 'select' },
];

export const containsOptions: Options[] = [
  { value: 'true', label: 'contains' },
  { value: 'false', label: "doesn't contain" },
];

export const selectOptions: Options[] = [
  { value: 'only', label: 'contains only' },
  { value: 'any', label: 'contains any of' },
];

export const isCheckedOptions: Options[] = [
  { value: 'true', label: 'is' },
  { value: 'false', label: 'is not' },
];

export const groupedOptions: GroupedOptionsType<OptionTypeBase> = [
  { label: 'Colours', options: generalOptions },
  { label: 'Genre', options: genreOptions },
  { label: 'Special', options: specialOptions },
  { label: 'Rarity', options: rarityOptions },
  { label: 'Category', options: subtypeOptions },
];

export interface FilterProps {
  id: string;
  setSubmitMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const Filter: React.FC<FilterProps> = (props: FilterProps) => {
  let textInput: HTMLInputElement = null;
  const filterSet = useSelector((state: RootState) => state.search.filterSet);
  const index = filterSet.filters.findIndex((filter) => filter.id === props.id);
  const filter: FilterClass = filterSet.filters[index];

  const [fourthValue, setFourthValue] = useState('');
  const [thirdValue, setThirdValue] = useState(containsOptions[0]);
  const [thirdOptions, setThirdOptions] = useState(containsOptions);

  const onChangeFirst = (options: Options) => {
    filterSet.setOperator(options.value as Operator);
  };

  const onChangeSecond = (options: Options) => {
    switch (options.type) {
      case 'checkbox':
        setThirdValue(isCheckedOptions[0]);
        setThirdOptions(isCheckedOptions);
        break;
      case 'userInput':
        setThirdValue(containsOptions[0]);
        setThirdOptions(containsOptions);
        break;
      case 'select':
        setThirdValue(selectOptions[0]);
        setThirdOptions(selectOptions);
        break;
      default:
        break;
    }
    filter.setFilterValue(options.value);
    filter.setFilterType(options.type);
    props.setSubmitMessage(filterSet.generateSubmitMessage());
  };

  const onChangeThird = (options: Options) => {
    setThirdValue(options);
    switch (filter.filterType) {
      case 'checkbox':
        filter.setCheckboxIsChecked(JSON.parse(options.value));
        break;
      case 'userInput':
        filter.setUserInputContains(JSON.parse(options.value));
        break;
      case 'select':
        filter.setSelectType(options.value as SelectType);
        break;
      default:
        break;
    }
  };

  const onChangeFourth = (input: any): void => {
    switch (filter.filterType) {
      case 'checkbox':
        filter.setCheckboxIsChecked(input.target.checked);
        break;
      case 'userInput':
        filter.setUserInputValue(input.target.value);
        setFourthValue(input.target.value);
        break;
      case 'select':
        if (filter.selectType === 'any') {
          const values: string[] = input.map((option: any) => option.value);
          filter.setSelection(values);
        } else {
          filter.setSelection(input.value);
        }
        break;
      default:
        break;
    }
    props.setSubmitMessage(filterSet.generateSubmitMessage());
  };

  const renderFourth = (): JSX.Element => {
    let options: OptionsType<any>;
    switch (filter.filterType) {
      case 'checkbox':
        return (
          <div className="advancedFilterFourth">
            <input
              type="checkbox"
              onChange={onChangeFourth}
              checked
            />
          </div>
        );
      case 'userInput':
        return (
          <input
            value={fourthValue}
            onClick={() => textInput.focus()}
            ref={(input) => textInput = input}
            onChange={onChangeFourth}
          />
        );
      case 'select':
        switch (filter.filterValue) {
          case 'genre':
            options = genreOptions;
            break;
          case 'spec':
            options = specialOptions;
            break;
          case 'rare':
            options = rarityOptions;
            break;
          case 'subtype':
            options = subtypeOptions;
            break;
          default:
            options = null;
        }

        return filter.selectType === 'any' ? (
          <Select
            className="reactselect-valid"
            options={options}
            onChange={onChangeFourth}
            isSearchable
            isClearable
            isMulti
          />
        ) : (
          <Select
            options={options}
            onChange={onChangeFourth}
            isSearchable
          />
        );
      default:
        return null;
    }
  };

  return filter ? (
    <div key={filter.id} className="advancedFilter">
      <div className={index !== 1 ? 'advancedFilterFirst' : ''} key={`${filter.id}-first`} style={{ width: '20%' }}>
        {index === 0 ? (<span>Where</span>)
          : index !== 1 ? (<span>{filterSet.operator}</span>)
            : (
              <Select
                defaultValue={operatorOptions[0]}
                options={operatorOptions}
                onChange={onChangeFirst}
              />
            )}
      </div>
      <div key={`${filter.id}-second`} style={{ width: '25%' }}>
        <Select
          defaultValue={filterValueOptions[0]}
          options={filterValueOptions}
          onChange={onChangeSecond}
        />
      </div>
      <div key={`${filter.id}-third`} style={{ width: '30%' }}>
        <Select
          value={thirdValue}
          options={thirdOptions}
          onChange={onChangeThird}
        />
      </div>
      <div key={`${filter.id}-fourth`} style={{ width: '25%' }}>
        {renderFourth()}
      </div>
      <button
        type="button"
        className="equipped-trash"
        key={`${filter.id}_trash`}
        onClick={() => {
          filterSet.removeFilter(filter);
          props.setSubmitMessage(filterSet.generateSubmitMessage());
        }}
      >🗑️
      </button>
    </div>
  ) : null;
};

export default Filter;
