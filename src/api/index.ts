import { HttpRequestException } from '../models/Errors';
import database from '../Database';

export const fetchItemData = async (itemId: number): Promise<any> => {
  try {
    return database.collection('clothes').doc(itemId.toString())
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log('No such document!');
          return null;
        }
        console.log('Retrieved data from database.', doc.data());
        return doc.data();
      });
  } catch (error) {
    throw new HttpRequestException(error.code, 'Error getting document.');
  }
};

export default fetchItemData;
