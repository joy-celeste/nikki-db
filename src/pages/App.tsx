import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem } from '../modules/data';
import { Character, wearItem } from '../modules/character';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import { searchName, SearchResult } from '../modules/search';
import index_ref_to_name from '../index_ref_to_name.json';
import Icon from '../components/Icon';

export interface AppOwnState {
  itemLookupValue: string,
  searchValue: string,
}

export interface AppStateProps {
  itemsData: Record<ItemId, ItemData>,
  character: Character,
  searchResults: SearchResult[],
}

export interface AppDispatchProps {
  dispatch: any;
  loadItem(itemId: ItemId): void,
  searchName(searchName: string): void,
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps, AppOwnState> {
  index: any;
  refToName: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      itemLookupValue: '',
      searchValue: '',
    };
  }

  componentDidMount() {
    const { loadItem, searchResults } = this.props;
    loadItem(10001);
    this.handleClickBackground('medium');
    this.refToName = JSON.parse(JSON.stringify(index_ref_to_name));
    console.log(searchResults)
  }

  handleLookupSubmit = (event: any) => {
    const { itemLookupValue } = this.state;
    const { loadItem } = this.props;
    event.preventDefault();
    loadItem(parseInt(itemLookupValue, 10));
  };

  handleSearchSubmit = (event: any) => {
    const { searchValue } = this.state;
    event.preventDefault();
    this.props.searchName(searchValue);
  };

  handleLookupChange = (event: any) => {
    this.setState({
      itemLookupValue: event.target.value,
    });
  };

  handleSearchChange = (event: any) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  handleClickBackground = (backgroundImageName: string) => {
    document.body.style.backgroundImage = `url(/assets/${backgroundImageName}.jpg)`;
  };

  renderSelectionIcon(clothesId: number, itemName: string) {
    const { loadItem } = this.props;
    return (
      <button key={itemName} type="button" onClick={() => { loadItem(clothesId); }}>
        <Icon clothesId={clothesId} />
        {itemName}
      </button>
    );
  }

  renderSearchResults = (results: SearchResult[]) => results.map((result: SearchResult) => {
    return this.renderSelectionIcon(result.iconId, result.itemName);
  });

  render() {
    const { loadItem, character, itemsData, searchResults } = this.props;
    const { itemLookupValue, searchValue } = this.state;

    return (
      <div className="App">
        <div className="canvas-form">
          <form onSubmit={this.handleLookupSubmit} onChange={this.handleLookupChange}>
            <input value={itemLookupValue} onChange={this.handleLookupChange} />
            <input type="submit" value="Submit Item Id" />
          </form>

          <form onSubmit={this.handleSearchSubmit}>
            <input value={searchValue} onChange={this.handleSearchChange} />
            <input type="submit" value="Search" />
          </form>

          <div className="searchResults">
            {searchResults ? this.renderSearchResults(searchResults) : null}
          </div>

          <p>
            <button type="button" onClick={() => { this.handleClickBackground('light'); }}> Light </button>
            <button type="button" onClick={() => { this.handleClickBackground('alight2'); }}> Light2 </button>
            <button type="button" onClick={() => { this.handleClickBackground('medium'); }}> Medium </button>
            <button type="button" onClick={() => { this.handleClickBackground('dark'); }}> Dark </button>
            <button type="button" onClick={() => { this.handleClickBackground('dark2'); }}>Dark2</button>
          </p>

          <p>
            <button type="button" onClick={() => { loadItem(12212); }}>Lucid Song (hair)</button>
            <button type="button" onClick={() => { loadItem(21032); }}>Cosmos Tide (dress)</button>
            <button type="button" onClick={() => { loadItem(82284); }}>Glittering Veil (posed gloves)</button>
            <button type="button" onClick={() => { loadItem(31006); }}>Star Sea Echo (posed coat)</button>
            <button type="button" onClick={() => { loadItem(71784); }}>Treasure Collection (posed shoes)</button>
            <button type="button" onClick={() => { loadItem(83696); }}>Moon Frost</button>
            <button type="button" onClick={() => { loadItem(85217); }}>Novice Witch (hat)</button>
            <button type="button" onClick={() => { loadItem(86099); }}>Galaxy Poem (earrings)</button>
            <button type="button" onClick={() => { loadItem(86115); }}>Reflection on Water (ground)</button>
            <button type="button" onClick={() => { loadItem(86777); }}>Dancing Flower (head?)</button>
            <button type="button" onClick={() => { loadItem(90449); }}>Priceless (makeup)</button>
            <button type="button" onClick={() => { loadItem(880048); }}>Deer and Cliff</button>
          </p>
        </div>

        <div className="equipped">
          {Object.values(character.clothes).map((clothesId) => <Icon key={clothesId} clothesId={clothesId} />)}
        </div>

        <div className="canvas-figure">
          <Draggable>
            <Figure itemsData={itemsData} characterData={character} />
          </Draggable>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): AppStateProps => ({
  itemsData: state.data.itemsData,
  character: state.character.history[state.character.step],
  searchResults: state.search.results,
});

const mapDispatchToProps = (dispatch: any): AppDispatchProps => ({
  dispatch,
  loadItem: (itemId: ItemId) => dispatch(loadItem(itemId)),
  searchName: (searchTerm: string) => dispatch(searchName(searchTerm)),
});

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
