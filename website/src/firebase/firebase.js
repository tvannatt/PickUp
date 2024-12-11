// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, getDoc, doc } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY, // Ensure you prefix your environment variables with REACT_APP_
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const rtdb = getDatabase(app);
const db = getFirestore(app);



// To grab user role to ensure staff-only sign in. 
const USER_COLLECTION = 'users_test';

const fetchUserRole = async (email) => {
  const userDocRef = doc(db, USER_COLLECTION, email);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    console.log("User role fetched.");
    return docSnapshot.data().role; // or whatever field the role is stored in
  } else {
    console.log("No such document!");
    return null;
  }
};



// Export the Firebase app and any services that you use
export { app, auth, db, rtdb, fetchUserRole};

