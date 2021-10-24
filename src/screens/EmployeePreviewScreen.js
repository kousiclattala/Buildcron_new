import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  Image,
  BackHandler,
} from 'react-native';
import {Styles, CImage, CText, CInput} from '../common';
import DropDownMenu from '../common/DropDownMenu';
import DocumentPicker from 'react-native-document-picker';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class EmployeePreviewScreen extends Component {
  constructor() {
    super();
    this.state = {
      selectedDocument: [],
      docName: '',
    };
  }

  componentDidMount() {
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

  handleDocumentPicker = async () => {
    try {
      var res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      console.log('res from document picker -->', res);

      this.setState({
        docName: res.name,
        selectedDocument: res,
      });
    } catch (error) {
      console.log(error);
    }
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
          Notification Page
        </CText>

        <View
          style={[{backgroundColor: '#f7edeb'}, Styles.marH10, Styles.padV10]}>
          <CText
            cStyle={[
              {fontSize: 18, marginBottom: 10, marginLeft: 15},
              Styles.cBlue,
            ]}>
            Your inspection was Approved
          </CText>
          <Text
            style={{
              fontSize: 14,
              marginLeft: 15,
              marginBottom: 10,
            }}>
            Please upload the report
          </Text>
          <TouchableOpacity
            onPress={() => this.handleDocumentPicker()}
            style={{
              flexDirection: 'row',
              marginHorizontal: 15,
              borderWidth: 0.5,
              borderRadius: 5,
              borderColor: '#000',
              paddingHorizontal: 20,
              backgroundColor: '#eee',
            }}>
            <Text
              style={{
                borderRightWidth: 0.5,
                borderColor: '#000',
                paddingVertical: 10,
                paddingHorizontal: 15,
                color: '#666',
                left: -18,
              }}>
              Choose File
            </Text>

            <Text
              style={{
                top: 10,
              }}>
              {this.state.docName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
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
              Upload Report
            </CText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default EmployeePreviewScreen;
