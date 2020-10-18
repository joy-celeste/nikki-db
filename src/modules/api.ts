import { HttpRequestException } from './errors';
import database from './database';
import { API_CONSTANTS } from './constants';

export const fetchItemData = async (itemId: number): Promise<any> =>
  database.collection(API_CONSTANTS.CLOTHES).doc(itemId.toString())
    .get()
    .then((response) => {
      if (!response) {
        console.log('No such document!');
        return null;
      }
      console.log('Retrieved data from database.');
      return response.data();
    })
    .catch((error) => {
      console.log(new HttpRequestException(error, 'Error getting response.'));
    });

export {};
