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
    Platform
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import Layout from "./../SharedObject/Layout"
import { styles } from "./../SharedObject/MainStyles"
import Authorization from "./../SharedObject/Authorization";
import inappdata from "./../InAppData/HandbookListData"
import SharedPreference from "./../SharedObject/SharedPreference"
let dataSource = [];
let temphandbookData = [];


class BookCover extends Component {
    constructor(props) {
      super(props);
      this.state = {
        /* Set placeholder URL */
        url: this.props.placeholderUrl
      };
  
    }
  
    updateSource(newUrl){
      console.log("Book updateSource : " + newUrl);
      this.setState(previousState => {
        return { url: Platform.OS === 'android' ? 'file://' + newUrl : '' + newUrl}
      });
    }
  

    refresh() {
      console.log('[BookCover] Refresh');
  
      let dirs = RNFetchBlob.fs.dirs
      let filename = this.props.bookName + '.png'
      let targetFile = dirs.DocumentDir + '/cover/' + filename;
  
      let hasFile = false;
      let FUNCTION_TOKEN =  Authorization.convert(SharedPreference.profileObject.client_id, '1', SharedPreference.profileObject.client_token)
      RNFetchBlob.fs.exists(targetFile)
        .then((exist) => {
          hasFile = exist;
          console.log("======================");
          console.log("Has file : " + hasFile);
          console.log("======================");
          hasFile=false
        //   if (hasFile) {
        //     this.updateSource(targetFile);
        //   } else {
            
            RNFetchBlob
              .config({
                // response data will be saved to this path if it has access right.
                path: targetFile
              })
              //.fetch('GET', 'https://facebook.github.io/react-native/img/header_logo.png', {
                
              .fetch('GET', this.props.coverUrl, {
                //some headers ..
                'Content-Type': 'image/png;base64',
                Authorization: FUNCTION_TOKEN

              })
              .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                
                console.log('load cover TOKEN ', FUNCTION_TOKEN)
                console.log('The file saved to ', res.path())
                this.updateSource(targetFile);
              })
        //   }
  
        })
        .catch(() => {
          console.log('[Error] BookCover ==> Error on DidMounted')
        });
  
    }

    componentDidMount(){
      console.log('[BookCover] componentDidMount');
      this.refresh();
    }
  
    render() {
      return (
        //<Text>Hello {this.props.name}!</Text>
        <Image source={{ uri: this.state.url }}
          style={{ width: '100%', height: '100%' }} />
  
      );
    }
  }

export default class Handbookctivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            temparray: [],
        };

        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));
    }
    checkDataFormat(DataResponse) {

        if (DataResponse) {
            console.log('Handbookctivity DataResponse :',DataResponse)
            // dataSource = DataResponse.data;
            dataSource = DataResponse;
           
        } else {
            console.log('inappdata :',inappdata.dataSource.data.detail)
            dataSource = inappdata.dataSource.data.detail.items;
            
        }

        this.createShelfHandbook();

    }



    

    onDownloadPDFFile() {

        let PAYSLIP_DOWNLOAD_API  = SharedPreference.HOST + dataSource[0].handbook_cover

        console.log('COVER_HANDBOOK : ', PAYSLIP_DOWNLOAD_API)
        pdfPath = PAYSLIP_DOWNLOAD_API

        month = (this.state.initialyear + 1)
        let numberMonth = month
        if (month < 10) {
            numberMonth = "0" + (month + 1)
        } else {
            numberMonth = month + 1
        }

        filename = "Payslip_" + this.state.monthselected + "_" + numberMonth + '.pdf'
        // console.log('PAYSLIP_DOWNLOAD_API : ', PAYSLIP_DOWNLOAD_API)

        if (Platform.OS === 'android') {
            RNFetchBlob
                .config({
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: false,
                        path: RNFetchBlob.fs.dirs.DownloadDir + '/' + filename,
                        mime: 'application/pdf',
                        title: 'appTitle',
                        description: 'shippingForm'
                    }
                })
                .fetch('GET', pdfPath, {
                    'Content-Type': 'application/pdf;base64',
                    Authorization: SharedPreference.TOKEN
                })
                .then((resp) => {
                    console.log("Android ==> LoadPDFFile ==> Load Success  : ", resp);
                    RNFetchBlob.android.actionViewIntent(resp.data, 'application/pdf')
                })
                .catch((errorCode, errorMessage) => {
                    console.log("Android ==> LoadPDFFile ==> Load errorCode  : ", errorCode);
                    Alert.alert(
                        errorCode,
                        errorMessage,
                        [
                            {
                                text: 'Cancel', onPress: () => {
                                    console.log("Android ==> LoadPDFFile ==> Load errorCode  : ", errorCode);

                                }, style: 'cancel'
                            },
                            {
                                text: 'OK', onPress: () => {
                                    this.addEventOnCalendar()
                                }
                            },
                        ],
                        { cancelable: false }
                    )
                })
        } else {//iOS
            console.log("loadPdf pdfPath : ", pdfPath)
            console.log("loadPdf filename : ", filename)
            RNFetchBlob
                .config({
                    fileCache: true,
                    appendExt: 'png',
                    filename: filename
                })
                .fetch('GET', pdfPath, {
                    'Content-Type': 'application/pdf;base64',
                    Authorization: SharedPreference.TOKEN
                })
                .then((resp) => {
                    console.log("WorkingCalendarYear pdf1 : ", resp);
                    console.log("WorkingCalendarYear TOKEN : ", SharedPreference.TOKEN);
                    console.log("WorkingCalendarYear pdf2 : ", resp.path());
                    RNFetchBlob.fs.exists(resp.path())
                        .then((exist) => {
                            console.log(`WorkingCalendarYear ==> file ${exist ? '' : 'not'} exists`)
                        })
                        .catch(() => { console.log('WorkingCalendarYear ==> err while checking') });

                    RNFetchBlob.ios.openDocument(resp.path());
                })
                .catch((errorMessage, statusCode) => {
                    console.log('Error: ' + errorMessage);
                    console.log('Status code: ' + statusCode);
                });
        }
    }

    requestPDFPermission = async () => {
        console.log("requestPDFPermission")
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': "Permission",
                    'message': 'External Storage Permission'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the WRITE_EXTERNAL_STORAGE")

                this.setState({
                    havePermission: true
                })
                this.onDownloadPDFFile()
            } else {
                console.log("WRITE_EXTERNAL_STORAGE permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }
    componentDidMount() {
        //console.log(Layout.window.width);
        // this.fetchData()
    }
    onBack() {
        this.props.navigation.navigate('HomeScreen');
    }
    onDetail(i) {

        this.props.navigation.navigate('HandbookDetail', {
            handbook_file: dataSource[i].handbook_file,
        });
        
    }
    setrowstate() {

        this.setState({ leftside: false });
    }
    fetchData() {
        return fetch('https://randomuser.me/api/?results=5')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({

                    isLoading: false,
                    dataSource: responseJson.results,
                    people: []


                }, function () {

                    people = [];

                    // for (let i = 0; i < 2; i++) {

                    //     // //console.log(this.state.dataSource[i].picture.large);

                    //     people.push({

                    //         cover1: this.state.dataSource[i].picture.large,
                    //         cover2: this.state.dataSource[(i * 2) + 1].picture.large,
                    //         name1: this.state.dataSource[i].name.first,
                    //         name2: this.state.dataSource[(i * 2) + 1].name.first,
                    //     });
                    // }
                    // //console.log(people)

                    // tempannouncementData = [];

                    // const list = this.state.dataSource.map((item, i) => {

                    //     if (i%2) {
                    //         temp = [];

                    //         tempannouncementData.push(item)

                    //     }


                    // });

                    // //console.log(tempannouncementData)
                    tempannouncementData = [];
                    tempdata = [];
                    //console.log( this.state.dataSource.length)

                    // for(){



                    // }
                    this.state.dataSource.map((item, i) => {


                        tempdata.push(item)

                        if (i % 2) {

                            tempannouncementData.push(tempdata)
                            tempdata = [];

                        }



                    });
                    //console.log(tempannouncementData)
                }



                );

            })
            .catch((error) => {
                console.error(error);
            });

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
       // console.log('path : ', SharedPreference.HOST + dataSource[0].handbook_cover)

        // let path = '';

        // RNFetchBlob
        //     .config({
        //         fileCache: true,
        //         appendExt: 'png',

        //     })
        //     .fetch('GET', SharedPreference.HOST + dataSource[0].handbook_cover, {

        //         'Content-Type': 'application/png;base64',
        //         Authorization: SharedPreference.TOKEN
        //     })
        //     .then((res) => {

        //         imageView: <Image source={{ uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }} />


        //     })
    
        // console.log('The file saved to ', this.state.imageView)
             

        return (
            <View style={styles.handbookItem} key={i}>
                <TouchableOpacity style={{ flex: 1 }}
                 //   onPress={(this.onDetail.bind(this))
                        onPress={() => { this.onDetail(i) }}>

                    
                    <View style={{
                        flex: 5,
                    }}
                    >
                        <View style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>

                            <BookCover
                                // ref={bc => { this.bookCover = bc }}
                                placeholderUrl={'https://facebook.github.io/react/logo-og.png'}
                            //    coverUrl={'https://tdemconnect-dev.tdem.toyota-asia.com/api/v1/handbooks/download?file=00021'}
                                coverUrl={SharedPreference.HOST+ dataSource[i].handbook_cover}
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
            <View style={{flex: 1}} >
                
                <View style={[styles.navContainer,{flexDirection: 'column' }]}>
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
                            <Text style={[styles.navTitleTextTop,{fontFamily: "Prompt-Bold"}]}>E-Book</Text>
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