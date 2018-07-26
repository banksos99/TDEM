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
    Alert,
    ActivityIndicator
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import Layout from "./../SharedObject/Layout"
import { styles } from "./../SharedObject/MainStyles"

import orgdata from './../InAppData/OrgstructerData.json';
import SharedPreference from "./../SharedObject/SharedPreference"
import RestAPI from "../constants/RestAPI"

let dataSource = [];
let temphandbookData = [];
let option = 0;
let org_code = '';

export default class OrganizationStruct extends Component {

    constructor(props) {
        super(props);
        this.state = {
         

        }

        this.checkoption(this.props.navigation.getParam("Option", ""));

        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));
      
    }
    checkoption(data) {
        if (data) {
            option = data
        }
        console.log('option :', option)
    }
    checkDataFormat(DataResponse) {

        if (DataResponse) {

            console.log('org DataResponse :', DataResponse.org_code)
            org_code =DataResponse.org_code
            console.log('org_code :', org_code)
            dataSource = [];
            //console.log(DataResponse[0].data)
            // dataSource = DataResponse.org_lst;
            // DataResponse.org_emp.map((item) => (

            dataSource.push({

                org_code: DataResponse.org_code,
                org_name: DataResponse.org_name,
                org_level: DataResponse.org_level,
                next_level: 'true',
                expand: 0,
            })
            // dataSource.push({

            //     org_code: DataResponse.org_code,
            //     org_name: DataResponse.org_name,
            //     org_level: parseInt(DataResponse.org_level) + 10,
            //     next_level: 'false',
            //     expand: 0,
            // })
            // //     ))
            // DataResponse.org_lst.map((item) => (
            //     dataSource.push({
            //         org_code: item.org_code,
            //         org_name: item.org_name,
            //         org_level: item.org_level,
            //         next_level: item.next_level,
            //         expand: 0,
            //     }

            //     ))
            // )

           
        } else {

            console.log('orgdata : ', orgdata)

        }
    }

    componentDidMount() {
        //console.log(Layout.window.width);
        // this.fetchData()
    }

    onBack() {

        this.props.navigation.navigate('HomeScreen');
    }

    onOrgStruct(item, index) {

        console.log('item :', item)

        if (item.org_code == 0) {

            // *** select emp info detail
            console.log('load empinfo  :', item.emp_id)
            this.setState({

                isscreenloading: true,
                loadingtype: 3,
                org_code: item.emp_id,
                org_name: item.org_name,

            }, function () {
                console.log('option :', option)
                if (option == 1) {

                    this.loadOTBarChartfromAPI()

                } else if (option == 2) {

                    this.loadOTLineChartfromAPI()

                }


            });

        } else {


            if (item.next_level === 'true') {

                if (item.expand === 0) {
                    // *** select expand
                    console.log('expand  :')
                    this.setState({

                        isscreenloading: true,
                        loadingtype: 3,
                        org_code: item.org_code,
                        org_name: item.org_name,
                        index_org_code: index

                    }, function () {
                        this.loadOrgStructureAPI()
                    });

                } else {
                    // *** select collapse   

                    console.log('dataSource : ', dataSource)
                    console.log('index : ', index)
                    console.log('org_level : ', item.org_level)

                    this.setState({

                        isscreenloading: true,
                        loadingtype: 3,
                        org_code: item.org_code,
                        index_org_code: index

                    });
                    let temparr = []
                    let statuscol = 1;
                    // let org_level = 0;

                    for (let i = 0; i < dataSource.length; i++) {

                        if (statuscol == 0) {
                            console.log('dataSource[i].org_level : ' + dataSource[i].org_level + ':' + item.org_level)

                            console.log('     ******    ')
                            if (parseInt(item.org_level) >= parseInt(dataSource[i].org_level)) {

                                statuscol = 1;
                            }
                        }

                        if (i === index) {
                            statuscol = 0;
                            //  org_level =  dataSource[i].org_level;
                            temparr.push({
                                org_code: dataSource[i].org_code,
                                org_name: dataSource[i].org_name,
                                org_level: dataSource[i].org_level,
                                next_level: dataSource[i].next_level,
                                expand: 0

                            })
                            console.log('select org_code : ', dataSource[i].org_code)
                            i = i + dataSource[i].expand;

                        } else if (statuscol == 0) {
                            console.log('collapse org_code : ', dataSource[i].org_code, ' : ', dataSource[i].org_level)


                        } else {
                            console.log('exist org_code : ', dataSource[i].org_code)
                            temparr.push(
                                dataSource[i]
                            )

                        }

                    }
                    dataSource = temparr;
                    console.log('dataSource : ', dataSource)
                    this.setState({
                        isscreenloading: false,
                    })
                }

            } else {
                // *** select employee list
                console.log('load empinfo  :', item)
                

                this.setState({

                    isscreenloading: true,
                    loadingtype: 3,
                    org_code: item.org_code,
                    org_name: item.org_name,

                }, function () {
                    console.log('option :', option)
                    if (option == 1){
                        this.loadOTBarChartfromAPI()
                        
                    }else if(option == 2){
    
                        this.loadOTLineChartfromAPI()
                    }
                });


            }
        }




    }


    loadOrgStructureAPI = async () => {

        let url = SharedPreference.ORGANIZ_STRUCTURE_API + this.state.org_code

        this.APICallback(await RestAPI(url))

    }

    APICallback(data) {

        console.log('APICallback : ',data)

        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {

            console.log('data.data :', data.data)
            if (data.data.org_lst) {
                let temparr = []
                for (let i = 0; i < dataSource.length; i++) {

                    if (i === this.state.index_org_code) {

                        temparr.push({
                            org_code: dataSource[i].org_code,
                            org_name: dataSource[i].org_name,
                            org_level: dataSource[i].org_level,
                            next_level: dataSource[i].next_level,
                            expand: data.data.org_lst.length,

                        })

                        // data.data.org_emp.map((item) => (
                        temparr.push(
                            {
                                org_code: this.state.org_code,
                                org_name: this.state.org_name,
                                org_level: parseInt(dataSource[i].org_level) + 10,
                                next_level: 'false',
                                //    emp_id: item.employee_id,
                                expand: 0,

                            }
                        )

                        // ))

                        data.data.org_lst.map((item) => (
                            temparr.push(
                                {
                                    org_code: item.org_code,
                                    org_name: item.org_name,
                                    org_level: item.org_level,
                                    next_level: item.next_level,
                                    expand: 0

                                }
                            )

                        ))
                    } else {
                        temparr.push(
                            dataSource[i]
                        )

                    }

                }
                dataSource = temparr;
                console.log('dataSource :', dataSource)

            } else {

                Alert.alert(
                    'No Data',
                    'No data found',
                    [{
                        text: 'OK', onPress: () => {
                            console.log("onLoadErrorAlertDialog")
                        }
                    }],
                    { cancelable: false }
                )
            }

        } else {
            this.onLoadErrorAlertDialog(data)
        }

        this.setState({

            isscreenloading: false,

        })
    }

    
    loadOTLineChartfromAPI = async () => {

        let url = SharedPreference.OTSUMMARY_LINE_CHART + this.state.org_code
        
        this.APIDetailCallback(await RestAPI(url), 'OTLineChartView')

    }

    loadOTBarChartfromAPI = async () => {

        let today = new Date();

        let url = SharedPreference.OTSUMMARY_BAR_CHART + this.state.org_code + '&month=0' + parseInt(today.getMonth() + 1) + '&year=' + today.getFullYear()
        console.log('url  :', url)
        this.APIDetailCallback(await RestAPI(url), 'OTBarChartView')

    }


    APIDetailCallback(data,path) {
        console.log('data  :', data)
        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {

            this.props.navigation.navigate(path, {
                DataResponse: data.data,
                org_name:this.state.org_name,
                org_code:this.state.org_code
            });

        } else {
            
            this.onLoadErrorAlertDialog(data)
        }

        this.setState({
            isscreenloading: false,
        })
    }


    onLoadErrorAlertDialog(error) {

        this.setState({
            isscreenloading: false,
        })
        if (this.state.isConnected) {
            Alert.alert(
                'MHF00001ACRI',
                'Cannot connect to server. Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => console.log('OK Pressed')
                }],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'MHF00002ACRI',
                'System Error (API). Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => {
                        console.log("onLoadErrorAlertDialog")
                    }
                }],
                { cancelable: false }
            )
        }
        console.log("error : ", error)
    }
    renderloadingscreen() {

        if (this.state.isscreenloading) {

            return (
                <View style={{ height: '100%', width: '100%', position: 'absolute', }}>
                    <View style={{ backgroundColor: 'black', height: '100%', width: '100%', position: 'absolute', opacity: 0.7 }}>

                    </View>
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                        <ActivityIndicator />
                    </View>
                </View>
            )
        }

    }
    render() {
        return (
            <View style={{ flex: 1 }} >

                <View style={[styles.navContainer, { flexDirection: 'column' }]}>
                    <View style={styles.statusbarcontainer} />
                    <View style={{ height: 50, flexDirection: 'row', }}>

                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <View style={{ width: '100%', justifyContent: 'center', position: 'absolute', }}>
                                <Text style={styles.navTitleTextTop}>Organization Structure</Text>
                            </View>
                            <TouchableOpacity
                                onPress={(this.onBack.bind(this))}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('./../resource/images/Back.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>

                        {/* <View style={{ flex: 1, }}>
                        </View> */}
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column', }}>
                        {/* <View style={{ flex: 1 }}> </View> */}
                        <View style={{ flex: 10 }}>
                            <ScrollView>
                                {
                                    dataSource.map((item, index) => (
                                        <View style={{ height: 50 }} key={'m' + index}

                                        >
                                            <TouchableOpacity
                                                onPress={() => { this.onOrgStruct(item, index) }}
                                            >
                                                <View style={{ height: 49, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                                        <View style={{ flex: 1, justifyContent: 'center' }} >
                                                            <Text style={item.expand === 0 ?
                                                                { marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.grayTextColor, fontFamily: 'Prompt-Regular' } :
                                                                { marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.redTextColor, fontFamily: 'Prompt-Regular' }}

                                                            >{item.org_name}</Text>
                                                        </View>
                                                        <View style={item.org_code === 0 ? { height: 20, justifyContent: 'center' } : { height: 0, justifyContent: 'center' }} >
                                                            <Text style={{ marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.grayTextColor, fontFamily: 'Prompt-Regular', fontSize: 10 }}
                                                            >{item.position}</Text>
                                                        </View>
                                                    </View>
                                                    <Image

                                                        style={item.next_level === 'false' ? { height: 0, width: 0 } : { height: 40, width: 40 }}
                                                        source={item.expand === 0 ?
                                                            require('./../resource/images/Expand.png') :
                                                            require('./../resource/images/Collapse.png')}
                                                    // resizeMode='cover'
                                                    />


                                                </View>
                                                <View style={{ height: 1, backgroundColor: 'lightgray', justifyContent: 'flex-end' }} />
                                            </TouchableOpacity>
                                        </View>

                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
                {this.renderloadingscreen()}
            </View >
        );
    }
}