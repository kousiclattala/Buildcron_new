//import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {tabbaricons} from './tabbarIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionSignUp} from '../../Store/Actions/SignUpAction';

class TabItem extends Component {
  HandlePressed = () => {
    this.props.navigation.navigate(this.props.routeName);
  };

  render() {
    const {routeName, isActive} = this.props;
    const Icon = tabbaricons[isActive ? 'active' : 'inactive'][routeName];
    if (routeName === 'Directory') {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={this.HandlePressed.bind(this)}
          activeOpacity={0.6}>
          {Icon}
          {/* <Icon/> */}
          <Text
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#FFF' : '#FFF',
              marginTop: 0,
              fontSize: 9,
            }}>
            {routeName}
          </Text>
        </TouchableOpacity>
      );
    } else if (routeName === 'MyDocs') {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={this.HandlePressed.bind(this)}
          activeOpacity={0.6}>
          {Icon}
          {/* <Icon/> */}
          <Text
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#FFF' : '#FFF',
              marginTop: 0,
              fontSize: 9,
            }}>
            My Docs
          </Text>
        </TouchableOpacity>
      );
    } else if (routeName === 'Home') {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 150 * 0.5,
            height: 150 * 0.5,
            borderRadius: 250,
            backgroundColor: '#010066',
            position: 'relative',
            bottom: 15,
          }}
          onPress={this.HandlePressed.bind(this)}
          activeOpacity={1}>
          {Icon}
          {/* <Icon/> */}
          <Text
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#FFF' : '#FFF',
              marginTop: 0,
              fontSize: 9,
            }}>
            {routeName}
          </Text>
        </TouchableOpacity>
      );
    } else if (routeName === 'Todolist') {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={this.HandlePressed.bind(this)}
          activeOpacity={0.6}>
          {Icon}
          {/* <Icon/> */}
          <Text
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#FFF' : '#FFF',
              marginTop: 0,
              fontSize: 9,
            }}>
            To do list
          </Text>
        </TouchableOpacity>
      );
    } else if (routeName === 'Search') {
      return (
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          onPress={this.HandlePressed.bind(this)}
          activeOpacity={0.6}>
          {Icon}
          {/* <Icon/> */}
          <Text
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#FFF' : '#FFF',
              fontSize: 9,
            }}>
            {routeName}
          </Text>
        </TouchableOpacity>
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(TabItem);
