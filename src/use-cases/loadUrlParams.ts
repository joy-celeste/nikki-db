import { Dispatch } from 'react';
import { RootState } from 'redux/reducers/store';
import { ItemId } from 'models/Item';
import { loadParamItems } from 'use-cases/wearItem';

export const loadUrlParams = (urlSearchParmas: URLSearchParams) =>
  async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    const closetItems: ItemId[] = JSON.parse(`[${urlSearchParmas.get('closet')}]`);
    const wornItems: ItemId[] = JSON.parse(`[${urlSearchParmas.get('wear')}]`);
    dispatch(loadParamItems(closetItems, wornItems));
  };
