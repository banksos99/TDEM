import React, { Component } from 'react';


import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    Button,
    TouchableOpacity,
    ListView,
    RefreshControl,
    Image, Picker, WebView,
    Platform,
    ActivityIndicator,
    Alert,
    moment,
    BackHandler
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import Layout from "./../SharedObject/Layout"
import SharedPreference from "./../SharedObject/SharedPreference"

import { styles } from "./../SharedObject/MainStyles"
import Months from "./../constants/Month"
import StringText from '../SharedObject/StringText';
import RestAPI from "../constants/RestAPI"
import firebase from 'react-native-firebase';

let scale = Layout.window.height / 320;

let firstday;
let daymonth;
let currentday;
let currentmonth;
let initannouncementType;

export default class ClockInOutSelfView extends Component {

    constructor(props) {

        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        let today = new Date();

        currentday = today.getDate() - 1;
        currentmonth = today.getMonth();
        this.state = {
            isscreenloading: false,
            dataSource: ds,
            page: 1,
            data: [],
            fetching: false,
            refreshing: false,
            url: '',
            showincome: true,
            Heightincome: 0,
            heightdeduct: 0,
            incomeBG: Colors.greenTextColor,
            incomeText: 'white',
            deductBG: Colors.pink,
            deductText: Colors.lightred,
            bordercolor: Colors.greenTextColor,

            months: [],
            tdataSource: [],
            initialyear: 0,
            initialmonth: 0,
            yearselected: 0,
            monthselected: today.getMonth() + 1,
            dateselected: 0,
            tfirstday: 0,
            manager: this.props.navigation.getParam("manager", ""),
            previous: this.props.navigation.getParam("previous", ""),
            employee_name: this.props.navigation.getParam("employee_name", ""),
            employee_position: this.props.navigation.getParam("employee_position", ""),
        }
        tempannouncementType=0;
        tempinitannouncementType = 0;
        tempinitannouncementTypetext = 0;
        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));
        let birthday = new Date(Months.monthNames[this.state.initialmonth + 1] + '1,' + this.state.initialyear);
        firstday = birthday.getDay() + 1;

        if (this.state.manager) {
            title = 'Clock In - Out Manager View'
        } else {
            title = 'Clock In - Out'

        }
        firebase.analytics().setCurrentScreen(SharedPreference.SCREEN_CLOCK_IN_OUT_SELF)
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.settimerInAppNoti()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        clearTimeout(this.timer);
    }

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

    checkDataFormat(DataResponse) {

        console.log('DataResponse :', DataResponse);
        //console.log('monthselected :', this.state.monthselected);
        ////console.log('initialmonth :', this.state.initialmonth);
        // if (DataResponse) {

        let today = new Date();
        date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
        this.state.initialyear = today.getFullYear();
        this.state.initialmonth = parseInt(today.getMonth() - 1);
        this.state.announcementTypetext = Months.monthNames[this.state.initialmonth + 1] + ' ' + this.state.initialyear;
        for (let i = this.state.initialmonth + 13; i > this.state.initialmonth + 1; i--) {

            if (i === 11) {

                this.state.initialyear--;
            }
            this.state.months.push(Months.monthNames[i % 12] + ' ' + this.state.initialyear)
        }

        var monthnow = new Date(this.state.initialyear, this.state.initialmonth + 1, 1);
        var monthnext = new Date(this.state.initialyear, this.state.initialmonth + 2, 1);
        //console.log('monthnow :', this.state.initialmonth);
        var date1_ms = monthnow.getTime();
        var date2_ms = monthnext.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        var one_day = 1000 * 60 * 60 * 24;

        daymonth = Math.round(difference_ms / one_day)

        for (let m = 0; m < daymonth; m++) {
            let datetype = 0;
            let workstart = '-';
            let workend = '-';
            let actualstart = '-';
            let actualend = '-';
            let late = 0;
            let early = 0;

            if (DataResponse.data) {

                //console.log('have data work', DataResponse.data.items.length)

                for (let i = 0; i < DataResponse.data.items.length; i++) {

                    let item = DataResponse.data.items[i].date.split('-');

                    if (parseInt(item[2]) == m + 1) {

                        datetype = DataResponse.data.items[i].datetype;
                        //console.log('have data work', DataResponse.data.items[i].work)
                        if (DataResponse.data.items[i].work) {
                            //console.log('have data work')
                            if (DataResponse.data.items[i].work.start) {
                                workstart = DataResponse.data.items[i].work.start;
                            }

                            if (DataResponse.data.items[i].work.end) {
                                workend = DataResponse.data.items[i].work.end;
                            }
                        }

                        if (DataResponse.data.items[i].actual) {
                            //console.log('have data actual')
                            if (DataResponse.data.items[i].actual.start) {
                                actualstart = DataResponse.data.items[i].actual.start;
                            }
                            if (DataResponse.data.items[i].actual.end) {
                                actualend = DataResponse.data.items[i].actual.end;
                            }
                        }

                        var wstart = new Date('Jan 01 2007 ' + workstart + ':00');
                        var astart = new Date('Jan 01 2007 ' + actualstart + ':00');

                        var date1_ms = wstart.getTime();
                        var date2_ms = astart.getTime();

                        var difference_start = date2_ms - date1_ms;

                        if ((difference_start / 60000) > 0) {
                            late = 1
                        }
                        var wend = new Date('Jan 01 2007 ' + workend + ':00');
                        var aend = new Date('Jan 01 2007 ' + actualend + ':00');

                        var date3_ms = wend.getTime();
                        var date4_ms = aend.getTime();

                        var difference_end = date4_ms - date3_ms;

                        if ((difference_end / 60000) < 0) {
                            early = 1

                            break;
                        }

                    }

                }

            }

            this.state.tdataSource.push({
                datetype: datetype,
                workstart: workstart,
                workend: workend,
                actualstart: actualstart,
                actualend: actualend,
                late: late,
                early: early
            })

        }
        //sert initial data
        initannouncementType = this.state.months[0]
        tempinitannouncementType = this.state.months[0];
        initannouncementType = tempinitannouncementType;
        //tempinitannouncementTypetext = tempinitannouncementType;
      //  this.state.announcementType = initannouncementType;
        this.state.tempannouncementTypetext= initannouncementType;
        //console.log('init data : ', this.state.months[0])

    }

    onBack() {

        if (this.state.previous == 1) {

            this.props.navigation.navigate('OrgStructure');

        } else if (this.state.previous == 2) {

            this.props.navigation.navigate('EmployeeList');

        } else {

            this.props.navigation.navigate('HomeScreen');

        }

    }

    loadClockInOutfromAPI = async (omonth, oyear) => {

        this.state.yearselected = oyear;
        this.state.monthselected = omonth;


        let tmonth = omonth.toString();


        if (omonth < 10) {
            tmonth = '0' + omonth
        }
        let today = new Date();
        let birthday = new Date(Months.monthNames[parseInt(omonth) - 1] + '1,' + oyear);
        firstday = birthday.getDay();

        let url = SharedPreference.CLOCK_IN_OUT_API + SharedPreference.profileObject.employee_id + '&month=' + tmonth + '&year=' + oyear
        //console.log('CLOCK_IN_OUT_API :', url)

        this.APICallback(await RestAPI(url, SharedPreference.FUNCTIONID_CLOCK_IN_OUT))

    }

    APICallback(data) {

        code = data[0]
        data = data[1]
        //console.log('CLOCK_IN_OUT_API data :', data)
        if (code.SUCCESS == data.code) {

            this.state.tdataSource = [];

            for (let i = 0; i < data.data.items.length; i++) {

                let datetype = 0;
                let workstart = '-';
                let workend = '-';
                let actualstart = '-';
                let actualend = '-';
                let late = 0;
                let early = 0;

                if (data.data.items[i].work) {

                    if (data.data.items[i].work.start) {
                        workstart = data.data.items[i].work.start;
                    }
                    if (data.data.items[i].work.end) {
                        workend = data.data.items[i].work.end;
                    }

                }
                if (data.data.items[i].actual) {
                    if (data.data.items[i].actual.start) {
                        actualstart = data.data.items[i].actual.start;
                    }
                    if (data.data.items[i].actual.end) {
                        actualend = data.data.items[i].actual.end;
                    }
                }

                var wstart = new Date('Jan 01 2007 ' + workstart + ':00');
                var astart = new Date('Jan 01 2007 ' + actualstart + ':00');

                var date1_ms = wstart.getTime();
                var date2_ms = astart.getTime();

                var difference_start = date2_ms - date1_ms;

                if ((difference_start / 60000) > 0) {
                    late = 1
                }
                var wend = new Date('Jan 01 2007 ' + workend + ':00');
                var aend = new Date('Jan 01 2007 ' + actualend + ':00');

                var date3_ms = wend.getTime();
                var date4_ms = aend.getTime();

                var difference_end = date4_ms - date3_ms;

                if ((difference_end / 60000) < 0) {
                    early = 1

                }

                this.state.tdataSource.push({
                    datetype: data.data.items[i].datetype,
                    workstart: workstart,
                    workend: workend,
                    actualstart: actualstart,
                    actualend: actualend,
                    late: late,
                    early: early

                })


            }
        } else {

            this.state.tdataSource = [];
            var monthnow = new Date(this.state.yearselected, this.state.monthselected + 1, 1);
            var monthnext = new Date(this.state.yearselected, this.state.monthselected + 2, 1);
            //console.log('monthselected :', this.state.monthselected);
            var date1_ms = monthnow.getTime();
            var date2_ms = monthnext.getTime();
            var difference_ms = date2_ms - date1_ms;
            var one_day = 1000 * 60 * 60 * 24;

            daymonth = Math.round(difference_ms / one_day)

            for (let m = 0; m < daymonth; m++) {

                let datetype = 0;
                let workstart = '-';
                let workend = '-';
                let actualstart = '-';
                let actualend = '-';
                let late = 0;
                let early = 0;

                this.state.tdataSource.push({
                    datetype: datetype,
                    workstart: workstart,
                    workend: workend,
                    actualstart: actualstart,
                    actualend: actualend,
                    late: late,
                    early: early

                })
            }

        }
        //console.log('tdataSource : ', this.state.tdataSource)
        this.setState({
            isscreenloading: false,
        })
    }

    onLoadErrorAlertDialog(error) {

        if (this.state.isConnected) {

            Alert.alert(
                'MHF00001ACRI',
                'Cannot connect to server. Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => {
                        //console.log('OK Pressed')
                    }
                }],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'MHF00002ACRI',
                'System Error (API). Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => {
                        //console.log("onLoadErrorAlertDialog")
                    }
                }],
                { cancelable: false }
            )
        }
        //console.log("error : ", error)
    }


    select_month() {
        tempannouncementType = this.state.announcementType
        this.setState({

            loadingtype: 0,
            isscreenloading: true,

        }, function () {

            this.setState(this.renderloadingscreen())
        });
    }
    cancel_select_change_month = () => {
        
       // console.log('tempannouncementType =>', tempannouncementType)

        this.setState({
           announcementType: tempannouncementType,
            loadingtype: 1,
            isscreenloading: false,

        })

    }
    cancel_select_change_month_andr(){
        
        // console.log('tempannouncementType =>', tempannouncementType)
 
         this.setState({
           // announcementType: tempannouncementType,
             loadingtype: 1,
             isscreenloading: false,
 
         })
 
     }
    select_month_clockinout() {

      
        this.setState({
            loadingtype: 1,
            isscreenloading: true,
            announcementTypetext:this.state.tempannouncementTypetext

        }, function () {
            initannouncementType = tempinitannouncementType;
            initannouncementTypetext = tempinitannouncementTypetext
            let tdate = initannouncementType.split(' ')
            let mdate = 0;

            //console.log('month : ', tdate[0])

            for (let i = 0; i < 12; i++) {
                if (Months.monthNames[i] === tdate[0]) {
                    //console.log('month : ', i)
                    mdate = i;
                }
            }
            //console.log('month select  : ', mdate)
            //console.log('year : ', tdate[1])

            this.setState(this.renderloadingscreen())

            this.loadClockInOutfromAPI(mdate + 1, tdate[1])
        });

    }
    select_month_clockinout_and(item) {

        this.setState({

            // announcementType: month,
            loadingtype: 1,
            isscreenloading: true,

            announcementTypetext: item
            // isscreenloading: false,

        }, function () {

            let tdate = item.split(' ')
            let mdate = 0;

            //console.log('month : ', tdate[0])

            for (let i = 0; i < 12; i++) {
                if (Months.monthNames[i] === tdate[0]) {
                    //console.log('month : ', i)
                    mdate = i;
                }
            }
            //console.log('month select  : ', mdate)
            //console.log('year : ', tdate[1])

            this.setState(this.renderloadingscreen())

            this.loadClockInOutfromAPI(mdate + 1, tdate[1])
        });

    }

    conv(date) {

        if (date == '-') {

            return date
        } else if (parseInt(date)) {
            let arr = date.split(':');

            return parseInt(arr[0]) + ':' + arr[1]
        }
        return '-'

    }



    renderpickerview() {

        if (this.state.loadingtype == 0) {

            if (Platform.OS === 'android') {
                ////console.log('android selectmonth')
                return (
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                        <View style={{ width: '80%', backgroundColor: 'white' }}>
                            <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                                <Text style={styles.alertDialogBoxText}>Select Month and Year</Text>
                            </View>
                            <ScrollView style={{ height: '40%' }}>
                                {
                                    this.state.months.map((item, index) => (
                                        <TouchableOpacity style={styles.button}
                                            onPress={() => { this.select_month_clockinout_and(item) }}
                                            key={index + 100}>
                                            <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                                                <Text style={{ textAlign: 'center', fontSize: 10 * scale, width: '100%', height: 30, alignItems: 'center' }}> {item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                            <View style={{ flexDirection: 'row', height: 40, }}>
                                <View style={{ flex: 2 }} />
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => { this.cancel_select_change_month_andr() }}
                                >
                                    <Text style={{ fontSize: 16, color: Colors.redTextColor, textAlign: 'center' }}> Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )

            }
            return (
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                    <View style={{ width: '80%', backgroundColor: 'white' }}>
                        <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                            <Text style={styles.titlepicker}>Select Month and Year</Text>
                        </View>
                        <Picker
                            selectedValue={this.state.announcementType}
                            onValueChange={(itemValue, itemIndex) => this.setState({
                                announcementType: itemValue,
                                tempannouncementTypetext: this.state.months[itemIndex],
                            }, function () {

                                tempinitannouncementType = itemValue;
                                tempinitannouncementTypetext = itemValue;

                            })}>{
                                this.state.months.map((item, index) => (
                                    <Picker.Item label={item} value={item} key={index}  />

                                ))}

                        </Picker>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 50, alignItems: 'center', }}>
                            <TouchableOpacity style={{ flex: 2, justifyContent: 'flex-start' }}
                                onPress={(this.cancel_select_change_month)}>
                                >
                                <Text style={styles.buttonpicker}> Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 3, justifyContent: 'center' }} />
                            <TouchableOpacity style={{ flex: 2, justifyContent: 'flex-end' }} onPress={(this.select_month_clockinout.bind(this))}>
                                <Text style={styles.buttonpicker}> OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                <ActivityIndicator />
            </View>
        )

    }

    renderloadingscreen() {

        if (this.state.isscreenloading) {

            return (
                <View style={{ height: '100%', width: '100%', position: 'absolute', }}>
                    <View style={{ backgroundColor: 'black', height: '100%', width: '100%', position: 'absolute', opacity: 0.7 }}>

                    </View>
                    {this.renderpickerview()}
                </View>
            )
        }

    }
    renderdetail() {
        //console.log('weakday : ', (firstday + 1) % 7)
        let offsety = 0;
        if (this.state.initialmonth + 2 === this.state.monthselected) {

            //console.log('scroll hight : ', Layout.window.height - 100)
            //console.log('content height : ', this.state.tdataSource.length * 90)
            //console.log('currentday : ', (currentday + 1) * 90)
            //console.log('offsety : ', offsety)

          //  offsety = ((currentday * 90) - 220)

            let half = (Layout.window.height - 100) / 2
            offsety = ((currentday + 1) * 90) - half
            if (offsety > (this.state.tdataSource.length * 90) - (Layout.window.height - 100)) {
                offsety = (this.state.tdataSource.length * 90) - (Layout.window.height - 100)

            } else if (((currentday + 1) * 90)  < ((Layout.window.height - 100 )/ 2)) {

                //offsety = ((currentday ) * 90) 
                offsety = 0
            }
            
        }

       // Layout.window.height - 100 

        return (
            <View style={{ flex: 16, backgroundColor: Colors.calendarLocationBoxColor, }}>
                <ScrollView ref="scrollView"
                    onContentSizeChange={(width, height) => this.refs.scrollView.scrollTo({ y: offsety })}
                >
                    {
                        this.state.tdataSource.map((item, index) => (

                            <View key={item.id} style={index === currentday && (this.state.initialmonth + 2 === this.state.monthselected) ?
                                { height: 120, backgroundColor: '#F2DEDE' } :
                                { height: 90, backgroundColor: '#F5F5F5' }} key={index + 500}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={item.datetype === 'Y' ? styles.clockinoutdaybluetext :
                                            item.datetype === 'N' ? styles.clockinoutdayredtext : styles.clockinoutdaytext

                                        }
                                        >
                                            {index + 1}
                                        </Text >
                                        <Text style={item.datetype === 'Y' ? styles.clockinoutweakdaybluetext :
                                             item.datetype === 'N' ? styles.clockinoutweakdayredtext : styles.clockinoutweakdaytext
                                        }>
                                            {Months.dayNamesShortMonthView[(firstday + index) % 7]}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={styles.clockinoutweakdayalphatext}>SHIFT</Text>
                                        <Text style={styles.clockinoutweakdayalphatext} />
                                        <Text style={styles.clockinoutweakdayalphatext}>ACTUAL</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={index > currentday && (this.state.initialmonth + 2 === this.state.monthselected) ? styles.clockinoutbodyhidetext : styles.clockinoutbodytext}>{this.conv(item.workstart)}</Text>
                                        <Text style={styles.clockinoutweakdayalphatext} />
                                        <Text style={index > currentday && (this.state.initialmonth + 2 === this.state.monthselected) ? styles.clockinoutbodyhidetext : item.actualstart === '-' && item.workstart != '-' ?
                                            styles.clockinoutbodyredtext :
                                            item.late === 1 && item.datetype === 'W'? styles.clockinoutbodyredtext : styles.clockinoutbodytext}>

                                            {this.conv(item.actualstart)}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={index > currentday && (this.state.initialmonth + 2 === this.state.monthselected) ? styles.clockinoutbodyhidetext : styles.clockinoutbodytext}>{this.conv(item.workend)}</Text>
                                        <Text style={styles.clockinoutweakdayalphatext} />
                                        <Text style={index > currentday && (this.state.initialmonth + 2 === this.state.monthselected) ?
                                            styles.clockinoutbodyhidetext :
                                            item.actualend === '-' && item.workend != '-' ?
                                                styles.clockinoutbodyredtext :
                                                item.early === 1 && item.datetype === 'W'? styles.clockinoutbodyredtext :
                                                    styles.clockinoutbodytext}>

                                            {this.conv(item.actualend)}</Text>
                                    </View>
                                </View>
                                <View style={{ height: 1, backgroundColor: Colors.lightGrayTextColor, }} />
                                <View style={index > currentday && (this.state.initialmonth + 2 === this.state.monthselected) ?
                                    { height: 90, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'white', opacity: 0.7 } :
                                    { height: 90, width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'white', opacity: 0 }
                                } >
                                </View>
                            </View>
                        ))
                    }

                </ScrollView>
            </View>
        );



    }

    render() {
        // this.state.datasource.map((i, index) => (
        //     <Picker.Item key={index} label={i.label} value={i.value} />
        // ))
        // ////console.log(this.state.tdataSource.data.detail.items)

        return (
            // this.state.dataSource.map((item, index) => (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }} >
                <View style={[styles.navContainer, { flexDirection: 'column' }]}>
                    <View style={styles.statusbarcontainer} />
                    <View style={{ height: 50, flexDirection: 'row', }}>
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', position: 'absolute' }}>
                            <Text style={styles.navTitleTextTop}>{title}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <TouchableOpacity onPress={(this.onBack.bind(this))}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('./../resource/images/Back.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 5, }}>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', }}>
                    <View style={{ height: this.state.manager * 50, backgroundColor: Colors.redColor, justifyContent: 'center' }}>
                        <Text style={{ flex: 1, marginLeft: 20, color: 'white', fontFamily: 'Prompt-Regular' }}>{this.state.employee_name}</Text>
                        <Text style={{ flex: 1, marginLeft: 20, color: 'white', fontFamily: 'Prompt-Regular' }}>{this.state.employee_position}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: Colors.calendarLocationBoxColor, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        onPress={(this.select_month.bind(this))}
                    >

                        <Text style={styles.otsummarydatetext}>{this.state.announcementTypetext}</Text>

                    </TouchableOpacity>



                    <View style={{ flex: 12, marginLeft: 5, marginRight: 5, marginTop: 2, marginBottom: 2 }}>

                        <View style={{ flex: 1, backgroundColor: Colors.lightred, borderRadius: 5 }}>

                            {this.renderdetail()}

                        </View>

                    </View>

                </View>
                {this.renderloadingscreen()}
            </View >
            // ))
        );
    }
}