import { combineReducers, Store } from 'redux';
import { posedDress, posedCoat, simpleDress, simpleHair } from '../test_data/data';
import { RootState } from '../../modules';
import { AmputationParts, ItemData, ItemId, SubType, DataState } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { Character, Body, CharacterState, characterReducer, wearItem } from '../../modules/character';
import { DEFAULT_AMPUTATIONS, DEFAULT_BODY, DEFAULT_CLOTHES, SUBTYPES } from '../../modules/constants';

function validateAmputations(itemData: ItemData, character: Character) {
  const { amputations } = character;
  const clothes = new Set(Object.values(character.clothes));

  Object.keys(amputations).forEach((strBodyPart) => {
    const bodyPart = parseInt(strBodyPart, 10) as AmputationParts;

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
  });
}

describe('Character', () => {
  test('Initializes to default data if empty constructor', () => {
    const newCharacter: Character = new Character();
    expect(newCharacter.body).toEqual(DEFAULT_BODY);
    expect(newCharacter.clothes).toEqual(DEFAULT_CLOTHES);
    expect(newCharacter).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success case: dress on new character', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(dress.subType in character.clothes).toBe(true);
    expect(character.clothes[dress.subType]).toEqual(dress.id);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: replacing default hair with something else', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simpleHair);
    character.wear(hair.subType, hair.id, hair.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(1);
    expect(character.clothes[hair.subType]).toEqual(hair.id);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing a posed dress - assert limbs get amputated', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    validateAmputations(dress, character);
  });

  test('CHARACTER: wear() - success: prevent taking off hair if wearing the hair already', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simpleHair);
    character.wear(hair.subType, hair.id, hair.amputationData);
    character.wear(hair.subType, hair.id, hair.amputationData);
    expect(character.clothes[hair.subType]).toBe(hair.id);
  });

  test('CHARACTER: wear() - success: replacing dress on character', () => {
    const character: Character = new Character();
    const originalBody: Body = new Set(character.body);

    // Wear a posed dress, validate that the limbs get amputated
    const dress1: ItemData = new ItemData(posedDress);
    character.wear(dress1.subType, dress1.id, dress1.amputationData);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes[dress1.subType]).toEqual(dress1.id);
    validateAmputations(dress1, character);
    expect(character).toMatchSnapshot();

    // Assert amputation data gets removed because we're replacing posed dress with simple dress
    const dress2: ItemData = new ItemData(simpleDress);
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

    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress.subType, dress.id, dress.amputationData);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();

    const coat: ItemData = new ItemData(posedCoat);
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

    const dress1: ItemData = new ItemData(posedDress);
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
    const dress1: ItemData = new ItemData(posedDress);
    character.wear(dress1.subType, dress1.id, dress1.amputationData);

    const copy: Character = new Character(character);
    expect(character.clothes).toStrictEqual(copy.clothes);
    expect(character.amputations).toStrictEqual(copy.amputations);
    expect(character.body).toStrictEqual(copy.body);
  });
});

describe('CharacterState', () => {
  let store: Store<any>;
  let mockDataReducer: any;
  let mockRootReducer: any;

  const mockDataState: DataState = {
    itemsData: {
      [simpleHair.id]: new ItemData(simpleHair),
      [simpleDress.id]: new ItemData(simpleDress),
      [posedDress.id]: new ItemData(posedDress),
      [posedCoat.id]: new ItemData(posedCoat),
    },
    loading: false,
  };

  beforeEach(() => {
    mockDataReducer = jest.fn().mockReturnValue(mockDataState);
    mockRootReducer = combineReducers({
      data: mockDataReducer,
      character: characterReducer,
    });
    store = createStoreWithMiddleware(mockRootReducer);
  });

  test('Assert initial state uses default values', async () => {
    const characterState: CharacterState = store.getState().character;
    expect(characterState.history.length).toEqual(1);
    expect(characterState.step).toBe(0);

    const initialState : Character = characterState.history[0];
    expect(initialState.body).toStrictEqual(DEFAULT_BODY);
    expect(initialState.clothes).toStrictEqual(DEFAULT_CLOTHES);
    expect(initialState.amputations).toStrictEqual(DEFAULT_AMPUTATIONS);
    expect(characterState).toMatchSnapshot();
  });

  test('Action: CHARACTER_ADD_TO_HISTORY / Use-case: wearItem -- '
       + 'successfully add to history - wearing, replacing, unwearing items', async () => {
    await store.dispatch<any>(wearItem(simpleHair.id));
    await store.dispatch<any>(wearItem(posedDress.id));
    await store.dispatch<any>(wearItem(simpleDress.id));
    await store.dispatch<any>(wearItem(simpleDress.id));
    await store.dispatch<any>(wearItem(posedCoat.id));
    const state: RootState = store.getState();
    expect(Object.keys(state.character.history[state.character.step].clothes)).toHaveLength(2);
    expect(state).toMatchSnapshot();
  });
});