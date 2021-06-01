import React from 'react';
import { ItemId } from '../modules/data';

export interface IconProps {
  clothesId: ItemId;
  disabled?: boolean
}

export const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { clothesId, disabled } = props;

  return (
    <div className="icon-wrapper">
      <img className={`${disabled ? 'disabled' : ''}`} src={`https://www.miraland.net/assets/clothes_icons/icon${clothesId}.png`}/>
    </div>
  );
};

export default Icon;