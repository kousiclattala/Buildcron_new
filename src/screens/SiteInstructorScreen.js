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
import ImagePicker from 'react-native-image-crop-picker';
import DropDownMenu from '../common/DropDownMenu';

import {launchCamera} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import Snackbar from 'react-native-snackbar';

import RNFS from 'react-native-fs';
import {generateSlug} from 'random-word-slugs';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class SiteInstructorScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      areaInspected: '',
      contractorResponsible: '',
      category: '',
      severityLevel: '',
      addInstructions: '',
      picturesPath: '',
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false, images: []});
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
            ]}
            key={index}>
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

  contractorList(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            contractorResponsible: item.maker.name,
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

  categoryList(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            category: item.name,
            categoryModal: false,
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

  severityLevelList(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.getActionSignUp({
            severityLevel: item.level,
            severityModal: false,
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
            {item.level}
          </CText>
        </View>
      </TouchableOpacity>
    );
  }

  handleSiteObservationData() {
    // TODO: add images to the data

    if (
      !this.props.SignupState.areaInspected ||
      !this.props.SignupState.contractorResponsible ||
      !this.props.SignupState.category ||
      !this.props.SignupState.severityLevel ||
      !this.props.SignupState.addInstructions
    ) {
      Snackbar.show({
        text: 'Please include all fields',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      const siteObservationData = {
        areaInspected: this.props.SignupState.areaInspected,
        contractorResponsible: this.props.SignupState.contractorResponsible,
        category: this.props.SignupState.category,
        severityLevel: this.props.SignupState.severityLevel,
        addObservations: this.props.SignupState.addInstructions,
      };

      this.props.getActionSignUp({
        siteObservationData: siteObservationData,
      });

      this.props.navigation.navigate('SiteObservationPreview');
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
          Site Observation Report
        </CText>
        <ScrollView style={[{marginBottom: 20}]}>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Area Being Inspected
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Describe the Zone/Area being Inspected (Ex Tower1, 5th Floor Slab)"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              onChangeText={(value) =>
                this.props.getActionSignUp({
                  areaInspected: value,
                })
              }
              value={this.props.SignupState.areaInspected}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {opacity: 0.7, borderWidth: 0.3, borderColor: '#000'},
              ]}
            />
          </View>

          {/* <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop20,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginTop: 10, marginLeft: 15},
                Styles.cblue,
              ]}>
              Inspection Material Quality
            </CText>
            <View
              style={[
                {borderWidth: 0.3, borderColor: '#000', opacity: 0.7},
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
                Styles.brdRad5,
              ]}>
              <CText cStyle={[Styles.mLt10, Styles.f15]}>
                Select the Material Being Inspected
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </View>
          </View> */}

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop20,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginTop: 10, marginLeft: 15},
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
                {borderWidth: 0.3, borderColor: '#000', opacity: 0.7},
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
                Styles.brdRad5,
              ]}>
              <CText cStyle={[Styles.mLt10, Styles.f15]}>
                {this.props.SignupState.contractorResponsible
                  ? this.props.SignupState.contractorResponsible
                  : 'Select the Contractor from the List'}
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop20,
            ]}>
            <CText
              cStyle={{
                fontSize: 18,
                marginTop: 10,
                color: '#142A66',
                marginLeft: 15,
              }}>
              Category
            </CText>
            <TouchableOpacity
              onPress={() => {
                this.props.getActionSignUp({
                  categoryModal: true,
                });
              }}
              style={[
                {borderWidth: 0.3, borderColor: '#000', opacity: 0.7},
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
                Styles.brdRad5,
              ]}>
              <CText cStyle={[Styles.mLt10, Styles.f15]}>
                {this.props.SignupState.category
                  ? this.props.SignupState.category
                  : 'Select the Category from the List'}
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </TouchableOpacity>
            <View
              style={[
                {
                  display:
                    this.props.SignupState.category === 'Other'
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
                onChangeText={(value) =>
                  this.props.getActionSignUp({
                    otherCategory: value,
                  })
                }
                value={this.props.SignupState.otherCategory}
                style={[Styles.padV5, Styles.marH15, Styles.bgFFF, Styles.f12]}
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
                {fontSize: 18, marginTop: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Severity Level
            </CText>
            <TouchableOpacity
              onPress={() => {
                this.props.getActionSignUp({severityModal: true});
              }}
              style={[
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
                Styles.padV10,
                Styles.marH15,
                Styles.row,
                Styles.aitCenter,
                Styles.jSpaceBet,
                Styles.marV5,
                Styles.mTop10,
                Styles.bgFFF,
                Styles.brdRad5,
              ]}>
              <CText cStyle={[Styles.mLt15, Styles.f15]}>
                {this.props.SignupState.severityLevel
                  ? this.props.SignupState.severityLevel
                  : 'Select the Severity Leval'}
              </CText>
              <CImage
                cStyle={[{height: 30, width: 30}, Styles.mRt10]}
                src={require('../images/down-black.png')}
              />
            </TouchableOpacity>
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
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Add Observation
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Provide a brief Instruction for the contractor to take action"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              onChangeText={(value) =>
                this.props.getActionSignUp({
                  addInstructions: value,
                })
              }
              value={this.props.SignupState.addInstructions}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {opacity: 0.7, borderWidth: 0.3, borderColor: '#000'},
              ]}
            />
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
            <CText cStyle={[Styles.f15]}>Add Site Instruction Pictures</CText>
          </View>
          <FlatList
            data={this.props.SignupState.images}
            //keyExtractor={(item, index) => item._id + index}
            renderItem={({item, index}) => this.displayPics(item, index)}
            extraData={this.props}
            horizontal={true}
            style={[Styles.marH15, Styles.mTop10]}
          />

          <TouchableOpacity
            onPress={() => {
              this.handleSiteObservationData();
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
              Preview Report
            </CText>
          </TouchableOpacity>

          {/* //* Contractor Modal */}
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
                  ) : (
                    this.props.SignupState.selectedProject.material.map(
                      (item, index) => this.contractorList(item, index),
                    )
                  )}
                </View>
              </View>
            </View>
          </Modal>

          {/* //* Category Modal */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.SignupState.categoryModal}
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
                    display: this.props.SignupState.categoryModal
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
                        Category List
                      </CText>

                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                          this.props.getActionSignUp({categoryModal: false});
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
                    data={this.props.SignupState.siteCategory}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={({item, index}) =>
                      this.categoryList(item, index)
                    }
                    extraData={this.props}
                    // horizontal={true}
                    style={[Styles.marV10]}
                  /> */}
                  {this.props.SignupState.siteCategory.map((item, index) => {
                    this.categoryList(item, index);
                  })}
                </View>
              </View>
            </View>
          </Modal>

          {/* //* Severity Level Modal */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.SignupState.severityModal}
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
                    display: this.props.SignupState.severityModal
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
                        Severity List
                      </CText>

                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                          this.props.getActionSignUp({severityModal: false});
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
                    data={this.props.SignupState.severityLevelData}
                    keyExtractor={(item, index) => item.id + index.toString()}
                    renderItem={({item, index}) =>
                      this.severityLevelList(item, index)
                    }
                    extraData={this.props}
                    // horizontal={true}
                    style={[Styles.marV10]}
                  /> */}

                  {this.props.SignupState.severityLevelData.map(
                    (item, index) => {
                      this.severityLevelList(item, index);
                    },
                  )}
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
)(SiteInstructorScreen);
