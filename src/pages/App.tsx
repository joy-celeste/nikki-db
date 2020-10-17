import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, ItemId, loadItem } from '../modules/data';
import { Character, wearItem } from '../modules/character';

export interface AppOwnState {
  initialString: string,
  inputValue: string,
}

export interface AppDispatchProps {
  itemsData: Record<ItemId, ItemData>,
  character: Character,
}

export interface AppStateProps {
  dispatch: any;
  loadItem(itemId: ItemId): void,
  wearItem(itemId: ItemId): void,
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps> {
  state: AppOwnState = {
    initialString: 'string',
    inputValue: '',
  }

  componentDidMount() {
    // this.props.login('test_username');]
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.loadItem(parseInt(this.state.inputValue, 10));
  };

  handleChange = (event: any) => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <input value={this.state.inputValue} onChange={this.handleChange} />
            <input type="submit" value="Submit" />
          </form>

          <p>Here are the items I have loaded:</p>
          <p>{this.props.character.body}</p>
          <p>{JSON.stringify(this.props.character)}</p>

          <p><a onClick={() => { this.props.loadItem(22008); }}>Sakura Dream (posed dress)</a></p>
          <p><a onClick={() => { this.props.loadItem(30987); }}>Rose Heart (posed coat)</a></p>
          <p><a onClick={() => { this.props.loadItem(71927); }}>Sparse Stars (posed shoes)</a></p>
          <p><a onClick={() => { this.props.loadItem(10007); }}>Elegant Nobleman (simple hair)</a></p>

          <p>{Object.entries(this.props.itemsData).map(([key, value]) => `Key: ${key} - Name: ${value.name} - Value: ${JSON.stringify(value)}-----------------`)}</p>
          <p>
            And here is my state's initialString:
            {this.state.initialString}
          </p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  itemsData: state.data.itemsData,
  character: state.character.history[state.character.step],
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatch,
  loadItem: (itemId: ItemId) => dispatch(loadItem(itemId)),
  wearItem: (itemId: ItemId) => dispatch(wearItem(itemId)),
});

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
