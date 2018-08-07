import React, { Component } from 'react';
import { View, Image, Alert, Platform } from 'react-native';

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
      notiMessage:0
    }
    // SharedPreference.notiAnnounceMentBadge = 150;
  }

  async componentDidMount() {
    // this.notificationListener();
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

    firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_SPLASH)

    notificationOpen = await firebase.notifications().getInitialNotification();

    console.log('notificationOpen : ', notificationOpen)

    if (notificationOpen) {

      const notification = notificationOpen.notification;
      
      if (notification._data.type === 'Payroll') {

        SharedPreference.notipayslipID = notification._data.id

      } else if (notification._data.type === 'Emergency Announcement') {

        SharedPreference.notiAnnounceMentID = notification._data.id

      }
      console.log('notipayslipID : ', SharedPreference.notipayslipID);
    }
  }

  notificationListener() {
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('notification ==> notificationListener : ', notification)
        SharedPreference.notipayslipID = 10
        if (notification._data.type === 'Payroll') {

          SharedPreference.notipayslipID = notification._data.id
  
        } else if (notification._data.type === 'Emergency Announcement') {
  
          SharedPreference.notiAnnounceMentID = notification._data.id
  
        }
      });

    notificationOpen = firebase.notifications().getInitialNotification();
    console.log('notificationOpen : ', notificationOpen)

  }

  componentWillUnmount() {
    // this.notificationListener();
    this.unsubscribeFromNotificationListener();

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

  renderDetailScreen() {
    if (SharedPreference.notipayslipID) {
      return (
        <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'red' }}>
         
        </View>
      );
    }
    else if (SharedPreference.notiAnnounceMentID) {
      return (
        <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'red' }}>
         
        </View>
      );

    }
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
          <RootViewController
            pushstatus={this.state.notiMessage} />
          {/* <View style={{ height: 100, width: '100%', position: 'absolute', }}>
            <View style={{ backgroundColor: 'black', height: '100%', width: '100%', position: 'absolute', opacity: 0.7 }}>
            </View>

          </View> */}
          {this.renderDetailScreen()}
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
