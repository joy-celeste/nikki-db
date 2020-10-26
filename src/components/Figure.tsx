import React, { CSSProperties } from 'react';
import { Character } from '../modules/character';
import { ItemData, ItemId, ItemsData } from '../modules/data';
import { Body, Item } from '../modules/item';
import { Image } from './Image';

export interface FigureProps {
  itemsData: ItemsData;
  characterData: Character;
}

export const Figure: React.FC<FigureProps> = (props: FigureProps) => {
  let isVisible: boolean;
  let imageName: string;
  let imageStyle: CSSProperties;
  const { itemsData, characterData } = props;

  function renderPieces(item: Item) {
    return item.pieces.map((piece) => {
      isVisible = piece.isVisible;
      imageName = `${item.itemId}-${piece.depth}`;

      imageStyle = {
        top: -piece.y,
        right: piece.width ? -piece.x - Math.max((piece.width - window.innerWidth), 0) : -piece.x,
        bottom: piece.y,
        left: piece.width ? piece.x - Math.max((piece.width - window.innerWidth), 0) : piece.x,
        zIndex: piece.z,
        margin: 'auto',
        position: 'absolute',
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      };
      return <Image key={imageName} visible={isVisible} imageName={imageName} style={imageStyle} />;
    });
  }

  return (
    <div>
      {renderPieces(new Body(characterData.visibleParts))}
      {Object.values(characterData.clothes).map((itemId: ItemId) => {
        const itemData: ItemData = itemsData[itemId];
        const item: Item = itemData ? new Item(itemData) : null;
        return item ? renderPieces(item) : null;
      })}
    </div>
  );
};

export default Figure;
