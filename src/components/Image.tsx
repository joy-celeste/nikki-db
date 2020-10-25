import React, { CSSProperties } from 'react';

export interface ImageProps {
  visible: boolean;
  style: CSSProperties;
  imageName: string;
}

export const Image: React.FC<ImageProps> = (props: ImageProps) => {
  const { visible, style, imageName } = props;

  return (visible ? (
    <img
      id={imageName}
      style={style}
      src={`clothes/${imageName}.png`}
      alt={imageName}
    />
  ) : null);
};

export default Image;
