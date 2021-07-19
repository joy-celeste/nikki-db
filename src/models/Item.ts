import { SUBTYPES_LIST, SUBTYPES_MAP, REF_TO_SEARCH_DATA } from 'modules/constants';

export type SubType = typeof SUBTYPES_LIST[number];
export type ItemId = number;

export class Item {
    private key: string;
    readonly id: ItemId;
    readonly loadedTime: number;

    constructor(itemId: ItemId) {
        this.key = `I${itemId}`;
        this.id = itemId;
        this.loadedTime = Math.floor(Date.now() / 100);
    }

    get subtype(): SubType {
        return REF_TO_SEARCH_DATA[this.key]?.subtype;
    }

    get name(): string { // e.g. Nikki's Pinky
        return REF_TO_SEARCH_DATA[this.key]?.name;
    }

    get label(): string { // e.g. Nikki's Pinky (Hair)
        return `${this.name} (${SUBTYPES_MAP[this.subtype]?.replaceAll('_', ' ')})`;
    }
}

export const NIKKIS_PINKY: Item = new Item(10001);