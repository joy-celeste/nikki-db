import { combineReducers, Store } from 'redux';
import { ItemId } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { Filter, FilterSet, } from '../../modules/filters';
import { searchReducer, updateFilterSet, updateSearchString, searchInventory, updateSortOption, updateMaxResults, setAdvancedSearch } from '../../modules/search';
import { RootState } from '../../modules';
import { sortOptions } from '../../modules/constants';

const seed = (s: any) => {
  return function() {
      s = Math.sin(s) * 10000; return s - Math.floor(s);
  };
};

const mockMath = Object.create(global.Math);
mockMath.random = seed(42);
global.Math = mockMath;

const RELEVANCE_SORT = sortOptions[0];
const ID_SORT = sortOptions[1];

describe('FilterSet', () => {
  let filterSet: FilterSet;

  beforeEach(() => {
    filterSet = new FilterSet();
  });

  test('Initializes to with correct default data', () => {
    expect(filterSet.operator).toBeNull();
    expect(filterSet.filters.length).toBe(0);
    expect(filterSet.id.substring(0,10)).toBe('filterSet-')
    expect(filterSet).toMatchSnapshot();
  });

  test('Correctly changes operator', () => {
    expect(filterSet.operator).toBeNull();
    filterSet.setOperator('and');
    expect(filterSet.operator).toBe('and');
  });

  test('Correctly adds and removes filter', () => {
    const userInputFilter = new Filter({userInputContains: true, userInputValue: 'love'} as Filter);
    const checkboxFilter = new Filter({filterType: 'checkbox', filterValue: 'isPosed'} as Filter);

    filterSet.addFilter(userInputFilter);
    expect(filterSet.filters.length).toBe(1);

    filterSet.addFilter(checkboxFilter);
    expect(filterSet.filters.length).toBe(2);
    expect(filterSet).toMatchSnapshot();

    filterSet.removeFilter(userInputFilter)
    expect(filterSet.filters.length).toBe(1);
    expect(filterSet).toMatchSnapshot();
  });

  test('Correctly creates AND search term from multiple filters', () => {
    const userInputFilter = new Filter({userInputContains: true, userInputValue: 'love'} as Filter);
    const checkboxFilter = new Filter({filterType: 'checkbox', filterValue: 'isPosed'} as Filter);

    filterSet.addFilter(userInputFilter);
    filterSet.addFilter(checkboxFilter);
    expect(filterSet.toString()).toBe('+name:*love* +isPosed:true')
  });
});

describe('Filter', () => {
  test('Initializes to with correct default data', () => {
    let filter = new Filter();
    expect(filter.filterType).toBe('userInput');
    expect(filter.filterValue).toBe('name');
    expect(filter.userInputValue).toBe('');
    expect(filter.userInputContains).toBe(true);
    expect(filter.selectType).toBe('any');
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
    filter.setSelectType('only');
    filter.setSelection(['a']);
    filter.setCheckboxIsChecked(false);

    expect(filter.filterType).toBe('select');
    expect(filter.filterValue).toBe('genre');
    expect(filter.userInputValue).toBe('test-string');
    expect(filter.userInputContains).toBe(false);
    expect(filter.selectType).toBe('only');
    expect(filter.selections.length).toBe(1);
    expect(filter.checkboxIsChecked).toBe(false);
    expect(filter).toMatchSnapshot();
  });

  test('User input filter returns correct search strings', () => {
    let userInputFilter = new Filter({
        userInputContains: true,
        userInputValue: 'New Love'
      } as Filter);
    expect(userInputFilter.toString()).toBe('+name:*new_love*')

    userInputFilter = new Filter({
      userInputContains: false,
      userInputValue: 'New Love'
    } as Filter);
    expect(userInputFilter.toString()).toBe('-name:*new_love*')

    userInputFilter = new Filter({
      userInputContains: true,
      userInputValue: 'Brilliant Light ♥ Rapunzel'
    } as Filter);
    expect(userInputFilter.toString()).toBe('+name:*brilliant_light_♥_rapunzel*')   
  });

  test('Select filter returns correct search strings', () => {
    let selectFilter = new Filter({
      filterType: 'select',
      filterValue: 'genre',
      selectType: 'only',
      selections: ['14']
    } as Filter);
    expect(selectFilter.toString()).toBe('+genre:14')

    selectFilter = new Filter({
      filterType: 'select',
      filterValue: 'special',
      selectType: 'any',
      selections: ['2', '4', '6', '8']
    } as Filter);
    expect(selectFilter.toString()).toBe('special:2 special:4 special:6 special:8')
  });

  test('Checkbox filter returns correct search strings', () => {
    let checkboxFilter = new Filter({
        filterType: 'checkbox',
        filterValue: 'isSuit',
        checkboxIsChecked: true,
      } as Filter);
    expect(checkboxFilter.toString()).toBe('+isSuit:true')

    checkboxFilter = new Filter({
      filterType: 'checkbox',
      filterValue: 'isPosed',
      checkboxIsChecked: false,
    } as Filter);
    expect(checkboxFilter.toString()).toBe('+isPosed:false')
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
    expect(filterSet.filters.length).toEqual(0);
    expect(filterSet.operator).toBeNull();
  });

  test(`If there are filters, ignore simple search`, async () => {
    let userInputFilter = new Filter({
      userInputContains: true,
      userInputValue: 'ariel'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.addFilter(userInputFilter);
    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateSearchString('love'));
    await store.dispatch<any>(updateMaxResults(3));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results[0].displayName.includes('Ariel')).toBe(true);
  });

  test(`Looking up items via the NAME filter - ONLY items with "ariel" included`, async () => {
    let userInputFilter = new Filter({
      userInputContains: true,
      userInputValue: 'ariel'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.addFilter(userInputFilter);

    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateMaxResults(20));
    await store.dispatch<any>(searchInventory());

    state = store.getState();
    expect(state.search.results.length).toEqual(16);
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`Looking up items via the NAME filter - ONLY items with "Legend of Light" included`, async () => {
    let userInputFilter = new Filter({
      userInputContains: true,
      userInputValue: 'Legend of Light'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.addFilter(userInputFilter);
    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateMaxResults(3));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    expect(state.search.results[0].displayName.includes('Legend of Light')).toBe(true);

    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`OR filter - 'little mermaid' OR 'legend of light`, async () => {
    const userInputFilter1 = new Filter({
      userInputContains: true,
      userInputValue: 'Legend of Light'
    } as Filter);
    const userInputFilter2 = new Filter({
      userInputContains: true,
      userInputValue: 'Little Mermaid'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.setOperator('or');
    currFilterSet.addFilter(userInputFilter1);
    currFilterSet.addFilter(userInputFilter2);
    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateMaxResults(10));
    await store.dispatch<any>(searchInventory());
    state = store.getState();
    
    // 2 mermaid suits, 2 LoL suits, 1 LoL dress
    expect(state.search.results.length).toEqual(5); 
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`AND filter - 'little mermaid' OR 'legend of light`, async () => {
    const userInputFilter1 = new Filter({
      userInputContains: true,
      userInputValue: 'Legend of Light'
    } as Filter);
    const userInputFilter2 = new Filter({
      userInputContains: true,
      userInputValue: 'Little Mermaid'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.setOperator('and');
    currFilterSet.addFilter(userInputFilter1);
    currFilterSet.addFilter(userInputFilter2);
    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateMaxResults(10));

    await store.dispatch<any>(searchInventory());
    state = store.getState();
  
    expect(state.search.results.length).toEqual(0); 
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });

  test(`AND filter - 'little mermaid' OR 'legend of light`, async () => {
    const userInputFilter1 = new Filter({
      userInputContains: true,
      userInputValue: 'Legend of Light'
    } as Filter);
    const userInputFilter2 = new Filter({
      userInputContains: true,
      userInputValue: 'Little Mermaid'
    } as Filter);
    
    const currFilterSet = store.getState().search.filterSet;
    currFilterSet.setOperator('and');
    currFilterSet.addFilter(userInputFilter1);
    currFilterSet.addFilter(userInputFilter2);
    await store.dispatch<any>(updateFilterSet(currFilterSet));
    await store.dispatch<any>(updateMaxResults(10));

    await store.dispatch<any>(searchInventory());
    state = store.getState();
  
    expect(state.search.results.length).toEqual(0); 
    expect(state.search.filterSet).toMatchSnapshot();
    expect(state.search.results).toMatchSnapshot();
  });
});
