import { AppRegistry } from 'react-native';
import App from './App';
import bgMessaging from './constants/BgMessaging';


AppRegistry.registerComponent('tdemconnect', () => App);

AppRegistry.registerHeadlessTask(
    'RNFirebaseBackgroundMessage',
    () => bgMessaging
  );

  
