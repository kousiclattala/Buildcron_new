import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Styles } from './index';

const CButton = ({ children, cStyle, onPress, clickable }) => {

    return (
        <View style={[Styles.cButton,]} >
            <TouchableOpacity activeOpacity={0.6} disabled={clickable} style={[Styles.cButton, cStyle,]} onPress={onPress} >
                {children}
            </TouchableOpacity>
        </View>
    );
};

export { CButton };