import React from 'react';
import { ItemId } from '../modules/data';
import './Icon.css';

export interface IconProps {
  clothesId: ItemId;
}

export const Icon: React.FC<IconProps> = (props: IconProps) => (
  <div className="icon-wrapper">
    <div className={`icon icon${props.clothesId}`} />
  </div>
);

export default Icon;
