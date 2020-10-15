import { AnyAction } from "redux";

type UserState = {
    username: string;
};

const initialState: UserState = { 
    username: ''
};

export const login = (username: string) => ({
    type: 'user/LOGIN',
    payload: username,
});

export const logout = () => ({
    type: 'user/LOGOUT'
});

export function userReducer(
  state = initialState,
  action: AnyAction
): UserState {
  switch (action.type) {
    case 'user/LOGIN':
      return { 
        ...state,
        username: action.payload
    };
    case 'user/LOGOUT':
      return {
        ...state,
        username: ''
    };
    default:
      return state;
  }
}