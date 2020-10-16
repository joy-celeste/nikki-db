import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA2Ra4ekyp8_vvQPln6gPcCSSYCGDzBk1s',
  authDomain: 'nikki-db.firebaseapp.com',
  databaseURL: 'https://nikki-db.firebaseio.com',
  projectId: 'nikki-db',
  storageBucket: 'nikki-db.appspot.com',
  messagingSenderId: '432978972545',
  appId: '1:432978972545:web:d910a9d0e8b99bf0',
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence or you're just
      // running unit tests. :P
    }
  });
const database = firebase.firestore();

export default database;
