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
  BackHandler,
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
const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class SafetyInspectionScreen extends React.Component {
  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
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

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  qualityInspectionData(item, index) {
    // console.log('item - - - >', item);
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            checklist_id: item.id,
            checklistName: item.name,
          });
          this.selectionOfQI(item);
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
          {item.name}
        </CText>
        <CImage
          cStyle={[{height: 30, width: 30}]}
          src={require('../images/right.png')}
        />
      </TouchableOpacity>
    );
  }

  selectionOfQI(item) {
    // console.warn(item.id);

    this.props.getActionSignUp({
      selectedChecklist: item,
      inspectionType: 'Safety',
    });

    this.props.navigation.navigate('ReinforcementChecklist');
    // if (id === 5) {
    //   this.props.navigation.navigate('ReinforcementChecklist');
    // }
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
            {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
            Styles.marV15,
            Styles.cBlue,
          ]}>
          Safety Inspection Library
        </CText>
        <View
          style={[
            {
              borderBottomColor: '#DDD',
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
              height: 45,
            },
          ]}>
          <CInput
            placeholder={'Search Checklist here '}
            cStyle={[{marginLeft: 15, fontSize: 15, flex: 0.95}]}></CInput>
          <CImage
            cStyle={[{height: 25, width: 25}]}
            src={require('../images/search.png')}
          />
        </View>

        {/* <Flatlist>
                         
                     </Flatlist> */}
        {/* <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Site Survey CheckList (QIS-1)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>

                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95 ,color:'#142A66'}]}>Pre-Exavation CheckList (QIS-2)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>

                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Earthwork pre-filling CheckList (QIS-3)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>
                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Earth Filling & Compaction CheckList (QIS-4)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>

                    <TouchableOpacity activeOpacity={0.6} onPress={()=>{this.props.navigation.navigate('ReinforcementChecklist')}} style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Reinforcement CheckList (QIS-5)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </TouchableOpacity>

                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95 ,color:'#142A66'}]}>Formwork CheckList (QIS-6)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>

                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Concentrate pour card (QIS-7)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View>
                    <View style={[{ paddingVertical: 15, backgroundColor: '#F7EDEB', marginHorizontal: 20, marginTop: 15, flexDirection: 'row', borderRadius: 5 }]}>
                        <CText cStyle={[{ marginLeft: 10, fontSize: 15, flex: 0.95,color:'#142A66' }]}>Water Proofing CheckList (QIS-8)</CText>
                        <CImage cStyle={[{ height: 30, width: 30 }]} src={require('../images/right.png')} />
                    </View> */}

        {/* <FlatList
          data={this.props.SignupState.QualityInspectionData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item, index}) =>
            this.qualityInspectionData(item, index)
          }
          extraData={this.props}
          style={[Styles.mBtm20]}
        /> */}

        {/* {this.props.SignupState.selectedProject.checklists.map((list) => {
          if (list.typee === 'Safety') {
            return this.qualityInspectionData(list);
          }
        })} */}

        {this.props.SignupState.selectedProject.length == 0 ? (
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
        ) : this.props.SignupState.selectedProject.safety_checklist.length ==
          0 ? (
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
              No Checklist Data
            </Text>
          </View>
        ) : (
          this.props.SignupState.selectedProject.safety_checklist.map(
            (list, index) => {
              return this.qualityInspectionData(list, index);
            },
          )
        )}

        {/* </ScrollView> */}
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
)(SafetyInspectionScreen);
