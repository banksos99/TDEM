import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';

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
import Layout from "./SharedObject/Layout";
export default class mainview extends Component {

  savePIN = new SavePIN()

  constructor(props) {
    super(props);
    this.state = {
      inactive: false,
      showpin: false,
    }
    // SharedPreference.notiAnnounceMentBadge = 150;
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

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log('message : ',message)
      // Process your message as required
      // Alert.alert(
      //   'payslip',
      //   message,
      //   [
      //     { text: 'OK', onPress: () => console.log('OK Pressed') },
      //   ],
      //   { cancelable: false }
      // )


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

    firebase.analytics().setCurrentScreen("TDEMCONNECT MAIN")

    ///when open Application
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
       
        console.log('notification : ', notification)
        SharedPreference.notiAnnounceMentBadge = notification._ios._badge;

        // if (notification._data['gcm.notification.type'] === 'Payroll') {

        //   SharedPreference.notipayslipID = notification._data['gcm.notification.id']
  
        // } else if (notification._data['gcm.notification.type'] === 'Emergency Announcement') {
  
        //   SharedPreference.notiAnnounceMentID = notification._data['gcm.notification.id']
  
        // }

        

      });
    
    notificationOpen = await firebase.notifications().getInitialNotification();
    console.log('notificationOpen : ', notificationOpen)

    if (notificationOpen) {

      const notification = notificationOpen.notification;
      
      if (notification._data['gcm.notification.type'] === 'Payroll') {

        SharedPreference.notipayslipID = notification._data['gcm.notification.id']

      } else if (notification._data['gcm.notification.type'] === 'Emergency Announcement') {

        SharedPreference.notiAnnounceMentID = notification._data['gcm.notification.id']

      }
      console.log('notipayslipID : ', SharedPreference.notipayslipID);
    }
  }

  componentWillUnmount() {
    this.notificationListener();
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
    }, 500);
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
        style={{ height: Layout.window.height, width: Layout.window.width, }}
          source={require('./resource/SplashBg.png')}
          resizeMode='contain'
          style={{ flex: 1 }} />
      </View>

    );
  }
}
