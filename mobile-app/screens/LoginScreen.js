import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { NextButton } from '../components/NextButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Theme, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { loginValidationSchema } from '../utils';
import { AnimatedBackground } from '../components/AnimatedBackground';

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = values => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch(error =>
      setErrorState(error.message)
    );
  };
  return (
    <>
    <AnimatedBackground/>
    {/* <LinearGradient
      colors={['#85afae', '#386e8e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    > */}
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Sign in</Text>
        </View>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={loginValidationSchema}
          onSubmit={values => handleLogin(values)}
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
              {/* Input fields */}
              <TextInput
                name='email'
                placeholder='email...'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                invalid={
                  (!errorState && (!touched.password || !errors.password))
                    ? false
                    : true
                }
              />
              <TextInput
                name='password'
                placeholder='password...'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType='password'
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                invalid={
                  (!errorState && (!touched.password || !errors.password))
                    ? false
                    : true
                }
              />      
              {/* Login button */}
              <View style={styles.NextButton}>
                <NextButton onPress={handleSubmit} label={"continue"}></NextButton>
              </View>
            </>
          )}
        </Formik>
        {/* Buttons to navigate to SignupScreen to create a new account or forgot password */}
        <View style={styles.secondaryButtons}>
          <View style={styles.buttonLeft}>
            <SecondaryButton onPress={() => navigation.navigate('Signup')} label={"create account"}></SecondaryButton>
          </View>
          <View style={styles.buttonRight}>
            <SecondaryButton onPress={() => navigation.navigate('ForgotPassword')} label={"forgot password"}></SecondaryButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    {/* </LinearGradient> */}
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
  secondaryButtons: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    /* Change Secondary Button Size Here - One Component for Both Buttons */
    width: '88%',
    height: 45,
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
  buttonLeft: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonRight: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
