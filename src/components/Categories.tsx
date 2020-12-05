import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { goDownMenu, goUpMenu, Menu } from '../modules/editor';
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
            onKeyPress={() => dispatch(goDownMenu(index))}
            onClick={() => dispatch(goDownMenu(index))}
          >{item}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default Categories;
