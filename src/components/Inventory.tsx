import React from 'react';
import BackgroundOptions from './BackgroundOptions';
import Results from './Results';
import SearchBar from './SearchBar';
import './Inventory.css';
import Downloader from './Downloader';
import Categories from './Categories';

export const Inventory = (): JSX.Element => (
  <div className="wrapper">
    <div className="searchbar"><SearchBar /></div>
    <div className="backgroundOptions"><BackgroundOptions /> <Downloader /></div>
    <div className="categories"><Categories /></div>
    <div className="items">
      <Results />
    </div>
  </div>
);

export default Inventory;
