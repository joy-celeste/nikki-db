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

  render() {
    const { loadItem, character } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="App">
        <div className="canvas-form">
          <form onSubmit={this.handleSubmit}>
            <input value={inputValue} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>

          <p>
            <button type="button" onClick={() => { loadItem(1); }}>
              Body
            </button>

            <button type="button" onClick={() => { loadItem(22008); }}>
              Sakura Dream (posed dress)
            </button>

            <button type="button" onClick={() => { loadItem(30987); }}>
              Rose Heart (posed coat)
            </button>

            <button type="button" onClick={() => { loadItem(71927); }}>
              Sparse Stars (posed shoes)
            </button>

            <button type="button" onClick={() => { loadItem(10007); }}>
              Elegant Nobleman (simple hair)
            </button>
          </p>
        </div>

        <div className="canvas-figure">
          <Draggable>
            <Figure characterData={character} />
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
