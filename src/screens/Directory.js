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
  FlatList,
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
import DropDownMenu from '../common/DropDownMenu';
import {DrawerActions} from 'react-navigation-drawer';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class Directory extends React.Component {
  constructor() {
    super();
    this.state = {
      DebitCardOption: 'Wallet',
      isApprover: true,
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});
  }

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  employeeDetails(item, index) {
    // console.log('item from directory', item);
  }

  qualityInspectionData(item, index) {
    // console.log('item - - - >', item),
    if (this.props.SignupState.SelectedOption === 'Employee') {
      return (
        <View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.selectionOfQI(item.id);
            }}
            style={[
              {
                paddingVertical: 15,
                backgroundColor: '#f7edeb',
                marginHorizontal: 20,
                marginTop: 10,
                borderRadius: 5,
              },
            ]}
            key={index}>
            <CText
              cStyle={[
                {marginLeft: 10, fontSize: 15, fontWeight: 'bold'},
                Styles.cBlk,
              ]}>
              {item.user.first_name}
            </CText>
            <CText
              cStyle={[
                {marginLeft: 10, fontSize: 12, marginVertical: 3},
                Styles.cBlk,
              ]}>
              {item.user.email}
            </CText>
            <CText cStyle={[{marginLeft: 10, fontSize: 12, color: 'blue'}]}>
              {item.user.phone_number}
              {/* <CText cStyle={[{fontSize: 12}, Styles.cBlk]}>
                {' '}
                {item.user.email}
              </CText> */}
            </CText>
          </TouchableOpacity>
        </View>
      );
    }
    if (this.props.SignupState.SelectedOption === 'Vendors') {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.selectionOfQI(item.id);
          }}
          style={[
            {
              paddingVertical: 15,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: index === 0 ? 0 : 10,
              borderRadius: 5,
            },
          ]}
          key={index}>
          <CText
            cStyle={[
              {marginLeft: 10, fontSize: 15, fontWeight: '600'},
              Styles.cBlk,
            ]}>
            {/* TM tech solutions pvt ltd. */}
            Name: {item.maker.name}
          </CText>
          {/* <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
            BUDE0013, Ramanthapur{' '}
          </CText>
          <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
            Hyderabad, Telangana
          </CText>

          <CText cStyle={[{marginLeft: 10, fontSize: 12, color: 'blue'}]}>
            +91- 8686808676{' '}
            <CText cStyle={[{fontSize: 12}, Styles.cBlk]}>
              , vinay@analogit.in
            </CText>
          </CText>
          <CText cStyle={[{marginLeft: 10, fontSize: 12, color: 'blue'}]}>
            <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
              SuperVisor: RS pandey{' '}
            </CText>{' '}
            +91- 8686808676
          </CText> */}
        </TouchableOpacity>
      );
    }
    if (this.props.SignupState.SelectedOption === 'Materials') {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.selectionOfQI(item.id);
          }}
          style={[
            {
              paddingVertical: 15,
              backgroundColor: '#f7edeb',
              marginHorizontal: 20,
              marginTop: index === 0 ? 0 : 10,
              borderRadius: 5,
            },
          ]}
          key={index}>
          <CText
            cStyle={[
              {marginLeft: 10, fontSize: 15, fontWeight: '600'},
              Styles.cBlk,
            ]}>
            {/* M30 Concrete */}
            Name: {item.name}
          </CText>
          <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
            {/* BUDMA001, BOQ Ref: 1.1.12, Make: ACC */}
            Total Quantity: {item.total_qty}
          </CText>
          {/* <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
            Project Quantity: 8000 cum
          </CText>
          <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
            Remaining Quantity: 2000 cum
          </CText> */}
        </TouchableOpacity>
      );
    }
  }

  // selectionOfQI(id) {
  //   console.warn(id);
  //   if (id === 5) {
  //     this.props.navigation.navigate('ReinforcementChecklist');
  //   }
  // }

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
          Project Directory
        </CText>
        <View
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
            placeholder={'Search Quicklist'}
            cStyle={[{marginLeft: 15, fontSize: 14, flex: 0.95}]}></CInput>
          <CImage
            cStyle={[{height: 25, width: 25}]}
            src={require('../images/search.png')}
          />
        </View>
        <ScrollView style={[{marginBottom: 20}]}>
          <View
            style={[
              Styles.row,
              Styles.jSpaceArd,
              Styles.marV15,
              Styles.marH20,
            ]}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                {
                  backgroundColor:
                    this.props.SignupState.SelectedOption === 'Employee'
                      ? 'blue'
                      : '#ddd',
                },
                Styles.jCenter,
                Styles.aitCenter,
                Styles.padV5,
                Styles.padH15,
              ]}
              onPress={() => {
                this.props.getActionSignUp({SelectedOption: 'Employee'});
              }}>
              <CText
                cStyle={[
                  {
                    fontSize: 14,
                    paddingVertical: 0,
                    color:
                      this.props.SignupState.SelectedOption === 'Employee'
                        ? '#FFF'
                        : 'black',
                  },
                  Styles.jCenter,
                ]}>
                Employee
              </CText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                {
                  backgroundColor:
                    this.props.SignupState.SelectedOption === 'Vendors'
                      ? 'blue'
                      : '#ddd',
                  borderBottomColor: true === 'DEBITCARD' ? '#1E32FA' : '#ddd',
                },
                Styles.jCenter,
                Styles.aitCenter,
                Styles.padV5,
                Styles.padH15,
              ]}
              onPress={() => {
                this.props.getActionSignUp({SelectedOption: 'Vendors'});
              }}>
              <CText
                cStyle={[
                  {
                    fontSize: 14,
                    paddingVertical: 0,
                    color:
                      this.props.SignupState.SelectedOption === 'Vendors'
                        ? '#FFF'
                        : 'black',
                  },
                ]}>
                Vendors
              </CText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                {
                  backgroundColor:
                    this.props.SignupState.SelectedOption === 'Materials'
                      ? 'blue'
                      : '#ddd',
                  borderBottomColor: true === 'CREDITCARD' ? '#1E32FA' : '#fff',
                },
                Styles.jCenter,
                Styles.aitCenter,
                Styles.padV5,
                Styles.padH15,
              ]}
              onPress={() => {
                this.props.getActionSignUp({SelectedOption: 'Materials'});
              }}>
              <CText
                cStyle={[
                  {
                    fontSize: 14,
                    paddingVertical: 0,
                    color:
                      this.props.SignupState.SelectedOption === 'Materials'
                        ? '#FFF'
                        : 'black',
                  },
                ]}>
                Materials
              </CText>
            </TouchableOpacity>
          </View>
          {this.props.SignupState.selectedProject.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 28,
                  opacity: 0.5,
                }}>
                No Projects Selected
              </Text>
            </View>
          ) : this.props.SignupState.SelectedOption === 'Employee' ? (
            <View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  //
                }}
                style={[
                  {
                    paddingVertical: 15,
                    backgroundColor: '#f7edeb',
                    marginHorizontal: 20,
                    marginTop: 10,
                    borderRadius: 5,
                  },
                ]}>
                <View>
                  <CText
                    cStyle={[
                      {marginLeft: 10, fontSize: 15, fontWeight: 'bold'},
                      Styles.cBlk,
                      Styles.mBtm5,
                    ]}>
                    {
                      this.props.SignupState.selectedProject.approver.user
                        .first_name
                    }
                  </CText>
                  <View
                    style={[
                      Styles.row,
                      Styles.aitCenter,
                      Styles.mBtm5,
                      {marginLeft: 10},
                    ]}>
                    <View
                      style={[
                        Styles.padV5,
                        Styles.padH10,
                        {
                          backgroundColor: '#10C000',
                          borderRadius: 5,
                        },
                      ]}>
                      <CText
                        cStyle={[
                          Styles.f14,
                          Styles.cFFF,
                          {fontWeight: 'bold'},
                        ]}>
                        Approver
                      </CText>
                    </View>
                  </View>
                </View>

                <CText cStyle={[{fontSize: 12, marginLeft: 10}, Styles.cBlk]}>
                  {this.props.SignupState.selectedProject.approver.user.email}
                </CText>
                <CText cStyle={[{marginLeft: 10, fontSize: 12, color: 'blue'}]}>
                  {
                    this.props.SignupState.selectedProject.approver.user
                      .phone_number
                  }
                </CText>
              </TouchableOpacity>
              {this.props.SignupState.selectedProject.employee.map(
                (item, index) => this.qualityInspectionData(item, index),
              )}
            </View>
          ) : (
            this.props.SignupState.selectedProject.material.map((item, index) =>
              this.qualityInspectionData(item, index),
            )
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Directory);
