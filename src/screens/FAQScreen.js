import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Styles, CText, CInput, CImage, CSpinner} from '../common';
import {bindActionCreators} from 'redux';
import {ActionSignUp} from '../Store/Actions/SignUpAction';
import {connect} from 'react-redux';
import Config from '../Config';
import axios from 'axios';
import DropDownMenu from '../common/DropDownMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[Styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class FAQScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      token: '',
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      var token = await AsyncStorage.getItem('access_token');

      if (token == null) {
        console.log('no token');
      } else {
        this.setState({token: token});

        axios({
          method: 'GET',
          url: Config.routes.faqAPI,
          headers: {
            Authorization: 'JWT' + ' ' + this.state.token,
          },
        })
          .then((res) => {
            // console.log('faq data --->', res.data);

            this.props.getActionSignUp({
              faqData: res.data,
            });
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(err);
    }
  };

  renderSpinner() {
    if (this.props.SignupState.spinnerBool) {
      return <CSpinner />;
    }
  }

  reinforcementData(item, index) {
    // console.log('faq item ', item);

    return (
      <View
        style={[
          Styles.marH15,
          Styles.marV5,
          Styles.padV15,
          {backgroundColor: '#f7edeb'},
        ]}
        key={index}>
        <TouchableOpacity style={[Styles.row, Styles.marH10, Styles.mTop5]}>
          <CText cStyle={[{fontWeight: 'bold'}]}>{index + 1}. </CText>
          <CText
            cStyle={[
              Styles.flex1,
              Styles.cBlk,
              Styles.f15,
              {fontWeight: 'bold'},
            ]}>
            {item.question}
          </CText>
        </TouchableOpacity>
        <View style={[Styles.marH15]}>
          <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f15]}>
            {item.answer}
          </CText>
        </View>
      </View>
    );

    // return (
    //   <View
    //     style={[
    //       Styles.marH15,
    //       Styles.marV5,
    //       Styles.padV15,
    //       {backgroundColor: '#f7edeb'},
    //     ]}>
    //     <View style={[Styles.row, Styles.marH10, Styles.mTop5]}>
    //       <CText>{index + 1}. </CText>
    //       <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f15]}>
    //         {item.question}
    //       </CText>
    //     </View>
    //     <View style={[Styles.row, Styles.jSpaceArd, Styles.mTop15]}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           this.selectedData(item.id);
    //         }}
    //         style={[
    //           {
    //             backgroundColor:
    //               item.status === 'Complied' ? '#10C000' : '#DADADA',
    //           },
    //           Styles.brdRad5,
    //           Styles.padH10,
    //         ]}
    //         activeOpacity={0.6}>
    //         <Text
    //           style={[
    //             Styles.f13,
    //             Styles.padH10,
    //             Styles.padV10,
    //             Styles.aslCenter,
    //             {color: item.status === 'Complied' ? '#FFF' : '#000'},
    //           ]}>
    //           Compiled
    //         </Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         onPress={() => {
    //           this.selectingNotCompiled(item.id);
    //         }}
    //         style={[
    //           {
    //             backgroundColor:
    //               item.status === 'Not Complied' ? '#E14B2B' : '#DADADA',
    //           },
    //           Styles.brdRad5,
    //         ]}
    //         activeOpacity={0.6}>
    //         <Text
    //           style={[
    //             Styles.f13,
    //             Styles.padH10,
    //             Styles.padV10,
    //             Styles.aslCenter,
    //             {color: item.status === 'Not Complied' ? '#FFF' : '#000'},
    //           ]}>
    //           Not Compiled
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //     <View
    //       style={[
    //         {display: item.status === 'Not Complied' ? 'flex' : 'none'},
    //         Styles.mTop5,
    //       ]}>
    //       <TextInput
    //         mode="outlined"
    //         theme=""
    //         returnKeyType="next"
    //         blurOnSubmit={false}
    //         placeholder="Add Note.."
    //         placeholderTextColor="#666"
    //         //keyboardType='numeric'
    //         multiline={true}
    //         ref={(input) => {
    //           // this.phoneNumber = input;
    //         }}
    //         onChangeText={(value) => this.updateNote(item, value)}
    //         value={item}
    //         style={[Styles.padV5, Styles.marH15, Styles.bgFFF, Styles.f12]}
    //       />
    //     </View>
    //   </View>
    // );
  }

  //   selectedQuestion(item) {
  //     <View
  //       style={[
  //         Styles.row,
  //         Styles.marH10,
  //         Styles.mTop5,
  //         {display: item.id !== null ? 'flex' : 'none'},
  //       ]}>
  //       <CText cStyle={[Styles.flex1, Styles.cBlk, Styles.f15]}>
  //         {item.answer}
  //       </CText>
  //     </View>;
  //   }

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1}]}>
        <MyStatusBar backgroundColor="#010066" barStyle="light-content" />

        {this.renderSpinner()}

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
            {alignSelf: 'center', fontSize: 16},
            Styles.cBlue,
            Styles.padV15,
          ]}>
          Frequently Asked Questions (FAQs)
        </CText>
        <ScrollView style={[{marginBottom: 20}]}>
          {this.props.SignupState.faqData.map(
            (item, index) => this.reinforcementData(item, index),
            // this.props.getActionSignUp({
            //   ReinforcementData: ques,
            // })
          )}
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  // console.log(' state - - - ', state);
  return {
    SignupState: state.SignUp,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getActionSignUp: bindActionCreators(ActionSignUp, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQScreen);
