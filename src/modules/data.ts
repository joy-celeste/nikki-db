import { Dispatch, AnyAction } from 'redux';
import { DeserializeNullException } from '../models/Errors';
import { fetchItemData } from '../api';

export class ItemData {
    id: number;
    name?: string;
    description?: string;
    depthType: number;
    amputationData?: AmputationData;
    position?: PositionData[];

    constructor(init?: any) {
      if (init) {
        this.deserialize(init);
      } else {
        throw new DeserializeNullException('Given null object in constructor');
      }
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
      this.createPositionData(input.position);
      return this;
    }

    createPositionData(input: any): void {
      const result: PositionData[] = [];
      Object.entries(input).forEach(([key, value]) => {
        result.push(new PositionData(parseInt(key, 10), value));
      });
      this.position = result;
    }
}

export class PositionData {
    depth: number;
    x: number;
    y: number;
    scale?: number;

    constructor(depth: number, input?: any) {
      if (input) {
        this.deserialize(depth, input);
      } else {
        throw new DeserializeNullException('Given null object in constructor');
      }
    }

    deserialize(depth: number, input: any) {
      if (!depth || !input) {
        throw new DeserializeNullException('Cannot deserialize null input for PositionData');
      }

      this.depth = depth || null;
      this.x = input.posx || null;
      this.y = input.posy || null;
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
      if (input) {
        this.deserialize(input);
      } else {
        throw new DeserializeNullException('Given null object in constructor');
      }
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
  type: 'items/ADD_ITEMS',
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
    case 'items/ADD_ITEMS':
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
