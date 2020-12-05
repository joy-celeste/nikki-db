import { Store } from 'redux';
import { posedDress, posedCoat, posedShoes, simpleHair,
  simpleHat, complexHair, deerSpirit, motorcycleSpirit, simpleDress } from '../test_data/data';
import { DeserializeNullException } from '../../modules/errors';
import { RootState } from '../../modules';
import { ItemData, loadItem, loadMultipleItems, PositionData, initialState } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import * as api from '../../modules/api';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.01;
global.Math = mockMath;

describe('ItemData', () => {
  test('Errors if given empty data', () => {
    expect(() => new ItemData()).toThrowError(DeserializeNullException);
    expect(() => new PositionData(0, null)).toThrowError(DeserializeNullException);
  });

  test('Successfully deserializes for the null cases', () => {
    const emptyItemData: ItemData = new ItemData({
    });
    expect(emptyItemData).toMatchSnapshot();
    const emptyPositionData: PositionData = new PositionData(10, {
    });
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

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully adds multiple items to the store', async () => {
    await store.dispatch<any>(loadItem(posedCoat.id));
    await store.dispatch<any>(loadItem(posedShoes.id));
    const state: RootState = store.getState();
    expect(Object.keys(state.data.itemsData)).toHaveLength(3); // nikki's pinky, coat, shoes
    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[posedShoes.id]).toStrictEqual(new ItemData(posedShoes));
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

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - handle API call returning blank data`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id]));
    const state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - 
        handle rejections in API calls - load as many items as possible`, async () => {
    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, `invalidId`]));
    const state: RootState = store.getState();
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });
});

describe.skip('DataState - with API', () => {
  let store: Store<any>;
  let apiMock: any;

  beforeEach(() => {
    store = createStoreWithMiddleware();
    apiMock = jest.spyOn(api, 'fetchItemData');
    apiMock.mockClear();
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- document does not exist', async () => {
    apiMock.mockImplementation(); // Document does not exist
    await store.dispatch<any>(loadItem(posedDress.id));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(state.data.itemsData).toStrictEqual({
    });
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(undefined);
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully calls API and adds one item to the store', async () => {
    apiMock.mockImplementation(() => posedDress);
    await store.dispatch<any>(loadItem(posedDress.id));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully adds multiple items to the store', async () => {
    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(posedCoat.id));

    apiMock.mockImplementation(() => posedShoes);
    await store.dispatch<any>(loadItem(posedShoes.id));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2);
    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[posedShoes.id]).toStrictEqual(new ItemData(posedShoes));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- calls API only once if the item is already loaded', async () => {
    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(posedCoat.id));

    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(posedCoat.id));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(Object.keys(state.data.itemsData)).toHaveLength(1);
    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - 
        load multiple items successfully (no conflicts)`, async () => {
    let state: RootState;

    apiMock
      .mockImplementationOnce(() => posedCoat)
      .mockImplementationOnce(() => posedDress);

    state = store.getState();
    expect(state.character.history.length).toEqual(1);
    expect(state.character.step).toEqual(0);
    expect(Object.keys(state.character.history[0].clothes).length).toEqual(1);
    expect(Object.keys(state.data.itemsData)).toHaveLength(0);

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id]));
    state = store.getState();
    expect(apiMock).toBeCalledTimes(2);
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2);

    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[posedDress.id]).toStrictEqual(new ItemData(posedDress));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems -
        load multiple items successfully (one conflict)`, async () => {
    apiMock
      .mockImplementationOnce(() => posedCoat)
      .mockImplementationOnce(() => simpleHair);

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, simpleHair.id]));
    const state: RootState = store.getState();
    expect(apiMock).toBeCalledTimes(2);
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2);

    expect(state.data.itemsData[posedCoat.id]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[simpleHair.id]).toStrictEqual(new ItemData(simpleHair));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test('Action: ADD_ITEMS / Use-case: loadMultipleItems - use item data if already loaded', async () => {
    let state: RootState;

    apiMock
      .mockImplementationOnce(() => posedCoat)
      .mockImplementationOnce(() => posedDress)
      .mockImplementationOnce(() => simpleHair)
      .mockImplementationOnce(() => simpleDress)
      .mockImplementationOnce(() => complexHair);

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, simpleHair.id]));
    state = store.getState();
    expect(apiMock).toBeCalledTimes(3);
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(3);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, simpleDress.id, complexHair.id]));
    state = store.getState();
    expect(apiMock).toBeCalledTimes(5);
    expect(state.character.history.length).toEqual(3);
    expect(state.character.step).toEqual(2);
    expect(Object.keys(state.character.history[2].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(5);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - 
        handle API call returning blank data`, async () => {
    apiMock
      .mockImplementationOnce(() => posedCoat)
      .mockImplementationOnce(() => {});

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id]));
    const state: RootState = store.getState();
    expect(apiMock).toBeCalledTimes(2);
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(1);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  test(`Action: ADD_ITEMS / Use-case: loadMultipleItems - 
        handle rejections in API calls - load as many items as possible`, async () => {
    apiMock
      .mockImplementationOnce(() => posedCoat)
      .mockImplementationOnce(() => posedDress)
      .mockImplementationOnce(() => Promise.reject(new Error('oops')));

    await store.dispatch<any>(loadMultipleItems([posedCoat.id, posedDress.id, posedShoes.id]));
    const state: RootState = store.getState();
    expect(apiMock).toBeCalledTimes(3);
    expect(state.character.history.length).toEqual(2);
    expect(state.character.step).toEqual(1);
    expect(Object.keys(state.character.history[1].clothes).length).toEqual(3);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2);
    expect(state.data).toMatchSnapshot();
    expect(state.character).toMatchSnapshot();
  });

  
});
