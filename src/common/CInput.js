import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Styles } from './index';

const CInput = ({ inputRef, onFocus,onBlur, onEndEditing, numberOfLines, cStyle, keyboardType, onChangeText,onContentSizeChange, placeholder, multiline, uColor, pColor, editable, value, secureTextEntry, maxLength,autoCapitalize }) => {
    return (
        <TextInput onBlur={onBlur} onFocus={onFocus} onEndEditing={onEndEditing} style={[Styles.inputStyle, Styles.cBlk, Styles.ffLt, cStyle, Platform.OS === 'ios' ? Styles.profileTabs : {}]} 
            onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder} multiline={multiline || false} value={value}
            underlineColorAndroid={uColor} placeholderTextColor={'#808080'||pColor} editable={editable} numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry} maxLength={maxLength} autoCapitalize={autoCapitalize} autoCorrect={false} spellCheck={false}
            ref={(r) => { inputRef && inputRef(r) }} textContentType="name" onContentSizeChange = {onContentSizeChange}
        />
    );
};

export { CInput };