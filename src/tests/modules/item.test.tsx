import { posedCoat, posedDress } from '../test_data/data';
import { Body, Item } from '../../modules/item';
import { NoDataException } from '../../modules/errors';
import { ItemData } from '../../modules/data';
import { Character } from '../../modules/character';

describe('Item', () => {
  test('Returns an object with null data if given no ItemData', () => {
    expect(() => new Item(null)).toThrowError(NoDataException);
  });

  test('Returns an BODY when given visible parts data', () => {
    const character: Character = new Character();
    const body = new Body(character.visibleParts);
    expect(body).toMatchSnapshot();
  });

  test('Returns an ITEM object with pieces if given ItemData', () => {
    const coat = new ItemData(posedCoat);
    const coatItem = new Item(coat);
    expect(coatItem).toMatchSnapshot();
  });

  test('Returns an ITEM object with pieces if given ItemData', () => {
    const dress = new ItemData(posedDress);
    const dressItem = new Item(dress);
    expect(dressItem).toMatchSnapshot();
  });
});
