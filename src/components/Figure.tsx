import React, { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { BodyPart, Character } from '../modules/character';
import { ItemData, ItemId, SubType } from '../modules/data';
import { Body, Item } from '../modules/item';
import { Image } from './Image';

export const Figure = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const characterData = useSelector((state: RootState) => state.character.history[state.character.step]);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);
  let character = new Character(characterData);

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
      {Object.entries(characterData.clothes).map(([subType, itemId]) => {
        console.log(subType, itemId)
        if (!hiddenList.has(itemId)) {
          const itemData: ItemData = itemsData[itemId];
          const item: Item = itemData ? new Item(itemData) : null;
          return item ? renderPieces(item) : null;
        } else {
          character.remove(parseInt(subType) as SubType);
        }
      })}
      {renderPieces(new Body(character.visibleParts))}
    </div>
  );
};

export default Figure;
