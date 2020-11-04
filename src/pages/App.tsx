import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem, loadMultipleItems } from '../modules/data';
import { Character, Clothes } from '../modules/character';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import { searchName, SearchResult } from '../modules/search';
import Icon from '../components/Icon';
import Result from '../components/Result';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];

export interface AppOwnState {
  searchValue: string,
  backgroundImageName: string,
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
  document: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchValue: 'abyssal creeper',
      backgroundImageName: DEFAULT_BACKGROUND_IMAGE_NAME,
    };
  }

  componentDidMount() {
    const { loadItem } = this.props;
    loadItem(10001);
    document.body.style.backgroundImage = `url(/assets/${DEFAULT_BACKGROUND_IMAGE_NAME}.jpg)`;
  }

  componentDidUpdate(_: AppProps, prevState: AppOwnState) {
    const { backgroundImageName } = this.state;
    if (prevState.backgroundImageName !== backgroundImageName) {
      document.body.style.backgroundImage = `url(/assets/${backgroundImageName}.jpg)`;
    }
  }

  handleSearchSubmit = (event: any) => {
    event.preventDefault();
    const { searchName, loadItem } = this.props;
    const { searchValue } = this.state;

    if (Number.isNaN(+searchValue)) {
      searchName(searchValue);
    } else {
      loadItem(parseInt(searchValue, 10));
    }
  };

  handleSearchChange = (event: any) => {
    this.setState({ searchValue: event.target.value });
  };

  renderSearchResults(results: SearchResult[]) {
    const { loadItem, loadMultipleItems } = this.props;
    return results ? results.map(result => 
      <Result loadItem={loadItem} loadMultipleItems={loadMultipleItems} result={result} />
    ) : null;
  }

  renderBackgroundOptions(backgroundOptions: string[]): React.ReactNode {
    const updateState = (backgroundName: string) => {
      this.setState({ backgroundImageName: backgroundName });
    };
    return backgroundOptions.map((backgroundName) => (
      <button type="button" onClick={() => { updateState(backgroundName); }}>
        {backgroundName}
      </button>
    ));
  }

  renderEquippedItems(clothes: Clothes) {
    return Object.values(clothes).map(clothesId => <Icon key={clothesId} clothesId={clothesId}/>);
  };

  render() {
    const { character, itemsData, searchResults } = this.props;
    const { searchValue } = this.state;

    return (
      <div className="App">
        <div className="form">
          <form onSubmit={this.handleSearchSubmit}>
            <input value={searchValue} onChange={this.handleSearchChange} />
            <input type="submit" value="Search" />
          </form>

          <div className="backgroundOptions"> {this.renderBackgroundOptions(DEFAULT_BACKGROUND_OPTIONS)} </div>
          <div className="searchResults"> {this.renderSearchResults(searchResults)}</div>
          <div className="equipped"> {this.renderEquippedItems(character.clothes)}</div>
        </div>

        <div className="figure">
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
