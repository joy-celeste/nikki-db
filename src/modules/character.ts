import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS, DEFAULT_BODY, DEFAULT_CLOTHES, DEFAULT_AMPUTATIONS, SUBTYPES, BODY } from './constants';
import { AmputationData, AmputationParts, ItemData, ItemId, ItemsData, SubType } from './data';
import { Item } from './item';

export type BodyPart = number;
export type BodyParts = Set<BodyPart>;
export type Clothes = Record<SubType, ItemId>;
export type Amputations = Record<AmputationParts, ItemId[]>;

export class Character {
  visibleParts: BodyParts;
  clothes: Clothes;
  amputations: Amputations;

  constructor(input?: any) {
    this.visibleParts = input && input.visibleParts ? new Set(input.visibleParts) : new Set(DEFAULT_BODY);
    this.clothes = input && input.clothes ? { ...input.clothes } : { ...DEFAULT_CLOTHES };
    this.amputations = input && input.amputations ? { ...input.amputations } : { ...DEFAULT_AMPUTATIONS };
  }

  hide(bodyPart: BodyPart): void {
    if (this.visibleParts.has(bodyPart)) {
      this.visibleParts.delete(bodyPart);
    }
  }

  show(bodyPart: BodyPart): void {
    this.visibleParts.add(bodyPart);
  }

  wear(itemData: ItemData): void {
    const { subType, id, amputationData} = itemData;

    if (this.clothes[subType] && this.clothes[subType] === id && subType !== SUBTYPES.HAIR) {
      this.remove(subType);
      return;
    }

    if (this.clothes[subType] && this.clothes[subType] !== id) {
      this.remove(subType);
    }

    if (subType === SUBTYPES.DRESS) {
      this.remove(SUBTYPES.TOP);
      this.remove(SUBTYPES.BOTTOM);
    } else if (subType === SUBTYPES.TOP) {
      this.remove(SUBTYPES.DRESS);
    } else if (subType === SUBTYPES.BOTTOM) {
      this.remove(SUBTYPES.DRESS);
    }

    this.clothes[subType] = id;
    this.updateAmputations(id, amputationData, subType);
    this.updateVisibleBodyParts();
  }

  remove(subtype: SubType): void {
    if (this.clothes[subtype]) {
      const foundItem : ItemId = this.clothes[subtype];
      delete this.clothes[subtype];

      Object.keys(this.amputations).forEach((bodyPartStr) => {
        const bodyPart = parseInt(bodyPartStr, 10) as AmputationParts;
        this.amputations[bodyPart] = this.amputations[bodyPart].filter((itemId: ItemId) => itemId !== foundItem);
        if (this.amputations[bodyPart].length === 0) {
          this.show(bodyPart);
        }
      });
    }

    if (subtype === SUBTYPES.DRESS) {
      this.show(BODY.BRA);
      this.show(BODY.PANTY);
    } else if (subtype === SUBTYPES.TOP) {
      this.show(BODY.BRA);
    } else if (subtype === SUBTYPES.BOTTOM) {
      this.show(BODY.PANTY);
    }
  }

  updateAmputations(itemId: ItemId, amputationData: AmputationData, subtype: SubType): void {
    Object.keys(this.amputations).forEach((bodyPartStr) => {
      const bodyPart = parseInt(bodyPartStr, 10) as AmputationParts;
      if (this.shouldHideBodyPart(bodyPart, amputationData, subtype)) {
        this.amputations[bodyPart] = [...this.amputations[bodyPart], itemId];
      }
    });
  }

  shouldHideBodyPart(bodyPart: BodyPart, amputationData: AmputationData, subtype: SubType): boolean {
    if (amputationData && amputationData[bodyPart]) {
      return true;
    }

    if ((bodyPart === BODY.BRA || bodyPart === BODY.VEST) && (subtype === SUBTYPES.TOP || subtype === SUBTYPES.DRESS)) {
      return true;
    }

    if (bodyPart === BODY.PANTY && (subtype === SUBTYPES.BOTTOM || subtype === SUBTYPES.DRESS)) {
      return true;
    }

    return false;
  }

  // also refactor wear to only take in itemdata instead of having to use 3 params

  updateVisibleBodyParts(): void {
    // If any amputation data is associated with an amputation location, hide the limb
    // Else if nothing is being worn on this amputation location right now, make it visible
    Object.entries(this.amputations).forEach(([bodyPartStr, items]) => {
      const bodyPart = parseInt(bodyPartStr, 10) as BodyPart;
      if (items.length >= 1) {
        this.hide(bodyPart); // have to cast as int as Object.keys turns keys into string
      } else {
        this.show(bodyPart);
      }
    });
  }
}

export type CharacterState = {
  history: Character[];
  step: number;
};

const initialState: CharacterState = {
  history: [new Character()],
  step: 0,
};

// ACTIONS
const addToHistory = (character: Character, step: number): AnyAction => ({
  type: ACTION_CONSTANTS.CHARACTER_ADD_TO_HISTORY,
  payload: {
    character, step,
  },
});

// USE-CASE
export const wearItem = (itemId: ItemId) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<any> => {
    const itemDataState: ItemsData = getState().data.itemsData;
    const itemData = itemDataState[itemId];

    if (itemData && itemData.subType) {
      const charState: CharacterState = getState().character;
      const oldChar: Character = charState.history[charState.step];
      const newChar: Character = new Character(oldChar);
      newChar.wear(itemData);
      dispatch(addToHistory(newChar, charState.step + 1));
    }
  };

// REDUCER
export function characterReducer(
  state = initialState,
  action: AnyAction,
): CharacterState {
  switch (action.type) {
    case ACTION_CONSTANTS.CHARACTER_ADD_TO_HISTORY:
      return {
        ...state,
        history: [...state.history, action.payload.character],
        step: action.payload.step,
      };
    default:
      return state;
  }
}
