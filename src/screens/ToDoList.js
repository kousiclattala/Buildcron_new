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
import {
  ActionSignUp,
  ScheduleInspection,
  ReportData,
  ReinforcementData,
} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import DropDownMenu from '../common/DropDownMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from 'react-navigation-drawer';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class TodoList extends React.Component {
  constructor() {
    super();
    this.state = {
      scheduledData: [],
      siteData: [],
      ncrData: [],
      inspectionData: [],
      siteModal: false,
      ncrModal: false,
      inspectionModal: false,
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});

    // console.log(
    //   're scheduled data -->',
    //   this.props.ScheduleInspectionState.reScheduledInspectionData,
    // );

    // console.log(
    //   'report data from store -->',
    //   this.props.ReportInspectionState.reportData,
    // );

    // console.log(
    //   'site Observation -->',
    //   this.props.SignupState.siteObservationSuccessData,
    // );

    this.getScheduledData();
  }

  // getScheduledData = async () => {
  //   try {
  //     let data = await AsyncStorage.getItem('@ScheduledData');

  //     this.setState({
  //       scheduledData: JSON.parse(data),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // TODO: add get inspection data and display it in view

  getScheduledData = async () => {
    var token = await AsyncStorage.getItem('access_token');

    let data = await AsyncStorage.getItem('@ScheduledData');

    this.setState({
      inspectionData: JSON.parse(data),
    });

    await axios({
      method: 'GET',
      url: Config.routes.siteObservationAPI,
      headers: {
        Authorization: 'JWT ' + token,
      },
    })
      .then((res) =>
        // console.log('site data from get -->', res.data),
        this.setState({
          siteData: res.data,
        }),
      )
      .catch((err) => console.log(err));

    await axios({
      method: 'GET',
      url: Config.routes.NCReportAPI,
      headers: {
        Authorization: 'JWT ' + token,
      },
    })
      .then((res) =>
        // console.log('ncr data from get -->', res.data),
        this.setState({
          ncrData: res.data,
        }),
      )
      .catch((err) => console.log(err));
  };

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  qualityInspectionData(item, index) {
    // console.log('item', item);
    return (
      <View
        style={{
          display: this.state.inspectionModal === true ? 'flex' : 'none',
        }}>
        {item === null ? (
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
              No Quality Inspection data
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.selectionOfQualityReport(item);
            }}
            style={[
              {
                paddingVertical: 12,
                backgroundColor: '#fff',
                flexDirection: 'row',
                borderColor: '#ddd',
                borderWidth: 1,
              },
              Styles.aitCenter,
            ]}
            key={index}>
            <View style={[Styles.marH15, Styles.row, Styles.aitCenter]}>
              <View
                style={[
                  Styles.aitCenter,
                  {
                    padding: 3,
                    backgroundColor: 'blue',
                    paddingHorizontal: 12,
                    borderRadius: 5,
                  },
                ]}>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {item.scheduledDateTime.slice(0, 3)}
                </CText>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {item.scheduledDateTime.slice(3, 6)}
                </CText>
              </View>
              <View style={[Styles.mLt10, Styles.flex1]}>
                <CText
                  cStyle={[
                    {marginLeft: 5, fontSize: 13, fontWeight: 'bold'},
                    Styles.cBlk,
                  ]}>
                  {/* Reinforcement Inspection, CIV-PR-002 */}
                  {item.name}
                </CText>
                <View
                  style={[
                    Styles.row,
                    Styles.flex1,
                    Styles.jSpaceBet,
                    Styles.mTop3,
                  ]}>
                  <CText cStyle={[{marginLeft: 5, fontSize: 10}, Styles.cBlk]}>
                    Doc {item.id}
                  </CText>
                  <CText
                    cStyle={[{fontSize: 10, fontWeight: '500'}, Styles.cBlk]}>
                    {item.scheduledDateTime}
                  </CText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  siteObservationData(item, index) {
    // console.log('item', item);
    return (
      <View style={{display: this.state.siteModal === true ? 'flex' : 'none'}}>
        {item === null ? (
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
              No Site Observation data
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.selectionOfSiteReport(item);
            }}
            style={[
              {
                paddingVertical: 12,
                backgroundColor: '#fff',
                flexDirection: 'row',
                borderColor: '#ddd',
                borderWidth: 1,
                marginHorizontal: 20,
              },
              Styles.aitCenter,
            ]}
            key={index}>
            <View style={[Styles.marH15, Styles.row, Styles.aitCenter]}>
              <View
                style={[
                  Styles.aitCenter,
                  {
                    padding: 3,
                    backgroundColor: 'blue',
                    paddingHorizontal: 12,
                    borderRadius: 5,
                  },
                ]}>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {/* {item.scheduledDateTime.slice(0, 3)} */}
                </CText>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {/* {item.scheduledDateTime.slice(3, 6)} */}
                </CText>
              </View>
              <View style={[Styles.mLt10, Styles.flex1]}>
                <CText
                  cStyle={[
                    {marginLeft: 5, fontSize: 13, fontWeight: 'bold'},
                    Styles.cBlk,
                  ]}>
                  {/* Reinforcement Inspection, CIV-PR-002 */}
                  Site Observation
                </CText>
                <View
                  style={[
                    Styles.row,
                    Styles.flex1,
                    Styles.jSpaceBet,
                    Styles.mTop3,
                  ]}>
                  <CText cStyle={[{marginLeft: 5, fontSize: 10}, Styles.cBlk]}>
                    Doc {item.id}
                  </CText>
                  <CText
                    cStyle={[{fontSize: 10, fontWeight: '500'}, Styles.cBlk]}>
                    {item.scheduledDateTime}
                  </CText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  NCReportData(item, index) {
    // console.log('item', item);
    return (
      <View style={{display: this.state.ncrModal === true ? 'flex' : 'none'}}>
        {item === null ? (
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
              No Site Observation data
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.selectionOfNCReport(item);
            }}
            style={[
              {
                paddingVertical: 12,
                backgroundColor: '#fff',
                flexDirection: 'row',
                borderColor: '#ddd',
                borderWidth: 1,
                marginHorizontal: 20,
              },
              Styles.aitCenter,
            ]}
            key={index}>
            <View style={[Styles.marH15, Styles.row, Styles.aitCenter]}>
              <View
                style={[
                  Styles.aitCenter,
                  {
                    padding: 3,
                    backgroundColor: 'blue',
                    paddingHorizontal: 12,
                    borderRadius: 5,
                  },
                ]}>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {/* {item.scheduledDateTime.slice(0, 3)} */}
                </CText>
                <CText
                  cStyle={[{fontSize: 12, fontWeight: 'bold'}, Styles.cFFF]}>
                  {/* {item.scheduledDateTime.slice(3, 6)} */}
                </CText>
              </View>
              <View style={[Styles.mLt10, Styles.flex1]}>
                <CText
                  cStyle={[
                    {marginLeft: 5, fontSize: 13, fontWeight: 'bold'},
                    Styles.cBlk,
                  ]}>
                  {/* Reinforcement Inspection, CIV-PR-002 */}
                  Non Compliance Report
                </CText>
                <View
                  style={[
                    Styles.row,
                    Styles.flex1,
                    Styles.jSpaceBet,
                    Styles.mTop3,
                  ]}>
                  <CText cStyle={[{marginLeft: 5, fontSize: 10}, Styles.cBlk]}>
                    Doc {item.id}
                  </CText>
                  <CText
                    cStyle={[{fontSize: 10, fontWeight: '500'}, Styles.cBlk]}>
                    {/* {item.scheduledDateTime} */}
                  </CText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  selectionOfQualityReport(item) {
    console.log('selected inspection data -->', item);

    this.props.getActionSignUp({
      checklistAddress: item.siteDetails.areaInspected,
      contractor: item.siteDetails.contractorResponsible,
      inspectionQuantity: item.siteDetails.inspQuantity,
      UOM: item.siteDetails.uom,
      materialname: item.siteDetails.inspectionMaterialQuantity,
      selectedProject: item.project,
      checklistName: item.name,
      successModal: false,
      InspectionIncompleteModal: false,
      ScheduleInspectionModal: false,
    });

    //* questions data
    this.props.getReinforcementData(item.inspectionQuestions);

    this.props.navigation.navigate('InspectionSchedule');
  }

  selectionOfSiteReport(item) {
    console.log('selected site data -->', item);

    let category = '';

    if (
      item.category !== 'Quality' &&
      item.category !== 'Safety' &&
      item.category !== 'House Keeping'
    ) {
      category = 'Other';
    }

    var selectedProject = {};

    this.props.SignupState.projects.map((proj, index) => {
      if (proj.id == item.project.id) {
        selectedProject = proj;
      }
    });

    siteObservationData = {
      areaInspected: item.area,
      contractorResponsible: item.contractor.name,
      category: category == 'Other' ? 'Other' : item.category,
      severityLevel: item.severity,
      addObservations: item.statement,
    };

    this.props.getActionSignUp({
      siteObservationData: siteObservationData,
      otherCategory: category == 'Other' ? item.category : '',
      siteObservationChecklist: item.siteObservationChecklist
        ? item.siteObservationChecklist
        : null,
      siteObservationNote: item.siteObservationNote
        ? item.siteObservationNote
        : null,
      selectedProject: selectedProject,
    });

    this.props.navigation.navigate('SiteObservationChecklist');
  }

  selectionOfNCReport(item) {
    console.log('selected ncr data -->', item);

    let category = '';

    if (
      item.category !== 'Quality' &&
      item.category !== 'Safety' &&
      item.category !== 'House Keeping'
    ) {
      category = 'Other';
    }

    var selectedProject = [];

    this.props.SignupState.projects.map((proj, index) => {
      if (proj.id == item.project.id) {
        selectedProject = proj;
      }
    });

    var NCReportData = {
      areaInspected: item.area,
      contractorResponsible: item.contractor.name,
      category: category == 'Other' ? 'Other' : item.category,
      severityLevel: item.severity,
      rootCause: item.root_cause,
      contractorClauseNo: item.root_cause_number,
      recommendedCorrectiveAction: item.recomended_action,
    };

    // TODO: Add selected project data

    this.props.getActionSignUp({
      NCReportData: NCReportData,
      siteNCRChecklist: item.status,
      siteNCRChecklistNote: item.reason_to_uncomplied,
      siteNCRChecklistStage2: item.siteNCRChecklistStage2
        ? item.siteNCRChecklistStage2
        : null,
      siteNCRChecklistNoteStage2: item.siteNCRChecklistNoteStage2
        ? item.siteNCRChecklistNoteStage2
        : null,
      selectedProject: selectedProject,
      contractorData: item.contractor,
    });

    this.props.navigation.navigate('NCReportChecklist');
  }

  // selectionOfReport(item) {
  //   // console.log('selected item from todo -->', item);

  //   if (item.name === 'Site Observation') {
  //     //
  //   } else if (item.name === 'Non Compliance Report (NCR)') {
  //   } else {
  //     //
  //   }

  //   // this.props.getActionSignUp({
  //   //   areaInspected: item.siteObservationData.areaInspected,
  //   //   contractorResponsible: item.siteObservationData.contractorResponsible,
  //   //   category: item.siteObservationData.category,
  //   //   severityLevel: item.siteObservationData.severityLevel,
  //   //   addObservation: item.siteObservationData.addObservation,
  //   //   siteObservationChecklist: item.siteObservationChecklist,
  //   //   siteObservationNote: item.siteObservationNote,
  //   // });

  //   // this.props.navigation.navigate('SiteInstructorScreen');
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
            {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
            Styles.marV10,
            Styles.cblue,
          ]}>
          To Do List
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
            placeholder={'Search Docs here'}
            cStyle={[{marginLeft: 15, fontSize: 14, flex: 0.95}]}></CInput>
          <CImage
            cStyle={[{height: 25, width: 25}]}
            src={require('../images/search.png')}
          />
        </View>
        <ScrollView style={[{marginBottom: 20}]}>
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.setState({
                  inspectionModal: !this.state.inspectionModal,
                });
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
                cStyle={[
                  {marginLeft: 10, fontSize: 13, flex: 0.95},
                  Styles.cblue,
                ]}>
                Quality/Safety Inspection Data
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}]}
                src={require('../images/right.png')}
              />
            </TouchableOpacity>
            {/* <FlatList
              data={this.state.inspectionData}
              // keyExtractor={(item, index) => item.id + index}
              renderItem={({item, index}) =>
                this.qualityInspectionData(item, index)
              }
              // extraData={this.props}
              style={[Styles.mBtm15, Styles.mTop15]}
            /> */}
            {this.state.inspectionData === null
              ? this.qualityInspectionData(null, null)
              : this.state.inspectionData.map((item, index) =>
                  this.qualityInspectionData(item, index),
                )}
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.setState({
                  siteModal: !this.state.siteModal,
                });
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
                cStyle={[
                  {marginLeft: 10, fontSize: 13, flex: 0.95},
                  Styles.cblue,
                ]}>
                Site Observation Data
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}]}
                src={require('../images/right.png')}
              />
            </TouchableOpacity>
            {/* <FlatList
              data={this.state.siteData}
              // keyExtractor={(item, index) => item.id + index}
              renderItem={({item, index}) =>
                this.siteObservationData(item, index)
              }
              // extraData={this.props}
              style={[Styles.mBtm15, Styles.mTop15]}
            /> */}
            {this.state.siteData == null
              ? this.siteObservationData(null, null)
              : this.state.siteData.map((item, index) =>
                  this.siteObservationData(item, index),
                )}
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.setState({
                  ncrModal: !this.state.ncrModal,
                });
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
                cStyle={[
                  {marginLeft: 10, fontSize: 13, flex: 0.95},
                  Styles.cblue,
                ]}>
                NCReport Data
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}]}
                src={require('../images/right.png')}
              />
            </TouchableOpacity>
            {this.state.ncrData == null
              ? this.NCReportData(null, null)
              : this.state.ncrData.map((item, index) =>
                  this.NCReportData(item, index),
                )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    SignupState: state.SignUp,
    ScheduleInspectionState: state.ScheduleInspection,
    ReportInspectionState: state.ReportInspection,
    ReinforcementState: state.ReinforcementData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
    getScheduleInspection: bindActionCreators(ScheduleInspection, dispatch),
    getReportData: bindActionCreators(ReportData, dispatch),
    getReinforcementData: bindActionCreators(ReinforcementData, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
