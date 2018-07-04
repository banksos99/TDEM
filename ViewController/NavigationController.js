import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {
    StackNavigator,
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


import OrganizationStruct from "./OrganizationStruct";

import calendarYearView from "./MHF03111WorkingCalendarYearView";
import calendarMonthView from "./MHF03112WorkingCalendarMonthView";
import calendarEventDetailView from "./MHF03211CalendarEventDetailView";

import clockInOutSelfView from "./MHF07011ClockInOutSelfViewView";

import registerScreen from "./MHF01210RegisterScreen";
import pinScreen from "./MHF01310PINScreen";


const AppNavigator = createSwitchNavigator({
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

    OrgStructure: { screen: OrganizationStruct },

    calendarYearView: { screen: calendarYearView },
    calendarMonthView: { screen: calendarMonthView },
    calendarEventDetailView: { screen: calendarEventDetailView },

    ClockInOutSelfView: { screen: clockInOutSelfView }

}, {
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
    render() {
        return (
            <AppNavigator />

        );
    }
}