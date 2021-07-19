import React, { useEffect } from 'react';
import Phone from 'components/Phone';
import Closet from 'components/Closet';
import Inventory from 'components/Inventory';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUrlParams } from 'use-cases/loadUrlParams';
import './base.css';
import './App.css';
import './items.css';
import './filters.css';
import { currentUrlParams } from 'redux/selectors/character-selectors';
import { SIMULATOR_HEADER } from 'modules/constants';

const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const updatedUrlParams = useSelector(currentUrlParams);

  useEffect(() => {
    dispatch(loadUrlParams(urlParams))
  }, [])

  useEffect(() => {
    window.history.replaceState(null, SIMULATOR_HEADER, updatedUrlParams);
  }, [updatedUrlParams])
  
  return (
    <div id="content">
      <div id="phone" className="window"><Phone/></div>
      <div id="inventory" className="window"><Inventory /></div>
      <div id="closet" className="window"><Closet/></div>
    </div>
  );
};

export default App;