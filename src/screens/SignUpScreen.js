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

class SignUpScreen extends React.Component {
  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});
  }

  verifyMobileNumber() {
    axios({
      method: 'post',
      url: Config.routes.base + 'login/',
      data: {
        email: 'aarthifnawaz@gmail.com',
        user: 'aarthif',
        password: '1234',
      },
    })
      .then((response) => {
        // console.log('response - -', response);
      })
      .catch((error) => {
        //console.warn(error.response.data.message)
        // console.log('error login  - - - - ', error.response);
        // Utils.dialogBox(error.response.data.message, "")
      });
    //     console.log("mobile number ", this.props.SignupState.PhoneNumber)
    //     const email = Utils.isValidEmail(this.props.SignupState.emailid)
    //     const mobileno = Utils.isValidIndianMobile(this.props.SignupState.PhoneNumber)
    //     if(!this.props.SignupState.fullname){
    //         Utils.dialogBox('Please enter the full name', '')
    //     }
    //     else if(!this.props.SignupState.password){
    //         Utils.dialogBox('Please enter the password', '')
    //     }
    //     else if(!this.props.SignupState.confirmpassword){
    //         Utils.dialogBox('Please enter the confirm password', '')
    //     }
    //     else if(this.props.SignupState.confirmpassword !==this.props.SignupState.password){
    //         Utils.dialogBox('password and confirm password do not match', '')
    //     }
    //    else if(!email.status){
    //         Utils.dialogBox(email.message, '')
    //     }
    //    else if (!mobileno.status) {
    //         Utils.dialogBox(mobileno.message, '')

    //     } else {
    //         this.props.navigation.navigate('OTPverificationScreen')
    //     }
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
      <View style={[{backgroundColor: '#FFF', flex: 1}]}>
        {this.renderSpinner()}
        {/* <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor={Platform.OS === 'ios' ? '#aaa' : '#FFF'}
                /> */}
        <KeyboardAvoidingView behavior="padding">
          <View style={[Styles.marH20]}>
            <CImage
              cStyle={[
                {height: 100, width: 100, borderRadius: 50},
                Styles.aslCenter,
                Styles.mTop20,
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
              Sign Up
            </Text>

            <TextInput
              label="Full Name*"
              mode="outlined"
              //theme='#FF6600'
              underlineColor="red"
              returnKeyType="next"
              // outlineColor='#FF6600'
              // backgroundColor= '#003489'
              blurOnSubmit={false}
              // placeholder='Mobile Number'
              placeholderTextColor="#EC6433"
              // keyboardType='numeric'
              ref={(input) => {
                this.fullname = input;
              }}
              onChangeText={(value) =>
                this.props.getActionSignUp({fullname: value})
              }
              value={this.props.SignupState.fullname}
              style={[Styles.mTop30, Styles.bgFFF, {height: 45}]}
            />

            <TextInput
              label="Password*"
              mode="outlined"
              //theme='#FF6600'
              underlineColor="red"
              returnKeyType="next"
              // outlineColor='#FF6600'
              // backgroundColor= '#003489'
              blurOnSubmit={false}
              // placeholder='Mobile Number'
              placeholderTextColor="#EC6433"
              // keyboardType='numeric'
              ref={(input) => {
                this.password = input;
              }}
              onChangeText={(value) =>
                this.props.getActionSignUp({password: value})
              }
              value={this.props.SignupState.password}
              style={[Styles.bgFFF, Styles.mTop15, {height: 45}]}
            />

            <TextInput
              label="Confirm Password*"
              mode="outlined"
              //theme='#FF6600'
              underlineColor="red"
              returnKeyType="next"
              // outlineColor='#FF6600'
              // backgroundColor= '#003489'
              blurOnSubmit={false}
              // placeholder='Mobile Number'
              placeholderTextColor="#EC6433"
              // keyboardType='numeric'
              ref={(input) => {
                this.confirmpassword = input;
              }}
              onChangeText={(value) =>
                this.props.getActionSignUp({confirmpassword: value})
              }
              value={this.props.SignupState.confirmpassword}
              style={[Styles.bgFFF, Styles.mTop15, {height: 45}]}
            />

            <TextInput
              label="Email ID*"
              mode="outlined"
              //theme='#FF6600'
              underlineColor="red"
              returnKeyType="next"
              // outlineColor='#FF6600'
              // backgroundColor= '#003489'
              blurOnSubmit={false}
              // placeholder='Mobile Number'
              placeholderTextColor="#EC6433"
              // keyboardType='numeric'
              ref={(input) => {
                this.emailid = input;
              }}
              onChangeText={(value) =>
                this.props.getActionSignUp({emailid: value})
              }
              value={this.props.SignupState.emailid}
              style={[Styles.bgFFF, Styles.mTop15, {height: 45}]}
            />

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
              placeholderTextColor="#EC6433"
              keyboardType="numeric"
              ref={(input) => {
                this.phoneNumber = input;
              }}
              onChangeText={(value) =>
                this.props.getActionSignUp({PhoneNumber: value})
              }
              value={this.props.SignupState.PhoneNumber}
              style={[Styles.bgFFF, Styles.mTop15, {height: 45}]}
            />

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
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>

            {/* <View style={{ marginTop: 13, justifyContent: 'center' }}>
                                    <Text style={{ color: '#7673A5', fontFamily: 'Muli-Regular', fontSize: 13 }}>
                                        By clicking the sumbit button, I agree to all the terms of service and privacy policy
                                    </Text>
                                </View> */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 13,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#7673A5',
                  fontFamily: 'Muli-Regular',
                  fontSize: 14,
                }}>
                Have an Account Already ?{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  this.props.navigation.navigate('LoginScreen');
                }}>
                <Text
                  style={{
                    color: '#FF6600',
                    fontSize: 13,
                    fontFamily: 'Muli-Bold',
                  }}>
                  {' '}
                  Sign in{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - ', state)
  return {
    SignupState: state.SignUp,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
