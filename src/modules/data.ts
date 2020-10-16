import { Dispatch, AnyAction } from 'redux';
import { DeserializeNullException } from './errors';
import { fetchItemData } from './api';
import { ACTION_CONSTANTS } from './constants';

export class ItemData {
  id?: number;
  name?: string;
  description?: string;
  depthType?: number;
  amputationData?: AmputationData;
  position?: PositionData[];

  constructor(init?: any) {
    this.deserialize(init);
  }

  deserialize(input: any) {
    if (!input) {
      throw new DeserializeNullException('Cannot deserialize null input for ItemData');
    }

    this.id = input.id || null;
    this.name = input.name || '';
    this.description = input.desc || '';
    this.depthType = input.depth_type || null;
    this.amputationData = input.amputation_data ? new AmputationData(input.amputation_data) : null;
    this.position = null;

    if (input.position) {
      const position: PositionData[] = [];
      Object.entries(input.position).forEach(([key, value]) => {
        position.push(new PositionData(parseInt(key, 10), value));
      });
      this.position = position;
    }
  }
}

export class PositionData {
  depth: number;
  x: number;
  y: number;
  scale?: number;

  constructor(depth: number, input?: any) {
    this.deserialize(depth, input);
  }

  deserialize(depth: number, input: any) {
    if (!depth || !input) {
      throw new DeserializeNullException('Cannot deserialize null input for PositionData');
    }

    this.depth = depth;
    this.x = input.posx;
    this.y = input.posy;
    this.scale = input.pot_scale || null;
    return this;
  }
}

export class AmputationData {
  arm: boolean;
  body: boolean;
  leg: boolean;
  panty: boolean;

  constructor(input?: any) {
    this.deserialize(input);
  }

  deserialize(input: any) {
    if (!input) {
      throw new DeserializeNullException('Cannot deserialize null input for AmputationData');
    }

    this.arm = !!input.arm || false;
    this.body = !!input.body || false;
    this.leg = !!input.leg || false;
    this.panty = !!input.panty || false;
    return this;
  }
}

type DataState = {
  itemsData: Record<number, ItemData>;
  loading: boolean;
};

const initialState: DataState = {
  itemsData: {},
  loading: false,
};

// ACTIONS
const addItemData = (itemId: number, itemData: ItemData) => ({
  type: ACTION_CONSTANTS.DATA_ADD_ITEMS,
  payload: { itemId, itemData },
});

// USE-CASE
export const loadItem = (itemId: number) =>
  async(dispatch: Dispatch<AnyAction>, getState: Function) => {
    const items: DataState = getState().data.itemsData;
    if (!(itemId in items)) {
      const response = await fetchItemData(itemId);
      if (response) {
        const itemData = new ItemData(response);
        dispatch(addItemData(itemId, itemData));
      }
    }
  };

// REDUCER
export function dataReducer(
  state = initialState,
  action: AnyAction,
): DataState {
  switch (action.type) {
    case ACTION_CONSTANTS.DATA_ADD_ITEMS:
      return {
        ...state,
        itemsData: {
          ...state.itemsData,
          [action.payload.itemId]: action.payload.itemData,
        },
      };
    default:
      return state;
  }
}
