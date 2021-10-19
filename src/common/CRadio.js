import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {CText} from './CText';
import {Styles} from './Styles';

const CRadio = ({label, onPress, activeStyle, cStyle, aStyle}) => {
  return (
    <View style={[Styles.row, Styles.aitCenter, [cStyle]]}>
      <TouchableOpacity onPress={onPress} style={[Styles.radioStyle, aStyle]}>
        <View style={[Styles.radioActiveStyle, [activeStyle]]}></View>
      </TouchableOpacity>
      <CText cStyle={[Styles.mLt10, Styles.mTop3]}>{label}</CText>
    </View>
  );
};

export {CRadio};
