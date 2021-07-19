import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ItemId } from 'models/Item';
import { generateImage } from 'modules/api';
import { selectCurrentItemIds } from 'redux/selectors/character-selectors';
import { useRef } from 'react';
import { useHorizontalScroll } from 'modules/horizontal-scroll';

export const Phone = (): JSX.Element => {
  const scrollRef = useHorizontalScroll();
  const itemIds: ItemId[] = useSelector(selectCurrentItemIds);
  const [image, setImage] = useState('assets/fairytale.jpeg');

  useEffect(() => {
    generateImage(itemIds, setImage);
  }, [itemIds])

  return (
    <div id="phone-image" ref={scrollRef}>
      <div id="phone-menu">
        <p>View Full Image</p><br></br>
        <p>Download Image</p><br></br>
        <p>Change Background</p><br></br>
        <p>Generate Link</p><br></br>
        <p>View Full Screen</p><br></br>
        <p>Toggle On Autorender Image</p><br></br>
        <p>Render Image</p><br></br>
      </div>
      <img src={image}/>
    </div>
  );
};

export default Phone;