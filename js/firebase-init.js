const firebaseConfig = {
  apiKey: "AIzaSyB6ePqcFMsY_Z7zJAt2kh-mCrEqyp3M0e4",
  authDomain: "recargashark.com",
  databaseURL: "https://recargashark-default-rtdb.firebaseio.com",
  projectId: "recargashark",
  storageBucket: "recargashark.firebasestorage.app",
  messagingSenderId: "1022280794794",
  appId: "1:1022280794794:web:f55aa0f01750a0d56d86d3"
};

// Initialize Firebase using the Compat SDK
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
