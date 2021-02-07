import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { SubType } from '../modules/data';
import { goDownMenu, goUpMenu, Menu } from '../modules/editor';
import { updateSearchSubtype, searchInventory, DEFAULT_MAX_RESULTS_CATEGORY } from '../modules/search';

export const Categories = (): JSX.Element => {
  const menu: Menu = useSelector((state: RootState) => state.editor.menu);
  const hideCategories = useSelector((state: RootState) => state.search.hideCategories);

  const dispatch = useDispatch();
  const onClickSubtype = (index: number) => dispatch(goDownMenu(index, (subtype: SubType) => {
    dispatch(updateSearchSubtype(subtype));
    dispatch(searchInventory(DEFAULT_MAX_RESULTS_CATEGORY));
  }));

  return menu.menuStrings && !hideCategories ? (
    <div className="categories">
      <ul>
        {menu.menuLocation[0] ? (
          <li>
            <button type="button" onClick={() => dispatch(goUpMenu())}>
              Go back
            </button>
          </li>
        ) : null}
        {menu.getStrings().map((item: string, index: number) => (
          <li key={item}>
            <button type="button" onClick={() => onClickSubtype(index)}>
              {item.split('_').join(' ')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Categories;
