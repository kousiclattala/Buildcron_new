import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import {Portal, Dialog, Button, Paragraph} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import Modal from '../common/Modal';
import FileViewer from 'react-native-file-viewer';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {htmlToPdf} from '../common/Report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from 'react-navigation-drawer';
import {file} from '@babel/types';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class ContactUs extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    //
  }

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1, zIndex: 1}]}>
        <MyStatusBar backgroundColor="#010066" barStyle="light-content" />

        {/* <ScrollView style={[{marginBottom:20}]}> */}

        <View style={[{paddingVertical: 5, backgroundColor: '#010066'}]}>
          <View
            style={[
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginHorizontal: 20,
              },
              Styles.aitCenter,
            ]}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <CImage
                cStyle={[{height: 25, width: 25}]}
                src={require('../images/menu.png')}
              />
            </TouchableOpacity>
            <View>
              <CImage
                cStyle={[{height: 40, width: 140}]}
                src={require('../images/buildcron.png')}
              />
            </View>
            <CImage
              cStyle={[{height: 30, width: 30}]}
              src={require('../images/bell.png')}
            />
          </View>
        </View>

        <DropDownMenu />

        <CText
          cStyle={[
            {alignSelf: 'center', fontSize: 16},
            Styles.marV10,
            Styles.cblue,
          ]}>
          Contact Technical Support
        </CText>

        <ScrollView>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cblue,
              ]}>
              Your Email Address *
            </CText>
            <TextInput
              mode="outlined"
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Enter your email address"
              placeholderTextColor="#A8A8A8"
              keyboardType="default"
              onChangeText={(value) => {}}
              value={{}}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f14,
                {fontWeight: '500'},
              ]}
            />
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cblue,
              ]}>
              Subject *
            </CText>
            <TextInput
              mode="outlined"
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Enter Subject"
              placeholderTextColor="#A8A8A8"
              keyboardType="default"
              onChangeText={(value) => {}}
              value={{}}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f14,
                {fontWeight: '500'},
              ]}
            />
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cblue,
              ]}>
              Description *
            </CText>
            <TextInput
              mode="outlined"
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Please enter details of your request"
              placeholderTextColor="#A8A8A8"
              keyboardType="default"
              multiline={true}
              onChangeText={(value) => {}}
              value={{}}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f14,
                {fontWeight: '500'},
              ]}
            />
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              Styles.brdRad5,
              Styles.marH20,
              {marginTop: 30, backgroundColor: '#010066'},
            ]}
            activeOpacity={0.6}>
            <Text
              style={[
                Styles.f16,
                Styles.padH10,
                Styles.padV10,
                Styles.aslCenter,
                Styles.cFFF,
                {fontWeight: '500'},
              ]}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default ContactUs;
