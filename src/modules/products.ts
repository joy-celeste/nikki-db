import { Dispatch, AnyAction } from 'redux';

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
};

export type CartItem = {
  id: number;
  quantity: number;
};

type ProductState = {
  products: Product[];
  loading: boolean;
  cart: CartItem[];
};

const initialState: ProductState = {
  products: [],
  loading: false,
  cart: [],
};

// ACTIONS
const addProducts = (products: Product[]) => ({
    type: 'products/ADD_PRODUCTS',
    payload: products,
});

export const updateCart = (newCart: CartItem[]) => ({
    type: 'products/UPDATE_CART',
    payload: newCart,
});

// USE-CASE
export const loadProducts = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    setTimeout(() => {
      // Pretend to load an item
      dispatch(
        addProducts([
          {
            id: 1,
            name: 'Cool Headphones',
            price: 4999,
            img: 'https://placeimg.com/640/480/tech/5',
          },
        ])
      );
    }, 500);
  };
};

export const addToCart = (productId: number, quantity: number) => {
  return (dispatch: Dispatch<AnyAction>, getState: Function) => {
    let currentCart: CartItem[] = getState().products.cart
    const index = currentCart.findIndex((item: CartItem) => item.id === productId);

    if (index === -1) {
      const newItem: CartItem = {
        id: productId,
        quantity: quantity
      }
      return dispatch(updateCart([...currentCart, newItem]));
    } else {
      const newItem: CartItem = {
        id: productId,
        quantity: quantity + currentCart[index].quantity
      }
      currentCart[index] = newItem
      return dispatch(updateCart(currentCart));
    }
  };
};

export function productsReducer(
  state = initialState,
  action: AnyAction
): ProductState {
  switch (action.type) {
    case 'products/ADD_PRODUCTS':
      return {
        ...state,
        products: [...state.products, ...action.payload],
      };
    case 'products/UPDATE_CART':
      return {
        ...state,
        cart: [...action.payload]
      };
    default:
      return state;
  }
}