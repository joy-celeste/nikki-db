import { RootState } from '.';
import { updateFilterSet } from './search';

export type Operator = 'and' | 'or';

export class FilterSet {
  id: string;
  filters: Filter[];
  operator: Operator;

  constructor(input?: FilterSet) {
    this.id = `filterSet-${Math.random().toString(36).substring(7)}`;
    this.filters = input?.filters ?? [];
    this.operator = input?.operator ?? 'and';
  }

  setOperator(operator: Operator) {
    this.operator = operator;
  }

  addFilter(filter: Filter) {
    this.filters.push(filter);
  }

  removeFilter(filter: Filter) {
    this.filters = this.filters.filter((f) => filter.id !== f.id);
  }

  toString() {
    return this.filters.map((f) => f.toString()).join(' ');
  }
}

export type FilterType = 'userInput' | 'select' | 'checkbox';
export type SelectType = 'any' | 'only';

export class Filter {
  id: string;
  filterType: FilterType;
  filterValue: string;
  userInputValue: string;
  userInputContains: boolean;
  selectType: SelectType;
  selections: string[];
  checkboxIsChecked: boolean;

  constructor(input?: Filter) {
    this.id = `filter-${Math.random().toString(36).substring(7)}`;
    this.filterType = input?.filterType ?? 'userInput';
    this.filterValue = input?.filterValue ?? 'name';
    this.userInputValue = input?.userInputValue ?? '';
    this.userInputContains = input?.userInputContains ?? true;
    this.selectType = input?.selectType ?? 'any';
    this.selections = input?.selections ?? [];
    this.checkboxIsChecked = input?.checkboxIsChecked ?? true;
  }

  setFilterType(filterType: FilterType) { this.filterType = filterType; }
  setFilterValue(filterValue: string) { this.filterValue = filterValue; }
  setUserInputValue(userInputValue: string) { this.userInputValue = userInputValue; }
  setUserInputContains(userInputContains: boolean) { this.userInputContains = userInputContains; }
  setSelectType(selectType: SelectType) { this.selectType = selectType; }
  setSelection(selection: string[]) { this.selections = selection; }
  setCheckboxIsChecked(checkboxIsChecked: boolean) { this.checkboxIsChecked = checkboxIsChecked; }

  toString() {
    switch (this.filterType) {
      case 'userInput':
        const containsPrefix = this.userInputContains ? '+' : '-';
        const sanitizedString = this.userInputValue.split(' ').join('_').toLowerCase();
        return `${containsPrefix}${this.filterValue}:*${sanitizedString}*`;
      case 'select':
        if (this.selectType === 'only') {
          return `+${this.filterValue}:${this.selections[0]}`;
        }
        return this.selections.map((s) => `${this.filterValue}:${s}`).join(' ');
      case 'checkbox':
        return `+${this.filterValue}:${this.checkboxIsChecked}`;
    }
  }
}

// USE-CASE
export const updateFilter = (id: string) =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const { filterSet } = getState().search;
    console.log(id, filterSet);
    const newFilterSet = new FilterSet(filterSet);
    dispatch(updateFilterSet(newFilterSet));
  };
