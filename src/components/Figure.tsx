import React, { CSSProperties, PureComponent, ReactNode } from 'react';
import { Character } from '../modules/character';

export interface FigureProps {
  characterData: Character;
}

export const Figure: React.FC<FigureProps> = (props: FigureProps) => (
  <div>
    {Object.entries(props.characterData).map(([key, value]) =>
      `Key: ${key} - Name: ${value.name} - Value: ${JSON.stringify(value)}`)}
  </div>
);

export default Figure;
