import React, { PureComponent } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { ItemId, loadItem } from '../modules/data';
import Draggable from '../components/Draggable';
import Figure from '../components/Figure';
import Menu from '../components/Menu';
import Equipped from '../components/Equipped';
import Inventory from '../components/Inventory';

const DEFAULT_BACKGROUND_IMAGE_NAME = 'medium';
const DEFAULT_BACKGROUND_OPTIONS = ['light', 'light2', 'medium', 'dark', 'dark2'];
const getAssetImg = (assetName: string): string => `url(/assets/${assetName}.jpg)`;

export interface AppOwnState {
  backgroundImageName: string,
}

export interface AppDispatchProps {
  loadItem(itemId: ItemId): void,
}

export type AppProps = AppDispatchProps;

class UnconnectedApp extends PureComponent<AppProps, AppOwnState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
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
    return (
      <div className="App">
        <div className="backgroundOptions"> {this.renderBackgroundOptions(DEFAULT_BACKGROUND_OPTIONS)} </div>
        <div className="figure">
          <Draggable>
            <Figure />
          </Draggable>
        </div>

        <div className="menu">
          <Menu minimized={false} active={false} top={30} right={30}>
            <Equipped />
          </Menu>

          <Menu minimized={false} active={false} top={30} left={30}>
            <Inventory />
          </Menu>
        </div>
      </div>

    );
  }
}

const mapDispatchToProps: AppDispatchProps = {
  loadItem: (itemId: ItemId) => loadItem(itemId),
};

const App = connect(null, mapDispatchToProps)(UnconnectedApp);
export default App;
