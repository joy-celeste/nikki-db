import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem, loadMultipleItems } from '../modules/data';
import { Character } from '../modules/character';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import { searchName, SearchResult } from '../modules/search';
import Result from '../components/Result';
import Menu from '../components/Menu';
import Equipped from '../components/Equipped';

const DEFAULT_SEARCH_VALUE = 'abyssal creeper';
const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;

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
  loadItem(itemId: ItemId): void,
  loadMultipleItems(itemIds: ItemId[]): void,
  searchName(searchName: string): void,
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps, AppOwnState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchValue: DEFAULT_SEARCH_VALUE,
      backgroundImageName: DEFAULT_BACKGROUND_IMAGE_NAME,
    };
  }

  componentDidMount(): void {
    const { loadItem } = this.props;
    loadItem(10001);
    document.body.style.backgroundImage = getAssetImg(DEFAULT_BACKGROUND_IMAGE_NAME);
  }

  componentDidUpdate(_: AppProps, prevState: AppOwnState): void {
    const { backgroundImageName } = this.state;
    if (prevState.backgroundImageName !== backgroundImageName) {
      document.body.style.backgroundImage = getAssetImg(backgroundImageName);
    }
  }

  handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const { searchName, loadItem } = this.props;
    const { searchValue } = this.state;

    if (Number.isNaN(+searchValue)) {
      searchName(searchValue);
    } else {
      loadItem(parseInt(searchValue, 10));
    }
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value });
  };

  renderSearchResults(results: SearchResult[]): React.ReactNode {
    const { loadItem, loadMultipleItems } = this.props;
    return results ? results.map((result) =>
      <Result loadItem={loadItem} loadMultipleItems={loadMultipleItems} result={result} />) : null;
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
          <div className="searchResults"> {this.renderSearchResults(searchResults)} </div>
        </div>

        <div className="figure">
          <Draggable>
            <Figure itemsData={itemsData} characterData={character} />
          </Draggable>
        </div>

        <div className="menu">
          <Menu
            minimized={false}
            active={false}
            top={30}
            right={30}
          >
            <Equipped />
          </Menu>
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

const mapDispatchToProps: AppDispatchProps = {
  loadItem: (itemId: ItemId) => loadItem(itemId),
  loadMultipleItems: (itemIds: ItemId[]) => loadMultipleItems(itemIds),
  searchName: (searchTerm: string) => searchName(searchTerm),
};

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
