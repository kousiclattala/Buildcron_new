import React, {Component} from 'react';
import {Alert, View, TouchableOpacity, Text, Button, Image} from 'react-native';
import PINCode, {
  hasUserSetPinCode,
  deleteUserPinCode,
  resetPinCodeInternalStates,
} from '@haskkor/react-native-pincode';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginPinScreen extends Component {
  constructor() {
    super();
    this.state = {
      showPinLock: true,
      PinCodeStatus: 'choose',
    };
  }

  async renderComponent() {
    var isPinSet = await hasUserSetPinCode();
    // console.log(isPinSet);
    if (isPinSet) {
      this.setState({
        showPinLock: true,
        PinCodeStatus: 'enter',
      });
    } else {
      this.setState({
        showPinLock: true,
        PinCodeStatus: 'choose',
      });
    }
  }

  componentDidMount() {
    this.renderComponent();
    // this.getAllKeys();
  }

  getAllKeys = async () => {
    var keys = [];
    keys = await AsyncStorage.getAllKeys();

    var data = await AsyncStorage.multiGet(keys);

    // console.log('data from async storage', data);
  };

  _finishProcess() {
    Snackbar.show({
      text: 'You have Successfully set the Passcode',
      textColor: '#fff',
      backgroundColor: '#FF6600',
      duration: Snackbar.LENGTH_SHORT,
    });
    this.props.navigation.navigate('footer');
  }

  async checkPin() {
    Snackbar.show({
      text: 'Your Passcode is Verified',
      textColor: '#fff',
      backgroundColor: '#FF6600',
      duration: Snackbar.LENGTH_LONG,
    });
    this.props.navigation.navigate('footer');
  }

  _onFail(res) {
    // console.log(res);

    if (res === 3) {
      Snackbar.show({
        text: 'Your account is locked',
        textColor: '#fff',
        backgroundColor: '#ff6600',
      });

      return <PINCode status="locked" />;
    } else {
      Snackbar.show({
        text: `You have ${3 - res} attempts`,
        textColor: '#fff',
        backgroundColor: '#ff6600',
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: 'Reset Passcode',
          textColor: '#fff',
          onPress: () => this._resetPinCode(),
        },
      });
    }
  }

  async _resetPinCode() {
    await deleteUserPinCode();
    await resetPinCodeInternalStates();

    Snackbar.show({
      text: 'Your Passcode was removed',
      textColor: '#fff',
      backgroundColor: '#ff6600',
    });

    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        {this.state.showPinLock && (
          <PINCode
            status={this.state.PinCodeStatus}
            finishProcess={
              this.state.PinCodeStatus === 'choose'
                ? () => this._finishProcess()
                : () => this.checkPin()
            }
            onFail={(res) => this._onFail(res)}
            titleChoose="1 - Enter Pass Code"
            titleConfirm="2 - Confirm Pass Code"
            titleEnter="Enter your Pass Code"
            touchIDDisabled={true}
            passwordLength={6}
            stylePinCodeDeleteButtonIcon="backspace"
            stylePinCodeHiddenPasswordSizeFull={12}
            stylePinCodeDeleteButtonColorHideUnderlay="black"
            stylePinCodeDeleteButtonText={{
              color: 'black',
              fontWeight: 'bold',
            }}
            colorPassword="#FF6600"
            numbersButtonOverlayColor="#FF6600"
            stylePinCodeColorTitle="#FF6600"
            stylePinCodeButtonCircle="#010066"
            stylePinCodeButtonNumber="#010066"
          />
        )}
      </View>
    );
  }
}

export default LoginPinScreen;
