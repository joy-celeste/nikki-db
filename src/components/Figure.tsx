import React, { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId } from '../modules/data';
import { Body, Item } from '../modules/item';
import { Image } from './Image';

export const Figure = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const characterData = useSelector((state: RootState) => state.character.history[state.character.step]);

  function renderPieces(item: Item) {
    return item.pieces.map((piece) => {
      const isVisible = piece.isVisible;
      const imageName = `${item.itemId}-${piece.depth}`;
      const imageStyle: CSSProperties = {
        top: -piece.y,
        right: piece.width ? -piece.x - Math.max((piece.width - window.innerWidth), piece.width) : -piece.x,
        bottom: piece.y,
        left: piece.width ? piece.x - Math.max((piece.width - window.innerWidth), piece.width) : piece.x,
        zIndex: piece.z,
        margin: 'auto',
        position: 'absolute',
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
