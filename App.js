import React, { Component } from 'react';
import { View, Image, Alert, Platform, Text } from 'react-native';

import {
  StackNavigator,
  createSwitchNavigator

} from 'react-navigation';

import SharedPreference from './SharedObject/SharedPreference';

import RootViewController from './ViewController/NavigationController';
import PINScreen from './ViewController/MHF01310PINScreen';
import SavePIN from "./constants/SavePIN";
import DeviceInfo from 'react-native-device-info';

import firebase from 'react-native-firebase';
import Layout from "./SharedObject/Layout";
import UserInactivity from 'react-native-user-inactivity';

import { styles } from "./SharedObject/MainStyles"

export default class mainview extends Component {

  savePIN = new SavePIN()

  constructor(props) {
    super(props);
    this.state = {
      inactive: false,
      showpin: false,
      notiMessage: 0,
      notipayslipID: 0,
      notiTitle: 0,
      notiBody: 0,
      timeWentInactive: false,

    }
  }

  onInactivity = (timeWentInactive) => {
    console.log("onInactivity : ", timeWentInactive)
    this.setState({
      showpin: true
    });
  }

  async componentDidMount() {
    this.notificationListener();
    this.inactivecounting();
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      ////console.log("firebase ==> user has permissions")
    } else {
      try {
        await firebase.messaging().requestPermission();
        ////console.log("firebase ==> User has authorised")
      } catch (error) {
      }
    }

    //////////Device Info/////////////
    const deviceModel = DeviceInfo.getModel();
    const deviceBrand = DeviceInfo.getBrand();
    const deviceOS = DeviceInfo.getSystemName();
    const deviceOSVersion = DeviceInfo.getSystemVersion();
    const appVersion = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();

    await firebase.messaging().getToken()
      .then((token) => {
        ////console.log('firebase ==> message Device FCM Token: ', token);
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

    notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const notification = notificationOpen.notification;
      if (notification._data.type === 'Payroll') {
        SharedPreference.notipayslipID = notification._data.id
      } else if (notification._data.type === 'Emergency Announcement') {
        SharedPreference.notiAnnounceMentID = notification._data.id
      }
    }
  }


  notificationListener() {
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        this.setState({
          notiMessage: 10,
          notiTitle: notification._title,
          notiBody: notification._body
        });

        SharedPreference.notipayslipID = 12
        // SharedPreference.notipayslipID = 10
        if (notification._data.type === 'Payroll') {
          SharedPreference.notipayslipID = notification._data.id
        } else if (notification._data.type === 'Emergency Announcement') {
          SharedPreference.notiAnnounceMentID = notification._data.id
        }
      });

    notificationOpen = firebase.notifications().getInitialNotification();

  }


  inactivecounting() {
    this.timer = setTimeout(() => {
      this.setState({
        inactive: true,
        modalVisible: true
      });
    }, 500);
  }
  cloatlabelnoti() {
    this.timer = setTimeout(() => {
      this.setState({
        notiMessage: 0
      });
    }, 5000);
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

  rendernotificationlabel() {

    if (this.state.notiMessage) {
      this.cloatlabelnoti();
      return (
        <View style={{ width: '100%', height: 120, position: 'absolute', backgroundColor: 'transparent' }}>
          <View style={{ flex: 1, borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', margin: 10 }}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 2 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    style={{ height: 20, width: 20, }}
                    source={require('./resource/SplashBg.png')}
                  /></View>
                <View style={{ flex: 7, justifyContent: 'center' }}><Text>TDEM Connect</Text></View>


              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text>{this.state.notiTitle}</Text>
              </View>
              <View style={{ flex: 2, marginLeft: 10 }}>
                <Text>{this.state.notiBody}</Text>
              </View>
            </View>
            {/* <View style={{ backgroundColor: 'blue', flex: 1 }}></View>
            <View style={{ backgroundColor: 'white', flex: 10 }}>
              <Text>{this.state.notiTitle}</Text>
              <Text>{this.state.notiTitle}</Text>
            </View> */}
          </View>
        </View>
      );
    }
  }

  renderPINScreen() {
    if (this.state.showpin) {
      return (
        <View style={styles.alertDialogContainer}>
          {/* <PINScreen  /> */}
        </View>
      );
    }
  }

  render() {

    const { timeWentInactive } = this.state;

    if (this.state.inactive) {
      return (
        <UserInactivity
          timeForInactivity={500000}
          checkInterval={500000}
          onInactivity={this.onInactivity} >
          <View style={styles.container} >
            <View style={styles.container} >
              <RootViewController
                pushstatus={this.state.notiMessage} />
              {this.rendernotificationlabel()}
            </View>
            {this.renderPINScreen()}
          </View>
        </UserInactivity>

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
