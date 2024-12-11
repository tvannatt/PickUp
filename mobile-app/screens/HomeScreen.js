import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, fetchUserRole } from '../config';
import { StaffHomeScreen } from './StaffHomeScreen';
import { GuardianHomeScreen } from './GuardianHomeScreen';
import { VerifyEmail } from '../components';
import { handleLogout } from '../utils';

export const HomeScreen = () => {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        if (user?.emailVerified) {
          const fetchedUserRole = await fetchUserRole(user.email);
          setUserRole(fetchedUserRole);
        } else {
          console.log("not verified")
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const renderBasedOnRole = () => {
    if (!currentUser) {
      return <Text>Fetching user info...</Text>;
    }

    if (!currentUser?.emailVerified) {
      return <VerifyEmail currentUser={currentUser} />;
    }

    if (userRole === 'staff') {
      return <StaffHomeScreen currentUser={currentUser} />;
    } else if (userRole === 'guardian') {
      return <GuardianHomeScreen currentUser={currentUser} />;
    } else {
      return <Button title={currentUser?.emailVerified ? 'Sign Out' : 'Sign In'} onPress={handleLogout} />
    }
  };

  return (
    <View style={styles.container}>
      {renderBasedOnRole()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
