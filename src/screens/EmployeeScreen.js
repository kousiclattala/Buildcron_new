import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config';
import {ActionSignUp} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class EmployeeScreen extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    this.getNotifications();
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

  getNotifications = async () => {
    try {
      var token = await AsyncStorage.getItem('access_token');

      await axios({
        method: 'GET',
        url: Config.routes.approverGetAPI,
        headers: {
          Authorization: 'JWT ' + token,
        },
      })
        .then((res) => {
          console.log('notification res -->', res.data);
          // TODO: add data to redux state variable Notifications
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(err);
    }
  };

  renderNotifications(item, index) {
    //Todo: render notification data using redux varaible Notifications

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.selectionOfNotification(item);
        }}
        style={[
          {
            paddingVertical: 10,
            backgroundColor: '#f7edeb',
            marginHorizontal: 20,
            marginTop: 15,
            flexDirection: 'row',
            borderRadius: 5,
          },
          Styles.aitCenter,
        ]}
        key={index}>
        <CText
          cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
          {item.data.type}
        </CText>
        <CImage
          cStyle={[{height: 30, width: 30}]}
          src={require('../images/right.png')}
        />
      </TouchableOpacity>
    );
  }

  selectionOfNotification(item) {
    this.props.getActionSignUp({
      notificationData: item,
    });

    this.props.navigation.navigate('NotificationPreviewScreen');
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
            Styles.cBlue,
          ]}>
          Notification Page
        </CText>
        {/* <View
          style={[
            {
              borderBottomColor: '#DDD',
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
              height: 40,
            },
          ]}>
          <CInput
            placeholder={'Search Docs here'}
            cStyle={[{marginLeft: 15, fontSize: 14, flex: 0.95}]}></CInput>
          <CImage
            cStyle={[{height: 25, width: 25}]}
            src={require('../images/search.png')}
          />
        </View> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.props.navigation.navigate('NotificationPreviewScreen');
          }}
          style={[
            {
              paddingVertical: 10,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
            },
            Styles.aitCenter,
          ]}>
          <CText
            cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
            Safety
          </CText>
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/right.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.props.navigation.navigate('NotificationPreviewScreen');
          }}
          style={[
            {
              paddingVertical: 10,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
            },
            Styles.aitCenter,
          ]}>
          <CText
            cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
            Quality
          </CText>
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/right.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.props.navigation.navigate('NotificationPreviewScreen');
          }}
          style={[
            {
              paddingVertical: 10,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
            },
            Styles.aitCenter,
          ]}>
          <CText
            cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
            Site Observation
          </CText>
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/right.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.props.navigation.navigate('NotificationPreviewScreen');
          }}
          style={[
            {
              paddingVertical: 10,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
            },
            Styles.aitCenter,
          ]}>
          <CText
            cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
            NCReport
          </CText>
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/right.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.props.navigation.navigate('NotificationPreviewScreen');
          }}
          style={[
            {
              paddingVertical: 10,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
            },
            Styles.aitCenter,
          ]}>
          <CText
            cStyle={[{marginLeft: 10, fontSize: 13, flex: 0.95}, Styles.cBlue]}>
            Daily Report
          </CText>
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/right.png')}
          />
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeScreen);
