import SearchIndex, { SearchResult, SearchState, RefToSearchData } from '../../modules/search';

describe('SearchIndex', () => {
  test('Expect search index to initialize correctly with no errors', () => {
    const index = new SearchIndex();
    expect(1).toEqual(1);
  });
});
