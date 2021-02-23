import { bodyItemData, ItemData, PositionData } from './data';
import { BodyParts } from './character';
import { NoDataException } from './errors';

export class Piece {
  isVisible?: boolean = true;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  z?: number;
  scale: number;

  constructor(position: PositionData, body?: BodyParts) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    this.scale = position.scale;
    this.depth = position.depth;
    this.width = position.width;
    this.height = position.height;
    this.isVisible = body ? body.has(position.depth) : true;
  }
}

export class Item {
  itemId: number;
  pieces: Piece[];

  constructor(itemData: ItemData) {
    if (!itemData || !itemData.id || !itemData.position) {
      throw new NoDataException('Cannot construct new Item without itemData!');
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
