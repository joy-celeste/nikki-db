import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchName } from '../modules/search';
import { loadItem } from '../modules/data';

const DEFAULT_SEARCH_VALUE = 'turins legend';

const SearchBar = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState(DEFAULT_SEARCH_VALUE);
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (Number.isNaN(+searchValue)) {
      dispatch(searchName(searchValue));
    } else {
      dispatch(loadItem(parseInt(searchValue, 10)));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default SearchBar;
