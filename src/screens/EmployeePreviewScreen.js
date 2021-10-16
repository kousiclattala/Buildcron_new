import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  BackHandler,
  TextInput,
} from 'react-native';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import {Portal, Dialog, Button, Paragraph} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import Modal from '../common/Modal';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {htmlToPdf} from '../common/Report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from 'react-navigation-drawer';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class EmployeePreviewScreen extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (!this.props.navigation.isFocused()) {
      return false;
    } else {
      this.props.navigation.navigate('footer');

      return true;
    }
  };

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
                this.props.navigation.navigate('footer');
              }}>
              <CImage
                cStyle={[{height: 25, width: 25}]}
                src={require('../images/small-back-white.png')}
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
          Notification Page
        </CText>

        <View
          style={[{backgroundColor: '#f7edeb'}, Styles.marH10, Styles.padV10]}>
          <CText
            cStyle={[
              {fontSize: 18, marginBottom: 10, marginLeft: 15},
              Styles.cblue,
            ]}>
            Area Being Inspected
          </CText>
          <TouchableOpacity
            style={{
              // flex: 1,
              flexDirection: 'row',
              marginHorizontal: 15,
              borderWidth: 0.5,
              borderColor: '#000',
              paddingHorizontal: 20,
              backgroundColor: '#eee',
            }}>
            <Text
              style={{
                borderWidth: 0.5,
                borderColor: '#000',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                paddingVertical: 23,
                paddingHorizontal: 15,
                color: '#666',
                left: -18,
              }}>
              Choose File
            </Text>

            {/* <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Select Report"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.props.SignupState.areaInspected = input;
              // }}
              onChangeText={(value) => {}}
              value={''}
              style={[
                Styles.padV5,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {flex: 1, opacity: 0.7, borderWidth: 0.3, borderColor: '#000'},
              ]}
            /> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={[
              {backgroundColor: '#010066'},
              Styles.brdRad5,
              Styles.marH20,
              Styles.mTop15,
            ]}
            activeOpacity={0.6}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.padH10,
                Styles.padV10,
                Styles.aslCenter,
                Styles.cFFF,
                {fontWeight: '500'},
              ]}>
              Upload Report
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default EmployeePreviewScreen;
