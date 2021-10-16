import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
} from 'react-native';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import {Portal, Dialog, Button, Paragraph} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import Modal from '../common/Modal';
import FileViewer from 'react-native-file-viewer';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {htmlToPdf} from '../common/Report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from 'react-navigation-drawer';
import {file} from '@babel/types';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      mode: '',
      directoryPath: '',
      buildcronDirPath: '',
      searchedValue: '',
      selectedFile: {},
    };
  }

  componentDidMount() {
    //
  }

  getAllKeys = async () => {
    var keys = [];
    keys = await AsyncStorage.getAllKeys();

    var data = await AsyncStorage.multiGet(keys);

    console.log('data from async storage', data);
  };

  searchFile() {
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
        console.log('files data from rnfs -->', files);

        console.log('searched value -->', this.state.searchedValue);

        files.map((file) => {
          if (file.name == `${this.state.searchedValue}.pdf`) {
            this.setState({
              selectedFile: file,
            });
          }
        });
      })
      .catch((err) => console.log(err));
  }

  openFile = (path) => {
    FileViewer.open(path).then(() =>
      this.setState({
        searchedValue: '',
      }),
    );
  };

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1, zIndex: 1}]}>
        <MyStatusBar backgroundColor="#010066" barStyle="light-content" />

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
          Search Page
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
            cStyle={[{marginLeft: 15, fontSize: 14, flex: 0.95}]}
            onChangeText={(value) =>
              this.setState({
                searchedValue: value,
              })
            }
            value={this.state.searchedValue}></CInput>
          <TouchableOpacity onPress={() => this.searchFile()}>
            <CImage
              cStyle={[{height: 25, width: 25}]}
              src={require('../images/search.png')}
            />
          </TouchableOpacity>
        </View>

        {this.state.searchedValue == '' ? (
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
              Search Documents here
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              this.openFile(this.state.selectedFile.path);
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
                {this.state.selectedFile.name}
              </CText>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default SearchScreen;
