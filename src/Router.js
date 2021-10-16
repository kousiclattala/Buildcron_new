import React, {Component, useEffect} from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationContainer,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {BottomTabBar, createBottomTabNavigator} from 'react-navigation-tabs';
import TabBar from './screens/CustomTabBar/TabBar';
import {
  createDrawerNavigator,
  DrawerGestureContext,
} from 'react-navigation-drawer';

import LoginScreen from './screens/loginScreen';
import OTPverificationScreen from './screens/OTPverificationScreen';
import HomeScreen from './screens/HomeScreen';
import QualityInspectionScreen from './screens/QualityInspectionScreen';
import ReinforcementChecklist from './screens/ReinforcementChecklist';
import ReinforcementInspection from './screens/ReinforcementInspection ';
import SiteInstructorScreen from './screens/SiteInstructorScreen';
import PreviewInspection from './screens/PreviewInspection';
import NCReportScreen from './screens/NCReportScreen';
import Directory from './screens/Directory';
import MyDocs from './screens/MyDocs';
import TodoList from './screens/ToDoList';
import ToDoList from './screens/ToDoList';
import DailyReportScreen from './screens/DailyReportScreen';
import SafetyInspectionScreen from './screens/SafetyInspectionScreen';
import DrawerContent from './screens/DrawerContent';
import SignUpScreen from './screens/SignUpScreen';
import LoginPinScreen from './screens/LoginPinScreen';
import SearchScreen from './screens/SearchScreen';
import SiteObservationChecklist from './screens/SiteObservationChecklist';
import SiteObservationPreview from './screens/SiteObservationPreview';
import DailyReportPreview from './screens/DailyReportPreview';
import FAQScreen from './screens/FAQScreen';
import NCReportChecklist from './screens/NCReportChecklist';
import NCReportPreview from './screens/NCReportPreview';
import LoadingScreen from './screens/LoadingScreen';
import SitePhotos from './screens/SitePhotos';
import InspectionSchedule from './screens/InspectionSchedule';
import NotificationScreen from './screens/NotificationScreen';
import NotificationPreviewScreen from './screens/NotificationPreviewScreen';
import EmployeeScreen from './screens/EmployeeScreen';
import EmployeePreviewScreen from './screens/EmployeePreviewScreen';

//import { createDrawerNavigator, DrawerGestureContext } from 'react-navigation-drawer';

const authNav = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    OTPverificationScreen: {
      screen: OTPverificationScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignUpScreen: {
      screen: SignUpScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'LoginScreen',
  },
);

const appNav = createStackNavigator(
  {
    LoginPinScreen: {
      screen: LoginPinScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    QualityInspectionScreen: {
      screen: QualityInspectionScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    ReinforcementChecklist: {
      screen: ReinforcementChecklist,
      navigationOptions: {
        headerShown: false,
      },
    },
    ReinforcementInspection: {
      screen: ReinforcementInspection,
      navigationOptions: {
        headerShown: false,
      },
    },
    PreviewInspection: {
      screen: PreviewInspection,
      navigationOptions: {
        headerShown: false,
      },
    },
    SiteInstructorScreen: {
      screen: SiteInstructorScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SiteObservationPreview: {
      screen: SiteObservationPreview,
      navigationOptions: {
        headerShown: false,
      },
    },
    SiteObservationChecklist: {
      screen: SiteObservationChecklist,
      navigationOptions: {
        headerShown: false,
      },
    },

    NCReportScreen: {
      screen: NCReportScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    NCReportPreview: {
      screen: NCReportPreview,
      navigationOptions: {
        headerShown: false,
      },
    },
    NCReportChecklist: {
      screen: NCReportChecklist,
      navigationOptions: {
        headerShown: false,
      },
    },
    SitePhotos: {
      screen: SitePhotos,
      navigationOptions: {
        headerShown: false,
      },
    },
    Directory: {
      screen: Directory,
      navigationOptions: {
        headerShown: false,
      },
    },
    MyDocs: {
      screen: MyDocs,
      navigationOptions: {
        headerShown: false,
      },
    },
    TodoList: {
      screen: TodoList,
      navigationOptions: {
        headerShown: false,
      },
    },
    DailyReportScreen: {
      screen: DailyReportScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    DailyReportPreview: {
      screen: DailyReportPreview,
      navigationOptions: {
        headerShown: false,
      },
    },
    SafetyInspectionScreen: {
      screen: SafetyInspectionScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    FAQScreen: {
      screen: FAQScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    InspectionSchedule: {
      screen: InspectionSchedule,
      navigationOptions: {
        headerShown: false,
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    NotificationPreviewScreen: {
      screen: NotificationPreviewScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EmployeeScreen: {
      screen: EmployeeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    EmployeePreviewScreen: {
      screen: EmployeePreviewScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'LoginPinScreen',
  },
);

const BottomBar = createBottomTabNavigator(
  {
    Directory: {screen: Directory},
    MyDocs: {screen: MyDocs},
    Home: {screen: HomeScreen},
    Todolist: {screen: ToDoList},
    Search: {screen: SearchScreen},
  },
  {
    initialRouteName: 'Home',
    backBehavior: 'history',
    tabBarComponent: (props) => <TabBar {...props} />,
  },
);
const DrawerNav = createDrawerNavigator(
  {
    //  HomeScreen:HomeScreen,
    footer: BottomBar,
  },
  {
    initialRouteName: 'footer',
    contentOptions: {
      activeTintColor: '#0000',
    },
    drawerContentOptions: {
      activeTintColor: '#e91e63',
      itemStyle: {marginVertical: 30},
    },
    //  contentComponent : DrawerContent,
    DrawerGestureContext: true,
    //drawerType: "front",
    //drawerPosition: 'right',
    contentComponent: DrawerContent,
  },
);

const SwitchRouter = createSwitchNavigator(
  {
    loading: LoadingScreen,
    auth: authNav,
    footer: BottomBar,
    appNav: appNav,
    Draw: DrawerNav,
  },
  {
    initialRouteName: 'loading',
    backBehavior: 'order',
  },
);
const Routers = createAppContainer(SwitchRouter);

export default Routers;
