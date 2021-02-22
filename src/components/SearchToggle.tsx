import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FilterSet } from '../modules/filters';
import { setAdvancedSearch, updateFilterSet, updateSearchString } from '../modules/search';

interface SearchToggleProps {
  initialValue: boolean;
}

export const SearchToggle = (props: SearchToggleProps): JSX.Element => {
  const { initialValue } = props;
  const [useAdvancedSearch, setToggle] = useState(initialValue);
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
