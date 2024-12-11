import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  where,
  query,
  updateDoc,
  getDoc,
  onSnapshot,
  doc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  setDoc,
  arrayUnion,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import {
  initializeAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set, get, child, push, orderByChild, limitToFirst, update, serverTimestamp as serverTimestampRTDB } from 'firebase/database';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  databaseURL: Constants.expoConfig.extra.databaseURL
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app); //real-time

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const USER_COLLECTION = 'users_test';
const CHILD_COLLECTION = 'children_test';
const QUEUE_COLLECTION = 'CarQueue';
const SPOT_COLLECTION = 'Spots';
const spotsRef = collection(db, SPOT_COLLECTION);
const queueRef = collection(db, QUEUE_COLLECTION);

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


const registerNewUser = async (email, password, setErrorState) => {
  const userDocRef = doc(db, USER_COLLECTION, email);
  const docSnapshot = await getDoc(userDocRef);

  if (!docSnapshot.exists()) {
    setErrorState("Email does not exist in our records.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async userCredential => {
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user)
        .then(() => {
          console.log('Verification email sent');
        })
        .catch((error) => {
          console.error('Error sending verification email:', error);
        });

    })
    .catch(error => setErrorState(error.message));
};

const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

// TODO: Determine the function of:
// const setStatus = async (documentId, status, updateCount) => {
//   try {
//     const usersCollection = collection(db, USER_COLLECTION);
//     const userDocRef = doc(usersCollection, documentId);

//     const userDocData = await getDoc(userDocRef);
//     const children = userDocData.data().children; // Get children array from user document

//     // Update status for the children
//     if (children && children.length > 0) {
//       const childrenCollection = collection(db, CHILD_COLLECTION); // Replace with your actual children collection name

//       for (const childUid of children) {
//         const childDocRef = doc(childrenCollection, childUid);
//         await updateDoc(childDocRef, { status: status });
//       }
//       console.log("Children status updated to", status, "for user document ID", documentId);
//     } else {
//       console.error('No children found for user document ID:', documentId);
//     }

//     // Update status for the user document itself
//     if (updateCount === true) {
//       const countCollection = collection(db, 'Count')
//       const countRef = doc(countCollection, 'count');
//       const countDoc = await getDoc(countRef);
//       const new_inQueue_Count = countDoc.data().inQueue + 1;
//       const new_pickedUp_Count = countDoc.data().pickedUp + 1;

//       if (!countDoc.exists) {
//         console.log('No such document!');
//       } else {
//         await updateDoc(countRef, { inQueue: newCount });
//         console.log('Document data:', countDoc.data());
//       }

//       await updateDoc(userDocRef, { status: status, loc: new_inQueue_Count });
//     } else {
//       await updateDoc(userDocRef, { status: status });
//     }

//     console.log("User status updated to", status, "for user document ID", documentId);
//   } catch (error) {
//     console.error('Error setting status:', error);
//   }
// };

const fetchChildrenData = (userEmail, setChildren) => {
  let unsubscribes = [];

  // Direct reference to user document based on email
  const userDocRef = doc(db, USER_COLLECTION, userEmail);

  const userUnsubscribe = onSnapshot(userDocRef, (userDocSnapshot) => {
    if (!userDocSnapshot.exists()) {
      console.error(`No user found with email: ${userEmail}`);
      setChildren([]);
      return;
    }

    const userData = userDocSnapshot.data();

    if (!userData || !userData.children) {
      console.error(`User with email ${userEmail} does not have children data.`);
      setChildren([]);
      return;
    }

    userData.children.forEach(childUid => {
      const childRef = doc(db, CHILD_COLLECTION, childUid);

      const childUnsubscribe = onSnapshot(childRef, (childDoc) => {
        if (childDoc.exists()) {
          setChildren(prevChildren => {
            const currentChildren = [...prevChildren];
            const index = currentChildren.findIndex(child => child.id === childUid);

            const childData = { id: childDoc.id, ...childDoc.data() };

            if (index !== -1) {
              currentChildren[index] = childData;
            } else {
              currentChildren.push(childData);
            }

            return currentChildren;
          });
        }
      });

      unsubscribes.push(childUnsubscribe);
    });

    unsubscribes.push(userUnsubscribe);
  });

  // The function to be called to unsubscribe all listeners
  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  };
};

const fetchAllGuardianData = (setGuardian) => { //not checked in
  let unsubscribes = [];

  // Query all documents from USER_COLLECTION where role is "guardian"
  const GuardianQuery = query(
    collection(db, USER_COLLECTION),
    where("role", "==", "guardian"),
  );

  const guardianUnsubscribe = onSnapshot(GuardianQuery, (querySnapshot) => {
    let guardianData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setGuardian(guardianData);
  });

  unsubscribes.push(guardianUnsubscribe);

  // The function to be called to unsubscribe all listeners
  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  };
};

const getDocumentIdByEmail = async (email) => {
  try {
    const userDocRef = doc(db, USER_COLLECTION, email);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      return docSnapshot.id; // Return the document ID
    } else {
      console.error('No user found with the specified email:', email);
      return null; // Return null if no user found
    }
  } catch (error) {
    console.error('Error retrieving document ID:', error);
    return null;
  }
};

const deleteAccount = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userEmail = user.email;

      if (userEmail) {
        // Get the user's document from Firestore
        const userDocRef = doc(db, USER_COLLECTION, userEmail);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.role === 'staff') {
            // If user is staff, proceed with deletion
            await deleteDoc(userDocRef);
          } else if (userData.role === 'guardian' && userData.children) {
            // If user is a guardian, delete children data first
            for (const childUid of userData.children) {
              const childDocRef = doc(db, CHILD_COLLECTION, childUid);
              await deleteDoc(childDocRef);
            }
            await deleteDoc(userDocRef);
          }

          // Delete the user account
          await deleteUser(user);
          console.log("User account and associated data deleted successfully.");
        } else {
          console.log("User document does not exist.");
        }
      } else {
        console.log("User email not found.");
      }
    } catch (error) {
      console.error("Error deleting user account and data: ", error);
      // Handle errors appropriately
    }
  } else {
    console.log("No authenticated user found.");
  }
};

const generateKey = async (isDefault) => {
  try {
    // Generate a random key using expo-crypto
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );

    let keyName;

    if (isDefault) {
      keyName = 'keyA'; // Default key name
      // Store the key in Firebase Realtime Database under a specific path
      const keyRef = ref(rtdb, 'encryptionKeys/' + keyName);
      await set(keyRef, { key });
    } else {
      // Retrieve the current count from the database
      const countRef = ref(rtdb, 'keyCount');
      const countSnapshot = await get(countRef);
      let count = countSnapshot.exists() ? countSnapshot.val() : 0;

      // Increment the key name with the current count
      keyName = 'key' + count;

      // Update the key count in the database
      await update(ref(rtdb), { keyCount: count + 1 });

      // Store the new key in Firebase Realtime Database under a specific path
      const keyRef = ref(rtdb, 'encryptionKeys/' + keyName);
      await set(keyRef, { key });
    }

    return keyName;
  } catch (error) {
    console.error('Error generating key:', error);
  }
};

const getKey = async (keyPath) => {
  try {
    const keyRef = ref(rtdb, keyPath);
    const snapshot = await get(keyRef);
    if (snapshot.exists()) {
      return snapshot.val().key; // Returns the key value
    } else {
      console.log('No data available at this path:', keyPath);
      return null; // No data available
    }
  } catch (error) {
    console.error('Error fetching key:', error);
    return null; // Error occurred
  }
};

const isUserCheckedIn = async (userId) => {
  const userDocRef = doc(db, `${USER_COLLECTION}/${userId}`);

  try {
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists() && docSnapshot.data().isCheckedIn) {
      console.log('User is already checked in returning true');
      return true;
    } else {
      console.log('User is not checked in returning false');
      await setDoc(userDocRef, { isCheckedIn: true }, { merge: true });
      return false;
    }
  } catch (error) {
    console.error('Error checking user checked-in status:', error);
    throw error; // Propagate the error for further handling
  }
};

const checkInUser = async (email) => {
  const childrenIds = await fetchChildrenIdsByEmail(email);

  const childrenNames = await fetchChildrenByIds(childrenIds);

  const queueRef = ref(rtdb, 'queue');
  const newUserRef = push(queueRef);

  await set(newUserRef, {
    email: email,
    checkedInTime: serverTimestampRTDB(),
    childrenNames: childrenNames,
  });

  console.log(`User ${email} checked in with children: ${childrenNames.join(", ")}`);
  assignSpotInSequence();
};


const checkOutFromQueue = async (parentEmail, staffEmail) => {
  const spotsRef = ref(rtdb, 'spots');

  const snapshot = await get(spotsRef);

  if (snapshot.exists()) {
    const updates = {};
    let isMatchFound = false;

    snapshot.forEach((childSnapshot) => {
      const spotData = childSnapshot.val();
      
      if (spotData.userId === parentEmail) {
        const key = childSnapshot.key;
        updates[`spots/${key}`] = { isFilled: false, userId: null, children: null};
        isMatchFound = true;
      }
    });

    if (isMatchFound) {
      await update(ref(rtdb), updates);
      assignSpotInSequence();
      await logCheckOutToHistory(parentEmail, staffEmail);
    } else {
      console.log("No matching spot found for the email:", parentEmail);
    }
  } else {
    console.log("No spots data available.");
  }
};


const logCheckOutToHistory = async (parentEmail, staffEmail) => {
  // Format today's date as YYYYMMDD to use as the document ID
  const today = new Date();
  const documentId = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

  // Reference to today's history document in the "history" collection
  const todayHistoryDocRef = doc(db, "history", documentId);

  try {
    // Prepare the check-out action entry
    const checkOutEntry = {
      parentEmail: parentEmail,
      checkedOutBy: staffEmail,
      timestamp: Timestamp.now(),
    };

    // Update today's history document with the new check-out action entry
    // If the document does not exist, it will be created automatically
    await setDoc(todayHistoryDocRef, {
      checkOutActions: arrayUnion(checkOutEntry)
    });

    //set parent ischeckedin to false
    const userDocRef = doc(db, USER_COLLECTION, parentEmail);
    await updateDoc(userDocRef, { isCheckedIn: false, loc: null });

    console.log(`Check-out action for ${parentEmail} logged successfully in document ${documentId}.`);
  } catch (error) {
    console.error("Error logging check-out action to history:", error);
  }
};


//TODO: Remove staging and queuing from spot assignment. 
// Assign a spot in sequence
const assignSpotInSequence = async () => {
  const queueRef = query(ref(rtdb, 'queue'), orderByChild('checkedInTime'), limitToFirst(1));
  const queueSnapshot = await get(queueRef);
  if (queueSnapshot.exists() && queueSnapshot.hasChildren()) {
    const spotsRef = ref(rtdb, 'spots');
    const spotsSnapshot = await get(spotsRef);
    if (spotsSnapshot.exists()) {
      let assigned = false;
      const updates = {};

      spotsSnapshot.forEach((spotSnapshot) => {
        const spot = spotSnapshot.val();
        const spotKey = spotSnapshot.key;
        if (!spot.isFilled && !assigned) {
          // Assuming there's at least one user in the queue when this function is called
          queueSnapshot.forEach((userSnapshot) => {
            const user = userSnapshot.val().email;
            const userKey = userSnapshot.key;
            updates[`spots/${spotKey}`] = { isFilled: true, userId: user, children: userSnapshot.val().childrenNames };
            updates[`queue/${userKey}`] = null;
            userEmail = user; // Capture the assigned user's email
            spotKeyAssigned = spotKey; // Capture the assigned spotKey
            assigned = true; // Stop after assigning the first available spot
            return true; // Stop forEach loop
          });
        }
      });

      if (assigned) {
        await update(ref(rtdb), updates);
        // Additionally, update the user's 'loc' field in Firestore
        const userDocRef = doc(db, USER_COLLECTION, userEmail); // Assuming 'users' is the collection name
        await setDoc(userDocRef, { loc: spotKeyAssigned }, { merge: true });
      }
    }
  }
};


const fetchChildrenByIds = async (childIds) => {
  try {
    if (!Array.isArray(childIds) || !childIds.length) {
      console.log('No child IDs provided');
      return [];
    }

    const childDocs = await Promise.all(childIds.map(async (id) => {
      const docRef = doc(db, CHILD_COLLECTION, id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, name: docSnap.data().name };
        } else {
          console.log(`No document found for ID: ${id}`);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching document for ID: ${id}`, error);
        return null; // Return null in case of an error, to filter out later
      }
    }));

    return childDocs.filter(doc => doc !== null).map(doc => doc.name);
  } catch (error) {
    console.error('Error fetching children by IDs', error);
    return []; // Return an empty array in case of any errors during the process
  }
};

const fetchChildrenIdsByEmail = async (email) => {
  const userDocRef = doc(db, USER_COLLECTION, email);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists() && docSnap.data().children) {
    return docSnap.data().children; // Return the children IDs
  } else {
    console.log("No user found with the given email or no children IDs available.");
    return []; // Return an empty array if no IDs found
  }
};


export {
  auth,
  fetchUserRole,
  registerNewUser,
  sendVerificationEmail,
  fetchChildrenData,
  fetchAllGuardianData,
  getDocumentIdByEmail,
  deleteAccount,
  generateKey,
  getKey,
  checkInUser,
  checkOutFromQueue,
  fetchChildrenByIds,
  isUserCheckedIn,
};
