import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOYmAwyM9OiF3auMgp-vI0IFJswzIv1OE",
  authDomain: "dgd-learning-app.firebaseapp.com",
  projectId: "dgd-learning-app",
  storageBucket: "dgd-learning-app.appspot.com",
  messagingSenderId: "251713384477",
  appId: "1:251713384477:web:b4ba3c163384c69ff116f4",
  measurementId: "G-35CES2X6FS",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
export { database, auth };
