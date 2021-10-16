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
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp, ReinforcementData} from '../Store/Actions/SignUpAction';
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
import {generateSlug} from 'random-word-slugs';
import {launchCamera} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import RNFS from 'react-native-fs';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class ReinforcementInspection extends React.Component {
  constructor() {
    super();
    this.state = {
      item: {},
      picturesPath: '',
      photoEditor: '',
    };
  }

  componentDidMount() {
    // console.log(
    //   'selected checklist from state -->',
    //   this.props.SignupState.selectedChecklist,
    // );

    console.log('site details -->', this.props.SignupState.siteDetails);
  }

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
    // console.log(this.props.SignupState.ReinforcementData);
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
    // console.log("   length ", this.props.SignupState.base64Images.length)
    let data = this.props.ReinforcementState.reinforcementData;
    let allAnswered = false;
    let count = 0;
    // console.log('data from reinforcement -->', data);
    var isAnswered = data.some((item) => {
      return item.status === 'Not Complied' && item.reason === null;
    });
    console.log('res isAnswered -->', isAnswered);
    if (isAnswered) {
      return Snackbar.show({
        text: 'Please answer all Checklist Questions',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      this.props.navigation.navigate('PreviewInspection');
    }
  }

  render() {
    //  this.props.getActionSignUp({images:images})

    // console.log('images', this.props.SignupState.images);
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
                this.props.navigation.navigate('ReinforcementChecklist');
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
        <CText
          cStyle={[
            {alignSelf: 'center', fontSize: 16, fontWeight: 'bold'},
            Styles.cblue,
            Styles.padV15,
          ]}>
          {this.props.SignupState.checklistName}
        </CText>
        <ScrollView style={[{marginBottom: 20}]}>
          {/* <FlatList
            data={this.props.SignupState.ReinforcementData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item, index}) => this.reinforcementData(item, index)}
            extraData={this.props}
            style={[{}]}
          /> */}

          {this.props.SignupState.selectedChecklist.question.map(
            (ques, index) => this.reinforcementData(ques, index),
            // this.props.getActionSignUp({
            //   ReinforcementData: ques,
            // })
          )}
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
              Preview Inspection
            </CText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - - ', state);
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
)(ReinforcementInspection);
