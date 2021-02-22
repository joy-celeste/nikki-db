import SearchIndex, { SUITS_BOOST_TERM } from './search';

export type Operator = 'and' | 'or';
export const PLEASE_CREATE_A_FILTER = 'Please create a filter.';
export const PLEASE_FILL_ALL_VALUES = 'Please fill all values.';
export const SEARCH_BUTTON_LABEL = 'Search';

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
      return PLEASE_CREATE_A_FILTER;
    } if (!this.allFiltersValid()) {
      return PLEASE_FILL_ALL_VALUES;
    }
    return SEARCH_BUTTON_LABEL;
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

  intersection(array: any[][]): any[] {
    return array.reduce((a, b) => b.filter(Set.prototype.has.bind(new Set(a))));
  }

  filtersWithAny() {
    return this.filters.filter((filter) => filter.filterType === 'select' && filter.selectType === 'any');
  }

  filtersWithoutAny() {
    return this.filters.filter((filter) => filter.filterType !== 'select' || filter.selectType !== 'any');
  }

  search(index: SearchIndex) {
    const withAny: Filter[] = this.filtersWithAny();

    // Without any multi-select filters with 'any' selectType ==========================================
    if (!withAny.length) {
      if (this.filters.length === 1 || this.operator === 'and') {
        const searchTerm = `${this.toString()} ${SUITS_BOOST_TERM}`;
        return index.searchWithTerm(searchTerm);
      }
      return this.filters.flatMap((filter: any) => index.searchWithTerm(filter.toString()));
    }

    // With any multi-select filters with 'any' selectType =============================================
    if (this.filters.length === 1) {
      return this.filters[0].search(index);
    }
    const withoutAny: Filter[] = this.filtersWithoutAny();
    const withoutAnySearchTerm = `${withoutAny.map((f) => f.toString()).join(' ')} ${SUITS_BOOST_TERM}`;
    const withoutAnyResults = withoutAny.length ? index.searchWithTerm(withoutAnySearchTerm) : [];

    if (this.operator === 'and') {
      const withAnyResults = withAny.map((filter) => filter.search(index));
      const intersection = this.intersection(withAnyResults);
      return withoutAnyResults.length 
        ? intersection.filter((res) => withoutAnyResults.includes(res))
        : intersection;
    } else {
      const withAnyResults = withAny.flatMap((filter) => filter.search(index));
      return withAnyResults.concat(withoutAnyResults);
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
  selections: string[] | string;
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

  isValid(): boolean {
    switch (this.filterType) {
      case 'userInput':
        return this.userInputValue.length > 0;
      case 'checkbox':
        return true;
      case 'select':
        return Array.isArray(this.selections) ? !!this.selections.length : !!this.selections;
    }
  }

  toString() {
    if (this.isValid()) {
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
    } else {
      return ''
    }
  }

  search(index: SearchIndex, maxResultsEach?: number) {
    if (this.filterType === 'select' && this.selectType === 'any' && Array.isArray(this.selections)) {
      return this.selections.flatMap((s) => index.searchWithTerm(`+${this.filterValue}:${s}`, maxResultsEach));
    }
  }
}