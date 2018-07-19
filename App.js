import React, { Component } from 'react';
import { View, Image } from 'react-native';

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
    this.inactivecounting();

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


    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
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
    console.log("appVersion : ", appVersion)

    const buildNumber = DeviceInfo.getBuildNumber();
    console.log("buildNumber : ", buildNumber)


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

    ////////////////////////
    // firebase.notifications().getInitialNotification
    // firebase.notifications.Notification()

    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   console.log("firebase ==> 1 Process your message as required : ", message)
    // });

    // firebase.messaging().onMessage((message) => {
    //   console.log("firebase ==> 2 Process your message as required : ", message)
    // });


    // firebase.messaging().onMessage(message => {
    //   console.log('firebase ==> message onMessage: ', message);
    // })

    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   console.log("firebase ==> message messageListener : ", message)
    // });

    // this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
    //   console.log("firebase ==> Process your notification as required")
    //   console.log("firebase ==> ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.")
    // });
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    //   console.log("firebase ==> Process your notification as required")
    // });

    // const notificationOpen = await firebase.notifications().getInitialNotification();
    // if (notificationOpen) {
    //   const action = notificationOpen.action;
    //   console.log("firebase ==> action : ", action)
    //   const notification = notificationOpen.notification;
    //   console.log("firebase ==> notification : ", notification)
    // }

    // firebase.messaging().onMessage((message) => {
    //   // Process your message as required
    //   console.log("firebase ==> messageListener ==> ", message)
    // });


    firebase.messaging().onMessage(payload => {
      console.log('Opened when app is alive');
      console.log("payload ", payload);

      const prefix = Platform.OS == 'android' ? 'ifimarketplace://ifimarketplace/' : 'ifimarketplace://'
      const url = `${prefix}tabs/messages/${payload.key}`;
      console.log("url ", url);
    });

  }




  componentWillReceiveProps(nextProps) {

    if (nextProps.fromPushnoti) {
      // alert('app did become active from pushnoti');

    } else if (nextProps.appDidBecomeActive) {
      // alert('app did become active');
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    this.messageListener();
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

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
    }, 5000);
  }

  toggleModal(visible) {
    this.timer = setTimeout(() => {
      this.setState({ showpin: false });
    }, 500);
  };

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
