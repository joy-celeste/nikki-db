import { AnyAction } from 'redux';
import { DeserializeNullException } from './errors';
import { fetchItemData } from './api';
import { ACTION_CONSTANTS, BODY, BODY_ITEM_DATA, BODY_ITEM_ID, BODY_PARTS_DEPTHS,
  DEFAULT_AMPUTATIONS_LIST, DEPTHTYPE_TO_SUBTYPES, SUBTYPES_LIST } from './constants';
import { wearItem } from './character';
import { RootState } from '.';

export type SubType = typeof SUBTYPES_LIST[number];
export type AmputationParts = typeof DEFAULT_AMPUTATIONS_LIST[number];
export type AmputationData = Record<AmputationParts, boolean>;
export type Depths = Record<number, number>;
export type ItemId = number;
export type DepthType = number;

export class ItemData {
  id?: ItemId;
  name?: string;
  description?: string;
  depthType?: DepthType;
  subType?: SubType;
  amputationData?: AmputationData;
  position?: PositionData[];
  depths?: Depths;

  constructor(input?: any) {
    this.deserialize(input);
  }

  deserialize(input: any): ItemData {
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
        [BODY.ARM]: !!input.amputation_data.arm,
        [BODY.TORSO]: !!input.amputation_data.body,
        [BODY.LEG]: !!input.amputation_data.leg,
        [BODY.PANTY]: !!input.amputation_data.panty,
      };
    }

    if (input.depth_type || input.id === BODY_ITEM_ID) {
      this.depthType = input.depth_type;
      const subtypeData = input.id !== BODY_ITEM_ID
        ? DEPTHTYPE_TO_SUBTYPES[input.depth_type.toString()]
        : BODY_PARTS_DEPTHS;
      this.subType = subtypeData.sub_type;
      this.depths = subtypeData.depth;
    }

    if (input.position) {
      const position: PositionData[] = [];
      Object.entries(input.position).forEach(([key, value]) => {
        position.push(new PositionData(parseInt(key, 10), value, this.depths));
      });
      this.position = position;
    }
    return this;
  }
}

export class PositionData {
  depth: number;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  scale?: number;

  constructor(depth: number, input: any, depths?: Depths) {
    this.deserialize(depth, input, depths);
  }

  deserialize(depth: number, input: any, depths?: Depths): PositionData {
    if (!depth || !input) {
      throw new DeserializeNullException('Cannot deserialize null input for PositionData');
    }

    this.depth = depth;
    this.x = input.posx;
    this.y = input.posy;
    this.z = null;
    this.height = input.height;
    this.width = input.width;
    this.scale = input.pot_scale || null;

    if (depths) {
      this.calculateDepth(depth, depths);
    }
    return this;
  }

  // Don't ask me about this logic... I'm just copying this straight from the original devs
  calculateDepth(depth: number, depths: Depths): void {
    if (depth < 100) {
      this.z = depths[depth];
    } else {
      const key: number = depth / 100;
      const ceil: number = Math.ceil(key);
      /* istanbul ignore next */
      if (key <= 0 || ceil === key) { // These are for animated effects.
        this.z = depths[ceil] - 5;
      }
      this.z = depths[ceil - 1] - 5;
    }
  }
}

export const bodyItemData = new ItemData(BODY_ITEM_DATA);

export type ItemsData = Record<ItemId, ItemData>;
export type DataState = {
  itemsData: ItemsData;
  loading: boolean;
};

const initialState: DataState = {
  itemsData: {
  },
  loading: false,
};

// ACTIONS
const addItemData = (itemId: number, itemData: ItemData): AnyAction => ({
  type: ACTION_CONSTANTS.DATA_ADD_ITEMS,
  payload: {
    itemId, itemData,
  },
});

// USE-CASE
export const loadItem = (itemId: ItemId) =>
  async(dispatch: Function, getState: () => RootState): Promise<any> => {
    const items: ItemsData = getState().data.itemsData;
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
