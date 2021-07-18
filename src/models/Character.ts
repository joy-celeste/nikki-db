import { SUBTYPES } from 'modules/constants';
import { Item, ItemId, NIKKIS_PINKY } from 'models/Item';

export const DEFAULT_CLOTHES = { [SUBTYPES.HAIR]: NIKKIS_PINKY }; // 10001 = Nikki's Pinky

export type SubType = number;
export type Clothes = Record<SubType, Item>;

export class Character {
  clothes: Clothes;

  constructor(input?: Character) {
    this.clothes = input?.clothes || { ...DEFAULT_CLOTHES };
  }

  contains(itemId: ItemId): boolean {
    return !!Object.values(this.clothes).find((item: Item) => item.id === itemId);
  }

  wear(newItem: Item): void {
    // If we're trying to wear the item we're already wearing, remove it, unless it's hair.
    if (this.contains(newItem.id) && newItem.subtype !== SUBTYPES.HAIR) {
      this.remove(newItem.subtype);
      return;
    }

    switch (newItem.subtype) {
      case SUBTYPES.DRESS:
        this.remove(SUBTYPES.TOP);
        this.remove(SUBTYPES.BOTTOM);
        break;
      case SUBTYPES.TOP:
      case SUBTYPES.BOTTOM:
        this.remove(SUBTYPES.DRESS);
        break;
      case SUBTYPES.BOTH_HAND_HOLDING:
        this.remove(SUBTYPES.LEFT_HAND_HOLDING);
        this.remove(SUBTYPES.RIGHT_HAND_HOLDING);
        break;
      case SUBTYPES.LEFT_HAND_HOLDING:
      case SUBTYPES.RIGHT_HAND_HOLDING:
        this.remove(SUBTYPES.BOTH_HAND_HOLDING);
        break;
    }

    this.clothes[newItem.subtype] = newItem;
  }

  remove(subtype: SubType): void {
    if (this.clothes[subtype]) {
      delete this.clothes[subtype];
    }
  }

  removeAll(): void {
    this.clothes = { ...DEFAULT_CLOTHES };
  }
}