import React from 'react';
import { useSelector } from 'react-redux';
import BackgroundOptions from './BackgroundOptions';
import Results from './Results';
import SearchBar from './SearchBar';
import './Inventory.css';
import Categories from './Categories';
import { takeScreenshot } from '../modules/downloader';
import { RootState } from '../modules';

export const Inventory = (): JSX.Element => {
  const downloadName: string = useSelector((state: RootState) => state.data.downloadName);

  return (
    <div className="wrapper">
      <div className="searchbar"><SearchBar /></div>
      <div className="backgroundOptions"><BackgroundOptions />
        <button type="button" onClick={() => takeScreenshot(downloadName)}>{`Download ${downloadName}!`}</button>
      </div>
      <div className="categories"><Categories /></div>
      <div className="items">
        <Results />
      </div>
    </div>
  );
};

export default Inventory;
