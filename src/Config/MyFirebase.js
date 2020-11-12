import firebase from 'firebase'

const config = {
    apiKey: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY,
    authDomain: "parley-4c999.firebaseapp.com",
    databaseURL: "https://parley-4c999.firebaseio.com",
    projectId: "parley-4c999",
    storageBucket: "parley-4c999.appspot.com",
    messagingSenderId: "197183713046",
    appId: "1:197183713046:web:11c087e4e7d0565f852a37",
    measurementId: "G-X18ZHV9BPD"
}
firebase.initializeApp(config)

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()
