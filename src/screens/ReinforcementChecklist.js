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
  Modal,
  FlatList,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp, ReinforcementData} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownMenu from '../common/DropDownMenu';
import Snackbar from 'react-native-snackbar';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class ReinforcementChecklist extends React.Component {
  componentDidMount() {
    // this.props.getReinforcementData(
    //   this.props.SignupState.selectedChecklist.question,
    // );

    this.addQuestions();
  }

  addQuestions() {
    var arr = this.props.SignupState.selectedChecklist.question;

    arr.map((ques) => {
      console.log('ques list --->', ques);
      ques.status = null;
      ques.reason = null;
    });

    console.log('questions array -->', arr);
    this.props.getReinforcementData(arr);
  }

  renderSpinner() {
    // console.log(
    //   'spinner calling ----- - - -> ',
    //   this.props.SignupState.spinnerBool,
    // );

    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }
  materials(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            materialname: item.name,
            materialData: item,
            selectMaterialModal: false,
          });
        }}
        style={[
          Styles.marH15,
          Styles.marV5,
          Styles.padV15,
          {backgroundColor: '#f7edeb'},
        ]}
        key={index}>
        <View style={[Styles.row, Styles.marH10, Styles.mTop5]}>
          {/* <CText>{index + 1}. </CText> */}
          <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f13]}>
            {item.name}
          </CText>
        </View>
      </TouchableOpacity>
    );
  }

  contractorList(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            contractor: item.maker.name,
            contractorData: item,
            contractorModal: false,
          });
        }}
        style={[
          Styles.marH15,
          Styles.marV5,
          Styles.padV15,
          {backgroundColor: '#f7edeb'},
        ]}
        key={index}>
        <View style={[Styles.row, Styles.marH10, Styles.mTop5]}>
          {/* <CText>{index + 1}. </CText> */}
          <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f13]}>
            {item.maker.name}
          </CText>
        </View>
      </TouchableOpacity>
    );
  }

  handleSiteDetails() {
    if (
      !this.props.SignupState.checklistAddress ||
      !this.props.SignupState.materialname ||
      !this.props.SignupState.inspectionQuantity ||
      !this.props.SignupState.UOM ||
      !this.props.SignupState.contractor
    ) {
      Snackbar.show({
        text: 'Please include all fields',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      const siteData = {
        areaInspected: this.props.SignupState.checklistAddress,
        inspectionMaterialQuantity: this.props.SignupState.materialname,
        inspQuantity: this.props.SignupState.inspectionQuantity,
        uom: this.props.SignupState.UOM,
        contractorResponsible: this.props.SignupState.contractor,
      };

      this.props.getActionSignUp({
        siteDetails: siteData,
      });

      this.props.navigation.navigate('ReinforcementInspection');
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
                this.props.navigation.navigate('QualityInspectionScreen');
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
              cStyle={[{height: 25, width: 25}]}
              src={require('../images/bell.png')}
            />
          </View>
        </View>

        {/* <View style={[{paddingVertical: 5}, Styles.orange]}>
            <View
              style={[
                {
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginHorizontal: 20,
                },
                Styles.aitCenter,
              ]}>
              <CText cStyle={[{color: 'white'}, Styles.f16]}>
                Project name, Address
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}]}
                src={require('../images/down.png')}
              />
            </View>
          </View> */}

        <DropDownMenu />

        <ScrollView>
          <CText
            cStyle={[
              {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
              Styles.cBlue,
              Styles.marV10,
            ]}>
            {this.props.SignupState.checklistName}
          </CText>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Area Being Inspected
            </CText>
            <TextInput
              mode="outlined"
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Describe the Zone/Area being Inspected (Ex Tower1, 5th Floor Slab)"
              placeholderTextColor="#A8A8A8"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.checklistAddress = input;
              // }}
              onChangeText={(value) =>
                this.props.getActionSignUp({checklistAddress: value})
              }
              value={this.props.SignupState.checklistAddress}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f13,
                {fontWeight: '500'},
              ]}
            />
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop20,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Inspection Material Quantity
            </CText>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.props.getActionSignUp({selectMaterialModal: true});
              }}
              style={[
                {borderColor: '#acadac', borderWidth: 2, borderRadius: 5},
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
              ]}>
              <CText
                cStyle={[
                  Styles.mLt10,
                  Styles.cAsh,
                  Styles.f13,
                  {
                    color: this.props.SignupState.materialname
                      ? '#000'
                      : '#a8a8a8',
                  },
                ]}>
                {this.props.SignupState.materialname
                  ? this.props.SignupState.materialname
                  : 'Select the Material Being Inspected'}
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </TouchableOpacity>
            <View style={[Styles.row, Styles.jSpaceBet]}>
              <TextInput
                mode="outlined"
                theme=""
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Enter Insp Quantity"
                placeholderTextColor="#A8A8A8"
                keyboardType="numeric"
                // multiline={true}
                // ref={(input) => {
                //   this.inspectionQuantity = input;
                // }}
                onChangeText={(value) =>
                  this.props.getActionSignUp({inspectionQuantity: value})
                }
                value={this.props.SignupState.inspectionQuantity}
                style={[
                  Styles.padV5,
                  Styles.marH15,
                  {flex: 0.6, height: 40},
                  Styles.bgFFF,
                  Styles.f13,
                ]}
              />
              <TextInput
                mode="outlined"
                theme=""
                returnKeyType="next"
                blurOnSubmit={false}
                autoCapitalize="characters"
                placeholder="UOM"
                placeholderTextColor="#A8A8A8"
                keyboardType="default"
                // multiline={true}
                // ref={(input) => {
                //   this.UOM = input;
                // }}
                onChangeText={(value) =>
                  this.props.getActionSignUp({UOM: value})
                }
                value={this.props.SignupState.UOM}
                style={[
                  Styles.padV5,
                  Styles.marH15,
                  {flex: 0.4, height: 40},
                  Styles.bgFFF,
                  Styles.f13,
                ]}
              />
            </View>
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop20,
            ]}>
            <CText
              cStyle={[
                {fontSize: 14, marginTop: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Contractor Responsible
            </CText>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.getActionSignUp({contractorModal: true});
              }}
              style={[
                {borderColor: '#acadac', borderWidth: 1.5, borderRadius: 5},
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
              ]}>
              <CText
                cStyle={[
                  Styles.mLt10,
                  Styles.cAsh,
                  Styles.f13,
                  {
                    color: this.props.SignupState.contractor
                      ? '#000'
                      : '#a8a8a8',
                  },
                ]}>
                {this.props.SignupState.contractor
                  ? this.props.SignupState.contractor
                  : 'Select the Contractor from the List'}
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.handleSiteDetails();
            }}
            style={[
              Styles.brdRad5,
              Styles.marH20,
              {marginTop: 30, backgroundColor: '#010066'},
            ]}
            activeOpacity={0.6}>
            <Text
              style={[
                Styles.f16,
                Styles.padH10,
                Styles.padV10,
                Styles.aslCenter,
                Styles.cFFF,
                {fontWeight: '500'},
              ]}>
              Start Inspection
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* //TODO: should add material data here */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.SignupState.selectMaterialModal}
          onRequestClose={() => {}}
          style={[Styles.flex1]}
          propagateSwipe={true}>
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: -1,
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            ]}>
            <View
              style={[
                Styles.flex1,
                Styles.aitCenter,
                Styles.jCenter,
                Styles.brdRad10,
                {
                  display: this.props.SignupState.selectMaterialModal
                    ? 'flex'
                    : 'flex',
                },
              ]}>
              <View
                style={[
                  {width: Dimensions.get('window').width - 50, height: 400},
                  Styles.bgFFF,
                ]}>
                <View style={[Styles.blue]}>
                  <View
                    style={[
                      Styles.row,
                      Styles.padV15,
                      Styles.jSpaceBet,
                      Styles.aitCenter,
                      Styles.marH15,
                    ]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.aslCenter,
                        Styles.cFFF,
                        Styles.aslCenter,
                        {fontWeight: '600'},
                      ]}>
                      Inspection Material Quantity
                    </CText>

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        this.props.getActionSignUp({
                          selectMaterialModal: false,
                        });
                      }}
                      style={[]}>
                      <CImage
                        cStyle={{height: 25, width: 25}}
                        src={require('../images/close-white.png')}
                        resizeMode={'contain'}
                      />
                      {/* <CText cStyle={[Styles.cFFF,Styles.f15,Styles.fWbold]}>Close</CText> */}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* <FlatList
                    data={this.props.SignupState.QualityInspectionData}
                    //keyExtractor={(item, index) => item._id + index}
                    renderItem={({item, index}) => this.materials(item, index)}
                    extraData={this.props}
                    // horizontal={true}
                    style={[Styles.marV10]}
                  /> */}

                {this.props.SignupState.selectedProject.material.map(
                  (item, index) => this.materials(item, index),
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* //TODO: should add contractor responsible data here */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.SignupState.contractorModal}
          onRequestClose={() => {}}
          style={[Styles.flex1]}
          propagateSwipe={true}>
          <View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: -1,
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            ]}>
            <View
              style={[
                Styles.flex1,
                Styles.aitCenter,
                Styles.jCenter,
                Styles.brdRad10,
                {
                  display: this.props.SignupState.contractorModal
                    ? 'flex'
                    : 'flex',
                },
              ]}>
              <View
                style={[
                  {width: Dimensions.get('window').width - 50, height: 400},
                  Styles.bgFFF,
                ]}>
                <View style={[Styles.cBlue]}>
                  <View
                    style={[
                      Styles.row,
                      Styles.padV15,
                      Styles.jSpaceBet,
                      Styles.aitCenter,
                      Styles.marH15,
                    ]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.aslCenter,
                        Styles.cFFF,
                        Styles.aslCenter,
                        {fontWeight: '600'},
                      ]}>
                      Contractor List
                    </CText>

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        this.props.getActionSignUp({contractorModal: false});
                      }}
                      style={[]}>
                      <CImage
                        cStyle={{height: 25, width: 25}}
                        src={require('../images/close-white.png')}
                        resizeMode={'contain'}
                      />
                      {/* <CText cStyle={[Styles.cFFF,Styles.f15,Styles.fWbold]}>Close</CText> */}
                    </TouchableOpacity>
                  </View>
                </View>
                {/* <FlatList
                    data={this.props.SignupState.QualityInspectionData}
                    //keyExtractor={(item, index) => item._id + index}
                    renderItem={({item, index}) =>
                      this.contractorList(item, index)
                    }
                    extraData={this.props}
                    // horizontal={true}
                    style={[Styles.marV10]}
                  /> */}

                {this.props.SignupState.selectedProject.material.map(
                  (item, index) => this.contractorList(item, index),
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - ', state);
  return {
    SignupState: state.SignUp,
    ReinforcementState: state.ReinforcementData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
    getReinforcementData: bindActionCreators(ReinforcementData, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReinforcementChecklist);
