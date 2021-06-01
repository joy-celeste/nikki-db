import { DEFAULT_CLOTHES} from '../modules/constants';
import { ItemId, SubType } from '../data';

export type Clothes = Record<SubType, ItemId>;

export class Character {
  clothes: Clothes;

  constructor(input?: Character) {
    this.clothes = input && input.clothes ? { ...input.clothes } : { ...DEFAULT_CLOTHES };
  }

  wear(itemId: ItemId): void {
    console.log("you need to fill this in")
    // const { subType, id, amputationData } = itemData;

    // if (this.clothes[subType] && this.clothes[subType] === id && subType !== SUBTYPES.HAIR) {
    //   this.remove(subType);
    //   return;
    // }

    // if (this.clothes[subType] && this.clothes[subType] !== id) {
    //   this.remove(subType);
    // }

    // if (subType === SUBTYPES.DRESS) {
    //   this.remove(SUBTYPES.TOP);
    //   this.remove(SUBTYPES.BOTTOM);
    // } else if (subType === SUBTYPES.TOP) {
    //   this.remove(SUBTYPES.DRESS);
    // } else if (subType === SUBTYPES.BOTTOM) {
    //   this.remove(SUBTYPES.DRESS);
    // }

    // this.clothes[subType] = id;
    // this.updateAmputations(id, amputationData, subType);
    // this.updateVisibleBodyParts();
  }

  remove(subtype: SubType): void {
    if (this.clothes[subtype]) {
      const foundItem : ItemId = this.clothes[subtype];
      delete this.clothes[subtype];
    }
  }

  removeAll(): void {
    Object.keys(this.clothes).forEach((subtype) => this.remove(+subtype));
  }
}