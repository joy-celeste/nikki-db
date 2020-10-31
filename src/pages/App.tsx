import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem } from '../modules/data';
import { Character, wearItem } from '../modules/character';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';

export interface AppOwnState {
  inputValue: string,
}

export interface AppStateProps {
  itemsData: Record<ItemId, ItemData>,
  character: Character,
}

export interface AppDispatchProps {
  dispatch: any;
  loadItem(itemId: ItemId): void,
  wearItem(itemId: ItemId): void,
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps, AppOwnState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  componentDidMount() {
    const { loadItem } = this.props;
    loadItem(10001);
    this.handleClickBackground('medium')
  }

  handleSubmit = (event: any) => {
    const { inputValue } = this.state;
    const { loadItem } = this.props;

    event.preventDefault();
    loadItem(parseInt(inputValue, 10));
  };

  handleChange = (event: any) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  handleClickBackground = (backgroundImageName: string) => {
    document.body.style.backgroundImage = `url(/assets/${backgroundImageName}.jpg)`;
  };

  renderEquippedIcons = (clothesIds: number[]) => clothesIds.map((clothesId) =>
    <div key={clothesId} className={`icon${clothesId}`} />)

  render() {
    const { loadItem, character, itemsData } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="App">
        <div className="canvas-form">
          <form onSubmit={this.handleSubmit}>
            <input value={inputValue} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>

          <p>
            <button type="button" onClick={() => { this.handleClickBackground('light'); }}> Light </button>
            <button type="button" onClick={() => { this.handleClickBackground('light2'); }}> Light2 </button>
            <button type="button" onClick={() => { this.handleClickBackground('medium'); }}> Medium </button>
            <button type="button" onClick={() => { this.handleClickBackground('dark'); }}> Dark </button>
            <button type="button" onClick={() => { this.handleClickBackground('dark2'); }}>Dark2</button>
          <p />

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
          {this.renderEquippedIcons(Object.values(character.clothes))}
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
});

const mapDispatchToProps = (dispatch: any): AppDispatchProps => ({
  dispatch,
  loadItem: (itemId: ItemId) => dispatch(loadItem(itemId)),
  wearItem: (itemId: ItemId) => dispatch(wearItem(itemId)),
});

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
