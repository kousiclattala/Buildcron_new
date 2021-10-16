import React, {PureComponent} from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducers from './src/Store/Reducers/index';
import Router from './src/Router';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';

// TODO: Remove logbox later
// import {LogBox} from 'react-native';

// LogBox.ignoreAllLogs();

const logger = createLogger({collapsed: true, diff: true});

const middlewares = [];

if (__DEV__) {
  middlewares.push(thunk);
  middlewares.push(logger);
} else {
  middlewares.push(thunk);
}

const store = createStore(reducers, applyMiddleware(...middlewares));

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <Router />
        </PaperProvider>
      </Provider>
    );
  }
}
