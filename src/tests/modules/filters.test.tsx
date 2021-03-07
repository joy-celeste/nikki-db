import { combineReducers, Store } from 'redux';
import { createSeedFunction, createStoreWithMiddleware } from '../helpers';
import { Filter, FilterSet, PLEASE_CREATE_A_FILTER, PLEASE_FILL_ALL_VALUES, SEARCH_BUTTON_LABEL, } from '../../modules/filters';
import SearchIndex, { searchReducer, updateFilterSet, updateSearchString, searchInventory, updateMaxResults, setAdvancedSearch, SearchState } from '../../modules/search';
import { RootState } from '../../modules';

const mockMath = Object.create(global.Math);
mockMath.random = createSeedFunction(40);
global.Math = mockMath;

describe('FilterSet', () => {
  let searchState: SearchState;
  let mockRootReducer: any;
  let filterSet: FilterSet;
  let firstFilter: Filter;

  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    searchState = createStoreWithMiddleware(mockRootReducer).getState().search;
    searchState.filterSet = new FilterSet();
    filterSet = searchState.filterSet;
    firstFilter = filterSet.filters[0];
  });

  test('Initializes to with correct default data', () => {
    expect(filterSet.operator).toBe('and');
    expect(filterSet.filters.length).toBe(1);
    expect(filterSet.id.substring(0,10)).toBe('filterSet-')
    expect(filterSet).toMatchSnapshot();
  });

  test('Correctly changes operator', () => {
    expect(filterSet.operator).toBe('and');
    filterSet.setOperator('or');
    expect(filterSet.operator).toBe('or');
  });

  test('Correctly adds and removes filter', () => {
    expect(filterSet.filters.length).toBe(1);
    const userInputFilter = new Filter({userInputContains: true, userInputValue: 'love'} as Filter);
    const checkboxFilter = new Filter({filterType: 'checkbox', filterValue: 'isPosed'} as Filter);

    filterSet.addFilter(userInputFilter);
    expect(filterSet.filters.length).toBe(2);

    filterSet.addFilter(checkboxFilter);
    expect(filterSet.filters.length).toBe(3);
    expect(filterSet).toMatchSnapshot();

    filterSet.removeFilter(userInputFilter)
    expect(filterSet.filters.length).toBe(2);
    expect(filterSet).toMatchSnapshot();
  });

  test('Correctly creates AND search term from multiple filters', () => {
    // Fill out default first filter
    firstFilter.setUserInputContains(true);
    firstFilter.setUserInputValue('love');

    // Add additional posed filter
    const checkboxFilter = new Filter({filterType: 'checkbox', filterValue: 'isPosed'} as Filter);
    filterSet.addFilter(checkboxFilter);
    expect(filterSet.toString()).toBe('+name:*_love_* +isPosed:true')
  });

  test('Correctly searches when there is a multi-select filter with "ANY" selectType', () => {
    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('genre');
    firstFilter.setSelection(['22', '23']);
    firstFilter.setSelectType('any');

    const result = filterSet.search(searchState.index).sort();
    expect(result).toMatchSnapshot();
  });

  test('Correctly searches when there is a multi-select filter with "ANY" selectType with both operators | operator = or', () => {
    filterSet.setOperator('or');

    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('genre');
    firstFilter.setSelection(['22', '23']);
    firstFilter.setSelectType('any');

    const otherSelectFilter = new Filter({
      filterType: 'select',
      filterValue: 'spec',
      selectType: 'any',
      selections: ['2', '4', '6', '8']
    } as Filter);
    filterSet.addFilter(otherSelectFilter);

    let result = filterSet.search(searchState.index).sort();
    expect(result).toMatchSnapshot();
  });

  test('Correctly searches when there is a multi-select filter with "ANY" selectType with both operators | operator = and', () => {
    filterSet.setOperator('and');

    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('genre');
    firstFilter.setSelection(['22', '23']);
    firstFilter.setSelectType('any');

    const otherSelectFilter = new Filter({
      filterType: 'select',
      filterValue: 'spec',
      selectType: 'any',
      selections: ['2', '4', '6', '8']
    } as Filter);
    filterSet.addFilter(otherSelectFilter);

    let result = filterSet.search(searchState.index).sort();
    expect(result).toMatchSnapshot();
  });

  test('Correctly searches when there is a mix of filter types | operator = and', () => {
    filterSet.setOperator('and');

    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('genre');
    firstFilter.setSelection(['22', '23']);
    firstFilter.setSelectType('any');

    const otherSelectFilter = new Filter({
      filterType: 'select',
      filterValue: 'rare',
      selectType: 'only',
      selections: '2'
    } as Filter);
    filterSet.addFilter(otherSelectFilter);

    let result = filterSet.search(searchState.index).sort();
    expect(result).toMatchSnapshot();
  });

  test('Correctly searches when there is a mix of filter types | operator = or', () => {
    filterSet.setOperator('or');

    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('genre');
    firstFilter.setSelection(['22', '23']);
    firstFilter.setSelectType('any');

    const otherSelectFilter = new Filter({
      filterType: 'select',
      filterValue: 'rare',
      selectType: 'only',
      selections: '2'
    } as Filter);
    filterSet.addFilter(otherSelectFilter);

    let result = filterSet.search(searchState.index).sort();
    expect(result).toMatchSnapshot();
  });
});

describe('Filter', () => {
  let searchState: SearchState;
  let mockRootReducer: any;
  let filterSet: FilterSet;
  let firstFilter: Filter;

  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    searchState = createStoreWithMiddleware(mockRootReducer).getState().search;
    searchState.filterSet = new FilterSet();
    filterSet = searchState.filterSet;
    firstFilter = filterSet.filters[0];
  });

  test('Initializes to with correct default data', () => {
    let filter = new Filter();
    expect(filter.filterType).toBe('userInput');
    expect(filter.filterValue).toBe('name');
    expect(filter.userInputValue).toBe('');
    expect(filter.userInputContains).toBe(true);
    expect(filter.selectType).toBe('only');
    expect(filter.selections.length).toBe(0);
    expect(filter.checkboxIsChecked).toBe(true);
    expect(filter).toMatchSnapshot();
  });

  test('Setters work correctly', () => {
    let filter = new Filter();

    filter.setFilterType('select');
    filter.setFilterValue('genre');
    filter.setUserInputValue('test-string');
    filter.setUserInputContains(false);
    filter.setSelectType('any');
    filter.setSelection(['a']);
    filter.setCheckboxIsChecked(false);

    expect(filter.filterType).toBe('select');
    expect(filter.filterValue).toBe('genre');
    expect(filter.userInputValue).toBe('test-string');
    expect(filter.userInputContains).toBe(false);
    expect(filter.selectType).toBe('any');
    expect(filter.selections.length).toBe(1);
    expect(filter.checkboxIsChecked).toBe(false);
    expect(filter).toMatchSnapshot();
  });

  test('Successfully generates submit message', () => {
    expect(filterSet.generateSubmitMessage()).toBe(PLEASE_FILL_ALL_VALUES); // Should be this on first init

    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('rare');
    firstFilter.setSelectType('any');
    firstFilter.setSelection(['3', '4']); // 2 choices
    expect(filterSet.generateSubmitMessage()).toBe(SEARCH_BUTTON_LABEL);

    filterSet.removeFilter(filterSet.filters[0])
    filterSet.removeFilter(filterSet.filters[1])
    expect(filterSet.generateSubmitMessage()).toBe(PLEASE_CREATE_A_FILTER);

    filterSet.addFilter(new Filter());
    expect(filterSet.generateSubmitMessage()).toBe(PLEASE_FILL_ALL_VALUES);
  });

  test('By default, allFiltersValid() returns false', () => {
    expect(filterSet.allFiltersValid()).toBe(false);
  });

  test('Successfully verifies whether all filters are valid', () => {
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('rare');
    firstFilter.setSelectType('any');
    firstFilter.setSelection(['3', '4']); // 2 choices
    
    let userInputFilter = new Filter({
        userInputContains: true,
        userInputValue: 'New Love'
      } as Filter);
    expect(userInputFilter.toString()).toBe('+name:*_new_love_*')
    expect(userInputFilter.isValid()).toBe(true);
    filterSet.addFilter(userInputFilter)
    expect(filterSet.allFiltersValid()).toBe(true);
  });

  test('User input filter returns correct search strings', () => {
    let userInputFilter = new Filter({
        userInputContains: true,
        userInputValue: 'New Love'
      } as Filter);
    expect(userInputFilter.toString()).toBe('+name:*_new_love_*')
    expect(userInputFilter.isValid()).toBe(true);
    filterSet.addFilter(userInputFilter)

    userInputFilter = new Filter({
      userInputContains: false,
      userInputValue: 'New Love'
    } as Filter);
    expect(userInputFilter.toString()).toBe('-name:*_new_love_*')
    expect(userInputFilter.isValid()).toBe(true);
    filterSet.addFilter(userInputFilter)

    userInputFilter = new Filter({
      userInputContains: true,
      userInputValue: 'Brilliant Light ♥ Rapunzel'
    } as Filter);
    expect(userInputFilter.toString()).toBe('+name:*_brilliant_light_♥_rapunzel_*')  
    expect(userInputFilter.isValid()).toBe(true); 
    filterSet.addFilter(userInputFilter)
  });

  test('Select filter returns correct search strings', () => {
    let selectFilter = new Filter({
      filterType: 'select',
      filterValue: 'genre',
      selectType: 'only',
      selections: []
    } as Filter);
    expect(selectFilter.toString()).toBe(undefined);
    expect(selectFilter.isValid()).toBe(false);
    filterSet.addFilter(selectFilter)

    selectFilter = new Filter({
      filterType: 'select',
      filterValue: 'genre',
      selectType: 'only',
      selections: ['14']
    } as Filter);
    expect(selectFilter.toString()).toBe('+genre:14')
    expect(selectFilter.isValid()).toBe(true);

    selectFilter = new Filter({
      filterType: 'select',
      filterValue: 'special',
      selectType: 'any',
      selections: ['2', '4', '6', '8']
    } as Filter);
    expect(selectFilter.toString()).toBe(undefined);
    expect(selectFilter.isValid()).toBe(true);

    selectFilter = new Filter({
      filterType: null,
    } as Filter);
    expect(selectFilter.toString()).toBe(undefined);
    expect(selectFilter.isValid()).toBe(false);
  });

  test('Checkbox filter returns correct search strings', () => {
    let checkboxFilter = new Filter({
        filterType: 'checkbox',
        filterValue: 'isSuit',
        checkboxIsChecked: true,
      } as Filter);
    expect(checkboxFilter.toString()).toBe('+isSuit:true')
    expect(checkboxFilter.isValid()).toBe(true);

    checkboxFilter = new Filter({
      filterType: 'checkbox',
      filterValue: 'isPosed',
      checkboxIsChecked: false,
    } as Filter);
    expect(checkboxFilter.toString()).toBe('+isPosed:false')
    expect(checkboxFilter.isValid()).toBe(true);
  });

  test('Filter instance search() should only work on multi-select "any" filters', () => {
    const index: SearchIndex = searchState.index;
    expect(firstFilter.search(index)).toBeUndefined();
    expect(firstFilter.isValid()).toBe(false);

    // Fill out default first filter
    firstFilter.setFilterType('select');
    firstFilter.setFilterValue('rare');
    firstFilter.setSelectType('any');
    firstFilter.setSelection(['3', '4']); // 2 choices
    const searchResult = firstFilter.search(index, 10)
    expect(searchResult.length).toBe(20); // 2 choices x 10 = 20
    expect(searchResult).toMatchSnapshot();
  });
});

describe('FilterState', () => {
  let store: Store<any>;
  let state: RootState;
  let mockRootReducer: any;
  
  beforeEach(() => {
    mockRootReducer = combineReducers({
      search: searchReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
    store.dispatch<any>(updateFilterSet(new FilterSet()));
  });

  test('Assert initial state uses default values', async () => {
    const filterSet: FilterSet = store.getState().search.filterSet;
    expect(filterSet.filters.length).toEqual(1);
    expect(filterSet.operator).toBe('and');
  });

  test(`If there are filters, ignore simple search`, async () => {
    // Fill out default first filter
    const filterSet: FilterSet = store.getState().search.filterSet;
    filterSet.filters[0].setUserInputContains(true);
    filterSet.filters[0].setUserInputValue('ariel');

    await store.dispatch<any>(setAdvancedSearch(true));
    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(updateMaxResults(3));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results[0].displayName.includes('Ariel')).toBe(true);
  });

  test(`Looking up items via the NAME filter - ONLY items with "ariel" included`, async () => {
    // Fill out default first filter
    const filterSet: FilterSet = store.getState().search.filterSet;
    filterSet.filters[0].setUserInputContains(true);
    filterSet.filters[0].setUserInputValue('ariel');

    await store.dispatch<any>(setAdvancedSearch(true));
    await store.dispatch<any>(updateMaxResults(20));
    await store.dispatch<any>(searchInventory());

    state = store.getState();
    expect(state.search.results.length).toEqual(16);
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`Looking up items via the NAME filter - ONLY items with "Legend of Light" included`, async () => {
    // Fill out default first filter
    const filterSet: FilterSet = store.getState().search.filterSet;
    filterSet.filters[0].setUserInputContains(true);
    filterSet.filters[0].setUserInputValue('Legend of Light');

    await store.dispatch<any>(setAdvancedSearch(true));
    await store.dispatch<any>(updateMaxResults(3));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results[0].displayName.includes('Legend of Light')).toBe(true);

    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`OR filter - 'little mermaid' OR 'legend of light`, async () => {
    // Fill out default first filter
    const filterSet: FilterSet = store.getState().search.filterSet;
    filterSet.setOperator('or');
    filterSet.filters[0].setUserInputContains(true);
    filterSet.filters[0].setUserInputValue('Legend of Light');

    // Add second filter
    const userInputFilter2 = new Filter({
      userInputContains: true,
      userInputValue: 'Little Mermaid'
    } as Filter);
    filterSet.addFilter(userInputFilter2);

    await store.dispatch<any>(setAdvancedSearch(true));
    await store.dispatch<any>(updateMaxResults(10));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    
    // 2 mermaid suits, 2 LoL suits, 1 LoL dress
    expect(state.search.results.length).toEqual(5); 
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`AND filter - 'little mermaid' AND 'legend of light`, async () => {
    // Fill out default first filter
    const filterSet: FilterSet = store.getState().search.filterSet;
    filterSet.setOperator('and');
    filterSet.filters[0].setUserInputContains(true);
    filterSet.filters[0].setUserInputValue('Legend of Light');

    // Add second filter
    const userInputFilter2 = new Filter({
      userInputContains: true,
      userInputValue: 'Little Mermaid'
    } as Filter);
    filterSet.addFilter(userInputFilter2);

    await store.dispatch<any>(setAdvancedSearch(true));
    await store.dispatch<any>(updateMaxResults(10));
    await store.dispatch<any>(searchInventory());
    state = store.getState();

    expect(state.search.results.length).toEqual(0); 
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });
});
