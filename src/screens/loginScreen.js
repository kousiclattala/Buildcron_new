import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  Platform,
  Button,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: '',
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({
      spinnerBool: false,
      PhoneNumber: '',
      password: '',
      email: '',
    });

    // this.getToken();
    this.getAllKeys();
  }

  getAllKeys = async () => {
    var keys = [];
    keys = await AsyncStorage.getAllKeys();

    var data = await AsyncStorage.multiGet(keys);

    // console.log('data from async storage', data);
  };

  getToken = async () => {
    var token = await AsyncStorage.getItem('access_token');

    if (token === null) {
      this.props.navigation.navigate('LoginScreen');
    } else {
      this.props.navigation.navigate('LoginPinScreen');
    }
  };

  verifyMobileNumber() {
    // TODO: uncomment later

    // this.props.navigation.navigate('footer');
    const mobileno = this.state.phone;

    if (!this.state.phone) {
      // Utils.dialogBox('Please enter mobile number', '');

      Snackbar.show({
        text: 'Please Enter Mobile Number',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else if (mobileno.toString().length < 10) {
      // Utils.dialogBox('Please enter valid mobile number', '');

      Snackbar.show({
        text: 'Please Enter valid Mobile Number',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else if (mobileno.toString().length > 10) {
      // Utils.dialogBox('Please enter valid mobile number', '');

      Snackbar.show({
        text: 'Enter Mobile Number without spaces and special characters',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      this.props.getActionSignUp({
        spinnerBool: true,
        PhoneNumber: '+91' + this.state.phone,
      });
      // console.log('mobile number ', this.state.phone);

      axios({
        method: 'post',
        url: Config.routes.otpRequestUrl,
        data: {
          // mobile: this.props.SignupState.PhoneNumber,
          // password: '1234',
          phone_number: '+91' + this.state.phone,
        },
      })
        .then((response) => {
          this.props.getActionSignUp({spinnerBool: false});

          console.log('response - -', response.data);

          if (response.data.error) {
            return Snackbar.show({
              text: `${response.data.error}`,
              textColor: '#fff',
              backgroundColor: '#FF6600',
            });
          } else {
            this.props.getActionSignUp({otp: response.data.otp});

            Snackbar.show({
              text: `Your OTP for Login ${response.data.otp}`,
              textColor: '#fff',
              backgroundColor: '#FF6600',
              duration: Snackbar.LENGTH_INDEFINITE,
            });

            this.props.navigation.navigate('OTPverificationScreen');
          }
        })
        .catch((error) => {
          //   console.warn(error.response.data.message);
          this.props.getActionSignUp({spinnerBool: false});
          // console.log('error login  - - - - ', error.response);
          // Utils.dialogBox('Invalid Credentials', '');
        });
    }
  }

  // getOtp(){
  //     const self = this;
  //     axios({
  //         method: "post",
  //         url: Config.routes.base + Config.routes.GetOtp,
  //         data: {
  //             "phone": this.props.SignupState.mobileno,
  //         }
  //     })
  //         .then((response) => {
  //             self.props.getActionSignUp({ fromScreen:'login'})
  //             console.log("response otp      - -  - - - > ", response)
  //             this.props.navigation.navigate('OtpScreen')
  //         })
  //         .catch((error) => {
  //           // self.props.getActionSignUp({ spinnerBool: false })
  //             console.log('error otp -- ---------------- - - - - ', error)
  //             // Utils.dialogBox(error, "")
  //         })
  //  }

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  render() {
    return (
      <View
        style={[
          {backgroundColor: '#FFF', flex: 1},
          Styles.jCenter,
          Styles.aitCenter,
        ]}>
        {this.renderSpinner()}
        {/* <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor={Platform.OS === 'ios' ? '#aaa' : '#FFF'}
                /> */}
        <KeyboardAvoidingView behavior="padding">
          <View style={[Styles.marH20, Styles.jCenter, Styles.flex1]}>
            <CImage
              cStyle={[
                {height: 100, width: 100, borderRadius: 50},
                Styles.aslCenter,
              ]}
              src={require('../images/loginImage.png')}
            />

            <Text
              style={[
                Styles.ffMbold,
                Styles.aslCenter,
                {color: '#FF6600', fontSize: 17},
                Styles.mTop20,
              ]}>
              Enter Your Mobile Number
            </Text>
            <Text
              style={[
                {fontSize: 14, color: '#5A587C', marginTop: 10},
                Styles.aslCenter,
              ]}>
              We will send you a 6 digit verification code
            </Text>

            <View
              style={{
                // flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                label="Mobile Number*"
                mode="outlined"
                //theme='#FF6600'
                underlineColor="red"
                returnKeyType="next"
                // outlineColor='#FF6600'
                // backgroundColor= '#003489'
                blurOnSubmit={false}
                // placeholder='Mobile Number'
                // maxLength={10}
                placeholderTextColor="#EC6433"
                keyboardType="numeric"
                // ref={(input) => {
                //   this.phoneNumber = input;
                // }}
                onChangeText={(value) => this.setState({phone: value})}
                value={this.state.phone}
                style={[Styles.mTop30, Styles.bgFFF, {height: 45, flex: 1}]}
                left={
                  <TextInput.Affix
                    text="+91"
                    textStyle={{
                      top: 2.5,
                    }}
                  />
                }
              />
            </View>

            {/* <TextInput label='Password*'
                                        mode='outlined'
                                        //theme='#FF6600'
                                        underlineColor='red'
                                        returnKeyType="next"
                                       // outlineColor='#FF6600'
                                      // backgroundColor= '#003489'
                                        blurOnSubmit={false}
                                       // placeholder='Mobile Number'
                                        placeholderTextColor='#EC6433'
                                       // keyboardType='numeric'
                                        ref={(input) => {
                                           // this.phoneNumber = input;
                                        }}

                                        onChangeText={(value) => this.props.getActionSignUp({ password: value })}
                                        value={this.props.SignupState.password}
                                        style={[Styles.bgFFF,{height:45},Styles.mTop10]}
                                    /> */}

            <TouchableOpacity
              onPress={() => {
                this.verifyMobileNumber();
              }}
              style={[
                {backgroundColor: '#FF6600'},
                Styles.brdRad5,
                Styles.mTop30,
              ]}
              activeOpacity={0.6}>
              <Text
                style={[
                  Styles.f14,
                  Styles.padH10,
                  Styles.padV10,
                  Styles.aslCenter,
                  Styles.cFFF,
                  {fontWeight: 'bold'},
                ]}>
                Generate OTP
              </Text>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 13,
                justifyContent: 'center',
                marginHorizontal: 2,
              }}>
              <Text
                style={{
                  color: '#010066', //#7673A5
                  fontFamily: 'Muli-Regular',
                  fontSize: 13,
                  textAlign: 'center',
                }}>
                By clicking the sumbit button, I agree to all the
                {/* //TODO: add a modal to show terms and privacy policy pages */}
                <TouchableOpacity>
                  <Text
                    style={{
                      color: 'blue',
                    }}>
                    terms of service and
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text
                    style={{
                      color: 'blue',
                    }}>
                    {' '}
                    privacy policy
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
            {/* <View style={{ flexDirection: 'row', marginTop: 13, justifyContent: 'center' }}>
                                     <Text style={{ color: '#7673A5', fontFamily: 'Muli-Regular', fontSize: 14 }}>
                                      Not a Registered user ? </Text>
                                     <TouchableOpacity activeOpacity={0.6} onPress={()=>{}}>
                                        <Text style={{ color: '#FF6600', fontSize: 13, fontFamily: 'Muli-Bold' }}> Sign up </Text>
                                    </TouchableOpacity>
                                </View> */}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - ', state);
  return {
    SignupState: state.SignUp,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
