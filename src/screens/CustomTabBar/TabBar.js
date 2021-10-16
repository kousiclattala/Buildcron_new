import React, {Component} from 'react';
import {View, PixelRatio, Keyboard, Image, Text} from 'react-native';
import TabItem from './TabItem';
import {bindActionCreators} from 'redux';
// import { ActionSignInandSignUp } from "../../Store/Actions/SignInandSignUpAction"
import {connect} from 'react-redux';
import {Styles, CText, CImage} from '../../common';

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      isVisible: true,
    };
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.setState({
      isVisible: false,
    });
  };

  keyboardWillHide = (event) => {
    this.setState({
      isVisible: true,
    });
  };

  // explore() {
  //   if (this.props.SignInandSignUpState.explore) {
  //   return(
  //     <View style={{backgroundColor:'#aaa',marginHorizontal:40,paddingVertical:0,borderRadius:10}}>
  //       <View style={{marginHorizontal:15,flexDirection:'row',justifyContent:'space-between'}}>
  //         <View>
  //         <CImage cStyle={[{ height: 30, width: 30, },Styles.aslCenter]} src={require('../../images/home-light.png')} />

  //           <Text style={{fontSize:9}}>Home</Text>

  //         </View>
  //         <View>
  //         <CImage cStyle={[{ height: 30, width: 30, },Styles.aslCenter]} src={require('../../images/footer-shop.png')} />
  //           <Text style={[{fontSize:9}]}>Shop</Text>

  //         </View>
  //         <View>
  //         <CImage cStyle={[{ height: 30, width: 30, },Styles.aslCenter]} src={require('../../images/games-light.png')} />

  //           <Text style={[{fontSize:9}]}>Games</Text>

  //         </View>
  //         <View>
  //         <CImage cStyle={[{ height: 30, width: 30, },Styles.aslCenter]} src={require('../../images/history-light.png')} />

  //           <Text style={[{fontSize:9}]}>Home</Text>

  //         </View>
  //       </View>
  //               </View>
  //   )
  //   }
  // }
  render() {
    const {navigation} = this.props;
    const {routes, index} = navigation.state;

    return this.state.isVisible ? (
      <View>
        {/* {this.explore()} */}
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            backgroundColor: '#010066',
            borderTopWidth: PixelRatio.roundToNearestPixel(0.3),
            borderColor: '#000',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            width: '100%',
          }}>
          {routes.map((route, i) => (
            <TabItem
              navigation={navigation}
              key={route.routeName}
              {...route}
              isActive={index === i}
            />
          ))}
        </View>
      </View>
    ) : null;
  }
}
// function mapStateToProps(state) {
//   return {
//     SignInandSignUpState: state.SignInandSignUp,
//   }
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     getActionUpdateSignIn: bindActionCreators(ActionSignInandSignUp, dispatch),
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(TabBar)
