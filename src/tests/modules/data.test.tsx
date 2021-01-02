import { Store } from 'redux';
import { posedDress, posedCoat, posedShoes, simpleHair,
  simpleHat, complexHair, deerSpirit, motorcycleSpirit, simpleDress, posedBottom } from '../test_data/data';
import { DeserializeNullException } from '../../modules/errors';
import { RootState } from '../../modules';
import { ItemData, loadItem, loadMultipleItems, PositionData, initialState, removeItemFromCloset } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.01;
global.Math = mockMath;
Date.now = jest.fn(() => 1000);

describe('ItemData', () => {
  test('Errors if given empty data', () => {
    expect(() => new ItemData()).toThrowError(DeserializeNullException);
    expect(() => new PositionData(0, null)).toThrowError(DeserializeNullException);
  });

  test('Successfully deserializes for the null cases', () => {
    const emptyItemData: ItemData = new ItemData({});
    expect(emptyItemData).toMatchSnapshot();
    const emptyPositionData: PositionData = new PositionData(10, {});
    expect(emptyPositionData).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: simpleHair', () => {
    const simpleHairItem: ItemData = new ItemData(simpleHair);
    expect(simpleHairItem).toMatchSnapshot();
    expect(simpleHairItem.amputationData).toBe(null);
  });

  test('Successfully deserializes ItemData: posed dress', () => {
    const posedDressItem: ItemData = new ItemData(posedDress);
    expect(posedDressItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: posed coat', () => {
    const posedCoatItem: ItemData = new ItemData(posedCoat);
    expect(posedCoatItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: posed shoes', () => {
    const posedShoesItem: ItemData = new ItemData(posedShoes);
    expect(posedShoesItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: simple hat', () => {
    const simpleHatItem: ItemData = new ItemData(simpleHat);
    expect(simpleHatItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: complex hair', () => {
    const complexHairItem: ItemData = new ItemData(complexHair);
    expect(complexHairItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: motorcycle spririt', () => {
    const motorcycleSpiritItem: ItemData = new ItemData(motorcycleSpirit);
    expect(motorcycleSpiritItem).toMatchSnapshot();
  });

  test('Successfully deserializes ItemData: deer spirit', () => {
    const deerSpiritItem: ItemData = new ItemData(deerSpirit);
    expect(deerSpiritItem).toMatchSnapshot();
  });
});

describe('DataState - with local clothesData', () => {
  let store: Store<any>;

  beforeEach(() => {
    store = createStoreWithMiddleware();
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- document does not exist', async () => {
    await store.dispatch<any>(loadItem(999999));
    const state: RootState = store.getState();
    expect(state.data.itemsData).toStrictEqual(initialState.itemsData);
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(undefined);
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully calls looks up item and adds it to the store', async () => {
    await store.dispatch<any>(loadItem(posedDress.id));
    const state: RootState = store.getState();
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- if the item is already loaded, reuse it', async () => {
    await store.dispatch<any>(loadItem(posedDress.id));
    let state: RootState = store.getState();
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
    await store.dispatch<any>(loadItem(posedDress.id));
    state = store.getState();
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully adds multiple items to the store', async () => {
    await store.dispatch<any>(loadItem(posedCoat.id));
    await store.dispatch<any>(loadItem(posedShoes.id));
    const state: RootState = store.getState();
    expect(Object.keys(state.data.itemsData)).toHaveLength(3); // nikki's pinky, coat, shoes
    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[posedShoes.id]).toStrictEqual(new ItemData(posedShoes));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - if the input has just one item, load it anyway`, async () => {
    let state: RootState;
    state = store.getState();
    expect(state.character.history.length).toEqual(1);
    expect(state.character.step).toEqual(0);
    expect(Object.keys(state.character.history[0].clothes).length).toEqual(1);
    expect(Object.keys(state.data.itemsData)).toHaveLength(1); // nikki's pinky

    await store.dispatch<any>(loadMultipleItems([posedDress.id]));
    state = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2); // nikki's pinky, dress

    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - 
        load multiple items successfully (no conflicts)`, async () => {
    let state: RootState;
    state = store.getState();
    expect(state.character.history.length).toEqual(1);
    expect(state.character.step).toEqual(0);
    expect(Object.keys(state.character.history[0].clothes).length).toEqual(1);
    expect(Object.keys(state.data.itemsData)).toHaveLength(1); // nikki's pinky

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id]));
    state = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3); // nikki's pinky, coat, dress

    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - load multiple items successfully (one conflict)`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, simpleHair.id]));
    const state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3); // nikki's pinky, coat, hair
    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[simpleHair.id]).toStrictEqual(new ItemData(simpleHair));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test('Action: ADD_ITEMS / Use-case: loadMultipleItems - use item data if already loaded', async () => {
    let state: RootState;

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, simpleHair.id]));
    state = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3); // nikki's pinky, hair, dress, coat
    expect(Object.keys(state.data.itemsData)).toHaveLength(4);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, simpleDress.id, complexHair.id]));
    state = store.getState();
    expect(state.character.history.length).toEqual(3);
    expect(state.character.step).toEqual(2);
    expect(Object.keys(state.character.history[2].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(6);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - handle clothes lookup returning blank data`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id]));
    const state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - handle failures in clothesdata lookup - load as many items as possible`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, `invalidId`]));
    const state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
    expect(state.character.history.length).toEqual(2);
  });

  test(`Action: SET_ITEMDATA / Use-case: removeItemFromCloset - successfully removes currently-worn item from the current itemsData and character`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, posedShoes.id]));
    let state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    const history = state.character.history[1].clothes;
    expect(Object.keys(state.data.itemsData)).toHaveLength(4);
    await store.dispatch<any>(removeItemFromCloset(posedCoat.id));
    state = store.getState();
    expect(state.character.history[1].clothes).toEqual(history); // do not rewrite history
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
  });

  test(`Action: SET_ITEMDATA / Use-case: removeItemFromCloset - does nothing if there is nothing to remove`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, posedShoes.id]));
    let state: RootState = store.getState();
    expect(Object.keys(state.data.itemsData)).toHaveLength(4);
    await store.dispatch<any>(removeItemFromCloset(posedBottom.id));
    state = store.getState();
    expect(Object.keys(state.data.itemsData)).toHaveLength(4);
  });

  test(`Action: SET_ITEMDATA / Use-case: removeItemFromCloset - successfully removes items even if they are not being currently worn`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, posedShoes.id]));
    await store.dispatch<any>(loadItem(simpleDress.id));
    let state: RootState = store.getState();
    expect(state.character.history.length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(5);
    await store.dispatch<any>(removeItemFromCloset(posedDress.id));
    state = store.getState();
    expect(Object.keys(state.data.itemsData)).toHaveLength(4);
    expect(state.character.history.length).toEqual(3);
  });
});