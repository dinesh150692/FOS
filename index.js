import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry, YellowBox } from 'react-native';


import Root from './App';
import configureStore from './src/redux/store';
import initialState from './src/redux/initialState';
import Config from "react-native-config";
import {Sentry} from "react-native-sentry";
const SENTRY_CONFIG_URL = Config.SENTRY_CONFIG_URL;
import { version } from './package.json';

Sentry.config(
    SENTRY_CONFIG_URL
).install();

Sentry.setVersion(version);

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Possible Unhandled Promise Rejection',
  'Unable to symbolicate stack trace: Network request failed'
]);


const store = configureStore(initialState);
export default store;
class App extends React.PureComponent {
    render() {
      return ( 
        <Provider store={store}>
            <Root/>
        </Provider>
      );
    }
}

AppRegistry.registerComponent('fos', () => App);
