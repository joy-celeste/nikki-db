import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Character } from '../modules/character';
import { ItemData, SubType } from '../modules/data';
import { Body, Item } from '../modules/item';
import { Image } from './Image';
import { getImagePayload } from '../modules/api';
import { ItemId } from '../modules/data';

export const Phone = (): JSX.Element => {
  const characterData = useSelector((state: RootState) => state.character.history[state.character.step]);
  const clothes = new Character(characterData).clothes;
  const [image, setImage] = useState('assets/fairytale.jpeg');

  const parsePayload = (response: any) => {
    setImage(JSON.parse(response.Payload).url);
  };
  
  useEffect(() => {
    const itemIds: ItemId[] = Object.values(clothes);
    const response = getImagePayload(itemIds, parsePayload);
  }, [characterData])

  return (
    <div id="phone-image">
      <div id="phone-menu">
        <p>View Full Image</p><br></br>
        <p>Download Image</p><br></br>
        <p>Change background</p><br></br>
        <p>Generate Link</p><br></br>
        <p>View Full Screen</p><br></br>
        <p>Toggle On Autorender Image</p><br></br>
        <p>Render Image</p><br></br>
      </div>
      <img src={image} draggable="false" />
    </div>
  );
};

export default Phone;
