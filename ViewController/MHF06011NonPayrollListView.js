import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

import StringText from './../SharedObject/StringText'
import Decrypt from './../SharedObject/Decryptfun'

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"


let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default class NonpayrollActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temparray: [],
            dataSource: this.props.navigation.getParam("dataResponse", ""),
            selectYear: this.props.navigation.getParam("selectYear", new Date().getFullYear()),
            // selectYear: new Date().getFullYear(),
            currentYearData: [],
            lastYearData: []
        };

    }

    renderRollItem() {
        year = 12
        monthRow = []
        monthContainer = []

        for (let index = 0; index < year; index++) {
            let month = index + 1
            monthRow.push(
                this.customMonthContainer(month, this.checkAmount(this.state.selectYear, month))
            )
            if (index % 3 === 2) {
                monthContainer.push(
                    <View style={{ flex: 1, flexDirection: 'row' }}>
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
                            //////console.log("month ==> ", object.detail.month, " , selectMonth : ", selectMonth)
                            return this.convertAmount(object.detail[k].sum_nonpay_amt)
                        }
                    }
                }
            }
            return false
        }

    }

    convertAmount(code) {
        return Decrypt.decrypt(code);
    }

    customMonthContainer(monthNumber, amount) {
        //console.log("monthNumber : ", monthNumber)

        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth() + 1
        if ((currentMonth == monthNumber) && (currentYear == this.state.selectYear)) {
            if (amount == false) {
                amount = '0.00'
            }
            return <View style={[styles.nonPayRollitem, {
                backgroundColor: Colors.calendarRedDotColor,
            }]}>
                <TouchableOpacity style={styles.button}
                    onPress={() => {

                        if (amount == '0.00') {
                            this.onLoadAlertDialog();
                        } else {
                            this.props.navigation.navigate('NonPayrollDetail', {
                                month: monthNumber,
                                selectYear: this.state.selectYear,
                                dataObject: this.state.dataSource
                            });
                        }
                    }}
                >
                    <View style={styles.nonPayRollDetailContainer}>
                        <Text style={[styles.payslipitemdetail, { color: 'white' }]}>{month[monthNumber - 1]}</Text>
                    </View>
                    <View style={styles.nonPayRollDetailContainer}>
                        <Text style={[styles.payslipitemmoney, { color: 'white' }]}>{amount}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        } else if ((monthNumber > currentMonth) && (currentYear == this.state.selectYear)) {
            return <View style={[styles.nonPayRollitem, {
                backgroundColor: 'white',
            }]}>
            </View>
        } else if (amount == false) {
            return (
                <View style={[styles.nonPayRollitem, {
                    backgroundColor: 'white',
                }]}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.onLoadAlertDialog()
                        }}>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemdetail}>{month[monthNumber - 1]}</Text>
                        </View>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemmoney}>0.00</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )

        } else {
            return (
                <View style={[styles.nonPayRollitem, {
                    backgroundColor: Colors.calendarLocationBoxColor
                }]}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.props.navigation.navigate('NonPayrollDetail', {
                                month: monthNumber,
                                selectYear: this.state.selectYear,
                                dataObject: this.state.dataSource
                            });
                        }} >
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemdetail}>{month[monthNumber - 1]}</Text>
                        </View>
                        <View style={styles.nonPayRollDetailContainer}>
                            <Text style={styles.payslipitemmoney}>{amount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    onLoadAlertDialog() {
        // //console.log("onLoadAlertDialog")
        Alert.alert(
            StringText.ALERT_NONPAYROLL_NODATA_TITLE,
            StringText.ALERT_NONPAYROLL_NODATA_TITLE,
            [{
                text: StringText.ALERT_NONPAYROLL_NODATA_BUTTON, onPress: () => {
                    // //console.log("onLoadAlertDialog")
                }
            },
            ],
            { cancelable: false }
        )
    }
    onBack() {
        this.props.navigation.navigate('HomeScreen');
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