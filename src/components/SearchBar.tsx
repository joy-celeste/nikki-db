import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchName } from '../modules/search';
import { ItemId, ItemsData, loadItem, loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';

const DEFAULT_SEARCH_VALUE = 'Legend of Tulans';

const SearchBar = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState(DEFAULT_SEARCH_VALUE);
  const itemsData: ItemsData = useSelector((state: RootState) => state.data.itemsData);
  const dispatch = useDispatch();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (searchValue[0] === '[') {
      const items: ItemId[] = JSON.parse(searchValue);
      dispatch(loadMultipleItems(items))
    } else if (Number.isNaN(+searchValue)) {
      dispatch(searchName(searchValue));
    } else {
      dispatch(loadItem(parseInt(searchValue, 10)));
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchBar;
