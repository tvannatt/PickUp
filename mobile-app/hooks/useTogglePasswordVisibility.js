import { useState } from 'react';

export const useTogglePasswordVisibility = () => {
  // password will not be initially visible
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('dot-circle');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('dot-circle');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);

  // function that toggles password visibility on a TextInput component on a password field
  const handlePasswordVisibility = () => {
    if (rightIcon === 'dot-circle') {
      setRightIcon('circle');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'circle') {
      setRightIcon('dot-circle');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  // function that toggles password visibility on a TextInput component on a confirm password field
  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordIcon === 'dot-circle') {
      setConfirmPasswordIcon('circle');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'circle') {
      setConfirmPasswordIcon('dot-circle');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  return {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    confirmPasswordVisibility,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon
  };
};
