import React, {Component} from 'react';
import {View, Text} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {CImage} from '../common';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionSignUp} from '../Store/Actions/SignUpAction';

// const data = [
//   {
//     label: 'Test Project 1',
//     value: 'Test Project 1, Rajendra Nagar,Kondapur,Hyderabad',
//   },
//   {
//     label: 'Test Project 2',
//     value: 'Test Project 2, Rajendra Nagar,Kondapur,Hyderabad',
//   },
//   {
//     label: 'Test Project 3',
//     value: 'Test Project 3, Rajendra Nagar,Kondapur,Hyderabad',
//   },
//   {
//     label: 'Test Project 4',
//     value: 'Test Project 4, Rajendra Nagar,Kondapur,Hyderabad',
//   },
//   {
//     label: 'Test Project 5',
//     value: 'Test Project 5, Rajendra Nagar,Kondapur,Hyderabad',
//   },
// ];

class DropDownMenu extends Component {
  constructor() {
    super();

    this.state = {
      project: '',
      data: [],
    };
  }

  render() {
    return (
      <SelectDropdown
        data={this.props.SignupState.projects}
        defaultButtonText={
          this.props.SignupState.selectedProject.length == 0
            ? 'Project Name, Address'
            : `${this.props.SignupState.selectedProject.name}, ${this.props.SignupState.selectedProject.location}`
        }
        defaultValue={this.props.SignupState.selectedProject}
        onSelect={(selected) => {
          // this.setState({
          //   project: selected,
          // });

          this.props.getActionSignUp({selectedProject: selected});
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return `${this.props.SignupState.selectedProject.name},${this.props.SignupState.selectedProject.location}`;
        }}
        renderCustomizedRowChild={(item, index) => {
          return (
            <View key={index}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  color: '#000',
                }}>
                {item.location}
              </Text>
            </View>
          );
        }}
        buttonStyle={{
          width: '100%',
          height: '6%',
          backgroundColor: '#ec6433',
          position: 'relative',
        }}
        buttonTextStyle={{
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'left',
          fontSize: 16,
        }}
        renderDropdownIcon={() => (
          <CImage
            cStyle={[{height: 30, width: 30}]}
            src={require('../images/down.png')}
          />
        )}
        dropdownStyle={{
          borderRadius: 13,
          marginVertical: -25,
        }}
        rowStyle={{
          padding: 7,
          // backgroundColor: '#ec6433',
        }}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(DropDownMenu);
