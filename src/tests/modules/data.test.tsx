import { Store } from 'redux';
import { posedDress, posedCoat, posedShoes, simpleHair,
  simpleHat, complexHair, deerSpirit, motorcycleSpirit } from '../test_data/data';
import { DeserializeNullException } from '../../modules/errors';
import { RootState } from '../../modules';
import { ItemData, loadItem, PositionData } from '../../modules/data';
import { createStoreWithMiddleware } from '../helpers';
import * as api from '../../modules/api';

describe('ItemData', () => {
  test('Errors if given empty data', () => {
    expect(() => new ItemData()).toThrowError(DeserializeNullException);
    expect(() => new PositionData(0, '')).toThrowError(DeserializeNullException);
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

describe('DataState', () => {
  let store: Store<any>;
  let apiMock: any;

  beforeEach(() => {
    store = createStoreWithMiddleware();
    apiMock = jest.spyOn(api, 'fetchItemData');
    apiMock.mockClear();
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- document does not exist', async () => {
    apiMock.mockImplementation(); // Document does not exist
    await store.dispatch<any>(loadItem(22008));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(state.data.itemsData).toStrictEqual({
    });
    expect(state.data.itemsData[22008]).toStrictEqual(undefined);
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully calls API and adds one item to the store', async () => {
    apiMock.mockImplementation(() => posedDress);
    await store.dispatch<any>(loadItem(22008));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(state.data.itemsData[22008]).toStrictEqual(new ItemData(posedDress));
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- successfully adds multiple items to the store', async () => {
    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(30987));

    apiMock.mockImplementation(() => posedShoes);
    await store.dispatch<any>(loadItem(71927));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(2);
    expect(Object.keys(state.data.itemsData)).toHaveLength(2);
    expect(state.data.itemsData[30987]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData[71927]).toStrictEqual(new ItemData(posedShoes));
    expect(state.data.itemsData).toMatchSnapshot();
  });

  test('Action: ADD_ITEMS / Use-case: loadItem -- calls API only once if the item is already loaded', async () => {
    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(30987));

    apiMock.mockImplementation(() => posedCoat);
    await store.dispatch<any>(loadItem(30987));
    const state: RootState = store.getState();

    expect(apiMock).toBeCalledTimes(1);
    expect(Object.keys(state.data.itemsData)).toHaveLength(1);
    expect(state.data.itemsData[30987]).toStrictEqual(new ItemData(posedCoat));
    expect(state.data.itemsData).toMatchSnapshot();
  });
});
