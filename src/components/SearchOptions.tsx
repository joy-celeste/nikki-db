import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { takeScreenshot } from '../modules/downloader';
import { RootState } from '../modules';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;
const colorOptions = ['red', 'blue', 'yellow', 'green', 'orange', 'pink']

export const SearchOptions = (): JSX.Element => {
  const [background, setBackground] = useState(DEFAULT_BACKGROUND_IMAGE_NAME);
  const downloadName: string = useSelector((state: RootState) => state.editor.downloadName);

  useEffect(() => {
    document.body.style.backgroundImage = getAssetImg(background);
  }, [background]);

  return (
    <div className="searchOptions">
      <button type="button" key="filter" onClick={() => setBackground(background)}>
          Filter
      </button>

      <button type="button" key="sort" onClick={() => setBackground(background)}>
          Sort
      </button>
    </div>
  );
};

export default SearchOptions;
