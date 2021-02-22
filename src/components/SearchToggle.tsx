import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FilterSet } from '../modules/filters';
import { setAdvancedSearch, updateFilterSet, updateSearchString } from '../modules/search';

export const SearchToggle = (props: any): JSX.Element => {
  const [useAdvancedSearch, setToggle] = useState(props.initialValue);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAdvancedSearch(useAdvancedSearch));
    if (useAdvancedSearch) {
      dispatch(updateSearchString(''));
    } else {
      dispatch(updateFilterSet(new FilterSet()));
    }
  }, [useAdvancedSearch]);

  return (
    <a onClick={() => setToggle(!useAdvancedSearch)}>
      <span>  </span>
      <u>{useAdvancedSearch ? 'Nevermind.' : 'Advanced Search'}</u>
      <span>  </span>
    </a>
  );
};

export default SearchToggle;
