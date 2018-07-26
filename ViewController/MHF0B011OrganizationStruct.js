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
import { styles } from "./../SharedObject/MainStyles"

import orgdata from './../InAppData/OrgstructerData.json';
import SharedPreference from "./../SharedObject/SharedPreference"
import RestAPI from "../constants/RestAPI"

let dataSource = [];
let option=0;
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

        if(DataResponse){
            dataSource = [];
            //console.log(DataResponse[0].data)
            // dataSource = DataResponse.org_lst;
            org_code =DataResponse.org_code
            console.log('org_code :', org_code)
            console.log('DataResponse :', DataResponse)

            dataSource.push({
                    
                org_code:DataResponse.org_code,
                org_name:DataResponse.org_name,
                org_level:DataResponse.org_level,
                next_level:'true',
                expand:0,
                }

            )


            // DataResponse.org_emp.map((item) => (
                
            //     dataSource.push({
                    
            //         org_code:0,
            //         org_name:item.employee_name,
            //         org_level:20,
            //         next_level:'false',
            //         emp_id:item.employee_id,
            //         position:item.employee_position,
            //         expand:0,
            //         }
    
            //     )))
            // DataResponse.org_lst.map((item) => (
            // dataSource.push({
            //     org_code:item.org_code,
            //     org_name:item.org_name,
            //     org_level:item.org_level,
            //     next_level:item.next_level,
            //     expand:0,
            //     }

            //     )))

            /*let temparr = [];
            for(let i=0 ; i<dataSource.length;i++){
                if (dataSource[i].emp_id ==  ) {
                    temparr.push({

                    
                    })
                }
                

            }*/
            

            
            console.log('dataSource :',dataSource)
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

    onClickOrgStruct(item, index) {

        console.log('item :',item)

        if (item.org_code == 0) {

            // *** select emp info detail
            console.log('load empinfo  :',item.emp_id)
            this.setState({

                isscreenloading: true,
                loadingtype: 3,
                org_code: item.emp_id,
                employee_name: item.org_name,
                employee_position: item.position

            }, function () {

                this.loadOrgStructureDetailAPI()
            });

        } else {

            if (item.next_level === 'true') {

                if (item.expand === 0) {
                    // *** select expand
                    this.setState({

                        isscreenloading: true,
                        loadingtype: 3,
                        org_code: item.org_code,
                        index_org_code: index

                    }, function () {
                        this.loadOrgStructureAPI()
                    });

                } else {
                    // *** select collapse   

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

                        if(statuscol == 0){

                            if(parseInt(item.org_level)  >= parseInt(dataSource[i].org_level)){

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

                            i = i + dataSource[i].expand;

                        } else if (statuscol == 0) {

                        } else {

                            temparr.push(
                                dataSource[i]
                            )

                        }

                    }
                    dataSource = temparr;

                    this.setState({
                        isscreenloading: false,
                    })
                }

            } else {
                // *** select employee list
                this.setState({

                    isscreenloading: true,
                    loadingtype: 3,
                    org_code: item.org_code,

                }, function () {

                    this.loadEmployeeListAPI()
                });


            }
        }
    }



    loadOrgStructureAPI = async () => {

        let url = SharedPreference.ORGANIZ_STRUCTURE_API + this.state.org_code
        
        this.APICallback(await RestAPI(url))

    }

    APICallback(data) {

        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {
            console.log('data.data.org_lst2 :', data.data.org_lst)
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

                        data.data.org_emp.map((item) => (
                            temparr.push(
                                {
                                    org_code: 0,
                                    org_name: item.employee_name,
                                    org_level: parseInt(dataSource[i].org_level) + 10,
                                    next_level: 'false',
                                    emp_id: item.employee_id,
                                    position: item.employee_position,
                                    expand: 0,

                                }
                            )

                        ))

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

    loadEmployeeListAPI = async () => {

        let url = SharedPreference.ORGANIZ_STRUCTURE_API + this.state.org_code
        console.log('url  :',url)
        this.APIEmpCallback(await RestAPI(url))

    }
    loadOrgStructureDetailAPI = async () => {

        let url = SharedPreference.EMP_INFO_MANAGER_API + this.state.org_code

        if (option == 2) {
            let today = new Date();
            url = SharedPreference.CLOCK_IN_OUT_MANAGER_API + this.state.org_code + '&month=0' + parseInt(today.getMonth() + 1) + '&year=' + today.getFullYear()

        }

        console.log('url : ', url)
        this.APIDetailCallback(await RestAPI(url))

    }
    APIEmpCallback(data) {

        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {
            console.log('data.data.org_lst :', data.data)
            this.props.navigation.navigate('EmployeeList', {
                DataResponse: data,
                Option:option
            });

        } else {
            this.onLoadErrorAlertDialog(data)
        }
        this.setState({

            isscreenloading: false,

        })

      
    }
    APIDetailCallback(data) {

        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {
            console.log('data.data.org_lst1 :', data)
            if (option == 2) {
                this.props.navigation.navigate('ClockInOutSelfView', {
                    DataResponse: data,
                    manager: 1,
                    previous:1,
                    employee_name: this.state.employee_name,
                    employee_position: this.state.employee_position,
                    Option:option
                });

            } else if (option == 1) {

                this.props.navigation.navigate('EmployeeInfoDetail', {
                    DataResponse: data.data,
                    manager: 1,
                    previous:1,
                    Option:option
                });
            }


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
        } else if(error.code == 404){

            Alert.alert(
                'MSTD0059AERR',
                'No data found',
                [{
                    text: 'OK', onPress: () => {
                        console.log("onLoadErrorAlertDialog")
                    }
                }],
                { cancelable: false }
            )

        }else{
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
            <View style={{flex: 1}} >
                
                <View style={[styles.navContainer,{flexDirection: 'column' }]}>
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
                                                onPress={() => { this.onClickOrgStruct(item, index) }}
                                            >
                                                <View style={{ height: 49, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                                        <View style={{ flex: 1, justifyContent: 'center' }} >
                                                            <Text style={item.expand === 0 ?
                                                                { marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.grayTextColor, fontFamily: 'Prompt-Regular' } :
                                                                { marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.redTextColor, fontFamily: 'Prompt-Regular' }}

                                                            >{item.org_name}</Text>
                                                        </View>
                                                        <View style={item.org_code === 0 ? {height: 20, justifyContent: 'center' }:{height: 0, justifyContent: 'center' }} >
                                                            <Text style={{marginLeft: (parseInt(item.org_level) ) * 2, color: Colors.grayTextColor, fontFamily: 'Prompt-Regular',fontSize:10}}
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