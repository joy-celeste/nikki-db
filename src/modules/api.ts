import { DocumentData } from '@firebase/firestore-types';
import { HttpRequestException } from './errors';
import database from './database';
import { API_CONSTANTS } from './constants';

export const fetchItemData = async (itemId: number): Promise<DocumentData> =>
  database.collection(API_CONSTANTS.CLOTHES).doc(itemId.toString())
    .get()
    .then((response) => (response ? response.data() : null))
    .catch((error) => new HttpRequestException(error, 'Error getting response.'));
