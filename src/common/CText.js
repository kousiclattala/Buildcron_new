import React from 'react';
import {Text} from 'react-native';
import {Styles} from './index';

const CText = ({children, cStyle}) => {
    return (
        <Text style={[Styles.cText, cStyle]}>{children}</Text>
    );
};

export {CText};