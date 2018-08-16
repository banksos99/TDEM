import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    BackHandler
} from 'react-native';

import StringText from './../SharedObject/StringText'
import Decrypt from './../SharedObject/Decryptfun'

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"

import Months from "./../constants/Month"
import firebase from 'react-native-firebase';

import SharedPreference from "./../SharedObject/SharedPreference"

export default class NonpayrollActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temparray: [],
            dataSource: this.props.navigation.getParam("dataResponse", ""),
            selectYear: this.props.navigation.getParam("selectYear", new Date().getFullYear()),
            currentYearData: [],
            dataSource: this.props.navigation.getParam("dataResponse", ""),
            badgeArray: this.props.navigation.getParam("badgeArray", []),
            lastYearData: []
        };
        firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_NON_PAYROLL_LIST)

        //console.log("badgeArray ==> ", this.state.badgeArray)

    }

    onBack() {

        this.props.navigation.navigate('HomeScreen');
    }
    componentDidMount() {

        //this.inappTimeInterval()
    }
    componentWillUnmount() {

        // clearTimeout(this.timer);

    }
    // inappTimeInterval() {

    //     this.timer = setTimeout(() => {
    //         this.onLoadInAppNoti()
    //        },SharedPreference.timeinterval);
    // };

    // onLoadInAppNoti = async () => {
    //     //TODO bell
    //     let lastTime = await this.saveTimeNonPayroll.getTimeStamp()
    //     if ((lastTime == null) || (lastTime == undefined)) {
    //         let today = new Date()
    //         const _format = 'YYYY-MM-DD hh:mm:ss'
    //         const newdate = moment(today).format(_format).valueOf();
    //         lastTime = newdate
    //     }
    //     latest_date = "2017-01-01 12:00:00"
    //     FUNCTION_TOKEN = await Authorization.convert(SharedPreference.profileObject.client_id, 1, SharedPreference.profileObject.client_token)
    //     let urlPullnoti = SharedPreference.PULL_NOTIFICATION_API + latest_date
    //     console.log('urlPullnoti : ', urlPullnoti);
    //     console.log('FUNCTION_TOKEN : ', FUNCTION_TOKEN)

    //     return fetch(urlPullnoti, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: FUNCTION_TOKEN,
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {

    //             try {

    //                 if (responseJson.status == 403) {

    //                     this.onAutenticateErrorAlertDialog()

    //                     inappTimeIntervalStatus = false

    //                 } else if (responseJson.status == 200) {

    //                     let dataArray = responseJson.data
    //                     let currentyear = new Date().getFullYear();

    //                     let monthArray = []
    //                     for (let index = 0; index < 12; index++) {
    //                         monthData = {
    //                             "month": index + 1,
    //                             "badge": 0
    //                         }
    //                         monthArray.push(monthData)
    //                     }

    //                     let dataCustomArray = [
    //                         {
    //                             "year": currentyear - 1,
    //                             "detail": monthArray
    //                         },
    //                         {
    //                             "year": currentyear,
    //                             "detail": monthArray
    //                         },
    //                     ]

    //                     for (let index = 0; index < dataArray.length; index++) {
    //                         const dataReceive = dataArray[index];
    //                         // //console.log("element ==> ", dataReceive.function_id)

    //                         if (dataReceive.function_id == "PHF06010") {//if nonPayroll
    //                             dataListArray = dataReceive.data_list

    //                             // //console.log("dataListArray ==> ", dataListArray)
    //                             for (let index = 0; index < dataListArray.length; index++) {
    //                                 const str = dataListArray[index];
    //                                 // //console.log("str ==> ", str)
    //                                 var res = str.split("|");

    //                                 var data = res[1]

    //                                 var monthYear = data.split("-");

    //                                 var year = monthYear[0]
    //                                 var month = monthYear[1]

    //                                 for (let index = 0; index < dataCustomArray.length; index++) {
    //                                     const data = dataCustomArray[index];


    //                                     if (year == data.year) {
    //                                         const detail = data.detail


    //                                         let element = detail.find((p) => {
    //                                             return p.month === JSON.parse(month)
    //                                         });

    //                                         element.badge = element.badge + 1

    //                                     }
    //                                 }
    //                             }
    //                         } else if (dataReceive.function_id == "PHF02010") {

    //                             console.log("announcement badge ==> ", dataReceive.badge_count)

    //                             SharedPreference.notiAnnounceMentBadge = parseInt(dataReceive.badge_count) + parseInt(SharedPreference.notiAnnounceMentBadge)

    //                         }

    //                     }

    //                     this.setState({
    //                         nonPayrollBadge: dataCustomArray
    //                     })

    //                 }
    //                 if (inappTimeIntervalStatus) {
    //                     this.inappTimeInterval()
    //                 }



    //             } catch (error) {

    //             }
    //         })
    //         .catch((error) => {



    //         });
    // }



    renderRollItem() {
        year = 12
        monthRow = []
        monthContainer = []

        for (let index = 0; index < year; index++) {
            let month = index + 1
            let badge = 0
            for (let index = 0; index < this.state.badgeArray.length; index++) {
                const element = this.state.badgeArray[index];
                // //console.log("getBadgeCount ==> element ", element)
                // //console.log("getBadgeCount ==> year ", element.year, " , year ==> ", this.state.selectYear)
                if (element.year == this.state.selectYear) {
                    let data = element.detail.find((p) => {
                        return p.month === month
                    });
                    // //console.log("getBadgeCount ==>  data : ", data)
                    badge = data.badge
                }
            }

            // //console.log("element badge ==> ",badge)

            monthRow.push(
                this.customMonthContainer(month, this.checkAmount(this.state.selectYear, month), badge, index)
            )
            if (index % 3 === 2) {
                monthContainer.push(
                    <View style={{ flex: 1, flexDirection: 'row' }} key={index}>
                        {monthRow}
                    </View>)
                monthRow = []
            }
        }
        return monthContainer
    }

    checkAmount(selectYear, selectMonth) {
        if (this.state.dataSource) {
            let dataArray = this.state.dataSource.years;
            for (let index = 0; index < dataArray.length; index++) {
                const object = dataArray[index];
                if (object.year == selectYear) {
                    for (let k = 0; k < object.detail.length; k++) {
                        const element = object.detail
                        if (object.detail[k].month_no == selectMonth) {
                            // //console.log("month ==> ", object.detail.month, " , selectMonth : ", selectMonth)
                            return this.convertAmount(object.detail[k].sum_nonpay_amt)
                        }
                    }
                }
            }
            return false
        }

    }

    convertAmount(code) {
        //console.log("convertAmount ==> month ==> code ==> ", code)
        return Decrypt.decrypt(code);
    }

    customMonthContainer(monthNumber, amount, badge, index) {

        if (badge == null) {
            badge = 0
        }

        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth() + 1

        if ((currentMonth == monthNumber) && (currentYear == this.state.selectYear)) {//currentMonth

            if (amount) {

                return (<View style={styles.nonPayRollitemBg} key={index}>
                    <View style={[styles.nonPayRollitem, {
                        backgroundColor: Colors.calendarRedDotColor
                    }]}>
                        <TouchableOpacity
                            style={{ width: '100%', height: '100%' }}
                            disable={amount}
                            onPress={() => {

                                this.props.navigation.navigate('NonPayrollDetail', {
                                    month: monthNumber,
                                    selectYear: this.state.selectYear,
                                    dataObject: this.state.dataSource
                                });
                            }}>
                            <View style={styles.nonPayRollDetailContainer}>
                                <Text style={[styles.payslipitemdetail, { color: 'white' }]}>{Months.monthNamesShort[monthNumber - 1]}</Text>
                            </View>
                            <View style={styles.nonPayRollDetailContainer}>
                                <Text style={[styles.payslipitemmoney, { color: 'white' }]}>{amount}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {badge != 0 ?
                        <View style={styles.nonPayrollBadgeContrainer}>
                            <Text style={styles.nonPayrollBadgeText}>
                                {badge}
                            </Text>
                        </View>
                        : null}
                </View>)
            }
            amount = '0.00'
            return (<View style={styles.nonPayRollitemBg} key={index}>
                <View style={[styles.nonPayRollitem, {
                    backgroundColor: Colors.calendarRedDotColor
                }]}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%' }}
                        disable={amount}
                        onPress={() => {
                            this.onLoadAlertDialog()
                        }}>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={[styles.payslipitemdetail, { color: 'white' }]}>{Months.monthNamesShort[monthNumber - 1]}</Text>
                        </View>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={[styles.payslipitemmoney, { color: 'white' }]}>{amount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {badge != 0 ?
                    <View style={styles.nonPayrollBadgeContrainer}>
                        <Text style={styles.nonPayrollBadgeText}>
                            {badge}
                        </Text>
                    </View>
                    : null}
            </View>)


        } else if ((monthNumber > currentMonth) && (currentYear == this.state.selectYear)) {//After currentMonth
            // nodata
            return <View style={[styles.nonPayRollitem, {
                backgroundColor: 'white',
            }]} key={index}>
            </View>

        } else if (amount) {//Normal Month - Has data 
            //console.log('amount :', amount)
            return (
                <View style={styles.nonPayRollitemBg} key={index}>
                    <View style={[styles.nonPayRollitem, {
                        backgroundColor: Colors.calendarLocationBoxColor
                    }]}>
                        <TouchableOpacity
                            style={{ width: '100%', height: '100%' }}
                            onPress={() => {
                                //console.log("onPress ==> monthNumber ==> ", monthNumber, " , year ==> ", this.state.selectYear)
                                let badgeData = this.state.badgeArray
                                //console.log("onPress ==> badgeData1 ==> ", badgeData)
                                for (let index = 0; index < badgeData.length; index++) {
                                    const element = badgeData[index];
                                    if (element.year = this.state.selectYear) {
                                        let data = element.detail.find((p) => {
                                            return p.month === monthNumber
                                        });
                                        data.badge = 0
                                    }
                                }
                                //console.log("onPress ==> badgeData2 ==> ", badgeData)

                                this.props.navigation.navigate('NonPayrollDetail', {
                                    month: monthNumber,
                                    badgeData: badgeData,
                                    selectYear: this.state.selectYear,
                                    dataObject: this.state.dataSource
                                });
                            }} >
                            <View style={styles.nonPayRollDetailContainer} >
                                <Text style={styles.payslipitemdetail}>{Months.monthNamesShort[monthNumber - 1]}</Text>
                            </View>
                            <View style={styles.nonPayRollDetailContainer}>
                                <Text style={styles.payslipitemmoney}>{amount}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {badge != 0 ?
                        <View style={styles.nonPayrollBadgeContrainer}>
                            <Text style={styles.nonPayrollBadgeText}>
                                {badge}
                            </Text>
                        </View>
                        : null}
                </View>
            )


        } else {//
            return (//Normal Month - No data
                <View style={[styles.nonPayRollitem, {
                    backgroundColor: "white",
                }]} key={index}>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%' }}
                        onPress={() => {
                            this.onLoadAlertDialog()
                        }}>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemdetail}>{Months.monthNamesShort[monthNumber - 1]}</Text>
                        </View>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemdetail}>00.00</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )
        }
    }
    onAutenticateErrorAlertDialog(error) {
        this.setState({
            isscreenloading: false,
        })

        Alert.alert(
            StringText.ALERT_AUTHORLIZE_ERROR_TITLE,
            StringText.ALERT_AUTHORLIZE_ERROR_MESSAGE,
            [{
                text: 'OK', onPress: () => {
                    this.select_sign_out()
                }
            }],
            { cancelable: false }
        )

        //console.log("error : ", error)
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


    onDetail() {
        this.props.navigation.navigate('NonPayrollDetail');
    }

    onLastYear() {
        this.setState({
            selectYear: new Date().getFullYear() - 1
        })
    }

    onCurrentYear() {
        this.setState({
            selectYear: new Date().getFullYear()
        })
    }

    nonPayRollItem() {
        return (
            <View style={styles.nonPayRollItemContainer}>
                {this.renderRollItem}
            </View>
        )
    }

    renderTabYearSelect() {
        let lastYear = new Date().getFullYear() - 1
        return (
            <View style={styles.selectYearContainer}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={(this.onLastYear.bind(this))} >
                    <View style={this.state.selectYear === lastYear ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                        <Text style={this.state.selectYear === lastYear ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{lastYear}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={(this.onCurrentYear.bind(this))} >
                    <View style={this.state.selectYear === (lastYear + 1) ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                        <Text style={this.state.selectYear === (lastYear + 1) ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{lastYear + 1}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>)

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.navContainer}>
                    <TouchableOpacity style={styles.navLeftContainer} onPress={(this.onBack.bind(this))}>
                        <Image
                            style={styles.navBackButton}
                            source={require('../resource/images/Back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.navTitleText}>Non Payroll</Text>
                </View>

                <View style={styles.tabbarSelectYearContainer}>
                    {this.renderTabYearSelect()}
                </View>
                <View style={styles.nonPayRollMonthContainer}>
                    {this.renderRollItem()}
                </View>
            </View >
        );
    }
}