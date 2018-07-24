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

import Colors from "./../SharedObject/Colors"
import Layout from "./../SharedObject/Layout"
import { styles } from "./../SharedObject/MainStyles"
// import { MonoText } from '../../components/StyledText';
// import  DataResponse  from "../../InAppData/Payslipdatalist"
import PayslipDataDetail from "./../InAppData/Payslipdatadetail2"
// import api from "../../constants/APIService"
import SharedPreference from "./../SharedObject/SharedPreference"
import Dcryptfun from "./../SharedObject/Decryptfun"

import RestAPI from "../constants/RestAPI"
import Month from "../constants/Month"

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


export default class PaySlipActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isscreenloading: false,
            loadingtype: 0,
            isFetching: false,

            expand: false,
            indexselectyear: 0,
            updatedHeight: 50,
            dataSource: [],
            selectYearArray: [2000, 2000, 2000]
        };
        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));

    }

    checkDataFormat(DataResponse) {
        console.log('DataResponse : ', DataResponse)
        if (DataResponse) {
            console.log('DataResponse : ', DataResponse)
            console.log('DataResponse.years : ', DataResponse.years)

            dataSource = DataResponse;

            for (let i = 0; i < DataResponse.years.length; i++) {

                yearnumber = DataResponse.years[i].year;

                if (DataResponse.years[i].detail) {
                    for (let j = DataResponse.years[i].detail.length - 1; j >= 0; j--) {

                        if (i == 0 && j == 0) {

                            initialyear = yearnumber;

                        }

                        monthlistdata.push({
                            year: DataResponse.years[i].year,
                            month: DataResponse.years[i].detail[j].month_no,
                            id: DataResponse.years[i].detail[j].payroll_id

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


    async componentWillMount() {
        await this.getArrayOfYear()
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

        console.log("getArrayOfYear ==> selectYearArray : ", this.state.selectYearArray)

    }


    createcomponent(i) {

        let havedata;

        if (dataSource.years) {

            if (dataSource.years[this.state.indexselectyear].detail) {

                for (let j = 0; j < dataSource.years[this.state.indexselectyear].detail.length; j++) {

                    if (dataSource.years[this.state.indexselectyear].detail[j].month_no === i + 1) {

                        havedata = dataSource.years[this.state.indexselectyear].detail[j]
                        break

                    }

                }

                if (havedata) {

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
                        <View style={i === currentmonth && this.state.indexselectyear === 0 ?
                            styles.payslipitemlast :
                            i > currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemdisable : styles.payslipitem} key={i}>
                            <TouchableOpacity style={{ flex: 1 }}
                                onPress={() => { this.onDetail(this.state.indexselectyear, i) }}
                            >

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {Month.monthNamesShort[i]}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={i === currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipincome}>
                                        {(netsalary)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {pay_date}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }

                let net = '0.00';

                if (currentmonth < i && this.state.indexselectyear === 0) {

                    net = '';

                }
                return (
                    <View style={i === currentmonth && this.state.indexselectyear === 0 ?
                        styles.payslipitemlast :
                        styles.payslipitemdisable}
                        key={i}>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={i === currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{Month.monthNamesShort[i]}</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={i === currentmonth && this.state.indexselectyear === 0 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{net}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                        </View>
                    </View>
                );

            }
        }

        return (
            <View style={i === currentmonth && this.state.indexselectyear === 0 ?
                styles.payslipitemlast :
                styles.payslipitemdisable}
                key={i}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={i > currentmonth && this.state.indexselectyear === 0 ?
                        styles.payslipitemdetailHide :
                        i === currentmonth && this.state.indexselectyear === 0 ?
                            styles.payslipitemcurrentdetail : styles.payslipitemdetail}>
                        {Month.monthNamesShort[i]}
                    </Text>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={i > currentmonth && this.state.indexselectyear === 0 ?
                        styles.payslipitemdetailHide :
                        i === currentmonth && this.state.indexselectyear === 0 ?
                            styles.payslipitemcurrentdetail : styles.payslipitemdetail}>
                        0.00
                        </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                </View>
            </View>
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


        this.props.navigation.navigate('HomeScreen'); ``

    }

    onDetail(year, index) {

        // pay_date_str = dataSource.years[this.state.indexselectyear].detail[index].pay_date;

        console.log('detail', pay_date_str)

        this.setState({

            isscreenloading: true,
            loadingtype: 3

        }, function () {
            // console.log(this.state.indexselectyear)
            // this.setState(this.renderloadingscreen())

            this.getPayslipDetailfromAPI(year, index)

        });

        // this.props.navigation.navigate('PaySlipDetail');

    }

    onCurrentYear() {



        this.setState({
            indexselectyear: 0,
            expand: false,
            updatedHeight: 50,

        }, function () {

            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }
    onLastYear() {

        this.setState({
            indexselectyear: 1,
            expand: false,
            updatedHeight: 50,

        }, function () {
            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }

    onLast2Year() {



        this.setState({
            indexselectyear: 2,
            expand: false,
            updatedHeight: 50,

        }, function () {
            this.setState(this.createPayslipItem)
            this.setState(this.PayslipItem())
        });

    }


    componentDidMount() {
        // console.log(Layout.window.width);
        // this.fetchData()
    }

    onRefresh() {

        this.setState({ isFetching: true }, function () { this.fetchData() });
    }

    getPayslipDetailfromAPI(year, index) {

        let rollid;

        for (let i = 0; i < yearlistdata[year].monthlistdata.length; i++) {

            if (yearlistdata[year].monthlistdata[i].month === index + 1) {

                rollid = yearlistdata[year].monthlistdata[i].id
            }
        }


        let host = SharedPreference.PAYSLIP_DETAIL_API + rollid

        console.log('host', host)
        console.log('TOKEN', SharedPreference.TOKEN)


        if (offine) {

            dataSource: PayslipDataDetail.detail[dataSource.years[year].detail[index].payroll_id]
            this.props.navigation.navigate('PaySlipDetail', {
                yearlist: yearlistdata,
                initialyear: initialyear,
                initialmonth: 0,
                monthselected: index,
                yearselected: year,
                Datadetail: this.state.dataSource
            });

        } else {
            // console.log('rollid', rollid)
            return fetch(host, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: SharedPreference.TOKEN,
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    this.setState({

                        isscreenloading: false,
                        dataSource: responseJson
                        // datadetail: PayslipDataDetail.detail[dataSource.years[year].detail[index].payroll_id]

                    }, function () {
                        console.log('status : ', this.state.dataSource.status);
                        if (this.state.dataSource.status === 200) {
                            console.log('payslip detail DataResponse : ', this.state.dataSource, rollid);
                            // console.log('DataResponse year : ',dataSource.data.years[year].year);
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
                                    { text: 'OK', onPress: () => console.log('OK Pressed') },
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

    }



    PayslipDetail() {

        // var CryptoJS = require("crypto-js");

        // var utf8 = require('utf8');
        // var base64 = require('base-64');

        // var orgtext = '121452';
        // console.log('orgtext ',orgtext);
        // var bytesd2 = base64.encode(orgtext);
        // var textdecode = utf8.encode(bytesd2);
        // console.log('textdecode ',textdecode);

        // var encoded = 'Zm9vIMKpIGJhciDwnYyGIGJheg==';
        // var bytes1 = base64.decode(textdecode);
        // var text = utf8.decode(bytes1);
        // console.log('textencode ', text);

        // let mytext = 'my message';
        // console.log("org text", mytext);
        // var ciphertext = CryptoJS.AES.encrypt(mytext.toString(), 'zxcZXC');
        // console.log("encrypted text", ciphertext.toString());

        // var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'zxcZXC');
        // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        // console.log("decrypted text", plaintext.toString());


        // var bytes = CryptoJS.AES.decrypt('4ejgPP6u2s3RdwoRZX0PFkadzo1lVhcn9kB4iurRtt02lBOmgV2fabu7QSAPUtPe','zxcZXC');
        // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        // console.log("decrypted text", bytes);


        let exemption = '0';
        let income_acc = '0';
        let tax_acc = '0';
        let social_fund = '0';
        let emp_pf_year = '0';
        let com_pf_year = '0';

        // if (dataSource.years[this.state.indexselectyear].header) {exemption = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.exemption);}

        // if (dataSource.years[this.state.indexselectyear].header) {income_acc = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.income_acc);}

        // if (dataSource.years[this.state.indexselectyear].header) {tax_acc = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.tax_acc);}

        // if (dataSource.years[this.state.indexselectyear].header) {social_fund = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.social_fund);}

        // if (dataSource.years[this.state.indexselectyear].header) {emp_pf_year = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.emp_pf_year);}

        // if (dataSource.years[this.state.indexselectyear].header) {com_pf_year = Dcryptfun.decrypt(dataSource.years[this.state.indexselectyear].header.com_pf_year);}


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
                                <View style={this.state.indexselectyear === 2 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={this.state.indexselectyear === 2 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[2]}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={(this.onLastYear.bind(this))}
                            >
                                <View style={this.state.indexselectyear === 1 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={this.state.indexselectyear === 1 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[1]}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={(this.onCurrentYear.bind(this))}>
                                <View style={this.state.indexselectyear === 0 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={this.state.indexselectyear === 0 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[0]}</Text>
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