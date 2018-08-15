import React, { Component } from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    BackHandler, NetInfo
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"
// import { MonoText } from '../../components/StyledText';
// import  DataResponse  from "../../InAppData/Payslipdatalist"
import PayslipDataDetail from "./../InAppData/Payslipdatadetail2"
// import api from "../../constants/APIService"
import SharedPreference from "./../SharedObject/SharedPreference"
import Dcryptfun from "./../SharedObject/Decryptfun"
import Authorization from '../SharedObject/Authorization'
import StringText from '../SharedObject/StringText';
import Month from "../constants/Month"
import firebase from 'react-native-firebase';

let monthlistdata = [];
let yearlistdata = [];
let payslipItems = [];
let dataSource = [];

let initialyear = 0;

let temparray = [];
let currentmonth = new Date().getMonth();
let monthdictionary = {};
let offine = 0;
let pay_date_str = 0;
let indexselectyear = 0;

export default class PaySlipActivity extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state = {
            isscreenloading: false,
            loadingtype: 0,
            isFetching: false,

            expand: false,

            updatedHeight: 50,
            dataSource: [],
            selectYearArray: [2000, 2000, 2000],
            DataResponse:this.props.navigation.getParam("DataResponse", "")
        };

       // firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_PAYSLIP_LIST)
    }

    componentDidMount() {
  
        if (this.state.DataResponse) {

            dataSource = this.state.DataResponse;

            for (let i = 0; i < this.state.DataResponse.years.length; i++) {

                yearnumber = this.state.DataResponse.years[i].year;

                if (this.state.DataResponse.years[i].detail) {
                    for (let j = this.state.DataResponse.years[i].detail.length - 1; j >= 0; j--) {

                        if (i == 0 && j == 0) {

                            initialyear = yearnumber;

                        }

                        monthlistdata.push({
                            year: this.state.DataResponse.years[i].year,
                            month: this.state.DataResponse.years[i].detail[j].month_no,
                            id: this.state.DataResponse.years[i].detail[j].payroll_id

                        })
                    }
                }

                yearlistdata.push({
                    monthlistdata

                })
                monthlistdata = [];
            }

            this.setState({

                isFetching: false,

                // loadingviewheight: 0,

            });


        }

        this.createPayslipItem();
    }

    

        // //console.log(Layout.window.width);
        // this.fetchData()


   // }

    async componentWillMount() {
        await this.getArrayOfYear()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);

    }
    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    };
    handleBackButtonClick() {
        this.onBack()
        return true;
    }


    getArrayOfYear() {
        var currentYear = new Date().getFullYear()
        selectYearArray = []

        for (let index = 0; index < 3; index++) {
            let year = (currentYear - index)
            selectYearArray.push(year)
        }

        this.setState({
            selectYearArray: selectYearArray,
        })

        //console.log("getArrayOfYear ==> selectYearArray : ", this.state.selectYearArray)

    }


    createcomponent(i) {

        let havedata;

        if (dataSource.years) {

            if (dataSource.years[indexselectyear].detail) {

                for (let j = 0; j < dataSource.years[indexselectyear].detail.length; j++) {

                    if (dataSource.years[indexselectyear].detail[j].month_no === i + 1) {

                        havedata = dataSource.years[indexselectyear].detail[j]
                        break

                    }

                }
                if (i > currentmonth && indexselectyear == 0) {

                } else if (havedata) {

                    let netsalary = 0;
                    let pay_date;

                    if (havedata.net_salary) {
                        netsalary = Dcryptfun.decrypt(havedata.net_salary)
                    }


                    if (havedata.pay_date) {

                        teatlist = havedata.pay_date.split('-')

                        pay_date = teatlist[2] + ' ' + Month.monthNamesShort[teatlist[1] - 1] + ' ' + teatlist[0]

                    }

                    return (

                        //have data
                        <View style={i === currentmonth && indexselectyear === 0 ?
                            styles.payslipitemlast :
                            i > currentmonth && indexselectyear === 0 ? styles.payslipitemdisable : styles.payslipitem} key={i}>
                            <TouchableOpacity style={{ width: '100%',height:'100%' }}
                                onPress={() => { this.onDetail(indexselectyear, i) }}
                            >

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {Month.monthNamesShort[i]}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipincome}>
                                        {(netsalary)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {pay_date}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }

                let net = '0.00';

                if (currentmonth < i && indexselectyear === 0) {

                    net = '';

                    return (
                        <View style={i === currentmonth && indexselectyear === 0 ?
                            styles.payslipitemlast :
                            styles.payslipitemdisable}
                            key={i}>


                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{Month.monthNamesShort[i]}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{net}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                            </View>

                        </View>
                    );


                }
                return (
                    <View style={i === currentmonth && indexselectyear === 0 ?
                        styles.payslipitemlast :
                        styles.payslipitemdisable}
                        key={i}>
                        <TouchableOpacity style={{ width: '100%',height:'100%' }}
                            onPress={() => { this.onNoDataDetail(indexselectyear, i) }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{Month.monthNamesShort[i]}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={i === currentmonth && indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{net}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                            </View>
                        </TouchableOpacity>
                    </View>
                );

            }
        }

        return (
            <View style={i === currentmonth && indexselectyear === 0 ?
                styles.payslipitemlast :
                styles.payslipitemdisable}
                key={i}>
                <TouchableOpacity style={{ width: '100%',height:'100%' }}
                    onPress={() => {
                        this.onLoadAlertDialog()
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={i > currentmonth && indexselectyear === 0 ?
                            styles.payslipitemdetailHide :
                            i === currentmonth && indexselectyear === 0 ?
                                styles.payslipitemcurrentdetail : styles.payslipitemdetail}>
                            {Month.monthNamesShort[i]}
                        </Text>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={i > currentmonth && indexselectyear === 0 ?
                            styles.payslipitemdetailHide :
                            i === currentmonth && indexselectyear === 0 ?
                                styles.payslipitemcurrentdetail : styles.payslipitemdetail}>
                            0.00
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                    </View>
                </TouchableOpacity>
            </View>
        )

    }

    onLoadAlertDialog() {
        // ////console.log("onLoadAlertDialog")
        Alert.alert(
            StringText.ALERT_NONPAYROLL_NODATA_TITLE,
            StringText.ALERT_NONPAYROLL_NODATA_TITLE,
            [{
                text: StringText.ALERT_NONPAYROLL_NODATA_BUTTON, onPress: () => {
                    // ////console.log("onLoadAlertDialog")
                }
            },
            ],
            { cancelable: false }
        )
    }

    createPayslipItem() {

        payslipItems = [];

        for (let i = 0; i < 12; i++) {

            temparray.push(

                this.createcomponent(i)

            )
            if (i % 3 === 2) {

                payslipItems.push(

                    <View style={{ flex: 1, flexDirection: 'row' }} key={i}>
                        {temparray}
                    </View>

                )

                temparray = []
            }
        }
    }


    expand_collapse_Function = () => {

        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (this.state.expand == false) {

            this.setState({

                expand: true,
                updatedHeight: 250

            });

        }
        else {
            this.setState({

                expand: false,
                updatedHeight: 50

            });
        }
    }

    onBack() {
        // this.props.navigator.pop();

       this.props.navigation.navigate('HomeScreen');
      // this.props.navigation.pop();
    }
    onNoDataDetail(year, index) {
        Alert.alert(
            'no data',
            'no data',
            [
                {
                    text: 'OK', onPress: () => {
                        //console.log('OK Pressed') },
                    }
                }
            ],
            { cancelable: false }
        )


    }
    onDetail(year, index) {

        // pay_date_str = dataSource.years[this.state.indexselectyear].detail[index].pay_date;

        //console.log('detail', pay_date_str)

        this.setState({

            isscreenloading: true,
            loadingtype: 3

        }, function () {
            // //console.log(this.state.indexselectyear)
            // this.setState(this.renderloadingscreen())

            this.getPayslipDetailfromAPI(year, index)

        });

        // this.props.navigation.navigate('PaySlipDetail');

    }

    onCurrentYear() {

        indexselectyear = 0

        this.setState({

            expand: false,
            updatedHeight: 50,

        }, function () {

            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }
    onLastYear() {
        indexselectyear = 1
        this.setState({

            expand: false,
            updatedHeight: 50,

        }, function () {
            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }

    onLast2Year() {
        indexselectyear = 2
        this.setState({

            expand: false,
            updatedHeight: 50,

        }, function () {
            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }




    onRefresh() {

        this.setState({ isFetching: true }, function () { this.fetchData() });
    }

    getPayslipDetailfromAPI = async (year, index) => {

        let rollid;

        for (let i = 0; i < yearlistdata[year].monthlistdata.length; i++) {

            if (yearlistdata[year].monthlistdata[i].month === index + 1) {
                rollid = yearlistdata[year].monthlistdata[i].id
            }
        }
        let host = SharedPreference.PAYSLIP_DETAIL_API + rollid
        // console

        //console.log('host : ', host);
        FUNCTION_TOKEN = await Authorization.convert(SharedPreference.profileObject.client_id, SharedPreference.FUNCTIONID_PAYSLIP, SharedPreference.profileObject.client_token)


        // //console.log('rollid', rollid)
        return fetch(host, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: FUNCTION_TOKEN,
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isscreenloading: false,
                    dataSource: responseJson
                    // datadetail: PayslipDataDetail.detail[dataSource.years[year].detail[index].payroll_id]

                }, function () {
                    //console.log('status : ', this.state.dataSource.status);
                    if (this.state.dataSource.status === 200) {
                        //console.log('payslip detail DataResponse : ', this.state.dataSource, rollid);
                        // //console.log('DataResponse year : ',dataSource.data.years[year].year);
                        // this.setState(this.renderloadingscreen())
                        this.props.navigation.navigate('PayslipDetail', {
                            // DataResponse:dataSource,
                            yearlist: yearlistdata,
                            initialyear: initialyear,
                            initialmonth: 0,
                            monthselected: index,
                            yearselected: year,
                            Datadetail: this.state.dataSource,
                            rollid: rollid
                        });
                    } else {

                        Alert.alert(
                            this.state.dataSource.errors[0].code,
                            this.state.dataSource.errors[0].detail,
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        //console.log('OK Pressed') },
                                    }
                                }
                            ],
                            { cancelable: false }
                        )

                    }

                });

            })
            .catch((error) => {
                console.error(error);
            });


    }



    PayslipDetail() {

        let exemption = '0';
        let income_acc = '0';
        let tax_acc = '0';
        let social_fund = '0';
        let emp_pf_year = '0';
        let com_pf_year = '0';

        if (dataSource.years) {

            if (dataSource.years[indexselectyear].header) { exemption = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.exemption); }

            if (dataSource.years[indexselectyear].header) { income_acc = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.income_acc); }

            if (dataSource.years[indexselectyear].header) { tax_acc = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.tax_acc); }

            if (dataSource.years[indexselectyear].header) { social_fund = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.social_fund); }

            if (dataSource.years[indexselectyear].header) { emp_pf_year = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.emp_pf_year); }

            if (dataSource.years[indexselectyear].header) { com_pf_year = Dcryptfun.decrypt(dataSource.years[indexselectyear].header.com_pf_year); }

        }



        return (

            <View style={{ height: this.state.updatedHeight, backgroundColor: 'gray', flexDirection: 'column', overflow: 'hidden', marginLeft: 5, marginRight: 5, borderRadius: 5 }}>
                <View style={{ height: 49, width: '100%', backgroundColor: Colors.calendarLocationBoxColor, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >

                    <Text style={{ flex: 5, fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>ANNUAL</Text>
                    <TouchableOpacity style={{ flex: 1 }} onPress={(this.expand_collapse_Function.bind(this))}>
                        <Image
                            style={{ height: 80, width: 80 }}
                            source={this.state.expand === false ?
                                require('./../resource/images/Expand.png') :
                                require('./../resource/images/Collapse.png')}
                        // resizeMode='cover'
                        />
                    </TouchableOpacity>

                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
                <View style={{ flex: 1, backgroundColor: Colors.calendarLocationBoxColor }}>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Exemption</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{exemption}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Year to date income</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{income_acc}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Year to date W/H Tax</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{tax_acc}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Social Security</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{social_fund}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Employee Provident Fund</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{emp_pf_year}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.payslipAnnoualLeft}>Company Povident Fund</Text>
                        <Text style={styles.payslipAnnoualRight} numberOfLines={1}>{com_pf_year}</Text>
                    </View>
                </View>

            </View>

        )
    }


    PayslipItem() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 3, marginRight: 3 }}>
                {payslipItems}
            </View>

        )
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
                            <TouchableOpacity onPress={(this.onBack.bind(this))}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('./../resource/images/Back.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.navTitleTextTop}>Pay Slip</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                        </View>
                    </View>
                </View>
                <View style={styles.leavequotaTabbar}>

                    <View style={{ flex: 1, flexDirection: 'column', marginTop: 7, marginLeft: 7, marginRight: 7 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={(this.onLast2Year.bind(this)

                                )}>
                                <View style={indexselectyear === 2 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={indexselectyear === 2 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[2]}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={(this.onLastYear.bind(this))}
                            >
                                <View style={indexselectyear === 1 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={indexselectyear === 1 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[1]}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={(this.onCurrentYear.bind(this))}>
                                <View style={indexselectyear === 0 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={indexselectyear === 0 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[0]}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }} />
                        </View>
                        {/* <View style={{ height: 10,backgroundColor:Colors.calendarLocationBoxColor }}/> */}
                    </View>

                </View>

                <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, flexDirection: 'column' }}>

                    {this.PayslipDetail()}
                    {this.PayslipItem()}

                </View>
                {this.renderloadingscreen()}
            </View >
        );
    }
}