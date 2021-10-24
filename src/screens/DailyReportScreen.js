import React, {Component} from 'react';
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
import {TextInput, DefaultTheme, RadioButton} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownMenu from '../common/DropDownMenu';
import Snackbar from 'react-native-snackbar';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import {generateSlug} from 'random-word-slugs';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class DailyReportScreen extends Component {
  constructor() {
    super();
    this.state = {
      image: '',
      areaInspected: '',
      weatherData: '',
      manpower: '',
      workCarriedOut: '',
      materialUsed: '',
      equipmentUsed: '',
      deliveries: '',
      testAndInspection: '',
      delaysAndIssues: '',
      safetyObservations: '',
      picturesPath: '',
      weatherData: {},
      weather: {},
      weatherEffected: '',
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false, images: []});
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    this.getWeatherData();
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

  getWeatherData = async () => {
    const data = this.props.SignupState.deviceLocation;
    console.log('device location data -->', typeof data);
    var latitude = data.latitude;
    var longitude = data.longitude;
    var API_KEY = '8bcdbc59a873b9001cecc6ddcd498d28';

    if (!latitude && !longitude) {
      await axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${'17.3850'}&lon=${'78.4867'}&appid=${API_KEY}`,
      })
        .then((res) => {
          res.data.weather.map((item) =>
            this.setState({
              weather: item,
            }),
          );

          this.setState({
            weatherData: res.data,
          });
        })
        .catch((err) => console.log(err));
    } else {
      await axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
      })
        .then((res) => {
          console.log('res from weather -->', res.data);

          res.data.weather.map((item) =>
            this.setState({
              weather: item,
            }),
          );

          this.setState({
            weatherData: res.data,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  validateReport() {
    if (
      !this.state.areaInspected ||
      !this.state.manpower ||
      !this.state.workCarriedOut ||
      !this.state.materialUsed ||
      !this.state.equipmentUsed ||
      !this.state.deliveries ||
      !this.state.testAndInspection ||
      !this.state.delaysAndIssues ||
      !this.state.safetyObservations ||
      !this.state.weatherEffected
    ) {
      Snackbar.show({
        text: 'Please Include All Fields',
        textColor: '#fff',
        backgroundColor: '#FF6600',
      });
    } else {
      const dailyReport = {
        areaInspected: this.state.areaInspected,
        weatherEffected: this.state.weatherEffected,
        manpower: this.state.manpower,
        workCarriedOut: this.state.workCarriedOut,
        materialUsed: this.state.materialUsed,
        equipmentUsed: this.state.equipmentUsed,
        deliveries: this.state.deliveries,
        testAndInspection: this.state.testAndInspection,
        delaysAndIssues: this.state.delaysAndIssues,
        safetyObservations: this.state.safetyObservations,
        project: this.props.SignupState.selectedProject,
        images: this.props.SignupState.images,
      };

      this.props.getActionSignUp({
        dailyReportData: dailyReport,
      });

      this.props.navigation.navigate('DailyReportPreview');
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

          console.log('path from state -->', this.state.picturesPath);
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
          Daily Report
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
              Area Responsible
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention the Area your responsible for supervision. 
                            (Ex. Civil works Towers 1 and 2)"
              placeholderTextColor="#666"
              multiline={true}
              // ref={(input) => {
              //   this.state.areaInspected = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  areaInspected: value,
                })
              }
              value={this.state.areaInspected}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
              ]}
            />
          </View>
          {/* //TODO: Add weather widget */}

          <View
            style={[
              {
                backgroundColor: '#f7edeb',
                flex: 1,
                flexDirection: 'row',
              },
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <View
              style={{
                marginLeft: 15,
                marginRight: 10,
                marginTop: 15,
              }}>
              <Text
                style={[
                  Styles.cBlue,
                  {
                    fontSize: 16,
                    fontWeight: '700',
                  },
                ]}>
                {/* {this.state.weatherData?.name} */}
                Hyderabad
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#000',
                }}>
                {/* {this.state.weather?.main} */}
                Cloudy
              </Text>
            </View>
            <Image
              // source={require('../images/weather.png')}
              source={require('../images/svgs/cloud.png')}
              style={{
                width: 50,
                height: 50,
                marginHorizontal: 20,
                marginVertical: 10,
              }}
            />
            {/* <Icon name="cloud-outline" /> */}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 25,
              }}>
              <Text
                style={[
                  Styles.cBlue,
                  {
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginHorizontal: 10,
                  },
                ]}>
                {/* {this.state.weatherData?.main?.temp}&deg;C */}
                30&deg;C
              </Text>
              <Text
                style={{
                  height: '80%',
                  width: 1,
                  backgroundColor: 'blue',
                  bottom: 5,
                }}>
                |
              </Text>
              <Text
                style={[
                  Styles.cBlue,
                  {
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginHorizontal: 10,
                  },
                ]}>
                {/* {this.state.weatherData?.main?.humidity}&deg;C */}
                20&deg;C
              </Text>
            </View>
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Work effected by Weather ?
            </CText>
            <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
              <RadioButton
                value="Yes"
                status={
                  this.state.weatherEffected == 'Yes' ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  this.setState({
                    weatherEffected: 'Yes',
                  });
                }}
                color="#ec6433"
              />
              <Text
                style={[
                  Styles.cBlue,
                  {
                    top: 7,
                    paddingRight: 10,
                    fontSize: 16,
                    fontWeight: '700',
                  },
                ]}>
                Yes
              </Text>
              <RadioButton
                value="No"
                status={
                  this.state.weatherEffected == 'No' ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  this.setState({
                    weatherEffected: 'No',
                  });
                }}
                color="#ec6433"
              />
              <Text
                style={[
                  Styles.cBlue,
                  {
                    top: 7,
                    paddingRight: 10,
                    fontSize: 16,
                    fontWeight: '700',
                  },
                ]}>
                No
              </Text>
            </View>
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Manpower
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Enter Manpower on site today"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              // multiline={true}
              // ref={(input) => {
              //   this.state.manpower = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  manpower: value,
                })
              }
              value={this.state.manpower}
              style={[
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderColor: '#000',
                  borderWidth: 0.3,
                  opacity: 0.7,
                },
              ]}
            />
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Work carried out
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Describe all work activities carried out at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  workCarriedOut: value,
                })
              }
              value={this.state.workCarriedOut}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
              ]}
            />
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Material Used
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all materials used at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  materialUsed: value,
                })
              }
              value={this.state.materialUsed}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderColor: '#000',
                  borderWidth: 0.3,
                  opacity: 0.7,
                },
              ]}
            />
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Equipment Used
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all Equipment used at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  equipmentUsed: value,
                })
              }
              value={this.state.equipmentUsed}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
              ]}
            />
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Deliveries
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all Material and Equipment delivered at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  deliveries: value,
                })
              }
              value={this.state.deliveries}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderColor: '#000',
                  borderWidth: 0.3,
                  opacity: 0.7,
                },
              ]}
            />
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Tests and Inspections
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all Tests and Inspections conducted at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  testAndInspection: value,
                })
              }
              value={this.state.testAndInspection}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
              ]}
            />
          </View>

          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Delays and Issues
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all Delays and Issues impacting work at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  delaysAndIssues: value,
                })
              }
              value={this.state.delaysAndIssues}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderColor: '#000',
                  borderWidth: 0.3,
                  opacity: 0.7,
                },
              ]}
            />
          </View>
          <View
            style={[
              {backgroundColor: '#f7edeb'},
              Styles.marH10,
              Styles.padV10,
              Styles.mTop10,
            ]}>
            <CText
              cStyle={[
                {fontSize: 18, marginBottom: 10, marginLeft: 15},
                Styles.cBlue,
              ]}>
              Safety Observations
            </CText>
            <TextInput
              theme=""
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder="Mention all Safety Observations effecting work at site today"
              placeholderTextColor="#666"
              keyboardType="default"
              multiline={true}
              // ref={(input) => {
              //   this.phoneNumber = input;
              // }}
              onChangeText={(value) =>
                this.setState({
                  safetyObservations: value,
                })
              }
              value={this.state.safetyObservations}
              style={[
                Styles.padV5,
                Styles.marH15,
                Styles.bgFFF,
                Styles.f15,
                Styles.brdRad5,
                {
                  borderWidth: 0.3,
                  borderColor: '#000',
                  opacity: 0.7,
                },
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
              this.validateReport();
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

export default connect(mapStateToProps, mapDispatchToProps)(DailyReportScreen);
