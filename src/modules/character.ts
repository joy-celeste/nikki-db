import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { RootState } from '.';
import { ACTION_CONSTANTS, DEFAULT_BODY, DEFAULT_CLOTHES, DEFAULT_AMPUTATIONS, SUBTYPES } from './constants';
import { AmputationData, AmputationParts, ItemId, ItemsData, SubType } from './data';

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

  wear(subtype: SubType, itemId: ItemId, amputationData: AmputationData): void {
    if (this.clothes[subtype] && this.clothes[subtype] === itemId && subtype !== SUBTYPES.HAIR) {
      this.remove(subtype);
      return;
    }

    if (this.clothes[subtype] && this.clothes[subtype] !== itemId) {
      this.remove(subtype);
    }

    this.clothes[subtype] = itemId;
    if (amputationData) {
      this.updateAmputations(itemId, amputationData);
      this.updateVisibleBodyParts();
    }
  }

  remove(subtype: SubType): SubType {
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
      return foundItem as SubType;
    }
    return null;
  }

  updateAmputations(itemId: ItemId, amputationData: AmputationData): void {
    Object.entries(amputationData).forEach(([bodyPartStr, visibility]) => {
      if (visibility) {
        const bodyPart = parseInt(bodyPartStr, 10) as AmputationParts;
        this.amputations[bodyPart] = [...this.amputations[bodyPart], itemId];
      }
    });
  }

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
      newChar.wear(itemData.subType, itemId, itemData.amputationData);
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
