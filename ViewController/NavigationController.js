import React, { Component } from 'react';
import {
    createSwitchNavigator,
} from 'react-navigation';

import homeScreen from "./MHF01410MainView";
import empInfoDetail from "./MHF04011EmpInfoSelfViewView";
import nonPayrollList from "./MHF06011NonPayrollListView";
import nonPayrollDetail from "./MHF06012NonPayrollDetailView";

import payslipList from "./MHF05011PaySlipListView";
import payslipDetail from "./MHF05012PaySlipDetailView";

import leavequotaList from "./MHF09011LeaveQuotaListView";
import leavequotaDetail from "./MHF09012LeaveQuotaDetailView";

import OTSummarySelfView from "./MHF08011OTSummarySelfViewView";

import handbookList from "./MHF0A011HandbookListView";
import handbookDetail from "./MHF0A012HandbookDetailView";

import OrganizationStruct from "./MHF0B011OrganizationStruct";


import calendarYearView from "./MHF03111WorkingCalendarYearView";
import calendarYearView2 from "./MHF03111WorkingCalendarYearView2";

import calendarMonthView from "./MHF03112WorkingCalendarMonthView";
import calendarEventDetailView from "./MHF03211CalendarEventDetailView";

import clockInOutSelfView from "./MHF07011ClockInOutSelfViewView";

import registerScreen from "./MHF01210RegisterScreen";
import pinScreen from "./MHF01310PINScreen";

import SaveProfile from "../constants/SaveProfile"

import OTLineChartView from "./MHF08013OTSummaryLineGraphView";
import OTBarChartView from "./MHF08014OTSummaryBarGraphView";
import OrganizationOTStruct from "./MHF0B010OrganizationStruct";
import announcementdetail from "./MHF02011AnnouncementDetailView"
import SharedPreference from './../SharedObject/SharedPreference';

let mon = ['Jan', 'Feb', 'Mar', 'Apl', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

import ChangePINScreen from "./ChangePINScreen"

const AppNavigatorPin = createSwitchNavigator({
    RegisterScreen: { screen: registerScreen },
    PinScreen: { screen: pinScreen },
    HomeScreen: { screen: homeScreen },
    EmployeeInfoDetail: { screen: empInfoDetail },
    NonPayrollList: { screen: nonPayrollList },
    NonPayrollDetail: { screen: nonPayrollDetail },
    PayslipList: { screen: payslipList },
    PayslipDetail: { screen: payslipDetail },
    LeavequotaList: { screen: leavequotaList },
    LeavequotaDetail: { screen: leavequotaDetail },
    OTSummarySelfView: { screen: OTSummarySelfView },
    Handbooklist: { screen: handbookList },
    HandbookDetail: { screen: handbookDetail },
    OrganizationStruct: { screen: OrganizationStruct },
    OrgStructure: { screen: OrganizationStruct },
    calendarYearView: { screen: calendarYearView },
    calendarYearView2: { screen: calendarYearView2 },
    calendarMonthView: { screen: calendarMonthView },
    calendarEventDetailView: { screen: calendarEventDetailView },
    AnnouncementDetail: { screen: announcementdetail },
    ClockInOutSelfView: { screen: clockInOutSelfView },
    OTLineChartView: { screen: OTLineChartView },
    OTBarChartView: { screen: OTBarChartView },
    OrganizationOTStruct: { screen: OrganizationOTStruct },
    AnnouncementDetail: { screen: announcementdetail },
    ChangePINScreen: { screen: ChangePINScreen }
}, {
        initialRouteName: 'PinScreen',
        headerMode: 'none',
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0
            }
        })
    }
);


const AppNavigatorRegister = createSwitchNavigator({
    RegisterScreen: { screen: registerScreen },
    PinScreen: { screen: pinScreen },
    HomeScreen: { screen: homeScreen },
    EmployeeInfoDetail: { screen: empInfoDetail },
    NonPayrollList: { screen: nonPayrollList },
    NonPayrollDetail: { screen: nonPayrollDetail },
    PayslipList: { screen: payslipList },
    PayslipDetail: { screen: payslipDetail },
    LeavequotaList: { screen: leavequotaList },
    LeavequotaDetail: { screen: leavequotaDetail },
    OTSummarySelfView: { screen: OTSummarySelfView },
    Handbooklist: { screen: handbookList },
    HandbookDetail: { screen: handbookDetail },
    OrganizationStruct: { screen: OrganizationStruct },
    OrgStructure: { screen: OrganizationStruct },
    calendarYearView: { screen: calendarYearView },
    calendarYearView2: { screen: calendarYearView2 },
    calendarMonthView: { screen: calendarMonthView },
    calendarEventDetailView: { screen: calendarEventDetailView },
    ClockInOutSelfView: { screen: clockInOutSelfView },
    OTLineChartView: { screen: OTLineChartView },
    OTBarChartView: { screen: OTBarChartView },
    OrganizationOTStruct: { screen: OrganizationOTStruct },
    AnnouncementDetail: { screen: announcementdetail },
    ChangePINScreen: { screen: ChangePINScreen }
}, {
        initialRouteName: 'RegisterScreen',
        headerMode: 'none',
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0
            }
        })
    }
);
export default class rootNavigation extends Component {
    saveProfile = new SaveProfile()
    constructor(props) {
        super(props);
        this.state = {
            hasPin: false,
            number: "111111"
        };
    }
    async componentDidMount() {
        // this.inappTimeInterval();

    }
    getParsedDate() {

        let date = new Date()

        date = String(date).split(' ');

        let days = String(date[0]).split('-');

        let hours = String(date[4]).split(':');

        let mon_num = 0

        for (let i = 0; i < mon.length; i++) {
            if (mon[i] === date[1]) {
                mon_num = i + 1;
            }

        }
        return date[3] + '-' + mon_num + '-' + date[2] + ' ' + hours[0] + ':' + hours[1] + ':' + hours[2];

    }
    onLoadAppInfo = async () => {

        let newdate = this.getParsedDate()
        FUNCTION_TOKEN = await Authorization.convert(SharedPreference.profileObject.client_id, SharedPreference.FUNCTIONID_PUSH_NOTIFICATION, SharedPreference.profileObject.client_token)

        return fetch(SharedPreference.PULL_NOTIFICATION_API + newdate, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: FUNCTION_TOKEN,
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                try {
                    this.inappTimeInterval()
                    console.log('responseJson :', responseJson)

                    if (responseJson.status == 403) {

                        SharedPreference.profileObject = null
                        this.saveProfile.setProfile(null)
                        this.props.navigation.navigate('RegisterScreen')
                        console.log('this.props.navigation :', this.props.navigation)
                        console.log('this.state' + this.state.number)
                    }

                    this.setState({


                    }, function () {



                    });

                } catch (error) {

                    //console.log('erreo1 :', error);

                }
            })
            .catch((error) => {

                console.log('error :', error)


            });
    }

    inappTimeInterval() {
        this.timer = setTimeout(() => {
            this.onLoadAppInfo()

        }, 200000);
    };

    async componentWillMount() {
        // number = await this.getPINFromDevice()
        profile = await this.getProfileObject()
    }

    getProfileObject = async () => {
        profileObject = await this.saveProfile.getProfile()
        console.log("NavigationController ==> ", profileObject)
        if (profileObject) {
            this.setState({
                hasPin: true
            })
        }
    }

    render() {
        if (this.state.hasPin == false) {
            return (
                <AppNavigatorRegister />
            );
        } else {
            return (
                <AppNavigatorPin />
            );
        }

    }
}