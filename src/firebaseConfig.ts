import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAnGHTPP8cC4wq0EmSBEbVAJT54pNZE1ls",
  authDomain: "next-app-6696a.firebaseapp.com",
  projectId: "next-app-6696a",
  storageBucket: "next-app-6696a.appspot.com",
  messagingSenderId: "282848710585",
  appId: "1:282848710585:web:890c70eb39689b513ef068"
});

const db = firebaseConfig.firestore();
const auth = getAuth(firebaseConfig);
const storage = getStorage(firebaseConfig);

export default db;
export { auth, storage};