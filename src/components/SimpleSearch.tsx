import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchInventory, updateSearchString } from '../modules/search';
import { ItemId, loadItem, loadMultipleItems } from '../modules/data';
import { RootState } from '../modules';
import SearchToggle from './SearchToggle';

const SearchText = (props: any): JSX.Element => {
  const searchResults = useSelector((state: RootState) => state.search.results);

  return (<span className="searchInputText">
    {searchResults ? (<b>Searching for ... "{props.text}" ... found {searchResults.length} results!</b>) : null}
    <input type="submit" value="Go Back" onClick={props.onClickBack} />
  </span>)
};

const SearchBar = (): JSX.Element => {
  let textInput: HTMLInputElement = null;
  const [showResult, setShowResult] = useState(false);
  const searchValue = useSelector((state: RootState) => state.search.simpleSearchString);
  const dispatch = useDispatch();

  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setShowResult(true);
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
    <div className="simpleSearch">
      {showResult ? <SearchText onClickBack={() => setShowResult(false)} text={searchValue} />
        : (
          <form onSubmit={handleSearchSubmit}>
            <span className="searchbar">
              <input
                value={searchValue}
                onClick={() => textInput.focus()}
                ref={(input) => textInput = input}
                onChange={(e) => dispatch(updateSearchString(e.target.value.toString()))}
              />
            </span>
            <input type="submit" value={"Search"}/>
            <span className="toggle"><SearchToggle initialValue={false}/></span>
          </form>
        )}
    </div>
  );
};

export default SearchBar;
