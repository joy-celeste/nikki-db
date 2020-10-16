import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { ItemData, loadItem } from '../modules/data';

export interface AppDispatchProps {
  itemsData: Record<number, ItemData>,
}

export interface AppStateProps {
  dispatch: any;
  loadItem(itemId: number): void,
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps> {
  state = {
    initialString: 'string',
  }

  // componentDidMount() {
  //   this.props.login('test_username');
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Here are the items I've loaded:</p>
          <p>{Object.entries(this.props.itemsData).map(([key, value]) => `Key: ${key} - Name: ${value.name} - Value: ${value.description}`)}</p>
          <p><a onClick={() => { this.props.loadItem(22008); this.props.loadItem(30987); }} style={{ cursor: 'pointer' }}>Click to load an item data</a></p>
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
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatch,
  loadItem: (itemId: number) => dispatch(loadItem(itemId)),
});

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;
