import React from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { View } from './View';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from './Button';
import { Theme } from '../config';

export const TextInput = ({ width = '90%', height = 50, rightIcon, handlePasswordVisibility, invalid, ...otherProps}) => {
  return (
    <View
      style={{
        borderRadius: 50,
        backgroundColor: Theme.white,
        flexDirection: 'row',
        padding: 12,
        marginTop: 25,
        width,
        height,
        alignSelf: 'center',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: invalid ? 0.8 : 0.5,
        shadowRadius: invalid ? 10 : 5,
        overflow: 'visible',
        shadowColor: invalid ? Theme.errorred : Theme.white,
      }}
    >
      <RNTextInput
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          fontSize: 20,
          fontFamily: 'ComfortaaMedium',
          color: Theme.lightgrey,
          marginLeft: 8,
        }}
        placeholderTextColor= {invalid ? Theme.texterrorred : 'rgba(77, 77, 77, 0.7)'}
        {...otherProps}
      />
      {rightIcon ? (
        <Button onPress={handlePasswordVisibility} style={{alignSelf: 'center'}}>
          <FontAwesome5
            name={rightIcon}
            size={22}
            color={Theme.lightgrey}
            style={{ marginRight: 3 }}
          />
        </Button>
      ) : null}
    </View>
  );
};
