import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAdvancedSearch, updateFilterSet, updateSearchString } from '../redux/actions/search-actions';
import { FilterSet } from '../modules/filters';

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
    <div id="filterToggle">
      <table>
        <tr>
          <td id={useAdvancedSearch ? '': 'selected'}><a onClick={() => setToggle(false)}>Simple Search</a></td>
          <td id={useAdvancedSearch ? 'selected': ''}><a onClick={() => setToggle(true)}>Advanced Search</a></td>
        </tr>
      </table>
    </div>
  );
};

export default SearchToggle;
