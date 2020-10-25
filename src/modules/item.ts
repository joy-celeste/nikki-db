import { bodyItemData, ItemData, PositionData } from './data';
import { BodyParts } from './character';
import { NoDataException } from './errors';

export class Piece {
  isVisible?: boolean = true;
  depth: number;
  x: number;
  y: number;
  z?: number;

  constructor(position: PositionData, body?: BodyParts) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    this.depth = position.depth;
    this.isVisible = body ? body.has(position.depth) : true;
  }
}

export class Item {
  itemId: number;
  pieces: Piece[];

  constructor(itemData: ItemData) {
    if (!itemData || !itemData.id || !itemData.position) {
      throw new NoDataException('Cannot construct new Item from no itemData!');
    }

    this.itemId = itemData.id;
    this.pieces = itemData.position.map((positionData: PositionData) => new Piece(positionData));
    return this;
  }
}

export class Body extends Item {
  pieces: Piece[];

  constructor(visibleParts: BodyParts) {
    super(bodyItemData);
    this.pieces = bodyItemData.position.map((positionData: PositionData) => new Piece(positionData, visibleParts));
  }
}
