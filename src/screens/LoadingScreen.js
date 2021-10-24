import React, {Component} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CSpinner} from '../common';

class LoadingScreen extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (token === null) {
        this.props.navigation.navigate('LoginScreen');
      } else {
        this.props.navigation.navigate('LoginPinScreen');
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  render() {
    return (
      <View>
        <CSpinner />
      </View>
    );
  }
}

export default LoadingScreen;
