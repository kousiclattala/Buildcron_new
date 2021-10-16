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
import {ActionSignUp, ReportData} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import Utils from '../common/Utils';
//import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import {TextInput, DefaultTheme} from 'react-native-paper';
import DropDownMenu from '../common/DropDownMenu';
import RNFS, {stat} from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {DrawerActions} from 'react-navigation-drawer';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class MyDocs extends React.Component {
  constructor() {
    super();
    this.state = {
      directoryPath: '',
      buildcronDirPath: '',
      filesPath: [],
    };
  }

  componentDidMount() {
    this.props.getActionSignUp({spinnerBool: false});

    // console.log(
    //   'sucess inspection data',
    //   this.props.SignupState.sucessInspectionData,
    // );

    this.renderFiles();

    // console.log('report data type -->', typeof this.props.SignupState.reports);
    // console.log('report data from store -->', this.props.SignupState.reports);
  }

  // componentDidUpdate() {
  //   this.renderFiles();
  // }

  // TODO: get files from local storage
  renderFiles() {
    RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
      .then((result) => {
        // console.log('rnfs result -->', result);

        result.map((res) => {
          if (res.name === 'Documents') {
            // console.log('rnfs particular res -->', res);

            this.setState({
              directoryPath: res.path,
            });
          } else if (res.name === 'documents') {
            // console.log('rnfs particular res 2 -->', res);

            this.setState({
              directoryPath: res.path,
            });
          }
        });
        return RNFS.readDir(this.state.directoryPath);
      })
      .then((contents) => {
        // console.log('rnfs particular res -->', res);
        // console.log('rnfs content -->', contents);

        contents.map((item) => {
          if (item.name == 'buildcron') {
            // console.log('item from dir --> ', item);

            this.setState({
              buildcronDirPath: item.path,
            });
          }
        });

        return RNFS.readDir(this.state.buildcronDirPath);
      })
      .then((files) => {
        console.log('files from buildron dir -->', files);

        const data = [];

        files.map((file) => {
          // console.log('file from buildcron -->', file);
          // TODO: create another reducer and add files to that reducer

          // this.setState({
          //   filesPath: this.state.filesPath + file,
          // });
          data.push(file);
        });
        // console.log('data array ----->', data);
        this.props.getReportData({
          reportData: data,
        });
        // console.log('files from state', this.state.filesPath);
      })
      .catch((err) => console.log(err));
  }

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  qualityInspectionData(item, index) {
    // console.log('item from mydocs -->', item);
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            this.selectionOfQI(item);
          }}
          style={[
            {paddingVertical: 8, backgroundColor: '#f7edeb', marginTop: 15},
          ]}>
          <View
            style={[
              Styles.row,
              Styles.marH15,
              Styles.aitCenter,
              Styles.jSpaceBet,
            ]}>
            <CImage
              cStyle={[{height: 37, width: 32, right: 5}]}
              src={require('../images/pdf.png')}
            />
            <CText cStyle={[{fontSize: 15, flex: 1}, Styles.cblue]}>
              {item.name}
            </CText>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {}}
          style={[
            {
              paddingVertical: 8,
              backgroundColor: '#fff',
              marginHorizontal: 15,
              marginTop: 15,
              flexDirection: 'row',
              borderRadius: 5,
              display: item.selected ? 'flex' : 'none',
              borderColor: '#ddd',
              borderWidth: 1,
            },
            Styles.aitCenter,
          ]}>
          <View style={[Styles.marH10, Styles.row, Styles.aitCenter]}>
            <CImage
              cStyle={[{height: 30, width: 30}]}
              src={require('../images/mensdress.jpg')}
            />
            <View style={[Styles.mLt10, Styles.flex1]}>
              <CText cStyle={[{marginLeft: 10, fontSize: 15}, Styles.cBlk]}>
                Reinforcement Inspection, CIV-PR-002
              </CText>
              <View
                style={[
                  Styles.row,
                  Styles.flex1,
                  Styles.jSpaceBet,
                  Styles.mTop3,
                ]}>
                <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
                  Doc# xx-xx-xxx
                </CText>
                <CText cStyle={[{fontSize: 12}, Styles.cBlk]}>
                  Apr 2, 2021 10:45 PM
                </CText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {}}
          style={[
            {
              paddingVertical: 8,
              backgroundColor: '#fff',
              marginHorizontal: 15,
              flexDirection: 'row',
              borderRadius: 5,
              display: item.selected ? 'flex' : 'none',
              borderColor: '#ddd',
              borderWidth: 1,
            },
            Styles.aitCenter,
          ]}>
          <View style={[Styles.marH10, Styles.row, Styles.aitCenter]}>
            <CImage
              cStyle={[{height: 30, width: 30}]}
              src={require('../images/mensdress.jpg')}
            />
            <View style={[Styles.mLt10, Styles.flex1]}>
              <CText cStyle={[{marginLeft: 10, fontSize: 15}, Styles.cBlk]}>
                Concrete Pour Inspection, CIV-PR-004
              </CText>
              <View
                style={[
                  Styles.row,
                  Styles.flex1,
                  Styles.jSpaceBet,
                  Styles.mTop3,
                ]}>
                <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
                  Doc# xx-xx-xxx
                </CText>
                <CText cStyle={[{fontSize: 12}, Styles.cBlk]}>
                  Apr 2, 2021 10:45 PM
                </CText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => {}}
          style={[
            {
              paddingVertical: 8,
              backgroundColor: '#fff',
              marginHorizontal: 15,
              flexDirection: 'row',
              borderRadius: 5,
              display: item.selected ? 'flex' : 'none',
              borderColor: '#ddd',
              borderWidth: 1,
            },
            Styles.aitCenter,
          ]}>
          <View style={[Styles.marH10, Styles.row, Styles.aitCenter]}>
            <CImage
              cStyle={[{height: 30, width: 30}]}
              src={require('../images/mensdress.jpg')}
            />
            <View style={[Styles.mLt10, Styles.flex1]}>
              <CText cStyle={[{marginLeft: 10, fontSize: 15}, Styles.cBlk]}>
                Blockwork Inspection, CIV-PR-014
              </CText>
              <View
                style={[
                  Styles.row,
                  Styles.flex1,
                  Styles.jSpaceBet,
                  Styles.mTop3,
                ]}>
                <CText cStyle={[{marginLeft: 10, fontSize: 12}, Styles.cBlk]}>
                  Doc# xx-xx-xxx
                </CText>
                <CText cStyle={[{fontSize: 12}, Styles.cBlk]}>
                  Apr 2, 2021 10:45 PM
                </CText>
              </View>
            </View>
          </View>
              </TouchableOpacity> */}
      </View>
    );

    // if (this.props.SignupState.SelectedOption === 'Employee') {
    //     return (
    //         <TouchableOpacity activeOpacity={0.6} onPress={() => { this.selectionOfQI(item.id) }} style={[{ paddingVertical: 15, backgroundColor: '#f7edeb', marginHorizontal: 20, marginTop: index === 0 ? 0 : 10, borderRadius: 5 },]}>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 15, fontWeight: '700' }, Styles.cBlk]}>Raj Kumar</CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12, marginVertical: 3 }, Styles.cBlk]}>BUDE0013, SafetyOfficer</CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12, color: 'blue' }]}>+91- 8686808676 , <CText cStyle={[{ fontSize: 12 }, Styles.cBlk]}> vinay@analogit.in</CText></CText>
    //         </TouchableOpacity>
    //     )
    // }
    // if (this.props.SignupState.SelectedOption === 'Vendors') {
    //     return (
    //         <TouchableOpacity activeOpacity={0.6} onPress={() => { this.selectionOfQI(item.id) }} style={[{ paddingVertical: 15, backgroundColor: '#f7edeb', marginHorizontal: 20, marginTop: index === 0 ? 0 : 10, borderRadius: 5 },]}>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 15, fontWeight: '700' }, Styles.cBlk]}>TM tech solutions pvt ltd.</CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>BUDE0013, Ramanthapur </CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>Hyderabad, Telangana</CText>

    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>+91- 8686808676 , vinay@analogit.in</CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12, color: 'blue' },]}><CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cblk]}>SuperVisor: RS pandey </CText> +91- 8686808676</CText>

    //         </TouchableOpacity>

    //     )
    // }
    // if (this.props.SignupState.SelectedOption === 'Materials') {
    //     return (
    //         <TouchableOpacity activeOpacity={0.6} onPress={() => { this.selectionOfQI(item.id) }} style={[{ paddingVertical: 15, backgroundColor: '#f7edeb', marginHorizontal: 20, marginTop: index === 0 ? 0 : 10, borderRadius: 5 },]}>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 15, fontWeight: '700' }, Styles.cBlk]}>M30 Concrete</CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>BUDMA001, BOQ Ref: 1.1.12, Make: ACC
    //             </CText>
    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>Project Quantity: 8000 cum</CText>

    //             <CText cStyle={[{ marginLeft: 10, fontSize: 12 }, Styles.cBlk]}>Remaining Quantity: 2000 cum
    //             </CText>

    //         </TouchableOpacity>
    //     )
    // }
  }

  selectionOfQI(item) {
    // console.log('selected item from docs -->', item);
    const path = item.path;

    FileViewer.open(path)
      .then(() => console.log('File Opened'))
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
          My Docs
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

        {/* <FlatList
          data={this.props.SignupState.MyDocsData}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item, index}) =>
            this.qualityInspectionData(item, index)
          }
          extraData={this.props}
          style={[Styles.mBtm15]}
        /> */}
        {/* //TODO: uncomment later */}
        {/* {this.props.SignupState.reports == undefined ? (
          <View>
            <Text>No files</Text>
          </View>
        ) : (
          this.props.SignupState.reports.map((report, index) =>
            this.qualityInspectionData(report, index),
          )
        )} */}

        <ScrollView>
          {this.props.ReportInspectionState.reportData.map((report, index) =>
            this.qualityInspectionData(report, index),
          )}
        </ScrollView>

        {/* </ScrollView> */}
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - ', state);
  return {
    SignupState: state.SignUp,
    ReportInspectionState: state.ReportInspection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
    getReportData: bindActionCreators(ReportData, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDocs);
