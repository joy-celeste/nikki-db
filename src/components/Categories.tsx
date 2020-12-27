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

  return menu.menuStrings ? (
    <div>
      <ul>
        {menu.menuLocation[0] ? (
          <li
            onKeyPress={() => dispatch(goUpMenu())}
            onClick={() => dispatch(goUpMenu())}
          > Go back
          </li>
        ) : null}
        {menu.getStrings().map((item: string, index: number) => (
          <li
            key={`${item}_${index}`}
            onKeyPress={() => dispatch(goDownMenu(index, (subtype: SubType) => dispatch(searchName(`posed:true subtype:${subtype}`))))}
            onClick={() => dispatch(goDownMenu(index, (subtype: SubType) => dispatch(searchName(`posed:true subtype:${subtype}`))))}
          >{item}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Categories;
