import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from '../config';

firebase.initializeApp(firebaseConfig);

if (!process.env.JEST_WORKER_ID === undefined) {
  firebase.firestore().enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.=
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence.
      }
    });
}

const database = firebase.firestore();

export default database;
