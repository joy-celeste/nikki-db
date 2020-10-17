import { Store } from 'redux';
import {
  posed_dress, posed_coat, posed_shoes, simple_dress, simple_hair, simple_hat, complex_hair, deer_spirit, motorcycle_spirit,
} from '../test_data/data';
import { DeserializeNullException } from '../../modules/errors';
import { RootState } from '../../modules';
import { AmputationData, AmputationParts, ItemData, ItemId, loadItem, PositionData, SubType } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import * as api from '../../modules/api';
import { Amputations, Character, Clothes, Body } from '../../modules/character';
import { ACTION_CONSTANTS, DEFAULT_BODY, DEFAULT_CLOTHES, SUBTYPES } from '../../modules/constants';

const validateAmputations = (itemData: ItemData, character: Character) => {
  const amputations: Amputations = character.amputations;
  const clothes = new Set(Object.values(character.clothes));

  for (let strBodyPart of Object.keys(amputations)) {
    const bodyPart = parseInt(strBodyPart) as AmputationParts;

    // Validate that ITEMDATA'S amputation data was added if the amputation data exists
    // If it doesn't exist, validate that it doesn't show up in CHARACTER.AMPUTATIONS
    if (itemData.amputationData) {
      if (itemData.amputationData[bodyPart] && character.clothes[itemData.subType] === itemData.id) {
        expect(amputations[bodyPart].includes(itemData.id)).toBe(true);
      } else {
        expect(amputations[bodyPart].includes(itemData.id)).toBe(false);
      }
    } else {
      expect(amputations[bodyPart].includes(itemData.id)).toBe(false);
    }

    // Validate there is no extraneous/old/outdated data in CHARACTER.AMPUTATIONS
    amputations[bodyPart].forEach((itemId: ItemId) => {
      expect(clothes.has(itemId)).toBe(true);
    });
  }
}

describe('Character', () => {
  test('Initializes to default data if empty constructor', () => {
    const new_character: Character = new Character();
    expect(new_character.body).toEqual(DEFAULT_BODY);
    expect(new_character.clothes).toEqual(DEFAULT_CLOTHES);
    expect(new_character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success case: dress on new character', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posed_dress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes.hasOwnProperty(dress.subType))
    expect(character.clothes[dress.subType]).toEqual(dress.id)
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: replacing default hair with something else', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simple_hair);
    character.wear(hair.subType, hair.id, hair.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(1);
    expect(character.clothes[hair.subType]).toEqual(hair.id);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing a posed dress - assert limbs get amputated', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posed_dress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    validateAmputations(dress, character);
  });

  test('CHARACTER: wear() - success: prevent taking off hair if wearing the hair already', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simple_hair);
    character.wear(hair.subType, hair.id, hair.amputationData);
    character.wear(hair.subType, hair.id, hair.amputationData);
    expect(character.clothes[hair.subType]).toBe(hair.id);
  });

  test('CHARACTER: wear() - success: replacing dress on character', () => {
    const character: Character = new Character();
    const originalBody: Body = new Set(character.body);

    // Wear a posed dress, validate that the limbs get amputated
    const dress1: ItemData = new ItemData(posed_dress);
    character.wear(dress1.subType, dress1.id, dress1.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes[dress1.subType]).toEqual(dress1.id);
    validateAmputations(dress1, character);
    expect(character).toMatchSnapshot();

    // Assert amputation data gets removed because we're replacing posed dress with simple dress
    const dress2: ItemData = new ItemData(simple_dress);
    character.wear(dress2.subType, dress2.id, dress2.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes[dress2.subType]).toEqual(dress2.id);

    // Assert body parts are made visible again when posed dress is removed
    expect(character.body).toEqual(originalBody);
    validateAmputations(dress2, character);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing multiple items that amputate the same body parts', () => {
    const character: Character = new Character();

    const dress: ItemData = new ItemData(posed_dress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();

    const coat: ItemData = new ItemData(posed_coat);
    character.wear(coat.subType, coat.id, coat.amputationData);
    validateAmputations(coat, character);
    expect(character).toMatchSnapshot();

    character.remove(SUBTYPES.DRESS as SubType);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: remove() - success: wear and unwear the same item, should be back to where you started', () => {
    const character: Character = new Character();
    const copy: Character = new Character(character);
    
    const dress1: ItemData = new ItemData(posed_dress);
    character.wear(dress1.subType, dress1.id, dress1.amputationData);
    character.remove(SUBTYPES.DRESS as SubType);

    expect(character.clothes).toStrictEqual(copy.clothes);
    expect(character.amputations).toStrictEqual(copy.amputations);
    expect(character.body).toStrictEqual(copy.body);
  });

  test('CHARACTER: remove() - success: does nothing if removing nothing', () => {
    const character: Character = new Character();
    expect(character).toMatchSnapshot();
    character.remove(SUBTYPES.BOTTOM as SubType);
    expect(character).toMatchSnapshot();
  });
  
  test('Successfully creates a new Character out of existing Character', () => {
    const character: Character = new Character();    
    const dress1: ItemData = new ItemData(posed_dress);
    character.wear(dress1.subType, dress1.id, dress1.amputationData);

    const copy: Character = new Character(character);
    expect(character.clothes).toStrictEqual(copy.clothes);
    expect(character.amputations).toStrictEqual(copy.amputations);
    expect(character.body).toStrictEqual(copy.body);
  });
});

// describe('DataState', () => {
//   let store: Store<any>;
//   let apiMock: any;

//   beforeEach(() => {
//     store = createStoreWithMiddleware();
//     apiMock = jest.spyOn(api, 'fetchItemData');
//     apiMock.mockClear();
//   });

//   test('Action: ADD_ITEMS / Use-case: loadItem -- document does not exist', async () => {
//     apiMock.mockImplementation((itemId: number) => {}); // Document does not exist
//     await store.dispatch<any>(loadItem(22008));
//     const state: RootState = store.getState();

//     expect(apiMock).toBeCalledTimes(1);
//     expect(state.data.itemsData).toStrictEqual({});
//     expect(state.data.itemsData[22008]).toStrictEqual(undefined);
//   });
// });
