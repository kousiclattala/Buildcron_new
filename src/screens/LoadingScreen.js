import React, {Component} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CSpinner} from '../common';

class LoadingScreen extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (token === null) {
        this.props.navigation.navigate('auth');
      } else {
        this.props.navigation.navigate('appNav');
      }
    } catch (error) {
      console.log(error);
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
