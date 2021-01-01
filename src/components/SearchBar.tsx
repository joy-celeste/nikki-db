import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchName } from '../modules/search';
import { ItemId, loadItem, loadMultipleItems } from '../modules/data';

const DEFAULT_SEARCH_VALUE = 'Legend of Tulans';

const SearchBar = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState(DEFAULT_SEARCH_VALUE);
  const dispatch = useDispatch();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (searchValue[0] === '[') {
      const items: ItemId[] = JSON.parse(searchValue);
      dispatch(loadMultipleItems(items));
    } else if (Number.isNaN(+searchValue)) {
      dispatch(searchName(searchValue, 10));
    } else {
      dispatch(loadItem(parseInt(searchValue, 10)));
    }
  };

  return (
    <div className="searchbar">
      <form onSubmit={handleSearchSubmit}>
        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchBar;
