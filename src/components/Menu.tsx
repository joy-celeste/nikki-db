import React, { ReactNode } from 'react';

export interface MenuProps {
  children: ReactNode;
  minimized: boolean;
  active: boolean;
  top: number;
  right?: number;
  left?: number;
}

export const Menu: React.FC<MenuProps> = (props: MenuProps): JSX.Element => {
  const { minimized, active, children, top, left, right } = props;
  const leftStyle = { top, left };
  const rightStyle = { top, right };

  return (
    <div
      style={left ? leftStyle : rightStyle}
      className={`window${active ? ' active' : ''}${minimized ? ' minimized' : ''}`}
    >
      {children}
    </div>
  );
};

export default Menu;
