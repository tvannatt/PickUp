import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AnimatedBackground } from '../components/AnimatedBackground';

import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { Theme, auth, registerNewUser } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { signupValidationSchema } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { NextButton } from '../components/NextButton';
import { SecondaryButton } from '../components/SecondaryButton';

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility
  } = useTogglePasswordVisibility();

  const handleSignup = async values => {
    const { email, password } = values;
  
    // // Fetch role by access code
    // const role = await fetchRoleByAccessCode(accessCode);
    const handleError = (message) => {
      console.error("An error occurred:", message);
      setErrorState(message)
    };

    registerNewUser(email, password, handleError)
  };

  return (
    <>
      <AnimatedBackground/>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Create a new account</Text>
        </View>
        
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={signupValidationSchema}
          onSubmit={values => handleSignup(values)}
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
              <TextInput
                name='email'
                placeholder='enter email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                invalid={
                  (!touched.email || !errors.email) 
                    ? false
                    : true
                }
              />
              
              <TextInput
                name='password'
                placeholder='enter password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='newPassword'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                invalid={
                  (!touched.password || !errors.password) 
                    ? false
                    : true
                }
              />

              <TextInput
                name='confirmPassword'
                placeholder='confirm password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType='password'
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                invalid={
                  (!touched.confirmPassword || !errors.confirmPassword) 
                    ? false
                    : true
                }
              />
              <View style={styles.NextButton}>
                <NextButton onPress={handleSubmit} label={"sign up"}></NextButton>
              </View>
            </>
          )}
        </Formik>
        
       <View style={styles.secondaryButton}>
          <SecondaryButton onPress={() => navigation.navigate('Login')} label={"already have an account"}/>
       </View>
      </KeyboardAwareScrollView>
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
  buttonText: {
    fontSize: 20,
    color: Theme.white,
    fontWeight: '700'
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
