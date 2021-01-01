import React, { useEffect, useState } from 'react';
import { takeScreenshot } from '../modules/downloader';
import { RootState } from '../modules';
import { useSelector } from 'react-redux';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;

export const BackgroundOptions = (): JSX.Element => {
  const [background, setBackground] = useState(DEFAULT_BACKGROUND_IMAGE_NAME);
  const downloadName: string = useSelector((state: RootState) => state.editor.downloadName);

  useEffect(() => {
    document.body.style.backgroundImage = getAssetImg(background);
  }, [background]);

  return (
    <div className="backgroundOptions">
      {DEFAULT_BACKGROUND_OPTIONS.map((backgroundName) => (
        <button type="button" key={backgroundName} onClick={() => setBackground(backgroundName)}>
          {backgroundName}
        </button>
      ))}
      <button type="button" onClick={() => takeScreenshot(downloadName)}>{`Download ${downloadName}!`}</button>
    </div>
  );
};

export default BackgroundOptions;
