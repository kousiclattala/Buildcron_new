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
  Modal,
  Alert,
  BackHandler,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp, ScheduleInspection} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme, Portal, Dailog} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import Snackbar from 'react-native-snackbar';
import DropDownMenu from '../common/DropDownMenu';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {generateSlug} from 'random-word-slugs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import {NCReportCheckPDF} from '../common/NCrCheckPDF';

import {launchCamera} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class NCReportChecklist extends React.Component {
  constructor() {
    super();
    this.state = {
      item: {},
      mode: '',
      datetime: '',
      show: false,
      count: 0,
    };
  }

  componentDidMount() {
    // console.log(
    //   'selected checklist from state -->',
    //   this.props.SignupState.selectedChecklist,
    // );

    this.props.getActionSignUp({
      ReinforcementData: this.props.SignupState.selectedChecklist.question,
    });

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

  openImagePicker() {
    let images = this.props.SignupState.images;
    let base64Images = this.props.SignupState.base64Images;

    // TODO: pictures should reflect automatically

    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 400,
        maxWidth: 300,
        quality: 1,
        cameraType: 'front',
        includeBase64: true,
        saveToPhotos: false,
      },
      (res) => {
        // console.log('res from image picker -->', res.assets);

        if (res.didCancel) {
          alert('User canceled the camera');
        } else if (res.errorCode === 'camera_unavailable') {
          alert('camera is not unavailable');
        } else if (res.errorCode === 'permission') {
          alert('permission is denied');
        } else if (res.errorCode === 'others') {
          alert(res.errorMessage);
        } else if (res.assets.length == 0) {
          alert('please select images');
        } else {
          res.assets.map((img) => {
            // console.log('img ---->', img.uri);
            // console.log('img name --->', img.fileName);

            // console.log('sliced uri -->', img.uri.slice(7));

            var slicedUri = img.uri.slice(7);

            // console.log('path from state', this.state.picturesPath);

            PhotoEditor.Edit({
              path: slicedUri,
              onDone: (imgPath) => {
                // console.log('path editing -->', imgPath);
                images.push({
                  name: img.fileName,
                  path: img.uri,
                  type: img.type,
                  height: img.height,
                  width: img.width,
                  fileSize: img.fileSize,
                });
                base64Images.push(img.base64);
              },
              onCancel: (res) => {
                console.log(res);
              },
            });
            this.props.getActionSignUp({
              base64Images: base64Images,
              images: images,
            });
            this.addPhotos(img);
          });
        }

        // console.log('path from state -->', this.state.picturesPath);
      },
    );

    //console.log("    data - - ", this.props.SignupState.base64Images)
  }

  addPhotos(img) {
    RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
      .then((result) => {
        result.map((res) => {
          if (res.name === 'Pictures') {
            this.setState({
              picturesPath: res.path,
            });
          }
        });
      })
      .then((path) => {
        console.log('path from -->', this.state.picturesPath);
        RNFS.mkdir(`${this.state.picturesPath}/buildcron`);

        const imgPath = `${
          this.state.picturesPath
        }/buildcron/${generateSlug()}.jpg`;

        RNFS.copyFile(img.uri, imgPath)
          .then((res) => {
            console.log('res from rnfs', res);
          })
          .catch((err) => {
            console.log('ERROR: image file copy failed!!!');
            console.log(err.message, err.code);
          });
      })
      .catch((err) => console.log(err));
  }

  displayPics(item, index) {
    // console.log(' display pivs    ', `data:image/jpeg;base64,${item.path}`);
    return (
      <View style={[Styles.marH5, Styles.marV10]}>
        <View style={{width: 100}}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.deleteImages(item, index);
            }}
            style={[
              Styles.aslEnd,
              {left: 5, padding: 3, borderRadius: 50, backgroundColor: '#ddd'},
            ]}>
            <CImage
              cStyle={{height: 25, width: 25}}
              src={require('../images/close.png')}
              resizeMode={'contain'}
            />
            {/* <CText cStyle={[Styles.cFFF,Styles.f15,Styles.fWbold]}>Close</CText> */}
          </TouchableOpacity>
        </View>
        <Image style={[{height: 90, width: 100}]} source={{uri: item.path}} />
      </View>
    );
  }

  deleteImages(item, index) {
    // console.warn(item,index)
    let tempArray = this.props.SignupState.images;
    let Base64Array = this.props.SignupState.base64Images;
    for (let i = 0; i < tempArray.length; i++) {
      if (i === index) {
        tempArray.splice(index, 1);
        Base64Array.splice(index, 1);
        // item.questionImages.splice(index, 1)
      }
    }
    this.props.getActionSignUp({images: tempArray, base64Images: Base64Array});
    // console.log(
    //   ' images',
    //   this.props.SignupState.images,
    //   this.props.SignupState.base64Images,
    // );
  }

  validationQuestions() {
    if (!this.props.SignupState.siteNCRChecklistStage2) {
      Snackbar.show({
        text: 'Please Answer Checklist Question',
        textColor: '#FFF',
        backgroundColor: '#FF6600',
      });
    } else if (
      this.props.SignupState.siteNCRChecklistStage2 == 'Not Complied'
    ) {
      if (!this.props.SignupState.siteNCRChecklistNoteStage2) {
        return Snackbar.show({
          text: 'Please Answer Checklist Note',
          textColor: '#FFF',
          backgroundColor: '#FF6600',
        });
      } else {
        return this.props.getActionSignUp({InspectionIncompleteModal: true});
      }
    } else {
      return this.props.getActionSignUp({successModal: true});
    }

    // console.log('date', this.state.date);
    // console.log('time', this.state.time);

    // this.props.getActionSignUp({InspectionIncompleteModal: true});
  }

  handleSuccessInspectionModal() {
    // TODO: should store success inspection data into redux store

    var siteDetails = [];

    const successData = {
      id: generateSlug(),
      name: 'Non Compliance Report (NCR)',
      NCReportData: this.props.SignupState.NCReportData,
      siteNCRChecklist: this.props.SignupState.siteNCRChecklist,
      siteNCRChecklistNote: this.props.SignupState.siteNCRChecklistNote,
      siteNCRChecklistStage2: this.props.SignupState.siteNCRChecklistStage2,
      siteNCRChecklistNoteStage2: this.props.SignupState
        .siteNCRChecklistNoteStage2,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
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
      siteNCRChecklistStage2: this.props.SignupState.siteNCRChecklistStage2,
      siteNCRChecklistNoteStage2: this.props.SignupState
        .siteNCRChecklistNoteStage2,
      scheduledDateTime: this.state.datetime,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
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
      html: NCReportCheckPDF(data),
      fileName: `NCReport-${moment(Date.now()).format('MMM D YYYY')}`,
      directory: 'Documents/buildcron',
    };

    let file = await RNHTMLtoPDF.convert(options);

    // alert('Report Generated');

    this.sendNCReportDataToBack(data);

    // console.log('File data from NCReport', file);

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

  // TODO: add stage 2 checklist status and note and also project data to data
  sendNCReportDataToBack = async (data) => {
    var token = await AsyncStorage.getItem('access_token');

    var data = {
      area: data.NCReportData.areaInspected,
      contractor: {
        id: data.contractorData.id,
      },
      project: {
        id: 5,
      },
      category: data.NCReportData.category,
      severity: data.NCReportData.severityLevel,
      root_cause: data.NCReportData.rootCause,
      root_cause_number: data.NCReportData.contractorClauseNo,
      recomended_action: data.NCReportData.recommendedCorrectiveAction,
      status: data.siteNCRChecklist,
      reason_to_uncomplied: data.siteNCRChecklistNote,
    };

    await axios({
      method: 'POST',
      url: Config.routes.NCReportAPI,
      headers: {
        Authorization: 'JWT ' + token,
      },
      data: data,
    })
      .then((res) => {
        console.log('res from POST request -->', res);
        console.log('POST request success');
      })
      .catch((err) => console.log(err));
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
              cStyle={[{height: 25, width: 25}]}
              src={require('../images/bell.png')}
            />
          </View>
        </View>
        <DropDownMenu />
        <CText
          cStyle={[
            {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
            Styles.cblue,
            Styles.padV15,
          ]}>
          Non Compliance Report (NCR)
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.NCReportData.areaInspected}
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
              Contractor Responsible
            </CText>
            <CText
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              cStyle={[Styles.f14, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
                  <CText cStyle={[Styles.f14, Styles.mTop5, Styles.marH15]}>
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
                    <CText cStyle={[Styles.f14, Styles.cFFF]}>
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

          <View
            style={[
              Styles.marH15,
              Styles.mTop20,
              Styles.padV10,
              {backgroundColor: '#f7edeb'},
            ]}>
            <View style={[Styles.row, Styles.marH10, Styles.mTop5]}>
              <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f15]}>
                Is the Corrective Action completed as specified and to
                satisfaction ?
              </CText>
            </View>
            <View style={[Styles.row, Styles.jSpaceArd, Styles.mTop15]}>
              <TouchableOpacity
                onPress={() => {
                  this.props.getActionSignUp({
                    siteNCRChecklistStage2: 'Complied',
                  });
                }}
                style={[
                  {
                    backgroundColor:
                      this.props.SignupState.siteNCRChecklistStage2 ===
                      'Complied'
                        ? '#10C000'
                        : '#DADADA',
                  },
                  Styles.brdRad5,
                  Styles.padH10,
                ]}
                activeOpacity={0.6}>
                <Text
                  style={[
                    Styles.f13,
                    Styles.padH10,
                    Styles.padV10,
                    Styles.aslCenter,
                    {
                      color:
                        this.props.SignupState.siteNCRChecklistStage2 ===
                        'Complied'
                          ? '#FFF'
                          : '#000',
                    },
                  ]}>
                  Complied
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.getActionSignUp({
                    siteNCRChecklistStage2: 'Not Complied',
                  });
                }}
                style={[
                  {
                    backgroundColor:
                      this.props.SignupState.siteNCRChecklistStage2 ===
                      'Not Complied'
                        ? '#E14B2B'
                        : '#DADADA',
                  },
                  Styles.brdRad5,
                ]}
                activeOpacity={0.6}>
                <Text
                  style={[
                    Styles.f13,
                    Styles.padH10,
                    Styles.padV10,
                    Styles.aslCenter,
                    {
                      color:
                        this.props.SignupState.siteNCRChecklistStage2 ===
                        'Not Complied'
                          ? '#FFF'
                          : '#000',
                    },
                  ]}>
                  Not Complied
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                {
                  display:
                    this.props.SignupState.siteNCRChecklistStage2 ===
                    'Not Complied'
                      ? 'flex'
                      : 'none',
                },
                Styles.mTop5,
              ]}>
              <TextInput
                mode="outlined"
                theme=""
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Add Note.."
                placeholderTextColor="#666"
                keyboardType="default"
                multiline={true}
                // ref={(input) => {
                //   this.props.SignupState.siteNCRChecklistNoteStage2 = input;
                // }}
                onChangeText={(value) =>
                  this.props.getActionSignUp({
                    siteNCRChecklistNoteStage2: value,
                  })
                }
                value={this.props.SignupState.siteNCRChecklistNoteStage2}
                style={[Styles.padV5, Styles.marH15, Styles.bgFFF, Styles.f12]}
              />
            </View>
          </View>

          <View
            style={[
              Styles.marV10,
              Styles.marH15,
              Styles.mTop20,
              Styles.bgEEE,
              {backgroundColor: '#f7edeb'},
            ]}>
            <View style={[Styles.p15]}>
              <CText cStyle={[Styles.f15, Styles.cBlk]}>GENERAL NOTES :</CText>
              <CText cStyle={[Styles.f13, Styles.mTop15]}>
                Take minimum 6 Pictures(including close-ups) to show overall
                general arrangement
              </CText>
              <CText cStyle={[Styles.f13, Styles.mTop10]}>
                Take picture of work supervisor to confirm that the inspection
                was held in his presence
              </CText>
            </View>
          </View>

          <View style={[Styles.aslCenter, Styles.aitCenter, Styles.mTop15]}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.openImagePicker();
              }}>
              <CImage
                cStyle={[{height: 50, width: 50}, Styles.mRt10]}
                src={require('../images/Sitephotos.png')}
              />
            </TouchableOpacity>
            <CText cStyle={[Styles.f13]}>Add Site Instruction Pictures</CText>
          </View>
          {this.props.SignupState.images.length !== 0 ? (
            <FlatList
              data={this.props.SignupState.images}
              //keyExtractor={(item, index) => item._id + index}
              renderItem={({item, index}) => this.displayPics(item, index)}
              extraData={this.props}
              horizontal={true}
              style={[Styles.marH15, Styles.mTop10]}
            />
          ) : null}

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
              Preview Inspection
            </CText>
          </TouchableOpacity>

          {/* //* Success Modal */}

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
                  <View style={[Styles.blue]}>
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

                    <CText cStyle={[Styles.f14, Styles.marV10, Styles.cBlk]}>
                      Your Inspection has been Successfully Completed
                    </CText>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.handleSuccessInspectionModal()}
                    activeOpacity={0.6}
                    style={[
                      Styles.orange,
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5},
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

          {/* //* Schedule Inspection Modal */}

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
                  <View style={[Styles.blue]}>
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
                        {this.state.date == ''
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
                      Styles.orange,
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5},
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

          {/* //* Inspection In-complete modal */}

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
                  <View style={[Styles.blue]}>
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
                    <CText cStyle={[Styles.f14, Styles.cBlk]}>
                      It look like you have selected
                    </CText>
                    <CText cStyle={[Styles.f14, Styles.cBlk, Styles.aslCenter]}>
                      "not compiled" for questions
                    </CText>
                    <CText cStyle={[Styles.f14, Styles.cBlk, Styles.aslCenter]}>
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
                      Styles.orange,
                      Styles.marH30,
                      Styles.mBtm20,
                      {borderRadius: 5},
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
  // console.log(' state - - - ', state);
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

export default connect(mapStateToProps, mapDispatchToProps)(NCReportChecklist);
