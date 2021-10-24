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
  Keyboard,
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

class OTPverificationScreen extends React.Component {
  componentDidMount() {
    this.props.getActionSignUp({
      spinnerBool: false,
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: '',
    });
  }

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  resendOTP = async () => {
    await axios({
      method: 'GET',
      url: `${Config.routes.otpURL}/${this.props.SignupState.PhoneNumber}/`,
      // data: {
      //   // mobile: this.props.SignupState.PhoneNumber,
      //   // password: '1234',
      //   phone_number: '+91' + this.state.phone,
      // },
    }).then((res) => {
      Snackbar.show({
        text: `${res.data.success}`,
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    });
  };

  validateOTP() {
    const otp1 = this.props.SignupState.otp1;
    const otp2 = this.props.SignupState.otp2;
    const otp3 = this.props.SignupState.otp3;
    const otp4 = this.props.SignupState.otp4;
    const otp5 = this.props.SignupState.otp5;
    const otp6 = this.props.SignupState.otp6;

    let finalOTP = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    // console.log(' final otp', finalOTP);
    // console.log(' final otp', typeof finalOTP);
    // console.log(
    //   ' phone number in OTP screen',
    //   this.props.SignupState.PhoneNumber,
    // );

    if (otp1 && otp2 && otp3 && otp4 && otp5 && otp6) {
      // this.props.navigation.navigate('footer')
      this.props.getActionSignUp({spinnerBool: true});

      axios({
        method: 'post',

        url: Config.routes.otpVerifyUrl,
        data: {
          otp: finalOTP,
          phone_number: this.props.SignupState.PhoneNumber,
        },
      })
        .then((response) => {
          this.props.getActionSignUp({spinnerBool: false});
          // console.log('response - -', response.data);

          Snackbar.show({
            text: 'Your OTP was Verified',
            textColor: '#fff',
            backgroundColor: '#FF6600',
          });

          this.storeAccessToken(response.data.access);

          this.props.navigation.navigate('LoginPinScreen');
          // this.props.navigation.navigate('footer');
        })
        .catch((error) => {
          // console.warn(error.response.data.message)
          this.props.getActionSignUp({spinnerBool: false});
          //  console.log('error login  - - - - ', error.response)
          // Utils.dialogBox('Please enter valid OTP', error);
        });
    } else {
      // Utils.dialogBox('please enter 6 digit OTP', '');
    }
  }

  storeAccessToken = async (data) => {
    try {
      await AsyncStorage.setItem('access_token', data);

      const getToken = await AsyncStorage.getItem('access_token');

      if (getToken !== null) {
        // console.log('token', getToken);
      } else {
        console.log('token null', getToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1}]}>
        {this.renderSpinner()}
        {/* <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor={Platform.OS === 'ios' ? '#aaa' : '#FFF'}
                />*/}

        <ScrollView>
          <View style={[Styles.marH20]}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[Styles.mTop40]}>
              <CText cStyle={[Styles.f15]}>Back</CText>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 70,
                marginBottom: 30,
                justifyContent: 'center',
                flex: 1,
              }}>
              <CImage
                cStyle={[
                  {height: 100, width: 100, borderRadius: 50},
                  Styles.aslCenter,
                ]}
                src={require('../images/OtpScreenImage.png')}
              />

              <Text
                style={[
                  Styles.fWbold,
                  Styles.aslCenter,
                  {color: '#FF6600', fontSize: 18},
                  Styles.mTop15,
                ]}>
                OTP Verification
              </Text>
              <Text
                style={[
                  {fontSize: 15, color: '#5A587C', marginTop: 15},
                  Styles.aslCenter,
                ]}>
                Enter the OTP Sent to{' '}
                <Text
                  style={[{fontSize: 15, color: '#FF6600'}, Styles.aslCenter]}>
                  {this.props.SignupState.PhoneNumber}
                </Text>
              </Text>
            </View>

            <KeyboardAvoidingView style={{flex: 1}}>
              <View style={[Styles.row, Styles.jSpaceArd, Styles.marV15]}>
                <TextInput
                  style={[
                    Styles.brdRad5,
                    {paddingLeft: 5, backgroundColor: 'white', borderWidth: 1},
                  ]}
                  // theme={theme}
                  maxLength={1}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp1 = input;
                  }}
                  onSubmitEditing={() => {
                    this.otp2.focus();
                  }}
                  onChangeText={(otp1) =>
                    this.props.getActionSignUp(
                      {otp1},
                      otp1 === '' ? null : this.otp2.focus(),
                    )
                  }
                  value={this.props.SignupState.otp1}
                />
                <TextInput
                  style={[
                    Styles.brdRad5,
                    {paddingLeft: 5, backgroundColor: 'white', borderWidth: 1},
                  ]}
                  maxLength={1}
                  //theme={theme}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp2 = input;
                  }}
                  onSubmitEditing={() => {
                    this.otp3.focus();
                  }}
                  onChangeText={(otp2) =>
                    this.props.getActionSignUp(
                      {otp2},
                      otp2 === '' ? null : this.otp3.focus(),
                    )
                  }
                  value={this.props.SignupState.otp2}
                />
                <TextInput
                  style={[
                    Styles.brdRad5,
                    // Styles.bw1,
                    {paddingLeft: 5, backgroundColor: 'white', borderWidth: 1},
                  ]}
                  maxLength={1}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp3 = input;
                  }}
                  onSubmitEditing={() => {
                    this.otp4.focus();
                  }}
                  onChangeText={(otp3) =>
                    this.props.getActionSignUp(
                      {otp3},
                      otp3 === '' ? null : this.otp4.focus(),
                    )
                  }
                  value={this.props.SignupState.otp3}
                />
                <TextInput
                  style={[
                    Styles.brdRad5,
                    // Styles.bw1,

                    {paddingLeft: 5, backgroundColor: 'white', borderWidth: 1},
                  ]}
                  maxLength={1}
                  //theme={theme}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp4 = input;
                  }}
                  onSubmitEditing={() => {
                    this.otp5.focus();
                  }}
                  onChangeText={(otp4) =>
                    this.props.getActionSignUp(
                      {otp4},
                      otp4 === '' ? null : this.otp5.focus(),
                    )
                  }
                  value={this.props.SignupState.otp4}
                />
                <TextInput
                  style={[
                    Styles.brdRad5,
                    // Styles.bw1,
                    Styles.bgFFF,
                    {paddingLeft: 5, borderWidth: 1},
                  ]}
                  maxLength={1}
                  // theme={theme}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp5 = input;
                  }}
                  onSubmitEditing={() => {
                    this.otp6.focus();
                  }}
                  onChangeText={(otp5) =>
                    this.props.getActionSignUp(
                      {otp5},
                      otp5 === '' ? null : this.otp6.focus(),
                    )
                  }
                  value={this.props.SignupState.otp5}
                />
                <TextInput
                  style={[
                    Styles.brdRad5,
                    Styles.bgFFF,
                    {paddingLeft: 5, borderWidth: 1},
                  ]}
                  maxLength={1}
                  //  theme={theme}
                  returnKeyType="next"
                  keyboardType="numeric"
                  blurOnSubmit={false}
                  ref={(input) => {
                    this.otp6 = input;
                  }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  onChangeText={(otp6) =>
                    this.props.getActionSignUp(
                      {otp6},
                      otp6 === ' ' ? null : Keyboard.dismiss(),
                    )
                  }
                  value={this.props.SignupState.otp6}
                />
              </View>
            </KeyboardAvoidingView>

            <View style={[Styles.marV10]}>
              <View style={[Styles.row, Styles.padV10, Styles.aslCenter]}>
                <Text style={[Styles.cBlue, Styles.f13]}>
                  Didn't receive the code?
                </Text>

                <TouchableOpacity onPress={() => this.resendOTP()}>
                  <CText
                    cStyle={[
                      {color: '#FF6600'},
                      Styles.f13,
                      // Styles.ffMregular,
                    ]}>
                    {' '}
                    Resend OTP
                  </CText>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.validateOTP();
              }}
              style={[
                Styles.mTop40,
                Styles.mBtm10,
                Styles.brdRad5,
                {backgroundColor: '#FF6600'},
              ]}
              activeOpacity={0.6}>
              <Text
                style={[
                  Styles.f13,
                  Styles.padH10,
                  Styles.padV10,
                  Styles.aslCenter,
                  Styles.cFFF,
                ]}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OTPverificationScreen);
