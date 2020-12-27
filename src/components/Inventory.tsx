import React from 'react';
import BackgroundOptions from './BackgroundOptions';
import Results from './Results';
import SearchBar from './SearchBar';
import './Inventory.css';
import Categories from './Categories';
import { takeScreenshot } from '../modules/downloader';

export const Inventory = (): JSX.Element => (
  <div className="wrapper">
    <div className="searchbar"><SearchBar /></div>
    <div className="backgroundOptions"><BackgroundOptions />
      <button type="button" onClick={() => takeScreenshot()}>Download!</button>
    </div>
    <div className="categories"><Categories /></div>
    <div className="items">
      <Results />
    </div>
  </div>
);

export default Inventory;
