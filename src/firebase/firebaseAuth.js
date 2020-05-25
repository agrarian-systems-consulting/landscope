import config from './firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp(config);

export const firebaseAuth = firebase.auth();