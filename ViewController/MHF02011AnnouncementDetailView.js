import React, { Component } from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    Button,
    TouchableOpacity,
    Image, Picker, WebView,
    FlatList,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';

import { styles } from "./../SharedObject/MainStyles"
import SharedPreference from "./../SharedObject/SharedPreference"


export default class PaySlipActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));

    }

    checkDataFormat(DataResponse) {
        console.log('DataResponse : ', DataResponse)
        if (DataResponse) {


        }


    }
    onBack() {

        SharedPreference.notipayAnnounceMentID = 0

        this.props.navigation.navigate('HomeScreen');

    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <View style={[styles.navContainer, { flexDirection: 'column' }]}>
                    <View style={styles.statusbarcontainer} />
                    <View style={{ height: 50, flexDirection: 'row', }}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <TouchableOpacity onPress={(this.onBack.bind(this))}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('./../resource/images/Back.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.navTitleTextTop}>Announcement detail</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                        </View>
                    </View>
                </View>
                {/* <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                <ActivityIndicator />
            </View> */}
                <WebView
                    source={{ uri: 'https://github.com/facebook/react-native' }}
                    style={{ marginTop: 0 }}
                />
            </View >

        );
    }
}