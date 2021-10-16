import React from 'react';
import FastImage from 'react-native-fast-image';

const CImage = ({ resizeMode,src,cStyle  }) => {
    return (
        <FastImage style={[cStyle]} resizeMode={resizeMode} source={src} priority="high" />
    );
};

// where resizeMode params are contain,cover,stretch,center

export { CImage };