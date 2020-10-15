import React, { PureComponent } from 'react';
import './App.css';
import { RootState } from './modules';
import { login, logout } from './modules/user'
import { loadProducts, CartItem, Product, addToCart } from './modules/products'
import { connect } from 'react-redux';

export interface AppDispatchProps {
  username: string,
  products: Product[],
  cart: CartItem[]
}

export interface AppStateProps {
  dispatch: any;
  loadProducts(): void,
  addToCart(productId: number, quantity: number): void,
  login(username: string): void,
  logout(): void
}

export type AppProps = AppDispatchProps & AppStateProps;

class UnconnectedApp extends PureComponent<AppProps> {
  state = {
    initialString: "string"
  }

  componentDidMount() {
    this.props.loadProducts()
    this.props.login("test_username")
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Hello my username is: {this.props.username}</p>
          <p>And here are the possible items: {this.props.products.map(item => (`Item Id: ${item.id} - Name: ${item.name} - Price: ${item.price}`))}</p>
          <p>And here is my cart: {this.props.cart.map(item => (`Item Id: ${item.id} - Count: ${item.quantity}`))}</p>
          <p><a onClick={() => this.props.addToCart(1, 1)} style={{cursor: 'pointer'}}>Click to add to cart</a></p>
          <p>And here is my state's initialString: {this.state.initialString}</p>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  username: state.user.username,
  products: state.products.products,
  cart: state.products.cart,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch: dispatch,
    loadProducts: () => dispatch(loadProducts()),
    addToCart: (productId: number, quantity: number) => dispatch(addToCart(productId, quantity)),
    login: (username: string) => dispatch(login(username)),
    logout: () => dispatch(logout()),
  }
};

const App = connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
export default App;