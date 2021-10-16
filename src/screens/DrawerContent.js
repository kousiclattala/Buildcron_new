import React from 'react';
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
  Platform,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DrawerContent extends React.Component {
  constructor() {
    super();
    this.state = {
      rechargeElements: [
        {name: 'NEW', image: 'src/images/topBrand.jpg'},
        {name: 'ORIGINAL'},
        {name: 'MOVIES'},
        {name: 'Fashion'},
        {name: 'TRENDING'},
        {name: 'Fashion'},
      ],
    };
  }

  logout() {
    Alert.alert('Logout', 'Are you sure you want to logout ?', [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          AsyncStorage.clear();
          this.props.navigation.navigate('auth');
        },
      },
    ]);
  }

  render() {
    return (
      <SafeAreaView style={[Styles.flex1, {backgroundColor: '#010066'}]}>
        <ScrollView>
          <View style={{marginTop: 60, flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              // style={[Styles.row, Styles.mLt20, Styles.aitCenter]}
              style={[Styles.mLt30, {flex: 1}]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f25, Styles.fWbold, Styles.mlt10]}>
                Settings
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.closeDrawer();
              }}
              // style={[
              //   Styles.row,
              //   Styles.mLt10,
              //   Styles.aitCenter,
              //   Styles.aslEnd,
              //   Styles.mRt20,
              // ]}
              style={[
                Styles.mlt40,
                Styles.aitCenter,
                Styles.aslEnd,
                {flex: 1},
              ]}>
              <CImage
                cStyle={[Styles.mLt15, {height: 28, width: 28}]}
                src={require('../images/close-white.png')}
                resizeMode={'contain'}
              />
              {/* <CText cStyle={[Styles.cFFF,Styles.f15,Styles.fWbold]}>Close</CText> */}
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 20}}>
            {/* <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              style={[Styles.row, Styles.mLt20, Styles.aitCenter]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f25, Styles.mLt10, Styles.fWbold]}>
                Settings
              </CText>
            </TouchableOpacity> */}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              style={[
                Styles.row,
                Styles.mLt20,
                Styles.aitCenter,
                Styles.mTop10,
              ]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f15, Styles.mLt10, Styles.fWbold]}>
                Terms & Conditions
              </CText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.navigate('FAQScreen');
              }}
              style={[
                Styles.row,
                Styles.mLt20,
                Styles.aitCenter,
                Styles.mTop10,
              ]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f15, Styles.mLt10, Styles.fWbold]}>
                FAQs
              </CText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              style={[
                Styles.row,
                Styles.mLt20,
                Styles.aitCenter,
                Styles.mTop10,
              ]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f15, Styles.mLt10, Styles.fWbold]}>
                Contact Us
              </CText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.closeDrawer(), this.logout();
              }}
              style={[
                Styles.row,
                Styles.mLt20,
                Styles.aitCenter,
                Styles.mTop10,
              ]}>
              <CText
                cStyle={[Styles.cFFF, Styles.f15, Styles.mLt10, Styles.fWbold]}>
                Logout
              </CText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
