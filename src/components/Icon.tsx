import React from 'react';
import { ItemId } from '../modules/data';
import './Icon.css';

export interface IconProps {
  clothesId: ItemId;
  disabled?: boolean
}

export const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { clothesId, disabled } = props;

  return (
    <div className="icon-wrapper">
      <div className={`${disabled ? 'disabled' : ''} icon${clothesId}`} />
    </div>
  );
};

export default Icon;
