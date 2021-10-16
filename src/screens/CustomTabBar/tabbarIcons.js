import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Modal,
  Platform,
} from 'react-native';
import {Styles, CText, CImage} from '../../common';

export const tabbaricons = {
  active: {
    Directory: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/directory.png')}
      />
    ),
    MyDocs: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/mydocs.png')}
      />
    ),
    Home: (
      <CImage
        cStyle={[{height: 45, width: 45}, Styles.aslCenter]}
        src={require('../../images/home.png')}
      />
    ),
    Todolist: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/todolist.png')}
      />
    ),

    Search: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/footersearch.png')}
      />
    ),
  },
  inactive: {
    Directory: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/directory.png')}
      />
    ),
    MyDocs: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/mydocs.png')}
      />
    ),
    Home: (
      <CImage
        cStyle={[{height: 45, width: 45}, Styles.aslCenter]}
        src={require('../../images/home.png')}
      />
    ),
    Todolist: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/todolist.png')}
      />
    ),

    Search: (
      <CImage
        cStyle={[{height: 30, width: 30}, Styles.aslCenter]}
        src={require('../../images/footersearch.png')}
      />
    ),
  },
};
