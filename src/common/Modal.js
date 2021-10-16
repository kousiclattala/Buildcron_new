import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Text,
  Image,
} from 'react-native';

import {color} from 'react-native-reanimated';

class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <View style={[{backgroundColor: '#FFF', flex: 1, zIndex: 1}]}>
        <Modal
          animationType="fade"
          visible={this.props.visible}
          transparent={true}
          statusBarTranslucent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000',
              opacity: 0.8,
              zIndex: -1,
            }}>
            <View
              style={{
                margin: 5,
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 0,
                alignItems: 'center',
                // shadowColor: '#000',
                // shadowOffset: {
                //   width: 0,
                //   height: 2,
                // },
                // shadowOpacity: 0.25,
                // shadowRadius: 20,
                // elevation: 5,
                width: '90%',
                height: '35%',
                zIndex: 2,
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#010066',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {this.props.title}
                </Text>
              </View>
              <View>
                <Image
                  source={require('../images/success-tick.png')}
                  style={{
                    alignSelf: 'center',
                    width: 70,
                    height: 70,
                    top: 10,
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    top: 20,
                  }}>
                  {this.props.description}
                </Text>

                <TouchableOpacity
                  onPress={() => this.setState({visible: false})}
                  style={{
                    backgroundColor: '#FF6600',
                    top: 30,
                    marginLeft: 30,
                    marginRight: 30,
                    padding: 7,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    {this.props.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Modal;
