import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Character } from '../modules/character';
import { ItemData, SubType } from '../modules/data';
import { Body, Item } from '../modules/item';
import { Image } from './Image';

export const Phone = (): JSX.Element => {
  const itemsData = useSelector((state: RootState) => state.data.itemsData);
  const characterData = useSelector((state: RootState) => state.character.history[state.character.step]);
  const hiddenList = useSelector((state: RootState) => state.editor.hiddenItems);
  const character = new Character(characterData);

  return (
    <div id="phone-image">
      <div id="phone-menu">
        <p>View Full Image</p>
        <p>Download Image</p>
        <p>Change background</p>
        <p>Save to your outfits</p>
        <p>View Full Screen</p>
      </div>
      <img src='assets/fairytale.jpeg' draggable="false" />
    </div>
  );
};

export default Phone;
