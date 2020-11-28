import React, { useEffect, useState } from 'react';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;

export const BackgroundOptions = (): JSX.Element => {
  const [background, setBackground] = useState(DEFAULT_BACKGROUND_IMAGE_NAME);

  useEffect(() => {
    document.body.style.backgroundImage = getAssetImg(background);
  }, [background]);

  return (
    <div>
      {DEFAULT_BACKGROUND_OPTIONS.map((backgroundName) => (
        <button type="button" key={backgroundName} onClick={() => setBackground(backgroundName)}>
          {backgroundName}
        </button>
      ))}
    </div>
  );
};

export default BackgroundOptions;
