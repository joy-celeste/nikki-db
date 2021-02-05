import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchInventory, updateSearchString } from '../modules/search';
import { ItemId, loadItem, loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';

const SearchBar = (): JSX.Element => {
  let textInput: HTMLInputElement = null;

  const searchValue = useSelector((state: RootState) => state.search.userInput);
  const dispatch = useDispatch();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (searchValue[0] === '[') { // Load multiple items
      const items: ItemId[] = JSON.parse(searchValue);
      dispatch(loadMultipleItems(items));
    } else if (Number.isNaN(+searchValue)) { // Search term
      dispatch(searchInventory());
    } else {
      dispatch(loadItem(parseInt(searchValue, 10))); // Wear one item
    }
  };

  return (
    <div className="searchbar">
      <form onSubmit={handleSearchSubmit}>
        <span className="searchbar-input">
          <input
            value={searchValue}
            onClick={() => textInput.focus()}
            ref={(input) => textInput = input}
            onChange={(e) => dispatch(updateSearchString(e.target.value.toString()))} />
        </span>
        <span>
          <input type="submit" value="Search" />
        </span>
      </form>
    </div>
  );
};

export default SearchBar;
