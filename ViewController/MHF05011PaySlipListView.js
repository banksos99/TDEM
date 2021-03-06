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
import RestAPI from "../constants/RestAPI"

let monthlistdata = [];

let payslipItems = [];
let dataSource = [];

let initialyear = 0;

let temparray = [];
// let currentmonth = new Date().getMonth();
let monthdictionary = {};
let offine = 0;
let pay_date_str = 0;
//let indexselectyear = 0;
let tempdatadetail = []
let tempdatabody = []

export default class PaySlipActivity extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state = {
            isscreenloading: false,
            loadingtype: 0,
            isFetching: false,

            expand: false,
            currentmonth : new Date().getMonth(),
            updatedHeight: 50,
            dataSource: [],
            selectYearArray: [],
         //   yearselected:0,
            indexselectyear:2,
            DataResponse:this.props.navigation.getParam("DataResponse", ""),
            yearlistdata : [],
            inappTimeIntervalStatus:true
        };

       // firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_PAYSLIP_LIST)
       console.log('currentmonth = >',this.state.currentmonth)
    }

    componentDidMount() {


        if (this.state.DataResponse) {
            this.state.yearlistdata=[]
            dataSource = this.state.DataResponse;
            let yearnow = new Date().getFullYear();
            let monthnow = new Date().getMonth();

            for (let i = 0; i < this.state.selectYearArray.length; i++) {

                let havedatamonth = false;
                for (let j = 0; j < this.state.DataResponse.years.length; j++) {
                    
                    if (this.state.DataResponse.years[j].year === this.state.selectYearArray[i]) {
                        havedatamonth = true;
                        // console.log('selectYearArray : ', this.state.selectYearArray[i], this.state.DataResponse.years[j].detail)
                        for (let k = 0; k < 12; k++) {

                            let rollID = 0;
                            let paydate = 0;
                            let netsalary = 0;
                            let badge = 0;
                            for (let l = 0; l < this.state.DataResponse.years[j].detail.length; l++) {
                                if (this.state.DataResponse.years[j].detail[l].month_no === k + 1) {
                                    
                                    
                                    rollID = this.state.DataResponse.years[j].detail[l].payroll_id
                                    paydate = this.state.DataResponse.years[j].detail[l].pay_date
                                    netsalary = this.state.DataResponse.years[j].detail[l].net_salary
                                    for (let m = 0; m < SharedPreference.notiPayslipBadge.length; m++) {
                                        if (SharedPreference.notiPayslipBadge[m] == rollID) {
                                            badge = 1;
                                        }
                                    }
                                }

                            }

                            this.state.yearlistdata.push({
                                rollID: rollID,
                                month:Month.monthNamesShort[k],
                                monthfull:Month.monthNames[k],
                                year:this.state.selectYearArray[i],
                                paydate:paydate,
                                netsalary:netsalary,
                                badge:badge
                            })

                        }
                        first = true;

                    } 

                }
                if(!havedatamonth){
                    for (let k = 0; k < 12; k++) {
                        let rollID = 0;
                        this.state.yearlistdata.push({
                            rollID: rollID,
                            month:Month.monthNamesShort[k],
                            monthfull:Month.monthNames[k],
                            year:this.state.selectYearArray[i],
                            badge:0
                        })

                    }

                }
            }

         

        //    this.savedata()

            

            this.setState({

                isFetching: false,

                // loadingviewheight: 0,

            });


        }

       // this.createPayslipItem();
    }

    

        // //console.log(Layout.window.width);
        // this.fetchData()


   // }

    async componentWillMount() {
        await this.getArrayOfYear()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        this.settimerInAppNoti()
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
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

    settimerInAppNoti() {
        this.timer = setTimeout(() => {
            this.onLoadInAppNoti()
        }, SharedPreference.timeinterval);

    }

    onLoadInAppNoti = async () => {
        
        if (!SharedPreference.lastdatetimeinterval) {
            let today = new Date()
            const _format = 'YYYY-MM-DD hh:mm:ss'
            const newdate = moment(today).format(_format).valueOf();
            SharedPreference.lastdatetimeinterval = newdate
        }

        this.APIInAppallback(await RestAPI(SharedPreference.PULL_NOTIFICATION_API + SharedPreference.lastdatetimeinterval,1))

    }

    APIInAppallback(data) {
        code = data[0]
        data = data[1]

        if (code.INVALID_AUTH_TOKEN == data.code) {

            this.onAutenticateErrorAlertDialog()

        } else if (code.SUCCESS == data.code) {

            for (let index = 0; index < dataArray.length; index++) {
                const dataReceive = dataArray[index];
                // //console.log("element ==> ", dataReceive.function_id)

                if (dataReceive.function_id == "PHF06010") {//if nonPayroll
                    dataListArray = dataReceive.data_list

                    // //console.log("dataListArray ==> ", dataListArray)
                    for (let index = 0; index < dataListArray.length; index++) {
                        const str = dataListArray[index];
                        // //console.log("str ==> ", str)
                        var res = str.split("|");
                        // //console.log("res ==> ", res[1])
                        var data = res[1]

                        var monthYear = data.split("-");
                        // //console.log("dataListArray ==> monthYear ==> ", monthYear)

                        var year = monthYear[0]
                        var month = monthYear[1]

                        for (let index = 0; index < dataCustomArray.length; index++) {
                            const data = dataCustomArray[index];
                            // //console.log("dataCustomArray data ==> ", data)
                            // //console.log("dataCustomArray year ==> ", data.year)

                            if (year == data.year) {
                                const detail = data.detail
                                // //console.log("detail ==> ", detail)
                                // //console.log("month select  ==> ", month)

                                let element = detail.find((p) => {
                                    return p.month === JSON.parse(month)
                                });
                                // //console.log("element ==> ", element)

                                element.badge = element.badge + 1
                                //console.log("detail badge ==> ", element.badge)
                            }
                        }
                    }
                } else if (dataReceive.function_id == "PHF02010") {

                    console.log("announcement badge ==> ", dataReceive.badge_count)

                    this.setState({

                        notiAnnounceMentBadge: parseInt(dataReceive.badge_count) + parseInt(this.state.notiAnnounceMentBadge)
                    })

                } else if (dataReceive.function_id == 'PHF05010') {
                    console.log('new payslip arrive')
                    this.setState({
                        notiPayslipBadge: parseInt(dataReceive.badge_count) + this.state.notiPayslipBadge
                    }, function () {
                        dataReceive.data_list.map((item, i) => {

                            SharedPreference.notiPayslipBadge.push(item)
                            // = dataReceive.data_list

                        })
                    })
                    console.log('notiPayslipBadge',SharedPreference.notiPayslipBadge)
                }

            }


            this.timer = setTimeout(() => {
                this.onLoadInAppNoti()
            }, SharedPreference.timeinterval);

        }

    }

    onAutenticateErrorAlertDialog(error) {

        timerstatus = false;
        this.setState({
            isscreenloading: false,
        })

        Alert.alert(
            StringText.ALERT_AUTHORLIZE_ERROR_TITLE,
            StringText.ALERT_AUTHORLIZE_ERROR_MESSAGE,
            [{
                text: 'OK', onPress: () => {

                    page = 0
                    SharedPreference.Handbook = []
                    SharedPreference.profileObject = null
                    this.setState({
                        isscreenloading: false
                    })
                    this.props.navigation.navigate('RegisterScreen')

                }
            }],
            { cancelable: false }
        )
    }



    getArrayOfYear() {

        let currentYear = new Date().getFullYear()

        for (let index = 2; index >= 0; index--) {

           this.state.selectYearArray.push(currentYear - index )
        }

        console.log("getArrayOfYear ==> selectYearArray : ", this.state.selectYearArray,currentYear)

    }


    createcomponent(i) {

        let havedata;

        if (dataSource.years) {

            if (tempdatabody) {

                for (let j = 0; j < tempdatabody.length; j++) {
                    
                    if (tempdatabody[j].month_no === i + 1) {

                        havedata = tempdatabody[j]

                        //console.log('payslip data =>',dataSource.years[indexselectyear].detail,indexselectyear)
                        console.log('payslip data =>',havedata,this.state.indexselectyear)
                        break

                    }

                }

                if (i > this.state.currentmonth && this.state.indexselectyear == 2) {



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
                        <View style={i === this.state.currentmonth && this.state.indexselectyear === 2 ?
                            styles.payslipitemlast :
                            i > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdisable : styles.payslipitem} key={i}>
                            <TouchableOpacity style={{ width: '100%', height: '100%' }}
                                onPress={() => { this.onDetail(this.state.indexselectyear, i) }}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {Month.monthNamesShort[i]}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipincome}>
                                        {(netsalary)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>
                                        {pay_date}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {/* <View style={styles.badgeIconpayslip}>
                                <Text style={{color:'white'}}>18</Text>
                            </View> */}
                        </View>
                    )
                }

                let net = '0.00';

                if (this.state.currentmonth < i && this.state.indexselectyear === 2) {

                    net = '';

                    return (
                        <View style={i === this.state.currentmonth && this.state.indexselectyear === 2 ?
                            styles.payslipitemlast :
                            styles.payslipitemdisable}
                            key={i}>


                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{Month.monthNamesShort[i]}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{net}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                            </View>

                        </View>
                    );


                }
                return (
                    <View style={i === this.state.currentmonth && this.state.indexselectyear === 2 ?
                        styles.payslipitemlast :
                        styles.payslipitemdisable}
                        key={i}>
                        <TouchableOpacity style={{ width: '100%',height:'100%' }}
                            onPress={() => { this.onNoDataDetail(this.state.indexselectyear, i) }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{Month.monthNamesShort[i]}</Text>
                            </View>
                            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={i === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemmoneyred : styles.payslipitemdetail}>{net}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

                            </View>
                        </TouchableOpacity>
                    </View>
                );

            }
        }

        return (
            <View style={i === this.state.currentmonth && this.state.indexselectyear === 2 ?
                styles.payslipitemlast :
                styles.payslipitemdisable}
                key={i}>
                <TouchableOpacity style={{ width: '100%',height:'100%' }}
                    onPress={() => {
                        this.onLoadAlertDialog()
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={i > this.state.currentmonth && this.state.indexselectyear === 2 ?
                            styles.payslipitemdetailHide :
                            i === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemcurrentdetail : styles.payslipitemdetail}>
                            {Month.monthNamesShort[i]}
                        </Text>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={i > this.state.currentmonth && this.state.indexselectyear === 2 ?
                            styles.payslipitemdetailHide :
                            i === this.state.currentmonth && this.state.indexselectyear === 2 ?
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

        console.log('dataSource.years =>',dataSource.years)

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
        SharedPreference.notiPayslipBadge = [];
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

        
        this.setState({

            isscreenloading: true,
            loadingtype: 3

        }, function () {
            // //console.log(this.state.indexselectyear)
            // this.setState(this.renderloadingscreen())

            this.getPayslipDetailfromAPI(this.state.selectYearArray[year], index)

        });

        // this.props.navigation.navigate('PaySlipDetail');

    }
    savedata() {

        tempdatadetail = []
        tempdatabody = []

        if (dataSource.years) {

            console.log('tempdatadetail => ', dataSource.years)
            console.log('indexselectyear => ', this.state.selectYearArray[this.state.indexselectyear])
            
            for (let i = 0; i < dataSource.years.length; i++) {
                console.log('dataSource.years[i].year: => ', dataSource.years[i].year, this.state.selectYearArray[this.state.indexselectyear])
                if (dataSource.years[i].year == this.state.selectYearArray[this.state.indexselectyear]) {

                    tempdatadetail = dataSource.years[i].header
                   // tempdatabody = dataSource.years[i].detail
                   //console.log('dataSource.years : => ', tempdatadetail)
                    // exemption = Dcryptfun.decrypt(tempdatadetail.exemption);
                    // income_acc = Dcryptfun.decrypt(tempdatadetail.income_acc);
                    // tax_acc = Dcryptfun.decrypt(tempdatadetail.tax_acc);
                    // social_fund = Dcryptfun.decrypt(tempdatadetail.social_fund);
                    // emp_pf_year = Dcryptfun.decrypt(tempdatadetail.emp_pf_year);
                    // com_pf_year = Dcryptfun.decrypt(tempdatadetail.com_pf_year);

                    break
                }

            }

        }

    }

    onCurrentYear() {

       // this.savedata()

        this.setState({
            indexselectyear:2,
            expand: false,
            updatedHeight: 50,
     
        }, function () {

            // this.setState(this.createPayslipItem)
            // this.setState(this.PayslipItem())
        });

    }
    
    onLastYear() {

      //  this.savedata()

        this.setState({

            expand: false,
            updatedHeight: 50,
            indexselectyear:1,
      
        }, function () {
            // this.setState(this.createPayslipItem)
            // this.setState(this.PayslipItem())
        });

    }

    onLast2Year() {
   
     //   this.savedata()

        this.setState({

            expand: false,
            updatedHeight: 50,
            indexselectyear:0,

        }, function () {
            // this.setState(this.createPayslipItem)
            // this.setState(this.PayslipItem())
        });

    }

    onRefresh() {

        this.setState({ isFetching: true }, function () { this.fetchData() });
    }

    getPayslipDetailfromAPI = async (year, index) => {

        let rollid;

        for (let i = 0; i < dataSource.years.length; i++) {

            if (dataSource.years[i].year == year) {

                for (let j = 0; j < dataSource.years[i].detail.length; j++) {

                    let realindex = index + 1;

                    if (dataSource.years[i].detail[j].month_no === realindex) {

                        rollid = dataSource.years[i].detail[j].payroll_id;

                        break
                    }

                }

            }

        }
        // for (let i = 0; i < yearlistdata[year].monthlistdata.length; i++) {

        //     if (yearlistdata[year].monthlistdata[i].month === index + 1) {
        //         rollid = yearlistdata[year].monthlistdata[i].id
        //     }
        // }
        console.log('rollid :', this.state.yearlistdata[(this.state.indexselectyear * 12)+index])
        let host = SharedPreference.PAYSLIP_DETAIL_API + this.state.yearlistdata[(this.state.indexselectyear * 12)+index].rollID
        // console
        console.log('host :', host)

        //console.log('host : ', host);
        let FUNCTION_TOKEN = await Authorization.convert(SharedPreference.profileObject.client_id, SharedPreference.FUNCTIONID_PAYSLIP, SharedPreference.profileObject.client_token)


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
                    console.log('status : ', this.state.dataSource);
                    if (this.state.dataSource.status === 200) {
                        //console.log('payslip detail DataResponse : ', this.state.dataSource, rollid);
                        // //console.log('DataResponse year : ',dataSource.data.years[year].year);
                        // this.setState(this.renderloadingscreen())
                        // this.props.navigation.navigate('PayslipDetail', {
                        //     // DataResponse:dataSource,
                        //     yearlist: this.state.yearlistdata,
                        //     initialyear: initialyear,
                        //     initialmonth: 0,
                        //     monthselected: index,
                        //     selectedindex: ((this.state.indexselectyear) * 12) + index,
                        //     yearselected: year,
                        //     Datadetail: this.state.dataSource,
                        //     rollid: rollid,

                        // });

                        this.props.navigation.navigate('PayslipDetail', {
                            DataResponse:this.state.DataResponse,
                            yearlist: this.state.yearlistdata,
                            initialyear: initialyear,
                            initialmonth: 0,
                            monthselected: index,
                            selectedindex: ((this.state.indexselectyear) * 12) + index,
                            indexselectyear: year,
                            Datadetail: this.state.dataSource,
                            rollid: rollid
                        });

                    } else if (this.state.dataSource.status == 403) {
                        Alert.alert(
                            StringText.ALERT_AUTHORLIZE_ERROR_TITLE,
                            StringText.ALERT_AUTHORLIZE_ERROR_MESSAGE,
                            [{
                                text: 'OK', onPress: () => {
                            
                                    SharedPreference.Handbook = []
                                    SharedPreference.profileObject = null
                                   // this.saveProfile.setProfile(null)
                                    this.setState({
                                        isscreenloading: false
                                    })
                                    this.props.navigation.navigate('RegisterScreen')

                                }
                            }],
                            { cancelable: false }
                        )

                    } else {

                        Alert.alert(
                            'error',
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
        
    
        // tempdatadetail = []
        // tempdatabody = []

        if (dataSource.years) {

            console.log('tempdatadetail => ', dataSource.years)
            console.log('indexselectyear => ', this.state.selectYearArray[this.state.indexselectyear])
            
            for (let i = 0; i < dataSource.years.length; i++) {
                console.log('dataSource.years[i].year: => ', dataSource.years[i].year, this.state.selectYearArray[this.state.indexselectyear])
                if (dataSource.years[i].year == this.state.selectYearArray[this.state.indexselectyear]) {

                    let ttempdatadetail = dataSource.years[i].header
                   // tempdatabody = dataSource.years[i].detail
                    console.log('dataSource.years : => ', ttempdatadetail)
                    exemption = Dcryptfun.decrypt(ttempdatadetail.exemption);
                    income_acc = Dcryptfun.decrypt(ttempdatadetail.income_acc);
                    tax_acc = Dcryptfun.decrypt(ttempdatadetail.tax_acc);
                    social_fund = Dcryptfun.decrypt(ttempdatadetail.social_fund);
                    emp_pf_year = Dcryptfun.decrypt(ttempdatadetail.emp_pf_year);
                    com_pf_year = Dcryptfun.decrypt(ttempdatadetail.com_pf_year);

                   // break
                }

            }

        }

        // if (tempdatadetail.exemption) {

        //     exemption = Dcryptfun.decrypt(tempdatadetail.exemption);
        //     income_acc = Dcryptfun.decrypt(tempdatadetail.income_acc);
        //     tax_acc = Dcryptfun.decrypt(tempdatadetail.tax_acc);
        //     social_fund = Dcryptfun.decrypt(tempdatadetail.social_fund);
        //     emp_pf_year = Dcryptfun.decrypt(tempdatadetail.emp_pf_year);
        //     com_pf_year = Dcryptfun.decrypt(tempdatadetail.com_pf_year);

        // }

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
    PayslipBody() {
        
        let net1 = '0.00'; let pay1 = '-';
        let net2 = '0.00'; let pay2 = '-';
        let net3 = '0.00'; let pay3 = '-';
        let net4 = '0.00'; let pay4 = '-';
        let net5 = '0.00'; let pay5 = '-';
        let net6 = '0.00'; let pay6 = '-';
        let net7 = '0.00'; let pay7 = '-';
        let net8 = '0.00'; let pay8 = '-';
        let net9 = '0.00'; let pay9 = '-';
        let net10 = '0.00'; let pay10 = '-';
        let net11 = '0.00'; let pay11 = '-';
        let net12 = '0.00'; let pay12 = '-';
        let badge1 = 0;
        let badge2 = 0;
        let badge3 = 0;
        let badge4 = 0;
        let badge5 = 0;
        let badge6 = 0;
        let badge7 = 0;
        let badge8 = 0;
        let badge9 = 0;
        let badge10 = 0;
        let badge11 = 0;
        let badge12 = 0;
    
        if (this.state.yearlistdata.length) {
            console.log('yearlistdata =>', this.state.yearlistdata)
            // let netsalary =  this.state.yearlistdata[(this.state.yearselected * 12) + 5].netsalary
            // console.log('netsalary =>', netsalary)
            // console.log('client_secret =>', SharedPreference.profileObject.client_secret)
            // console.log('Dcryptfun =>', Dcryptfun.decrypt(netsalary))
            let tnet1 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 0].netsalary;  let tpay1 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 0].paydate;
            if (tpay1) {let apay1 = tpay1.split('-'); pay1 = apay1[2] + ' ' + Month.monthNamesShort[apay1[1] - 1] + ' ' + apay1[0];net1 = Dcryptfun.decrypt(tnet1);}
            let tnet2 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 1].netsalary;  let tpay2 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 1].paydate;
            if (tpay2) {let apay2 = tpay2.split('-'); pay2 = apay2[2] + ' ' + Month.monthNamesShort[apay2[1] - 1] + ' ' + apay2[0];net2 = Dcryptfun.decrypt(tnet2);}
            let tnet3 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 2].netsalary;  let tpay3 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 2].paydate;
            if (tpay3) {let apay3 = tpay3.split('-'); pay3 = apay3[2] + ' ' + Month.monthNamesShort[apay3[1] - 1] + ' ' + apay3[0];net3 = Dcryptfun.decrypt(tnet3);}
            let tnet4 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 3].netsalary;  let tpay4 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 3].paydate;
            if (tpay4) {let apay4 = tpay4.split('-'); pay4 = apay4[2] + ' ' + Month.monthNamesShort[apay4[1] - 1] + ' ' + apay4[0];net4 = Dcryptfun.decrypt(tnet4);}
            let tnet5 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 4].netsalary;  let tpay5 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 4].paydate;
            if (tpay5) {let apay5 = tpay5.split('-'); pay5 = apay5[2] + ' ' + Month.monthNamesShort[apay5[1] - 1] + ' ' + apay5[0];net5 = Dcryptfun.decrypt(tnet5);}
            let tnet6 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 5].netsalary;  let tpay6 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 5].paydate;
            if (tpay6) {let apay6 = tpay6.split('-'); pay6 = apay6[2] + ' ' + Month.monthNamesShort[apay6[1] - 1] + ' ' + apay6[0];net6 = Dcryptfun.decrypt(tnet6);}
            let tnet7 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 6].netsalary;  let tpay7 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 6].paydate;
            if (tpay7) {let apay7 = tpay7.split('-'); pay7 = apay7[2] + ' ' + Month.monthNamesShort[apay7[1] - 1] + ' ' + apay7[0];net7 = Dcryptfun.decrypt(tnet7);}
            let tnet8 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 7].netsalary;  let tpay8 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 7].paydate;
            if (tpay8) {let apay8 = tpay8.split('-'); pay8 = apay8[2] + ' ' + Month.monthNamesShort[apay8[1] - 1] + ' ' + apay8[0];net8 = Dcryptfun.decrypt(tnet8);}
            let tnet9 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 8].netsalary;  let tpay9 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 8].paydate;
            if (tpay9) {let apay9 = tpay9.split('-'); pay9 = apay9[2] + ' ' + Month.monthNamesShort[apay9[1] - 1] + ' ' + apay9[0];net9 = Dcryptfun.decrypt(tnet9);}
            let tnet10 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 9].netsalary;  let tpay10 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 9].paydate;
            if (tpay10) {let apay10 = tpay10.split('-'); pay10 = apay10[2] + ' ' + Month.monthNamesShort[apay10[1] - 1] + ' ' + apay10[0];net10 = Dcryptfun.decrypt(tnet10);}
            let tnet11 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 10].netsalary;  let tpay11 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 10].paydate;
            if (tpay11) { let apay11 = tpay11.split('-'); pay11 = apay11[2] + ' ' + Month.monthNamesShort[apay11[1] - 1] + ' ' + apay11[0]; net11 = Dcryptfun.decrypt(tnet11); }
            let tnet12 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 11].netsalary; let tpay12 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 11].paydate;
            if (tpay12) { let apay12 = tpay12.split('-'); pay12 = apay12[2] + ' ' + Month.monthNamesShort[apay12[1] - 1] + ' ' + apay12[0]; net12 = Dcryptfun.decrypt(tnet12); }

            badge1 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 0].badge;
            badge2 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 1].badge;
            badge3 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 2].badge;
            badge4 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 3].badge;
            badge5 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 4].badge;
            badge6 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 5].badge;
            badge7 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 6].badge;
            badge8 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 7].badge;
            badge9 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 8].badge;
            badge10 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 9].badge;
            badge11 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 10].badge;
            badge12 = this.state.yearlistdata[(this.state.indexselectyear * 12) + 11].badge;
        }
        return (
            <View style={{ flex: 1, margin: 3, }}>

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={0 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net1 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(0, net1) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={0 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : styles.payslipiteMonth}>{Month.monthNamesShort[0]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={0 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 0 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net1}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={0 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 0 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay1}</Text></View>
                            </TouchableOpacity>
                            <View style={badge1 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge1 ? { color: 'white' } : { color: 'transparent' }}>{badge1}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={1 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net2 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(1, net2) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={1 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 1 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[1]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={1 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 1 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net2}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={1 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 1 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay2}</Text></View>
                            </TouchableOpacity>
                            <View style={badge2 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge2 ? { color: 'white' } : { color: 'transparent' }}>{badge2}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={2 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net3 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(2, net3) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={2 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 2 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[2]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={2 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 2 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net3}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={2 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 2 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay3}</Text></View>
                            </TouchableOpacity>
                            <View style={badge3 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge3 ? { color: 'white' } : { color: 'transparent' }}>{badge3}</Text></View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={3 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net4 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(3, net4) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={3 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 3 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[3]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={3 === this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemcurrentdNet : 3 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net4}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={3 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 3 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay4}</Text></View>

                            </TouchableOpacity>
                            <View style={badge4 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge4 ? { color: 'white' } : { color: 'transparent' }}>{badge4}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={4 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net5 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(4, net5) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={4 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 4 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[4]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={4 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 4 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net5}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={4 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 4 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay5}</Text></View>
                            </TouchableOpacity>
                            <View style={badge5 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge5 ? { color: 'white' } : { color: 'transparent' }}>{badge5}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={5 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net6 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(5, net6) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={5 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 5 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide : styles.payslipiteMonth}>{Month.monthNamesShort[5]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={5 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 5 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net6}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={5 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 5 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay6}</Text></View>

                            </TouchableOpacity>
                            <View style={badge6 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge6 ? { color: 'white' } : { color: 'transparent' }}>{badge6}</Text></View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={6 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net7 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(6, net7) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={6 === this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemcurrentdMonth : 6 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[6]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={6 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 6 > this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemdetailHide : styles.payslipitemmoney}>{net7}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={6 === this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemcurrentdetail : 6 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay7}</Text></View>
                            </TouchableOpacity>
                            <View style={badge7 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge7 ? { color: 'white' } : { color: 'transparent' }}>{badge7}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={7 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net8 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(7, net8) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={7 === this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemcurrentdMonth : 7 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[7]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={7 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 7 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net8}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={7 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 7 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay8}</Text></View>
                            </TouchableOpacity>
                            <View style={badge8 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge8 ? { color: 'white' } : { color: 'transparent' }}>{badge8}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={8 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemlast : net9 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(8, net9) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={8 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 8 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[8]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={8 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 8 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net9}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={8 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 8 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay9}</Text></View>

                            </TouchableOpacity>
                            <View style={badge9 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge9 ? { color: 'white' } : { color: 'transparent' }}>{badge9}</Text></View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={9 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net10 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(9, net10) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={9 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth :9 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[9]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={9 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 9 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net10}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={9 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail: 9 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay10}</Text></View>
                            </TouchableOpacity>
                            <View style={badge10 ? styles.badgeIconpayslip : styles.badgeIconpayslipDisable}><Text style={badge10 ? { color: 'white' } : { color: 'transparent' }}>{badge10}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={10 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net11 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(10, net11) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={10 === this.state.currentmonth && this.state.indexselectyear === 2 ?styles.payslipitemcurrentdMonth : 10 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[10]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={10 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 10 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net11}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={10 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 10 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay11}</Text></View>
                            </TouchableOpacity>
                            <View style={badge11 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge11 ? { color: 'white' } : { color: 'transparent' }}>{badge11}</Text></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={11 === this.state.currentmonth && this.state.indexselectyear === 2 ?
                                styles.payslipitemlast :
                                net12 == 0 ? styles.payslipitemdisable : styles.payslipitem}
                                onPress={() => { this.onPayslipDetail(11, net12) }} >
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={11 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdMonth : 11 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipiteMonthHide :styles.payslipiteMonth}>{Month.monthNamesShort[11]}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={11 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdNet : 11 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemmoney}>{net12}</Text></View>
                                <View style={{ flex: 1, justifyContent: 'center' }}><Text style={11 === this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemcurrentdetail : 11 > this.state.currentmonth && this.state.indexselectyear === 2 ? styles.payslipitemdetailHide : styles.payslipitemdate}>{pay12}</Text></View>
                            </TouchableOpacity>
                            <View style={badge12 ? styles.badgeIconpayslip :styles.badgeIconpayslipDisable}><Text style={badge12 ? { color: 'white' } : { color: 'transparent' }}>{badge12}</Text></View>
                        </View>
                    </View>
                </View>
            </View>

        )
    }

    onPayslipDetail(index, data) {

        if (index > this.state.currentmonth && this.state.indexselectyear === 2) {
            return
        } else if (data === '0.00') {
            Alert.alert(
                'HAVE NO DATA',
                'No Data',
                [{
                    text: StringText.ALERT_NONPAYROLL_NODATA_BUTTON, onPress: () => {
                        // ////console.log("onLoadAlertDialog")
                    }
                },
                ],
                { cancelable: false }
            )

        } else {
            this.setState({

                isscreenloading: true,
                loadingtype: 3

            }, function () {

                this.getPayslipDetailfromAPI(this.state.selectYearArray[this.state.indexselectyear], index)

            });

        }

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
                                <View style={this.state.indexselectyear === 0 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={this.state.indexselectyear === 0 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[0]}</Text>
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
                                <View style={this.state.indexselectyear === 2 ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                    <Text style={this.state.indexselectyear === 2 ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{this.state.selectYearArray[2]}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }} />
                        </View>
                        {/* <View style={{ height: 10,backgroundColor:Colors.calendarLocationBoxColor }}/> */}
                    </View>

                </View>

                <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor, flexDirection: 'column' }}>

                    {this.PayslipDetail()}
                    {this.PayslipBody()}

                </View>
                {this.renderloadingscreen()}
            </View >
        );
    }
}