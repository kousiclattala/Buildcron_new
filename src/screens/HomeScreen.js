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
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {
  ActionSignUp,
  ScheduleInspection,
  ReinforcementData,
} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import GetLocation from 'react-native-get-location';
import DropDownMenu from '../common/DropDownMenu';
import {DrawerActions} from 'react-navigation-drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      token: '',
      checklists: [],
      questions: [],
      locationEnable: false,
    };
  }

  async componentDidMount() {
    this.requestPermissions();

    // this.getAllKeys();

    this.getToken();

    this.getDeviceLocation();
  }

  getAllKeys = async () => {
    var keys = [];
    keys = await AsyncStorage.getAllKeys();

    var data = await AsyncStorage.multiGet(keys);

    // console.log('data from async storage', data);
  };

  getDeviceLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        this.props.SignupState.getActionSignUp({
          deviceLocation: location,
        });
      })
      .catch((err) => console.log(err));
  };

  requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ],
        {
          title: 'Buildcron wants to use Camera',
          message: 'Camera Permission is required to take pictures of site',
          buttonNeutral: 'Ask me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        },
      ).then((res) => {
        if (
          res['android.permission.CAMERA'] &&
          res['android.permission.READ_EXTERNAL_STORAGE'] &&
          res['android.permission.WRITE_EXTERNAL_STORAGE'] &&
          res['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          console.log('Your Permissions Granted');
        } else {
          Alert.alert('Permission Request', 'Please Give all Permissions', [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'OK',
              onPress: () => {
                alert(
                  'Please Go Into Settings --> Applications --> Buildcron --> Permissions and Allow Permissions',
                );
              },
            },
          ]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // componentDidUpdate(prevProps) {
  //   if (this.state.selectedProj != prevProps.selectedProj) {
  //     this.setState({
  //       selectedProj: this.props.SignupState.selectedProject,
  //     });
  //   }
  // }

  getToken = async () => {
    try {
      var token = await AsyncStorage.getItem('access_token');
      // console.log('token from home screen --->', token);

      if (token == null) {
        console.log('No Token');
      } else {
        this.setState({token: token});

        // console.log('token in state', this.state.token);

        axios({
          method: 'GET',
          url: Config.routes.projectUrl,
          headers: {
            Authorization: 'JWT ' + token,
          },
        })
          .then((res) => {
            // console.log('res data', res.data);
            // console.log('res data', typeof res.data);
            this.props.getActionSignUp({projects: res.data});
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  checkProjectselected(screenName) {
    if (this.props.SignupState.selectedProject.length == 0) {
      Snackbar.show({
        text: 'Please select Project',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      this.props.navigation.navigate(screenName);
    }
  }

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1}]}>
        <MyStatusBar backgroundColor="#010066" barStyle="light-content" />

        {this.renderSpinner()}
        {/* <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor={Platform.OS === 'ios' ? '#aaa' : '#FFF'}
                />*/}
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
                this.props.navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <CImage
                cStyle={[{height: 25, width: 25}]}
                src={require('../images/menu.png')}
              />
            </TouchableOpacity>
            <View>
              <CImage
                cStyle={[{height: 40, width: 140}]}
                src={require('../images/buildcron.png')}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('NotificationScreen');
              }}>
              <CImage
                cStyle={[{height: 30, width: 30}]}
                src={require('../images/bell.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <DropDownMenu />

        <ScrollView>
          <View style={[{backgroundColor: '#f7edeb'}]}>
            <CImage
              cStyle={[
                {height: 120, borderRadius: 10},
                Styles.mTop20,
                Styles.marH10,
              ]}
              src={require('../images/banner.jpg')}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                // this.checkProjectselected('QualityInspectionScreen')
                this.props.navigation.navigate('QualityInspectionScreen')
              }
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 30,
              }}>
              <View style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/QualityInspection.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>
                  Quality inspection
                </CText>
              </View>
            </TouchableOpacity>
            <View
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 30,
              }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  // this.checkProjectselected('SafetyInspectionScreen')
                  this.props.navigation.navigate('SafetyInspectionScreen')
                }
                style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/SafetyInspection.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>
                  Safety Inspection
                </CText>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.navigate('SiteInstructorScreen');
              }}
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 25,
              }}>
              <View style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/QualityInspection.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>
                  Site Observation
                </CText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.navigate('DailyReportScreen');
              }}
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 25,
              }}>
              <View style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/QualityInspection.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>Daily Report</CText>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.navigate('NCReportScreen');
              }}
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 25,
              }}>
              <View style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/SiteReport.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>
                  Site NC Report
                </CText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.navigate('SitePhotos');
              }}
              style={{
                flex: 0.49,
                backgroundColor: '#f7edeb',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 25,
              }}>
              <View style={[{justifyContent: 'center'}, Styles.aitCenter]}>
                <CImage
                  cStyle={[{height: 70, width: 70}]}
                  src={require('../images/Sitephotos.png')}
                />
                <CText cStyle={[Styles.cBlue, Styles.f15]}>Site Photos</CText>
              </View>
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
    ScheduleInspectionState: state.ScheduleInspection,
    ReinforcementState: state.ReinforcementData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
    getScheduleInspection: bindActionCreators(ScheduleInspection, dispatch),
    getReinforcementData: bindActionCreators(ReinforcementData, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
