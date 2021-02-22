import { Index } from 'lunr';
import { RootState } from '.';
import SearchIndex, { SUITS_BOOST_TERM, updateFilterSet } from './search';

export type Operator = 'and' | 'or';

export class FilterSet {
  id: string;
  filters: Filter[];
  operator: Operator;

  constructor(input?: FilterSet) {
    this.id = `filterSet-${Math.random().toString(36).substring(7)}`;
    this.filters = input?.filters ?? [];
    this.operator = input?.operator ?? 'and';
    this.addFilter(new Filter());
  }

  allFiltersValid() {
    return this.filters.every((filter) => filter.isValid());
  }

  generateSubmitMessage() {
    if (this.filters.length === 0) {
      return 'Please create a filter.';
    } if (!this.allFiltersValid()) {
      return 'Please fill all values.';
    }
    return 'Search';
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

  common(a: Iterable<unknown>, b: any[]) {
    return b.filter(Set.prototype.has.bind(new Set(a)));
  }

  intersection(array: any[][]): any[] {
    return array.reduce(this.common);
  }

  search(index: SearchIndex) {
    const multiSelectFiltersWithAny: Filter[] = this.filters.filter((filter) => filter.filterType === 'select' && filter.selectType === 'any');

    if (multiSelectFiltersWithAny.length > 0) {
      if (this.filters.length === 1) {
        return this.filters[0].search(index);
      }
      const otherFilters: Filter[] = this.filters.filter((filter) => filter.filterType !== 'select' || filter.selectType !== 'any');
      const multiSelectFiltersWithAnyResults = multiSelectFiltersWithAny.map((filter) => filter.search(index));
      const restSearchTerm = `${otherFilters.map((f) => f.toString()).join(' ')} ${SUITS_BOOST_TERM}`;
      const restResults = otherFilters.length > 0 ? index.searchWithTerm(restSearchTerm) : [];

      if (this.operator === 'and') {
        const multiIntersection = this.intersection(multiSelectFiltersWithAnyResults);
        return restResults.length > 0 ? multiIntersection.filter((result) => restResults.includes(result)) : multiIntersection;
      } if (this.operator === 'or') {
        return multiSelectFiltersWithAnyResults.concat(restResults);
      }
    } else {
      console.log("here?")
      if (this.filters.length === 1 || this.operator === 'and') {
        const searchTerm = `${this.toString()} ${SUITS_BOOST_TERM}`;
        return index.searchWithTerm(searchTerm);
      }
      return this.filters.flatMap((filter: any) => index.searchWithTerm(filter.toString()));
    }
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
    this.selectType = input?.selectType ?? 'only';
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

  isValid() {
    switch (this.filterType) {
      case 'userInput':
        return this.userInputValue.length > 0;
      case 'checkbox':
        return true;
      case 'select':
        return(this.selectType) || this.selections.length >= 1;
    }
  }

  toString() {
    switch (this.filterType) {
      case 'userInput':
        const containsPrefix = this.userInputContains ? '+' : '-';
        const sanitizedString = this.userInputValue.split(' ').join('_').toLowerCase();
        return `${containsPrefix}${this.filterValue}:*_${sanitizedString}_*`;
      case 'checkbox':
        return `+${this.filterValue}:${this.checkboxIsChecked}`;
      case 'select':
        if (this.selectType === 'only') {
          return `+${this.filterValue}:${this.selections}`;
        }
    }
  }

  search(index: SearchIndex) {
    if (this.filterType === 'select' && this.selectType === 'any') {
      return this.selections.flatMap((s) => index.searchWithTerm(`+${this.filterValue}:${s}`));
    }
  }
}

// USE-CASE
export const updateFilter = (id: string) =>
  async(dispatch: Function, getState: () => RootState): Promise<void> => {
    const { filterSet } = getState().search;
    const newFilterSet = new FilterSet(filterSet);
    dispatch(updateFilterSet(newFilterSet));
  };
