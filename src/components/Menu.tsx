import React, { ReactNode } from 'react';
import './Menu.css';

export interface MenuProps {
  children: ReactNode;
  minimized: boolean;
  active: boolean;
  top: number;
  right?: number;
  left?: number;
}

export const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const { minimized, active, children, top, right } = props;
  const style = {
    top,
    right,
  };

  return <div style={style} className="window"> {minimized} {active} {children} </div>;
};

export default Menu;
