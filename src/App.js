import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: "AIzaSyBu4CnVOrfk7iUR-FuE43G5SOtGuWBIKNM",
  authDomain: "sosdev-8dd29.firebaseapp.com",
  databaseURL: "https://sosdev-8dd29.firebaseio.com",
  projectId: "sosdev-8dd29",
  storageBucket: "sosdev-8dd29.appspot.com",
  messagingSenderId: "304920388330",
  appId: "1:304920388330:web:c57e9329a3ac1a2d62ed93",
  measurementId: "G-6Y9H3ZEFEE"
});

const fireAuth = firebase.auth();
const fireData = firebase.firestore();

function App() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const registerUser = () => {
    //see if the email is allowed to register
    fireData.collection('future_users').doc(email).get().then(documentSnapshot => {
      const futureUserData = documentSnapshot.data();
  
      //if allowed then create user
      if (documentSnapshot.exists && futureUserData) {
        fireAuth.createUserWithEmailAndPassword(email, pass).then(userCredential => {
          //if user object is not null (dont know why it would be) then create user document
          if (userCredential.user) {
            const newUser = {
              id: userCredential.user.uid,
              email: email,
              firstName: futureUserData.firstName,
              lastName: futureUserData.lastName,
              admin: futureUserData.admin
            }

            console.log('here1');
            fireData.collection('users').doc(newUser.id).set({
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              admin: newUser.admin
            }).then(() => {
              console.log('added user doc');
            }).catch(() => {
              console.log('failed to add user doc');
            })
            console.log('here2');

          }
        }).catch(error => {
          console.log('failed to create user');
        })
      } else {
        console.log('email not allowed to register');
      }
    }).catch(error => {
      console.log('failed to get future user doc');
    })
  }

  return (
    <div>
      <input onChange={event => setEmail(event.target.value)} />
      <input onChange={event => setPass(event.target.value)} />
      <button onClick={registerUser}>SUBMIT</button>
    </div>
  );
}

export default App;
