import { combineReducers, Store } from 'redux';
import { posedDress, posedCoat, simpleDress, simpleHair, posedTop, posedBottom, posedShoes } from '../test_data/data';
import { RootState } from '../../modules';
import { AmputationParts, ItemData, ItemId, SubType, DataState } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import { Character, CharacterState, characterReducer, wearItem, BodyParts, DEFAULT_AMPUTATIONS, removeAll } from '../../modules/character';
import { BODY, DEFAULT_BODY, DEFAULT_CLOTHES, SUBTYPES } from '../../modules/constants';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.01;
global.Math = mockMath;

function validateAmputations(itemData: ItemData, character: Character) {
  const { amputations } = character;
  const clothes = new Set(Object.values(character.clothes));

  Object.keys(amputations).forEach((strBodyPart) => {
    const bodyPart = parseInt(strBodyPart, 10) as AmputationParts;

    // If item is being put on (not removed)...
    if (character.clothes[itemData.subType] === itemData.id) {
      // Validate underwear taken off if wearing a top/bottom/dress
      if ((bodyPart === BODY.BRA && (itemData.subType === SUBTYPES.TOP || itemData.subType === SUBTYPES.DRESS))
        || (bodyPart === BODY.PANTY && (itemData.subType === SUBTYPES.BOTTOM || itemData.subType === SUBTYPES.DRESS))) {
        expect(amputations[bodyPart].includes(itemData.id)).toBe(true);
      } else if (itemData.amputationData && itemData.amputationData[bodyPart]) {
        // this item's amputation data includes this body part
        expect(amputations[bodyPart].includes(itemData.id)).toBe(true);
      } else {
        expect(amputations[bodyPart].includes(itemData.id)).toBe(false);
      }
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
    expect(newCharacter.visibleParts).toEqual(DEFAULT_BODY);
    expect(newCharacter.clothes).toEqual(DEFAULT_CLOTHES);
    expect(newCharacter).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success case: dress on new character', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(dress.subType in character.clothes).toBe(true);
    expect(character.clothes[dress.subType]).toEqual(dress.id);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: replacing default hair with something else', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simpleHair);
    character.wear(hair);
    expect(Object.keys(character.clothes)).toHaveLength(1);
    expect(character.clothes[hair.subType]).toEqual(hair.id);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing a posed dress - assert limbs get amputated', () => {
    const character: Character = new Character();
    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress);
    validateAmputations(dress, character);
  });

  test('CHARACTER: wear() - success: prevent taking off hair if wearing the hair already', () => {
    const character: Character = new Character();
    const hair: ItemData = new ItemData(simpleHair);
    character.wear(hair);
    character.wear(hair);
    expect(character.clothes[hair.subType]).toBe(hair.id);
  });

  test('CHARACTER: wear() - success: replacing dress on character', () => {
    const character: Character = new Character();
    const dress2: ItemData = new ItemData(simpleDress);
    character.wear(dress2);
    const originalBodyWithDress: BodyParts = new Set(character.visibleParts); // regular body minus underwear

    // Wear a posed dress, validate that the arms/legs/torso get removed
    const dress1: ItemData = new ItemData(posedDress);
    character.wear(dress1);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes[dress1.subType]).toEqual(dress1.id);
    validateAmputations(dress1, character);
    expect(character).toMatchSnapshot();

    // Assert amputation data gets removed because we're replacing posed dress with simple dress
    character.wear(dress2);
    expect(Object.keys(character.clothes)).toHaveLength(2);
    expect(character.clothes[dress2.subType]).toEqual(dress2.id);

    // Assert torso, arms, and legs are made visible again when posed dress is removed
    expect(character.visibleParts).toEqual(originalBodyWithDress);
    validateAmputations(dress2, character);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing multiple items that amputate the same body parts', () => {
    const character: Character = new Character();

    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();

    const coat: ItemData = new ItemData(posedCoat);
    character.wear(coat);
    validateAmputations(coat, character);
    expect(character).toMatchSnapshot();

    character.remove(SUBTYPES.DRESS as SubType);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: wear() - success: wearing a top/bottom over the dress removes the dress', () => {
    const character: Character = new Character();

    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();

    const top: ItemData = new ItemData(posedTop);
    character.wear(top);
    validateAmputations(top, character);
    expect(character).toMatchSnapshot();

    character.wear(dress);
    validateAmputations(dress, character);
    expect(character).toMatchSnapshot();

    const bottom: ItemData = new ItemData(posedBottom);
    character.wear(bottom);
    validateAmputations(bottom, character);
    expect(character).toMatchSnapshot();
  });

  test('CHARACTER: remove() - success: wear and unwear the same item, should be back to where you started', () => {
    const character: Character = new Character();
    const copy: Character = new Character(character);

    const dress1: ItemData = new ItemData(posedDress);
    character.wear(dress1);
    character.remove(SUBTYPES.DRESS as SubType);

    expect(character.clothes).toStrictEqual(copy.clothes);
    expect(character.amputations).toStrictEqual(copy.amputations);
    expect(character.visibleParts).toStrictEqual(copy.visibleParts);
  });

  test('CHARACTER: remove() - success: wear and unwear a part that removes'
    + 'underwear, underwear should still remain off if wearing posed shoes', () => {
    const character: Character = new Character();

    const dress: ItemData = new ItemData(posedDress);
    character.wear(dress);
    expect(character.amputations[BODY.PANTY].includes(dress.id)).toBe(true);

    const shoes: ItemData = new ItemData(posedShoes);
    character.wear(shoes);
    expect(character.amputations[BODY.PANTY].includes(shoes.id)).toBe(true);
    validateAmputations(shoes, character);
    expect(character).toMatchSnapshot();

    character.remove(dress.subType);
    expect(character.amputations[BODY.PANTY].includes(dress.id)).toBe(false);
    expect(character.amputations[BODY.PANTY].includes(shoes.id)).toBe(true);
    validateAmputations(shoes, character);
    expect(character).toMatchSnapshot();
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
    character.wear(dress1);

    const copy: Character = new Character(character);
    expect(character.clothes).toStrictEqual(copy.clothes);
    expect(character.amputations).toStrictEqual(copy.amputations);
    expect(character.visibleParts).toStrictEqual(copy.visibleParts);
  });

  test('CHARACTER: removeAll() - success: removes all clothes', () => {
    const character: Character = new Character();
    expect(character).toMatchSnapshot();
    character.wear(new ItemData(posedDress));
    character.wear(new ItemData(posedCoat));
    character.wear(new ItemData(posedShoes));
    character.wear(new ItemData(simpleHair));
    expect(Object.keys(character.clothes).length).toEqual(4);
    character.removeAll();
    expect(Object.keys(character.clothes).length).toEqual(0);
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
    expect(initialState.visibleParts).toStrictEqual(DEFAULT_BODY);
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

  test('Action: CHARACTER_ADD_TO_HISTORY / Use-case: removeAll -- '
  + 'successfully remove all clothes', async () => {
    await store.dispatch<any>(wearItem(posedDress.id));
    await store.dispatch<any>(wearItem(posedCoat.id));
    let state: RootState = store.getState();
    expect(Object.keys(state.character.history[state.character.step].clothes)).toHaveLength(3);
    await store.dispatch<any>(removeAll());
    state = store.getState();
    expect(Object.keys(state.character.history[state.character.step].clothes)).toHaveLength(0);
    expect(state).toMatchSnapshot();
  });
});
