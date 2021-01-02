import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { SubType } from '../modules/data';
import { goDownMenu, goUpMenu, Menu } from '../modules/editor';
import { searchName } from '../modules/search';
import './Categories.css';

export const Categories = (): JSX.Element => {
  const menu: Menu = useSelector((state: RootState) => state.editor.menu);
  const dispatch = useDispatch();

  const onClickSubtype = (index: number) => dispatch(goDownMenu(index, (subtype: SubType) => dispatch(searchName(`subtype:${subtype}`))));

  return menu.menuStrings ? (
    <div className="categories">
      <ul>
        {menu.menuLocation[0] ? (
          <li>
            <button onClick={() => dispatch(goUpMenu())}>
              Go back
            </button>
          </li>
        ) : null}
        {menu.getStrings().map((item: string, index: number) => (
          <li key={item}>
            <button onClick={() => onClickSubtype(index)}>
              {item.split('_').join(' ')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Categories;
