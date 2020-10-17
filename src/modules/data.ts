import { AnyAction } from 'redux';
import { DeserializeNullException } from './errors';
import { fetchItemData } from './api';
import { ACTION_CONSTANTS, DEPTHTYPE_TO_SUBTYPES } from './constants';
import { wearItem } from './character';

export type AmputationParts = 12 | 5 | 9 | 10; // body, panty, arm, leg
export type AmputationData = Record<AmputationParts, boolean>;
export type Depths = Record<number, number>;
export type ItemId = number;
export type DepthType = number;
export type SubType = 8 | 17 | 10 | 5 | 13 | 3 | 2 | 11 | 1 | 14 | 9 | 88 | 12 | 7 | 6 | 16 | 4 | 15;

export class ItemData {
  id?: ItemId;
  name?: string;
  description?: string;
  depthType?: DepthType;
  subType?: SubType;
  amputationData?: AmputationData;
  position?: PositionData[];
  depths?: Depths;

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
    this.position = null;
    this.depthType = null;
    this.subType = null;
    this.depths = null;
    this.amputationData = null;

    if (input.amputation_data) {
      this.amputationData = {
        9: !!input.amputation_data.arm,
        12: !!input.amputation_data.body,
        10: !!input.amputation_data.leg,
        5: !!input.amputation_data.panty,
      };
    }

    if (input.depth_type) {
      this.depthType = input.depth_type;
      const key = input.depth_type.toString();
      const subtypeData = DEPTHTYPE_TO_SUBTYPES[key];
      this.subType = subtypeData.sub_type;
      this.depths = subtypeData.depth;
    }

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

export type DataState = {
  itemsData: Record<ItemId, ItemData>;
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
export const loadItem = (itemId: ItemId) =>
  async(dispatch: Function, getState: Function) => {
    const items: DataState = getState().data.itemsData;
    if (!(itemId in items)) {
      const response = await fetchItemData(itemId);
      if (response) {
        const itemData = new ItemData(response);
        dispatch(addItemData(itemId, itemData));
      }
    }
    dispatch(wearItem(itemId));
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
