import React, { Component } from 'react';
import RNFetchBlob from 'react-native-fetch-blob'
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
    Platform,
    BackHandler
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import Layout from "./../SharedObject/Layout"
import { styles } from "./../SharedObject/MainStyles"
import Authorization from "./../SharedObject/Authorization";
import inappdata from "./../InAppData/HandbookListData"
import SharedPreference from "./../SharedObject/SharedPreference"
import StringText from '../SharedObject/StringText';
import firebase from 'react-native-firebase';

let dataSource = [];
let temphandbookData = [];
let FUNCTION_TOKEN;

class BookCover extends Component {
    constructor(props) {
        super(props);
        this.terminated = false;
        this.state = {
            url: this.props.placeholderUrl
        };
    }


    updateSource(newUrl) {
        //console.log("Book updateSource : " + newUrl);

        if (this.terminated) {
            return;
        }

        this.setState(previousState => {
            return { url: Platform.OS === 'android' ? 'file://' + newUrl : '' + newUrl }
        });
    }


    refresh() {
        //console.log('[BookCover] Refresh');

        let dirs = RNFetchBlob.fs.dirs
        let filename = this.props.bookName + '.png'
        let targetFile = dirs.DocumentDir + '/cover/' + filename;

        let hasFile = false;

        RNFetchBlob.fs.exists(targetFile)
            .then((exist) => {
                hasFile = exist;
                //console.log("======================");
                //console.log("Has file : " + hasFile);
                //console.log("======================");
                //console.log("======================");

                hasFile = false
                //   if (hasFile) {
                //     this.updateSource(targetFile);
                //   } else {

                this.task = RNFetchBlob
                    .config({
                        fileCache: true,
                        // response data will be saved to this path if it has access right.
                        path: targetFile
                    })
                    //.fetch('GET', 'https://facebook.github.io/react-native/img/header_logo.png', {

                    .fetch('GET', this.props.coverUrl, {
                        //some headers ..
                        'Content-Type': 'image/png;base64',
                        Authorization: FUNCTION_TOKEN

                    });
                this.task.then((res) => {
                    // the path should be dirs.DocumentDir + 'path-to-file.anything'

                    //console.log('load cover TOKEN ', FUNCTION_TOKEN)
                    //console.log('The file saved to ', res.path())
                    if (this.terminated) {
                        return;
                    }
                    this.updateSource(targetFile);
                }).catch((err) => {
                    // scan file error
                    //console.log('[BookCover] Catch Error', err);
                });
                //   }

            })
            .catch(() => {
                //console.log('[Error] BookCover ==> Error on DidMounted')
            });

    }

    componentDidMount() {
        //console.log('[BookCover] componentDidMount');
        this.refresh();
    }

    componentWillUnmount() {
        this.terminated = true;
        this.task.cancel();
    }

    render() {
        return (
            <Image source={{ uri: this.state.url }}
                style={{ width: '100%', height: '100%' }} />

        );
    }
}

export default class Handbookctivity extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            temparray: [],
        };

        this.updateToken()
        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));
        firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_HANDBOOK_LIST)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    handleBackButtonClick() {
        this.onBack()
        return true;
    }


    updateToken() {
        FUNCTION_TOKEN = Authorization.convert(SharedPreference.profileObject.client_id, 1, SharedPreference.profileObject.client_token)
        //console.log('[Handbookctivity] FUNCTION_TOKEN :', FUNCTION_TOKEN)
    }

    checkDataFormat(DataResponse) {
        
        if (dataSource.length == 0) {

            if (DataResponse) {

                //console.log('Handbookctivity DataResponse :', DataResponse)
                // dataSource = DataResponse.data;
                dataSource = DataResponse;

            } else {
                //console.log('inappdata :', inappdata.dataSource.data.detail)
                dataSource = inappdata.dataSource.data.detail.items;

            }
console.log('dataSource :', dataSource)
            this.createShelfHandbook();
        }
    }


    onBack() {
        this.props.navigation.navigate('HomeScreen');
    }

    onDetail(i) {

        this.props.navigation.navigate('HandbookDetail', {
            handbook_file: dataSource[i].handbook_file,
            FUNCTION_TOKEN: FUNCTION_TOKEN,
        });

    }
    setrowstate() {

        this.setState({ leftside: false });
    }

    createShelfHandbook() {

        temphandbookData = [];

        dataSource.map((item, i) => {


            this.state.temparray.push(

                this.createcomponent(i)

            )

            if (i % 2) {

                temphandbookData.push(

                    <View style={{ flex: 1, flexDirection: 'row' }} key={i}>
                        {this.state.temparray}
                    </View>

                )

                this.state.temparray = []

            } else if (i === dataSource.length - 1) {

                temphandbookData.push(

                    <View style={{ flex: 1, flexDirection: 'row' }} key={i + 100}>
                        {this.state.temparray}
                    </View>

                )

                this.state.temparray = []

            }

        });
    }


    createcomponent(i) {

        return (
            <View style={styles.handbookItem} key={i}>
                <TouchableOpacity style={{ flex: 1 }}
                    //   onPress={(this.onDetail.bind(this))
                    onPress={() => { this.onDetail(i) }}>
                    <View style={{ flex: 5, }}>
                        <View style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>

                            <BookCover
                                placeholderUrl={'https://facebook.github.io/react/logo-og.png'}
                                coverUrl={SharedPreference.HOST + dataSource[i].handbook_cover}
                                bookName={new Date().getTime()}
                            />

                        </View>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={styles.epubbookname}>{dataSource[i].handbook_title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
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
                            <Text style={[styles.navTitleTextTop, { fontFamily: "Prompt-Regular" }]}>E-Book</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column', }}>
                        {/* <View style={{ flex: 1 }}> </View> */}
                        <View style={{ flex: 10 }}>
                            <ScrollView>
                                {
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        {temphandbookData}
                                    </View>

                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}