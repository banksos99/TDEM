import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Platform, AsyncStorage } from 'react-native';

import {
  StackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
// import DeviceInfo from 'react-native-device-info';

import RootViewController from './ViewController/NavigationController';
import PINScreen from './ViewController/MHF01310PINScreen';
import firebase from './SharedObject/Firebase';
import registerscreenView from "./ViewController/MHF01210RegisterScreen";

import SavePIN from "./constants/SavePIN"

// var utf8 = require('utf8');
// var binaryToBase64 = require('binaryToBase64');


export default class mainview extends Component {

  savePIN = new SavePIN()

  constructor(props) {
    super(props);
    this.state = {
      inactive: false,
      showpin: false,
    }
  }
  componentDidMount() {
    this.inactivecounting();

    firebase.messaging().getToken().then((token) => {
      console.log('getToken :', token)
      this._onChangeToken(token)
    });

    firebase.messaging().onTokenRefresh((token) => {
      console.log('onTokenRefresh :', token)
      this._onChangeToken(token)
    });
    AsyncStorage.getItem("myKey").then((value) => {

      if (value) {
        console.log('get value :', value)
      } else {
        console.log('save value :', value)
        AsyncStorage.setItem("myKey", '');
      }

    }).done();
  }

  _onChangeToken = (token) => {
    var data = {
      'device_token': token,
      'device_type': Platform.OS,
      // 'device_language': language
    };
    this._loadDeviceInfo(data).done();

  }

  _loadDeviceInfo = async (deviceData) => {
    // load the data in 'local storage'.
    // this value will be used by login and register components.
    var value = JSON.stringify(deviceData);
    try {
      await AsyncStorage.setItem(config.DEVICE_STORAGE_KEY, value);
    } catch (error) {
      console.log(error);
    }

    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      if (value !== null) {
        // We have data!!
        console.log('MySuperStore : ', value);
      } else {
        console.log('MySuperStore : write file');
        try {
          await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
        } catch (error) {
          // Error saving data
          console.log('MySuperStore : error');
        }

      }
    } catch (error) {
      // Error retrieving data
      console.log('MySuperStore :error');
    }
  };

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
      console.log('I do not leak!');
      this.setState({ showpin: false });

    }, 500);

  };

  getdate(value) {
    this.setState({
      showpin: false
    });

  }
  sendData(value) {


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
