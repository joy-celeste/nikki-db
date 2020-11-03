import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem, loadMultipleItems } from '../modules/data';
import { Character } from '../modules/character';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import { searchName, SearchResult } from '../modules/search';
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
  loadMultipleItems(itemIds: ItemId[]): void,
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
      searchValue: 'abyssal creeper',
    };
  }

  componentDidMount() {
    this.props.loadItem(10001);
    this.updateBackground('medium');
  }

  handleLookupSubmit = (event: any) => {
    event.preventDefault();
    this.props.loadItem(parseInt(this.state.itemLookupValue, 10));
  };

  handleSearchSubmit = (event: any) => {
    event.preventDefault();
    this.props.searchName(this.state.searchValue);
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

  updateBackground = (backgroundImageName: string) => {
    document.body.style.backgroundImage = `url(/assets/${backgroundImageName}.jpg)`;
  };

  renderSearchResults(results: SearchResult[]) {
    return results ? results.map((result: SearchResult) => (
      <button key={`${result.name}-${result.iconId}`} type="button" onClick={() => { this.props.loadMultipleItems(result.contents); }}>
        <Icon clothesId={result.iconId} />
        {result.name}
      </button>
    )) : null;
  }

  render() {
    const { character, itemsData, searchResults } = this.props;
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
            {this.renderSearchResults(searchResults)}
          </div>

          <p>
            <button type="button" onClick={() => { this.updateBackground('light'); }}> Light </button>
            <button type="button" onClick={() => { this.updateBackground('light2'); }}> Light2 </button>
            <button type="button" onClick={() => { this.updateBackground('medium'); }}> Medium </button>
            <button type="button" onClick={() => { this.updateBackground('dark'); }}> Dark </button>
            <button type="button" onClick={() => { this.updateBackground('dark2'); }}>Dark2</button>
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
  loadMultipleItems: (itemIds: ItemId[]) => dispatch(loadMultipleItems(itemIds)),
  searchName: (searchTerm: string) => dispatch(searchName(searchTerm)),
});

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
