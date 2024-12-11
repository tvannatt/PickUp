import * as Yup from 'yup';
import { auth } from '../config';
import { signOut } from 'firebase/auth';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email')
});

export const handleLogout = () => {
  signOut(auth).catch(error => console.log('Error logging out: ', error));
};

export const getDate = () => {
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();

  const day = weekday[d.getDay()];
  const month = m[d.getMonth()];
  const date = d.getDate();
  return `${day}, ${date} ${month}  `;
}
