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



import type, { Notification, NotificationOpen } from 'react-native-firebase';

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


    console.log('this.props.navigation',this.props.navigation)
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

    ///when open Application
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        ///when open Application
        console.log("notificationListener : ", notification)
        console.log("notificationListener data : ", notification.data)
        console.log("notificationListener _data : ", notification._data)
        // If you want to see notification on mobile
        // firebase.notifications().displayNotification(this.notification2)
        console.log(`Recieved notification 2`);

        SharedPreference.notipayslipID = notification._data.payslipID

        // Alert.alert(
        //   'notificationListener',
        //   notification._data.payslipID,
        //   [
        //     { text: 'OK', onPress: () => console.log('OK Pressed') },
        //   ],
        //   { cancelable: false }
        // )
      });


    // this.notification2 = new firebase.notifications.Notification()
    //   .setNotificationId('notificationId')
    //   .setTitle('My notification title')
    //   .setBody('My notification body')
    //   .android.setChannelId('test')
    //   .android.setClickAction('action')
    //   .setData({
    //     key1: 'value1',
    //     key2: 'value2',
    //   });


    notificationOpen = await firebase.notifications().getInitialNotification();
    
    if (notificationOpen) {

      //When App Close and user touch 
      console.log("push notification ==> notificationOpen ", notificationOpen)

      // Get information about the notification that was opened
      const notification = notificationOpen.notification;
      console.log("push notification ==> notification ", notification)
      console.log("notificationListener data : ", notification.data)
      console.log("notificationListener _data : ", notification._data)

      SharedPreference.notipayslipID = notification._data.payslipID

      SharedPreference.notipayAnnounceMentID = notification._data.AnnouncementID
      // Alert.alert(
      //   'notificationOpen',
      //   notification._data.payslipID,
      //   [
      //     { text: 'OK', onPress: () => console.log('OK Pressed') },
      //   ],
      //   { cancelable: false }
      // )
    }
  }
  componentWillUnmount() {
    console.log("componentWillUnmount")
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

  // toggleModal(visible) {
  //   this.timer = setTimeout(() => {
  //     this.setState({ showpin: false });
  //   }, 500);
  // };

  

  

  
  
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
