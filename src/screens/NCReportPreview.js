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
  Alert,
  Modal,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp, ScheduleInspection} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import DropDownMenu from '../common/DropDownMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment';
import {generateSlug} from 'random-word-slugs';
// import {htmlToPdf} from '../common/Report';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {SiteObservationPDF} from '../common/SiteObservationPDF';
import FileViewer from 'react-native-file-viewer';
import {NCReportPDF} from '../common/NcrPDF';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class NCReportPreview extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: '',
      datetime: '',
      show: false,
      count: 0,
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

  reinforcementData(item, index) {
    // console.log('status', item);
    return (
      <View
        style={[
          Styles.marH15,
          {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
          Styles.mTop15,
          Styles.padV10,
        ]}>
        <View style={[Styles.row]}>
          <CText
            cStyle={[
              Styles.f16,
              Styles.cBlk,
              Styles.mLt15,
              {fontWeight: '600'},
            ]}>
            {index + 1}.
          </CText>
          <View style={[Styles.flex1]}>
            <CText cStyle={[Styles.f16, Styles.cBlk, {fontWeight: '600'}]}>
              {' '}
              {item.question}
            </CText>
            <View style={[Styles.row, Styles.aitCenter, Styles.mTop15]}>
              <CText cStyle={[Styles.f13, Styles.mTop5]}>ANS :</CText>
              <View
                style={[
                  Styles.padV5,
                  Styles.padH10,
                  {
                    backgroundColor:
                      item.status === 'Complied' ? 'green' : 'red',
                    borderRadius: 5,
                  },
                  Styles.mLt10,
                ]}>
                <CText cStyle={[Styles.f13, Styles.cFFF]}>{item.status}</CText>
              </View>
            </View>
            <View
              style={[
                {display: item.status == 'Not Complied' ? 'flex' : 'none'},
              ]}>
              <CText
                cStyle={[
                  Styles.f16,
                  Styles.cBlk,
                  Styles.mTop5,
                  {fontWeight: '600'},
                ]}>
                Notes :
              </CText>
              <CText cStyle={[Styles.f16, Styles.mTop5]}>
                {/* Lorem ipsum is simply dummy text of the printing and typesetting
                industry */}
                {item.reason}
              </CText>
            </View>
          </View>
        </View>
      </View>
    );
  }

  validationQuestions() {
    // if (this.props.SignupState.siteNCRChecklist == 'Not Complied') {
    //   return this.props.getActionSignUp({InspectionIncompleteModal: true});
    // } else {
    //   return this.props.getActionSignUp({successModal: true});
    // }

    // console.log('date', this.state.date);
    // console.log('time', this.state.time);

    this.props.getActionSignUp({InspectionIncompleteModal: true});
  }

  handleSuccessInspectionModal() {
    var siteDetails = [];

    const successData = {
      id: generateSlug(),
      name: 'Non Compliance Report (NCR)',
      NCReportData: this.props.SignupState.NCReportData,
      siteNCRChecklist: this.props.SignupState.siteNCRChecklist,
      siteNCRChecklistNote: this.props.SignupState.siteNCRChecklistNote,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
      otherCategory: this.props.SignupState.otherCategory,
      contractorData: this.props.SignupState.contractorData,
    };

    this.props.getActionSignUp({
      NCReportSuccessData: successData,
      successModal: false,
      areaInspected: '',
      contractorResponsible: '',
      category: '',
      severityLevel: '',
      rootCause: '',
      contractorClauseNo: '',
      recommendedCorrectiveAction: '',
      siteNCRChecklist: '',
      siteNCRChecklistNote: '',
      images: [],
    });

    // htmlToPdf(successData);

    this.htmlToPdf(successData);

    this.props.navigation.navigate('footer');
  }

  showModal() {}

  submit() {}

  setMode() {
    // console.log('befor state up', this.state.show);

    this.setState({
      show: true,
    });

    // console.log('after state up', this.state.show);
  }

  onChangeDateTime(date) {
    // console.log('date type', typeof date);
    // console.log('date', date);

    this.setState({
      datetime: moment(date).format('MMM D YYYY hh:mm A'),
      show: false,
    });
  }

  handleCancel() {
    this.setState({
      show: false,
    });
  }

  handleScheduledInspectionData = () => {
    var siteDetails = [];

    const reScheduledData = {
      id: generateSlug(),
      name: 'Non Compliance Report (NCR)',
      NCReportData: this.props.SignupState.NCReportData,
      siteNCRChecklist: this.props.SignupState.siteNCRChecklist,
      siteNCRChecklistNote: this.props.SignupState.siteNCRChecklistNote,
      scheduledDateTime: this.state.datetime,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
      otherCategory: this.props.SignupState.otherCategory,
      contractorData: this.props.SignupState.contractorData,
    };

    this.props.getActionSignUp({
      ScheduleInspectionModal: false,
      areaInspected: '',
      contractorResponsible: '',
      category: '',
      severityLevel: '',
      rootCause: '',
      contractorClauseNo: '',
      recommendedCorrectiveAction: '',
      siteNCRChecklist: '',
      siteNCRChecklistNote: '',
      images: [],
    });

    this.props.getScheduleInspection(reScheduledData);

    // this.addScheduleDataToAsyncStorage(reScheduledData);

    this.htmlToPdf(reScheduledData);

    this.props.navigation.navigate('footer');
  };

  htmlToPdf = async (data) => {
    let options = {
      html: NCReportPDF(data),
      fileName: `NCReport-${moment(Date.now()).format('MMM D YYYY')}`,
      directory: 'Documents/buildcron',
    };

    let file = await RNHTMLtoPDF.convert(options);

    // alert('Report Generated');

    // console.log('File data from NCReport', file);

    this.sendNCReportDatatoBack(data, file);

    Alert.alert('Report Generated', 'Do you want to see Report ?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Open',
        onPress: () => this.openFile(file.filePath),
      },
    ]);
  };

  openFile = (path) => {
    FileViewer.open(path);
    // .then(
    //   () => (
    //     console.log('File opened successfully'),
    //     console.log('file data after opened -->', file)
    //   ),
    // )
    // .catch((err) => {
    //   console.log('Error in opening file');
    //   alert('Error in opening file');
    // });
  };

  // TODO: Add report data
  sendNCReportDatatoBack = async (data, file) => {
    try {
      const category =
        data.NCReportData.category === 'Other'
          ? data.otherCategory
          : data.NCReportData.category;

      const token = await AsyncStorage.getItem('access_token');

      var data = {
        area: data.NCReportData.areaInspected,
        category: category,
        severity: data.NCReportData.severityLevel,
        root_cause: data.NCReportData.rootCause,
        root_cause_number: data.NCReportData.contractorClauseNo,
        project: {
          id: data.project.id,
        },
        contractor: {
          id: this.props.SignupState.contractorData.id,
        },
        status: data.siteNCRChecklist,
        reason_to_uncomplied: data.siteNCRChecklistNote,
        recomended_action: data.NCReportData.recommendedCorrectiveAction,
      };

      console.log('data', data);

      await axios({
        method: 'POST',
        url: Config.routes.NCReportAPI,
        headers: {
          Authorization: 'JWT ' + token,
        },
        data: data,
      })
        .then((res) => (console.log(res), console.log('Success from NCR post')))
        .catch((err) => (console.log(err), console.log('Error from NCR post')));
    } catch (error) {
      console.log(error);
    }
  };

  addScheduleDataToAsyncStorage = async (data) => {
    try {
      let dataArray = [];
      dataArray.push(data);
      let asyncData = await AsyncStorage.getItem('@ScheduledData');

      if (asyncData === null) {
        await AsyncStorage.setItem('@ScheduledData', JSON.stringify(dataArray));
      } else {
        let parsedData = JSON.parse(asyncData);
        parsedData.push(data);

        await AsyncStorage.setItem(
          '@ScheduledData',
          JSON.stringify(parsedData),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                this.props.navigation.goBack();
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
            Styles.marV10,
            Styles.cBlue,
          ]}>
          Non Compliance Report (NCR) Preview
        </CText>
        <ScrollView style={[{marginBottom: 20}]}>
          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Area Being Inspected
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.areaInspected}
            </CText>
          </View>

          {/* <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Inspection Material Quantity
            </CText>
            <CText
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.materialname}
            </CText>
          </View>
          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
              Styles.row,
              Styles.jSpaceBet,
            ]}>
            <View>
              <CText
                cStyle={[
                  Styles.f16,
                  Styles.cBlk,
                  Styles.marH15,
                  {fontWeight: '600'},
                ]}>
                Inspection Material Quantity
              </CText>
              <CText cStyle={[Styles.f14, Styles.marH15, Styles.mTop5]}>
                {this.props.SignupState.inspectionQuantity}
              </CText>
            </View>
            <View style={[Styles.aitCenter]}>
              <CText
                cStyle={[
                  Styles.f16,
                  Styles.cBlk,
                  Styles.marH15,
                  {fontWeight: '600'},
                ]}>
                UOM
              </CText>
              <CText cStyle={[Styles.f14, Styles.marH15, Styles.mTop5]}>
                {this.props.SignupState.UOM}
              </CText>
            </View>
          </View> */}

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Contractor Responsible
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.contractorResponsible}
            </CText>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Category
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.category}
            </CText>
            <View
              style={[
                {
                  display:
                    this.props.SignupState.NCReportData.category == 'Other'
                      ? 'flex'
                      : 'none',
                },
              ]}>
              <CText
                cStyle={[
                  Styles.f16,
                  Styles.cBlk,
                  Styles.mTop5,
                  {fontWeight: '600', paddingLeft: 15},
                ]}>
                Notes :
              </CText>
              <CText cStyle={[Styles.f16, Styles.mTop5, {paddingLeft: 15}]}>
                {/* Lorem ipsum is simply dummy text of the printing and typesetting
                      industry */}
                {this.props.SignupState.otherCategory}
              </CText>
            </View>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <View style={[Styles.row]}>
              <View style={[Styles.flex1]}>
                <CText
                  cStyle={[
                    Styles.f16,
                    Styles.cBlk,
                    Styles.marH15,
                    {fontWeight: '600'},
                  ]}>
                  Severity Level
                </CText>
                <View style={[Styles.row, Styles.aitCenter, Styles.mTop15]}>
                  <View
                    style={[
                      Styles.padV5,
                      Styles.padH15,
                      {
                        backgroundColor:
                          this.props.SignupState.NCReportData.severityLevel ===
                          'High'
                            ? 'red'
                            : this.props.SignupState.NCReportData
                                .severityLevel === 'Medium'
                            ? 'orange'
                            : 'green',
                        borderRadius: 5,
                      },
                      Styles.mLt30,
                    ]}>
                    <CText
                      cStyle={[Styles.f16, Styles.cFFF, {fontWeight: 'bold'}]}>
                      {this.props.SignupState.NCReportData.severityLevel}
                    </CText>
                  </View>
                </View>
              </View>
            </View>

            {/* <CText
              cStyle={[
                Styles.f14,
                Styles.marH15,
                Styles.mTop5,
                Styles.mLt30,
                
              ]}>
              {this.props.SignupState.NCReportData.severityLevel}
            </CText> */}
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Root Cause
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.rootCause}
            </CText>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Contractor Clause No.
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.contractorClauseNo}
            </CText>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Recommended Corrective Action
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.recommendedCorrectiveAction}
            </CText>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Project Name
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.selectedProject.name}
            </CText>
          </View>
          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Project Location
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.selectedProject.location}
            </CText>
            {/* <CText
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              28.45876 N, 77,023423 E
            </CText> */}
          </View>
          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Date of Inspection
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {moment(Date.now()).format('MMM D YYYY hh:mm A')}
            </CText>
          </View>
          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Document Number
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              Doc xxx xxx xxx
            </CText>
          </View>

          <View
            style={[
              Styles.marH15,
              {borderColor: '#EEE', borderWidth: 4, borderRadius: 10},
              Styles.mTop15,
              Styles.padV10,
            ]}>
            <View style={[Styles.row]}>
              <View style={[Styles.flex1]}>
                <CText
                  cStyle={[
                    Styles.f16,
                    Styles.cBlk,
                    Styles.marH15,
                    {fontWeight: '600'},
                  ]}>
                  Is the Recommended Corrective Action as per Industry Standard
                  ?
                </CText>
                <View style={[Styles.row, Styles.aitCenter, Styles.mTop15]}>
                  <CText cStyle={[Styles.f13, Styles.mTop5, Styles.marH15]}>
                    ANS :
                  </CText>
                  <View
                    style={[
                      Styles.padV5,
                      Styles.padH10,
                      {
                        backgroundColor:
                          this.props.SignupState.siteNCRChecklist === 'Complied'
                            ? 'green'
                            : 'red',
                        borderRadius: 5,
                      },
                      Styles.mLt10,
                    ]}>
                    <CText cStyle={[Styles.f13, Styles.cFFF]}>
                      {this.props.SignupState.siteNCRChecklist}
                    </CText>
                  </View>
                </View>
                <View
                  style={[
                    {
                      display:
                        this.props.SignupState.siteNCRChecklist ==
                        'Not Complied'
                          ? 'flex'
                          : 'none',
                    },
                  ]}>
                  <CText
                    cStyle={[
                      Styles.f16,
                      Styles.cBlk,
                      Styles.mTop5,
                      {fontWeight: '600', paddingLeft: 15},
                    ]}>
                    Notes :
                  </CText>
                  <CText cStyle={[Styles.f16, Styles.mTop5, {paddingLeft: 15}]}>
                    {/* Lorem ipsum is simply dummy text of the printing and typesetting
                industry */}
                    {this.props.SignupState.siteNCRChecklistNote}
                  </CText>
                </View>
              </View>
            </View>
          </View>

          {/* <FlatList
            data={this.props.SignupState.ReinforcementData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item, index}) => this.reinforcementData(item, index)}
            extraData={this.props}
            style={[Styles.mBtm20]}
          /> */}

          {/* <View style={[Styles.marH15, { borderColor: '#EEE', borderWidth: 1, borderRadius: 10 }, Styles.mTop15, Styles.padV10]}>
                        <View style={[Styles.row]}>
                            <CText cStyle={[Styles.f16, Styles.cBlk, Styles.mLt15, { fontWeight: '600' }]}>1.</CText>
                            <View>
                                <CText cStyle={[Styles.f16, Styles.cBlk, { fontWeight: '600' }]}> Are the latest "Good for Construction" drawings available?</CText>
                                <View style={[Styles.row, Styles.aitCenter, Styles.mTop15]}>
                                    <CText cStyle={[Styles.f14, Styles.mTop5]}>ANS :</CText>
                                    <View style={[Styles.padV5, Styles.padH10, { backgroundColor: 'green', borderRadius: 5 }, Styles.mLt10]}>
                                        <CText cStyle={[Styles.f14, Styles.cFFF]}>Compiled</CText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[Styles.marH15, { borderColor: '#EEE', borderWidth: 1, borderRadius: 10 }, Styles.mTop15, Styles.padV10]}>
                        <View style={[Styles.row]}>
                            <CText cStyle={[Styles.f16, Styles.cBlk, Styles.mLt15, { fontWeight: '600' }]}>2.</CText>
                            <View style={[Styles.flex1]}>
                                <CText cStyle={[Styles.f16, Styles.cBlk, { fontWeight: '600' }]}> Is the method statement submitted and approved from client representative?</CText>
                                <View style={[Styles.row, Styles.aitCenter, Styles.mTop15]}>
                                    <CText cStyle={[Styles.f14, Styles.mTop5]}>ANS :</CText>
                                    <View style={[Styles.padV5, Styles.padH10, { backgroundColor: 'red', borderRadius: 5 }, Styles.mLt10]}>
                                        <CText cStyle={[Styles.f14, Styles.cFFF]}>Not Compiled</CText>
                                    </View>
                                </View>
                                <CText cStyle={[Styles.f16, Styles.cBlk,Styles.mTop5, { fontWeight: '600' }]}>Notes :</CText>
                                <CText cStyle={[Styles.f16,Styles.mTop5]}>Lorem ipsum is simply dummy text of the printing and typesetting industry</CText>


                            </View>
                        </View>
                    </View> */}

          <TouchableOpacity
            onPress={() => {
              this.validationQuestions();
            }}
            style={[
              {backgroundColor: '#010066'},
              Styles.brdRad5,
              Styles.marH20,
              Styles.mTop15,
            ]}
            activeOpacity={0.6}>
            <CText
              cStyle={[
                Styles.f16,
                Styles.padH10,
                Styles.padV10,
                Styles.aslCenter,
                Styles.cFFF,
                {fontWeight: '500'},
              ]}>
              Submit Inspection
            </CText>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.SignupState.successModal}
            onRequestClose={() => {}}
            style={[Styles.flex1]}
            propagateSwipe={true}>
            <TouchableOpacity
              onPress={() => {
                this.props.getActionSignUp({successModal: false});
              }}
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
                    display: this.props.SignupState.successModal
                      ? 'flex'
                      : 'none',
                  },
                ]}>
                <View style={[{width: 350}, Styles.bgFFF]}>
                  <View style={[Styles.cBlue]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV15,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      Inspection Completed
                    </CText>
                  </View>
                  <View
                    style={[Styles.aitCenter, Styles.aslCenter, Styles.padV20]}>
                    <CImage
                      cStyle={[{height: 60, width: 60}]}
                      src={require('../images/done.png')}
                    />

                    <CText cStyle={[Styles.f13, Styles.marV10, Styles.cBlk]}>
                      Your Inspection has been Successfully Completed
                    </CText>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.handleSuccessInspectionModal()}
                    activeOpacity={0.6}
                    style={[
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5, color: 'orange'},
                    ]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV10,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      OK
                    </CText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.SignupState.ScheduleInspectionModal}
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
                    display: this.props.SignupState.ScheduleInspectionModal
                      ? 'flex'
                      : 'none',
                  },
                ]}>
                <View
                  style={[
                    {width: Dimensions.get('window').width - 40},
                    Styles.bgFFF,
                  ]}>
                  <View style={[Styles.cBlue]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV15,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      Schedule Inspection
                    </CText>
                  </View>
                  <CText
                    cStyle={[
                      Styles.f16,
                      Styles.mTop15,
                      Styles.mLt15,
                      Styles.cBlk,
                    ]}>
                    Select Schedule Date & Time
                  </CText>

                  <View
                    style={[
                      Styles.row,
                      Styles.marV30,
                      Styles.marH20,
                      Styles.jSpaceBet,
                    ]}>
                    <TouchableOpacity
                      style={[
                        {
                          flex: 1,
                          borderRadius: 5,
                          borderColor: '#bbb',
                          borderWidth: 1,
                        },
                        Styles.jSpaceBet,
                        Styles.row,
                        Styles.aitCenter,
                        Styles.padV10,
                      ]}
                      onPress={() => this.setMode()}>
                      <CText cStyle={[Styles.mLt10, {fontWeight: '600'}]}>
                        {this.state.datetime == ''
                          ? `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
                          : this.state.datetime}
                      </CText>
                      <CImage
                        cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                        src={require('../images/down-black.png')}
                      />
                      {this.state.show && (
                        <DateTimePickerModal
                          mode="datetime"
                          isVisible={this.state.show}
                          onConfirm={(date) => this.onChangeDateTime(date)}
                          onCancel={this.handleCancel}
                        />
                      )}
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      style={[
                        {
                          flex: 0.48,
                          borderRadius: 5,
                          borderColor: '#bbb',
                          borderWidth: 1,
                        },
                        Styles.jSpaceBet,
                        Styles.row,
                        Styles.aitCenter,
                        Styles.padV10,
                      ]}
                      onPress={() => this.showTimePicker()}>
                      <CText cStyle={[Styles.mLt10]}>
                        {this.state.time == ''
                          ? `${new Date().getHours()}:${new Date().getMinutes()}`
                          : this.state.time.format('h mm A')}
                      </CText>
                      <CImage
                        cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                        src={require('../images/down-black.png')}
                      />

                      {this.state.show && (
                        <DateTimePickerModal
                          mode={this.state.mode}
                          isVisible={this.state.show}
                          onConfirm={(date) => this.onChangeTime(date)}
                          onCancel={this.handleCancel}
                        />
                      )}
                    </TouchableOpacity> */}
                  </View>
                  <TouchableOpacity
                    onPress={() => this.handleScheduledInspectionData()}
                    activeOpacity={0.6}
                    style={[
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5, backgroundColor: 'orange'},
                    ]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV10,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      Schedule Inspection
                    </CText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.SignupState.InspectionIncompleteModal}
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
                    display: this.props.SignupState.InspectionIncompleteModal
                      ? 'flex'
                      : 'none',
                  },
                ]}>
                <View style={[{width: 350}, Styles.bgFFF]}>
                  <View style={[Styles.cBlue]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV15,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      Inspection In-complete
                    </CText>
                  </View>

                  <View
                    style={[Styles.aitCenter, Styles.aslCenter, Styles.marV30]}>
                    <CText cStyle={[Styles.f13, Styles.cBlk]}>
                      It look like you have selected
                    </CText>
                    <CText cStyle={[Styles.f13, Styles.cBlk, Styles.aslCenter]}>
                      "not compiled" for questions
                    </CText>
                    <CText cStyle={[Styles.f13, Styles.cBlk, Styles.aslCenter]}>
                      select a time for re-inspection
                    </CText>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.getActionSignUp({
                        InspectionIncompleteModal: false,
                        ScheduleInspectionModal: true,
                      });
                    }}
                    activeOpacity={0.6}
                    style={[
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5, backgroundColor: 'orange'},
                    ]}>
                    <CText
                      cStyle={[
                        Styles.f16,
                        Styles.padV10,
                        Styles.aslCenter,
                        Styles.cFFF,
                        {fontWeight: '600'},
                      ]}>
                      Schedule Inspection
                    </CText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    SignupState: state.SignUp,
    ScheduleInspectionState: state.ScheduleInspection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
    getScheduleInspection: bindActionCreators(ScheduleInspection, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NCReportPreview);
