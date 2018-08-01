import React, { Component } from 'react';

import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    BackHandler
} from 'react-native';

import { styles } from "./../SharedObject/MainStyles"

import SharedPreference from './../SharedObject/SharedPreference'
import RestAPI from "../constants/RestAPI"

// import customData from './../InAppData/non-payroll-detail-data.json';
import Decrypt from './../SharedObject/Decryptfun'
import StringText from './../SharedObject/StringText'
import moment from 'moment'

export default class NonpayrollDetailView extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            dataSource: "",
            monthYear: 'April 2018',
            isLoading: false,
            dataObject: this.props.navigation.getParam("dataObject", ""),
            selectYear: this.props.navigation.getParam("selectYear", ""),
            selectMonth: this.props.navigation.getParam("month", ""),
        }
    }

    componentDidMount() {
        // ////console.log("nonpayrollDetailView ")
        this.loadDataFromAPI()

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        // console.log("handleBackButtonClick")
        this.onBack()
        return true;
    }

    convertDateTime(date) {
        const format = 'MMMM YYYY'
        const selectedDateMonth = moment(date).format(format);
        this.setState({
            monthYear: selectedDateMonth
        })
    }

    loadDataFromAPI = async () => {
        //console.log("loadDataFromAPI : ", this.state.selectMonth, " , selectYear : ", this.state.selectYear)
        this.setState({ isLoading: true })
        await this.onLoadAPI(this.state.selectMonth, this.state.selectYear)
    }

    onLoadAPI = async (month, year) => {
        // SharedPreference.NON_PAYROLL_DETAIL_API
        let data = await RestAPI(SharedPreference.NON_PAYROLL_DETAIL_API + month + "&year=" + year, SharedPreference.FUNCTIONID_NON_PAYROLL)
        code = data[0]
        data = data[1]
        //console.log("nonPayRollCallback data : ", data)
        if (code.SUCCESS == data.code) {
            this.convertDateTime(data.data.detail[0].pay_date)
            this.setState({
                dataSource: data.data,
                isLoading: false
            })
            this.getNonPayrollDetail()

        }else if(code.INVALID_AUTH_TOKEN == data.code){  
            this.onAutenticateErrorAlertDialog(data)

        } else {
            Alert.alert(
                StringText.ALERT_CANNOT_CONNECT_TITLE,
                StringText.ALERT_CANNOT_CONNECT_DESC,
                [{
                    text: 'OK', onPress: () => {
                        this.setState({
                            isLoading: false
                        })
                    }
                },
                ],
                { cancelable: false }
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
                    timerstatus = false
                    SharedPreference.profileObject = null
                    this.saveProfile.setProfile(null)
                    this.props.navigation.navigate('RegisterScreen')
                }
            }],
            { cancelable: false }
        )

        console.log("error : ", error)
    }

    getNonPayrollDetail() {
        try {
            const format = 'DD/MM/YYYY'
            detail = []

            let array = this.state.dataSource.detail

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                // ////console.log("getNonPayrollDetail ==> element : ", element.pay_date)
                const items = element.items;
                const datetime = moment(element.pay_date).format(format);
                detail.push(this.renderDate(datetime))
                subDetail = []

                for (let index2 = 0; index2 < items.length; index2++) {
                    const item = items[index2];
                    const detail = item.tran_detail;
                    const money = item.nonpay_amt
                    var decodedString = this.decrypt(money)
                    subDetail.push(this.renderSection(detail, decodedString))
                }
                detail.push(subDetail);
                detail.push(<View style={{ height: 1, backgroundColor: 'gray' }}></View>
                );
            }

            return detail
        } catch (error) {
            //////console.log('getNonPayrollDetail ==> error :', error);
        }
    }
    // return Decrypt.decrypt(code);
    decrypt(code) {
        return Decrypt.decrypt(code);
    }

    renderDate(date) {
        return (
            <Text style={styles.nonPayRollTitleText}>{date}</Text>
        );
    }

    renderSection(detail, money) {
        return (
            <View>
                <View style={styles.nonPayRollLeftContainer}>
                    <Text style={styles.nonPayRolldateDetailText}>{detail}</Text>
                </View>
                <View style={styles.nonPayRollRightContainer}>
                    <Text style={styles.nonPayRolldateMoneyText}>{money}</Text>
                </View>
            </View >
        );
    }

    onBack() {
        //console.log("====================")
        //console.log("dataResponse : ", this.state.dataObject)
        //console.log("selectYear : ", this.state.selectYear)

        this.props.navigation.navigate('NonPayrollList', {
            dataResponse: this.state.dataObject,
            selectYear: this.state.selectYear
        }
        );
    }


    renderProgressView() {
        if (this.state.isLoading) {
            return (
                <View style={styles.alertDialogContainer}>
                    <View style={styles.alertDialogBackgroudAlpha} />
                    {/* bg */}
                    <View style={styles.alertDialogContainer}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.container} >
                    <View style={styles.navContainer}>
                        <TouchableOpacity style={styles.navLeftContainer}
                            onPress={(this.onBack.bind(this))}
                        >
                            <Image
                                style={styles.navBackButton}
                                source={require('../resource/images/Back.png')}
                            />
                        </TouchableOpacity>
                        <Text style={styles.navTitleText}>Non-Payroll Detail</Text>
                    </View>

                    <ScrollView style={{ marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.nonPayRolldateYearText}>{this.state.monthYear}</Text>
                        <View style={{ height: 1, backgroundColor: 'gray' }}></View>
                        {this.getNonPayrollDetail()}
                    </ScrollView>

                </View >

                {this.renderProgressView()}
            </View>
        );
    }
}

