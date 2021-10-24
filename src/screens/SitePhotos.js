import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  Platform,
  BackHandler,
} from 'react-native';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import {Portal, Dialog, Button, Paragraph} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import Modal from '../common/Modal';

import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {htmlToPdf} from '../common/Report';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GridImageView from 'react-native-grid-image-viewer';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class SitePhotos extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      mode: '',
      images: [],
      picturesPath: '',
      buildcronDirPath: '',
      androidImages: [],
    };
  }

  componentDidMount() {
    // this.getAllKeys();

    this.getPhotos();
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

  getAllKeys = async () => {
    var keys = [];
    keys = await AsyncStorage.getAllKeys();

    var data = await AsyncStorage.multiGet(keys);

    // console.log('data from async storage', data);
  };

  getPhotos(img) {
    // RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
    //   .then((result) => {
    //     // console.log('rnfs result -->', result);

    //     result.map((res) => {
    //       if (res.name === 'Pictures') {
    //         // console.log('rnfs particular res -->', res);

    //         this.setState({
    //           picturesPath: res.path,
    //         });
    //       }
    //     });
    //     return RNFS.readDir(this.state.picturesPath);
    //   })
    //   .then((contents) => {
    //     // console.log('rnfs particular res -->', res);
    //     // console.log('rnfs content -->', contents);

    //     contents.map((item) => {
    //       if (item.name == 'buildcron') {
    //         // console.log('item from dir --> ', item);

    //         this.setState({
    //           buildcronDirPath: item.path,
    //         });
    //       }
    //     });

    //     return RNFS.readDir(this.state.buildcronDirPath);
    //   })
    //   .then((res) => {
    //     console.log('res from images dir', res);

    //     this.setState({
    //       images: res,
    //     });
    //   })
    //   .catch((err) => console.log(err));
    RNFS.readDir(`${RNFS.PicturesDirectoryPath}/buildcron`)
      .then((result) => {
        console.log(result);

        var imgs = [];

        result.map((res) => imgs.push(`file://${res.path}`));

        this.setState({
          androidImages: imgs,
        });
      })
      .catch((err) => console.log(err));
  }

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
            {alignSelf: 'center', fontSize: 16},
            Styles.marV10,
            Styles.cBlue,
          ]}>
          Site Photos
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
        {/* {this.state.images.map((img, index) => {
          console.log('img path', img.path);
          console.log(`file://${img.path}`);
          <Image
            source={{
              uri: `${
                Platform.OS === 'android' ? `file://${img.path}` : `${img.path}`
              }`,
              width: 100,
              height: 100,
            }}
            key={index}
          />;
        })} */}

        <GridImageView data={this.state.androidImages} />
      </View>
    );
  }
}

export default SitePhotos;
