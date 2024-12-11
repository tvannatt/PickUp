import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Adjust the import path accordingly
import '../css/LiveUpdates.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import logo from '../PickupLogo.png';
import { useTheme } from '../ThemeContext';

const sortUsers = (userData) => {
  return userData.sort((a, b) => {
    if (a.isCheckedIn && !b.isCheckedIn) return -1;
    if (!a.isCheckedIn && b.isCheckedIn) return 1;

    const locA = a.loc !== undefined && !isNaN(parseInt(a.loc, 10)) ? parseInt(a.loc, 10) : Infinity;
    const locB = b.loc !== undefined && !isNaN(parseInt(b.loc, 10)) ? parseInt(b.loc, 10) : Infinity;

    if (locA === 1 && locB !== 1) return -1;
    if (locA !== 1 && locB === 1) return 1;

    if (locA === Infinity && locB !== Infinity) return 1;
    if (locA !== Infinity && locB === Infinity) return -1;

    return locA - locB;
  });
};

const LiveUpdates = () => {
  const { theme } = useTheme();

  const [userChildren, setUserChildren] = useState([]);

  useEffect(() => {
    const fetchChildren = async (user) => {
      if (user.role !== 'guardian' || !user.children) {
        return [];
      }

      const childrenData = await Promise.all(
        user.children.map(childKey =>
          getDoc(doc(db, 'children_test', childKey))
            .then(docSnap => docSnap.exists() ? {
              id: childKey,
              ...docSnap.data(),
              parentId: user.id,
              parentLoc: user.loc, // Include guardian's loc
              parentIsCheckedIn: user.isCheckedIn // Include guardian's isCheckedIn status
            } : null)
        )
      );
      return childrenData.filter(child => child !== null);
    };

    const usersCollection = collection(db, 'users_test');
    const unsubscribe = onSnapshot(usersCollection, async (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedUsers = sortUsers(usersList);

      const childrenOfAllUsers = (await Promise.all(sortedUsers.map(user => fetchChildren(user)))).flat();

      setUserChildren(childrenOfAllUsers);
    });

    return () => unsubscribe();
  }, []);

  const getLocationDisplay = (child) => {
    if (child.parentIsCheckedIn) {
      if (child.parentLoc !== null) {
        return child.parentLoc;
      } else {
        return (
          <div className="spinner-container">
            <img src={logo} className="App-logo-spin" alt="Loading..." />
          </div>
        );
      }
    }
    return child.parentLoc !== null ? child.parentLoc : "";
  };

  return (
    <Table className='custom-table-font table' hover variant={theme === 'dark' ? 'dark' : ''}>
      <thead>
        <tr>
          <th>Child Name</th>
          <th>Queue Spot</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {userChildren.map((child, index) => (
          <tr key={index} className="shadow">
            <td>{child.name}</td>
            <td>{getLocationDisplay(child)}</td>
            <td>{child.parentIsCheckedIn ? 'Checked In' : 'Not Checked In'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  
};

export default LiveUpdates;
