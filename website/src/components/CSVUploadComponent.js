import { useEffect } from 'react';
import { db } from '../firebase/firebase';
import { rtdb } from '../firebase/firebase';
import { collection, doc, setDoc, getDocs, query, where, addDoc } from 'firebase/firestore';
import { ref, set, remove } from 'firebase/database';
import Papa from 'papaparse';

const USER_COLLECTION = 'users_test';
const CHILD_COLLECTION = 'children_test';

const resetSpotsData = async () => {
  const spotsRef = ref(rtdb, 'spots');

  try {
    await set(spotsRef, {
      1: "",
      2: "",
      3: "",
      4: ""
    });
    console.log('Spots data reset successfully.');
  } catch (error) {
    console.error('Failed to reset spots data:', error);
  }
};

// Example function to delete a queue
const deleteQueue = async () => {
  const queueRef = ref(rtdb, 'queue');

  try {
    await remove(queueRef);
    console.log('Queue removed successfully.');
  } catch (error) {
    console.error('Failed to remove queue:', error);
  }
};


//TODO: Update this to allow non-guardian CSV uploades (TENTATIVE)
async function processCSVRow(row, rowIndex) {
  if (!row['Guardian Email'] || !row['Guardian_Name'] || !row['Child_Name(s)'] || !row['Student_ID(s)']) {
    throw new Error(`Row ${rowIndex} is missing required fields.`);
  }

  let child_uids = [];
  const guardianEmail = row['Guardian Email'].trim();
  const guardianName = row['Guardian_Name'].trim();
  let childNames = row['Child_Name(s)'].split(',').map(name => name.trim()).filter(name => name !== '');
  let childIds = row['Student_ID(s)'].split(',').map(id => id.trim()).filter(id => id !== '');
  const staffEmail = row['Staff Email']?.trim() || '';
  const staffName = row['Staff Name']?.trim() || '';

  for (let i = 0; i < childNames.length; i++) {
    const name = childNames[i];
    const id = parseInt(childIds[i]);
    if (isNaN(id)) {
      throw new Error(`Invalid Student_ID(s) '${childIds[i]}' at row ${rowIndex}, unable to process child '${name}'.`);
    }

    const childrenQuery = query(collection(db, CHILD_COLLECTION), where("ID", "==", id));
    const querySnapshot = await getDocs(childrenQuery);

    let childDocRef;
    if (querySnapshot.empty) {
      const newChildDoc = await addDoc(collection(db, CHILD_COLLECTION), {
        ID: id,
        name: name,
        status: "inSchool",
        parent: guardianName,
        loc: null,
        vehicle: "car",
      });
      childDocRef = newChildDoc;
    } else {
      querySnapshot.forEach((doc) => {
        childDocRef = doc;
        setDoc(doc.ref, {
          ID: id,
          name: name,
          status: "inSchool",
          parent: guardianName,
          loc: null,
          vehicle: "car",
        }, { merge: true });
      });
    }
    child_uids.push(childDocRef.id);
  }

  await setDoc(doc(db, USER_COLLECTION, guardianEmail), {
    email: guardianEmail,
    role: 'guardian',
    name: guardianName,
    children: child_uids,
    isCheckedIn: false,
    loc: null,
  }, { merge: true });

  if (staffEmail) {
    await setDoc(doc(db, USER_COLLECTION, staffEmail), {
      email: staffEmail,
      role: 'staff',
      name: staffName,
    }, { merge: true });
  }
}

function CSVUploadComponent({ file, onProcessingResult }) {
  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        complete: async (results) => {
          try {
            for (let i = 0; i < results.data.length - 1; i++) {
              await processCSVRow(results.data[i], i);
            }
            await resetSpotsData();
            await deleteQueue();
            onProcessingResult('Processing Complete');
          } catch (e) {
            onProcessingResult(`Error: ${e.message}`);
            console.error(`Error processing file: ${e.message}`);
          }
        },
        header: true,
      });
    }
  }, [file, onProcessingResult]);
}

export default CSVUploadComponent;
