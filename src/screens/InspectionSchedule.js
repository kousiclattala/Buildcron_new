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
  BackHandler,
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
import DropDownMenu from '../common/DropDownMenu';

// import DateTimePicker from '@react-native-community/datetimepicker';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment';
import {generateSlug} from 'random-word-slugs';
// import {htmlToPdf} from '../common/Report';
// import QualityPDF from '../common/qualityReport';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import {GenerateHtml} from '../common/generatehtml';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class InspectionSchedule extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: '',
      datetime: '',
      show: false,
      count: 0,
      token: '',
      buildcronDirPath: '',
      directoryPath: '',
      picturesPath: '',
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});
    // console.log(
    //   'ReinforcementData -->',
    //   this.props.SignupState.ReinforcementData,
    // );

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    this.getToken();
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

  getToken = async () => {
    try {
      var token = await AsyncStorage.getItem('access_token');

      this.setState({
        token: token,
      });
    } catch (error) {
      console.log(error);
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

    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 400,
        maxWidth: 300,
        quality: 1,
        cameraType: 'back',
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
                console.log('path editing -->', imgPath);
                images.push({
                  name: img.fileName,
                  path: img.uri,
                  type: img.type,
                  height: img.height,
                  width: img.width,
                  fileSize: img.fileSize,
                });
                base64Images.push(img.base64);
                this.props.getActionSignUp({
                  base64Images: base64Images,
                  images: images,
                });
                this.addPhotos(img);
              },
              onCancel: (res) => {
                console.log(res);
              },
            });
          });

          // console.log('path from state -->', this.state.picturesPath);
        }
      },
    );

    //console.log("    data - - ", this.props.SignupState.base64Images)
  }

  displayPics(item, index) {
    // console.log(' display pivs    ', `data:image/jpeg;base64,${item.path}`);
    // console.log('data from displayPics method -->', item);
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
  }

  reinforcementData(item, index) {
    // console.log(' item ', item);
    return (
      <View
        style={[
          Styles.marH15,
          Styles.marV5,
          Styles.padV15,
          {backgroundColor: '#f7edeb'},
        ]}>
        <View style={[Styles.row, Styles.marH10, Styles.mTop5]}>
          <CText>{index + 1}. </CText>
          <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f15]}>
            {item.question}
          </CText>
        </View>
        <View style={[Styles.row, Styles.jSpaceArd, Styles.mTop15]}>
          <TouchableOpacity
            onPress={() => {
              this.selectedData(item.id);
            }}
            style={[
              {
                backgroundColor:
                  item.status === 'Complied' ? '#10C000' : '#DADADA',
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
                {color: item.status === 'Complied' ? '#FFF' : '#000'},
              ]}>
              Complied
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.selectingNotCompiled(item.id);
            }}
            style={[
              {
                backgroundColor:
                  item.status === 'Not Complied' ? '#E14B2B' : '#DADADA',
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
                {color: item.status === 'Not Complied' ? '#FFF' : '#000'},
              ]}>
              Not Complied
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {display: item.status === 'Not Complied' ? 'flex' : 'none'},
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
            ref={(input) => {
              // this.phoneNumber = input;
            }}
            onChangeText={(value) => this.updateNote(item, value)}
            value={item.reason}
            style={[Styles.padV5, Styles.marH15, Styles.bgFFF, Styles.f12]}
          />
        </View>
      </View>
    );
  }

  selectedData(id) {
    // console.warn(id);
    let arr = this.props.ReinforcementState.reinforcementData;
    console.log('data from state', arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        arr[i].status = 'Complied';
      }
    }
    this.props.getReinforcementData(arr);
  }

  selectingNotCompiled(id) {
    // console.warn(id);
    let arr = this.props.ReinforcementState.reinforcementData;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        arr[i].status = 'Not Complied';
      }
    }
    this.props.getReinforcementData(arr);
  }

  updateNote(item, value) {
    let temp = this.props.ReinforcementState.reinforcementData;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id == item.id) {
        temp[i].reason = value;
      }
    }
    this.props.getReinforcementData(temp);
  }

  validationQuestions() {
    var data = this.props.ReinforcementState.reinforcementData;
    // console.log('data preview Insp', data);
    data.map((data) => {
      if (data.status == 'Not Complied') {
        return this.props.getActionSignUp({
          InspectionIncompleteModal: true,
          successModal: false,
        });
      } else {
        return this.props.getActionSignUp({successModal: true});
      }
    });

    // console.log('date', this.state.date);
    // console.log('time', this.state.time);

    // this.props.getActionSignUp({InspectionIncompleteModal: true});
  }

  handleSuccessInspectionModal = () => {
    // TODO: should store success inspection data into redux store

    // console.log('images data from store --> ', this.props.SignupState.images);

    var questions = [];

    const successData = {
      id: generateSlug(),
      name: this.props.SignupState.checklistName,
      siteDetails: this.props.SignupState.siteDetails,
      inspectionQuestions: this.props.ReinforcementState.reinforcementData,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
    };

    this.props.getActionSignUp({
      sucessInspectionData: successData,
      successModal: false,
      checklistAddress: '',
      materialname: '',
      inspectionQuantity: '',
      UOM: '',
      contractor: '',
      checklistName: '',
      images: [],
    });

    this.props.getReinforcementData([]);

    this.sendDataToBack(successData);

    this.htmltoPdf(successData);

    this.props.navigation.navigate('footer');
  };

  setMode() {
    this.setState({
      show: true,
    });
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

  // TODO: add scheduled data into asyncstorage
  handleScheduledInspectionData = () => {
    var siteDetails = [];

    const reScheduledData = {
      id: generateSlug(),
      name: this.props.SignupState.checklistName,
      siteDetails: this.props.SignupState.siteDetails,
      inspectionQuestions: this.props.ReinforcementState.reinforcementData,
      scheduledDateTime: this.state.datetime,
      project: this.props.SignupState.selectedProject,
      images: this.props.SignupState.images,
    };

    this.props.getScheduleInspection(reScheduledData);

    this.props.getActionSignUp({
      ScheduleInspectionModal: false,
      checklistAddress: '',
      materialname: '',
      inspectionQuantity: '',
      UOM: '',
      contractor: '',
      images: [],
      checklistName: '',
    });

    this.props.getReinforcementData([]);
    // this.htmltoPdf(reScheduledData);

    this.addScheduleDataToAsyncStorage(reScheduledData);

    this.props.navigation.navigate('footer');
  };

  htmltoPdf = async (data) => {
    let options = {
      html: GenerateHtml(data),
      fileName: `${data.name}`,
      directory: 'Documents/buildcron',
    };

    let file = await RNHTMLtoPDF.convert(options);

    // console.log('pdf report data from preview ', file);

    // this.props.getActionSignUp({
    //   reports: file,
    // });

    // TODO: uncomment
    // this.sendDataToBack(data, file);

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

  sendDataToBack = async (data, file) => {
    const resdata = {
      project: data.project.name,
      type: this.props.SignupState.inspectionType,
      question: data.inspectionQuestions,
      report: file,
    };

    // console.log('data ---->', resdata);

    // TODO: send raw data to backend
    await axios({
      method: 'POST',
      url: `${Config.routes.inspectionAPI}/${this.props.SignupState.checklistName}`,
      headers: {
        Authorization: 'JWT ' + this.state.token,
      },
      data: {
        project: data.project.name,
        type: this.props.SignupState.inspectionType,
        question: data.inspectionQuestions,
        report: file,
      },
    })
      .then(({data}) => {
        console.log('res from post', data);
        console.log('Put request Success');
      })
      .catch((err) => {
        console.log('err res from axios post req', err);
      });
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
              cStyle={[{height: 30, width: 30}]}
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

        <CText
          cStyle={[
            {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
            Styles.marV10,
            Styles.cBlue,
          ]}>
          Preview Inspection
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
              {this.props.SignupState.checklistAddress}
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
              Inspection Material Name
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
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
              <CText cStyle={[Styles.f13, Styles.marH15, Styles.mTop5]}>
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
              <CText cStyle={[Styles.f13, Styles.marH15, Styles.mTop5]}>
                {this.props.SignupState.UOM}
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
            <CText
              cStyle={[
                Styles.f16,
                Styles.cBlk,
                Styles.marH15,
                {fontWeight: '600'},
              ]}>
              Responsible Contractor
            </CText>
            <CText
              cStyle={[Styles.f13, Styles.marH15, Styles.mTop5, Styles.mLt30]}>
              {this.props.SignupState.contractor}
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

          <FlatList
            data={this.props.ReinforcementState.reinforcementData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item, index}) => this.reinforcementData(item, index)}
            extraData={this.props}
            style={[Styles.mBtm20]}
          />

          <View
            style={[
              Styles.marV10,
              Styles.marH15,
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
              Submit Inspection
            </CText>
          </TouchableOpacity>
          {/* //* Success Inspection modal */}
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

          {/* //* Schedule Inspection modal */}
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

export default connect(mapStateToProps, mapDispatchToProps)(InspectionSchedule);
