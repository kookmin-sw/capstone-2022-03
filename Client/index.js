/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

LogBox.ignoreLogs([
    "ViewPropTypes will be removed",
    "ColorPropType will be removed",
])
AppRegistry.registerComponent(appName, () => App);
