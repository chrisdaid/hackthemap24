// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  onValue,
  update,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHDpabN_9C68KAs9c6d5KwHINETtlmGFs",
  authDomain: "roomies-f0398.firebaseapp.com",
  projectId: "roomies-f0398",
  storageBucket: "roomies-f0398.appspot.com",
  messagingSenderId: "200410283392",
  appId: "1:200410283392:web:21277a96a706794d1e5565"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const ddnb = getDatabase();
const users = ref(ddnb, 'users');


// "keys" array holds all keys BESIDES the current person signed in
const keys = [];

// logic + eventlistener for yes/no button on meet page 
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

const seenKeys = [];
const yesKeys = [];

// this code sets the meet page with profile info
onValue(users, (snapshot) => {
  const data = snapshot.val();
  // console.log(data, "this is data");

  const profileName = document.getElementById('profile-name');
  const profileAge = document.getElementById('profile-age')
  const profileGender = document.getElementById('profile-gender')
  const profileCollege = document.getElementById('profile-college')
  const profileBio = document.getElementById('profile-bio')
  const profileEmail = document.getElementById('profile-email')

  // current person signed in's key 
  const auth = getAuth();
  const user = auth.currentUser;
  const currentUserKey = user.uid;


  // set the profile on meet page to profile data 


  Object.keys(data).forEach(key => {
    if (key !== currentUserKey) {
      keys.push(key)
    }
  });

  let leftClicked = false;
  let rightClicked = false;

  function getClick() {
    return new Promise(acc => {
      leftClicked = false;
      rightClicked = false;
      function handleClickLeft() {
        leftBtn.removeEventListener('click', handleClickLeft);
        leftClicked = true;
        acc();
      }
      function handleClickRight() {
        rightBtn.removeEventListener('click', handleClickRight);
        rightClicked = true;
        acc()
      }
      leftBtn.addEventListener('click', handleClickLeft);
      rightBtn.addEventListener('click', handleClickRight);
    });
  }


  // INITIALLY SET PROFILE

  const index = 0;
  if (keys[0] === currentUserKey) {
    index = 1;
  }
  profileName.innerText = `Name: ${data[keys[index]].name}`;
  profileAge.innerText = `Age: ${data[keys[index]].age}`;
  profileGender.innerText = `Gender: ${data[keys[index]].gender}`;
  profileCollege.innerText = `College: ${data[keys[index]].college}`;
  profileBio.innerText = `Bio: ${data[keys[index]].bio}`;
  profileEmail.innerText = `Email: ${data[keys[index]].email}`;

  // click function 
  async function main() {
    // Object.keys(data).forEach(async (key) => {

      console.log("waiting for a click");
      console.log("click received");
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== currentUserKey) {

          if (rightClicked) { // right click means Yes, so push key into yesKeys along with seenKeys
            yesKeys.push(keys[i])
            console.log(yesKeys, 'YES KEYS LINE 119');
            seenKeys.push(keys[i])
            console.log(seenKeys, 'SEEN KEYS LINE 121');
          } else if (leftClicked) { // left means No, so only push key into seenKeys
            console.log(yesKeys, 'YES KEYS LINE 119');
            seenKeys.push(keys[i])
            console.log(seenKeys, 'SEEN KEYS LINE 124');
          }
          profileName.innerText = `Name: ${data[keys[i]].name}`
          profileAge.innerText = `Age: ${data[keys[i]].age}`;
          profileGender.innerText = `Gender: ${data[keys[i]].gender}`;
          profileCollege.innerText = `College: ${data[keys[i]].college}`;
          profileBio.innerText = `Bio: ${data[keys[i]].bio}`;
          profileEmail.innerText = `Email: ${data[keys[i]].email}`;
          await getClick();
      }
      }
      
    }
    // )
    console.log("done");
  // }
  
  main();


});


function setTotalPeopleSeen(seenKeys) {
  // sets the database every time left or right button is clicked -> setting database with updated
  // "seenKeys" array
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    totalPeopleSeen: [seenKeys]
  });
}

function setYesPeople(yesKeys) {
  // sets the database every time left or right button is clicked -> setting database with updated
  // "yesKeys" arrays
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    yesPeople: [yesKeys],
  });

}

// end logic for event listener on Meet Page


const loginForm = document.getElementById("login-form");
const signUpBtn = document.querySelector("#signup-btn"); 
const loginBtn = document.querySelector("#login-btn"); 
const usernameText = document.querySelector("#username-db"); // doesnt exist

const errorMessageText = document.querySelector(".error-text");

if (signUpBtn) { // if sign up button exists on the page, 
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var age = document.getElementById('age-box').value;
    var college = document.getElementById('college-box').value;
    var bio = document.getElementById('bio-box').value;
    var gender = document.getElementById('gender-box').value;
    var name = document.getElementById("name-box").value;
    var password = document.getElementById("password-box").value;
    var instagram = document.getElementById('instagram-box').value;
    var email = document.getElementById("email-box").value;
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log("AUTO SIGNED IN");
        const user = userCredential.user;
        const dt = new Date();
        set(ref(database, "users/" + user.uid), {
          name: name,
          age: age,
          college: college,
          gender: gender,
          bio: bio,
          instagram: instagram,
          email: email,
          elo: 0,
          yesPeople: [],
          totalPeopleSeen: []
        });

        // set error message to account created and change red to black
        errorMessageText.style.color = "#000";
        errorMessageText.innerText = "account created, please login";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // set error message
        errorMessageText.innerText = error.code;
        // ..
      });
  });
}

let userId;

if (loginBtn) {
  // loginBtn.addEventListener("click", (e) => {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const dt = new Date();
        userId = user.uid;
        update(ref(database, "users/" + user.uid), {
          last_login: dt,
        });
        // clear error message
        errorMessageText.innerText = "";
        window.location.href = "/meet"; // do this when signed in
        console.log(user.displayName);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        errorMessageText.innerText = error.code;
      });
  });
}

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    let currentURL = window.location.href;
    let currentFile = currentURL.split("/");
    currentFile = currentFile[currentFile.length - 1];
    console.log(`${user.email} SIGNED IN`);
    if (currentFile.toLowerCase() == "meet") {
      console.log("you're on the meet page");
      const signOutBtn = document.getElementById('button__sign-out');
      signOutBtn.innerText = "Sign out";
      // now redirect to login page because account created
      // window.location.href = "/login.html";
    }
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
const signoutBtn = document.querySelector("#button__sign-out");
if (signoutBtn) {
  signoutBtn.addEventListener("click", (e) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('sign out successful');
        window.location.href = "/login";
        // now user is on the login page, change the text on the page to "Signed out, see you later."
        // check if user on the login page, then change hte text
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
}

if (usernameText) {
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
});
}