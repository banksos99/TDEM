import React, { Component } from 'react';
import { View, Image,Alert } from 'react-native';

import {
  StackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import SharedPreference from './SharedObject/SharedPreference';

import RootViewController from './ViewController/NavigationController';
import PINScreen from './ViewController/MHF01310PINScreen';
import SavePIN from "./constants/SavePIN";
import DeviceInfo from 'react-native-device-info';

import firebase from 'react-native-firebase';
import type, { RemoteMessage } from 'react-native-firebase';
let mon = ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default class mainview extends Component {

  savePIN = new SavePIN()

  constructor(props) {
    super(props);
    this.state = {
      inactive: false,
      showpin: false,
    }
  }

  async componentDidMount() {
    console.log("App ==> componentDidMount")
    this.inactivecounting();
    this.inappTimeInterval();
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("firebase ==> user has permissions")
    } else {
      try {
        await firebase.messaging().requestPermission();
        console.log("firebase ==> User has authorised")
      } catch (error) {
        console.log("firebase ==> error")
      }
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      // Process your message as required
    });
    //////////Device Info/////////////

    const deviceModel = DeviceInfo.getModel();
    // console.log("deviceModel : ", deviceModel)

    const deviceBrand = DeviceInfo.getBrand();
    // console.log("deviceBrand : ", deviceBrand)

    const deviceOS = DeviceInfo.getSystemName();
    // console.log("deviceOS : ", deviceOS)

    const deviceOSVersion = DeviceInfo.getSystemVersion();
    // console.log("deviceOSVersion : ", deviceOSVersion)

    const appVersion = DeviceInfo.getVersion();
    // console.log("appVersion : ", appVersion)

    const buildNumber = DeviceInfo.getBuildNumber();
    // console.log("buildNumber : ", buildNumber)


    await firebase.messaging().getToken()
      .then((token) => {
        console.log('firebase ==> message Device FCM Token: ', token);
        SharedPreference.deviceInfo = {
          "deviceModel": deviceModel,
          "deviceBrand": deviceBrand,
          "deviceOS": deviceOS,
          "deviceOSVersion": deviceOSVersion,
          "firebaseToken": token,
          "appVersion": appVersion,
          "buildNumber": buildNumber
        }
      });

    firebase.messaging().onMessage(payload => {
      // console.log('Opened when app is alive');
      // console.log("payload ", payload);
      const prefix = Platform.OS == 'android' ? 'ifimarketplace://ifimarketplace/' : 'ifimarketplace://'
      const url = `${prefix}tabs/messages/${payload.key}`;
      // console.log("url ", url);
    });


    firebase.messaging().getInitialNotification()
      .then((notification) => {
        console.log('Notification which opened the app: ', notification);
      });


    const onBackgroundMessage = (msg) => {
      // do something with msg
      console.log('Message received when app was closed', msg);
    }

    const onForegroundMessage = (msg) => {
      // do something with msg
      console.log('Message received in open app', msg);
    }

    // use:
    const unsubscribeOnMessage = messaging.onMessage(msg => {
      const { opened_from_tray } = msg;

      // opened_from_tray is a numeric boolean and takes values either 1 or 0
      if (opened_from_tray) {
        onBackgroundMessage(msg);
      } else {
        onForegroundMessage(msg);
      }
    });

    // this.messageListener();
    // this.notificationDisplayedListener();
    // this.notificationListener();
    // this.notificationOpenedListener();

  }

  // componentWillUnmount() {
  //   console.log("App ==> componentWillUnmount")
  //   this.messageListener();
  //   this.notificationDisplayedListener();
  //   this.notificationListener();
  //   this.notificationOpenedListener();
  // }

  inactivecounting() {
    this.timer = setTimeout(() => {
      this.setState({
        inactive: true,
        modalVisible: true
      });
    }, 500);
  }

  noaction() {
    this.timer = setTimeout(() => {
      this.setState({
        showpin: true,
        modalVisible: true
      });
    }, 500);
  }

  // toggleModal(visible) {
  //   this.timer = setTimeout(() => {
  //     this.setState({ showpin: false });
  //   }, 500);
  // };

  inappTimeInterval() {
    this.timer = setTimeout(() => {
      this.onLoadAppInfo()
      
    }, 60000);
  };

  getParsedDate() {

    let date = new Date()

    date = String(date).split(' ');

    let days = String(date[0]).split('-');

    let hours = String(date[4]).split(':');

    let mon_num = 0

    for (let i = 0; i < mon.length; i++) {
      if (mon[i] === date[1]) {
        mon_num = i + 1;
      }

    }
    return date[3] + '-' + mon_num + '-' + date[2] + ' ' + hours[0] + ':' + hours[1] + ':' + hours[2];

  }

  onLoadAppInfo() {

    let newdate = this.getParsedDate()

    return fetch(SharedPreference.PULL_NOTIFICATION_API + newdate, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: SharedPreference.TOKEN,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        try {
          console.log('responseJson :', responseJson)

          this.setState({


          }, function () {

            this.inappTimeInterval()

          });

        } catch (error) {

          //console.log('erreo1 :', error);

        }
      })
      .catch((error) => {

        console.log('error :', error)


      });
  }
  
  getdate(value) {
    this.setState({
      showpin: false
    });
  }

  renderPINScreen() {
    if (this.state.showpin) {
      return (
        <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'red' }}>
          <PINScreen onPINScreen={this.getdata} />
        </View>
      );
    }
  }

  render() {
    if (this.state.inactive) {
      return (
        <View style={{ flex: 1, }}>
          <RootViewController />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, }} >
        <Image
          source={require('./resource/SplashBg.png')}
          style={{ flex: 1 }} />
      </View>
      
    );
  }
}
