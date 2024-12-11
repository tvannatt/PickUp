import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';

import { passwordResetSchema } from '../utils';
import { Theme, auth } from '../config';
import { View, TextInput, Button, FormErrorMessage } from '../components';

import { LinearGradient } from 'expo-linear-gradient';
import { NextButton } from '../components/NextButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = values => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Success: Password Reset Email sent.');
        navigation.navigate('Login');
      })
      .catch(error => setErrorState(error.message));
  };

  return (
    <>
      <AnimatedBackground/>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Reset password</Text>
      </View>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={passwordResetSchema}
        onSubmit={values => handleSendPasswordResetEmail(values)}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <>
            {/* Email input field */}
            <TextInput
              name='email'
              leftIconName='email'
              placeholder='enter email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              invalid={
                (!touched.email || !errors.email) 
                  ? false
                  : true
              }
            />
            {/* Password Reset Send Email  button */}
            <View style={styles.NextButton}>
              <NextButton label='send reset email' onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
      {/* Button to navigate to Login screen */}
      <View style={styles.secondaryButton}>
        <SecondaryButton onPress={() => navigation.navigate('Login')} label={"back to login"}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 70,
    alignItems: 'center'
  },
  headerTitle: {
    padding: 20,
    fontSize: 27,
    color: Theme.white,
    fontFamily: 'ComfortaaMedium',
    textShadowColor: Theme.white,
    textShadowRadius: 17,
  },
  NextButton: {
    marginTop: 45,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    /* Change Next Button Size Here */
    width: '90%',
    height: 70,
  },
  secondaryButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    /* Change Secondary Button Size Here */
    width: '88%',
    height: 45,
  },
});
