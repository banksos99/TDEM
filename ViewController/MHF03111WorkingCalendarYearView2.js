import React, { Component } from 'react';
import RNFetchBlob from 'react-native-fetch-blob'

import {
    Text,
    View,
    TouchableOpacity,
    Image, Picker,
    Alert,
    ActivityIndicator,
    Platform,
    ScrollView
} from 'react-native';
import Authorization from '../SharedObject/Authorization'

import { Calendar, LocaleConfig } from 'react-native-calendars';

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"

import moment from 'moment'
const _format = 'YYYY-MM-DD'

import SharedPreference from '../SharedObject/SharedPreference'
import StringText from '../SharedObject/StringText'

import RestAPI from "../constants/RestAPI"
import EventCalendar from "../constants/EventCalendar"

import SaveProfile from "../constants/SaveProfile"

import CalendarPDFAPI from "../constants/CalendarPDFAPI"

export default class calendarYearView extends Component {

    eventCalendar = new EventCalendar()
    SaveProfile = new SaveProfile()

    constructor(props) {
        super(props);
        this.state = {
            connectWithServer: true,
            url: '',
            countDay: [],

            yearObject: '',
            monthObject: '',
            yearsPickerArray: [],
            locationPickerArrya: [],
            //
            selectYear: this.props.navigation.getParam("selectYear", ""),
            selectDownloadYear: '',
            selectLocation: this.props.navigation.getParam("location", "TA"),

            showYear: '',
            showLocation: '',

            yearPickerForDownloadPDFFileView: '',
            yearsPickerView: '',
            locationPickerView: '',

            isLoading: false,
            calendarEventData: '',

            // data
            locationPicker: '',
            today: new Date(),
            dataResponse: this.props.navigation.getParam("dataResponse", ""),

            havePermission: false,
            changeData: false,
            newPage: false,
            isLoadingPDF: false

        }
        console.log("setNewPicker index ==>  SharedPreference.COMPANY_LOCATION  ")

        this.LocaleConfig()
        this.onPressCalendar = this.onPressCalendar.bind(this)
        this.getYearSelect()
        this.setNewPicker()
    }

    setNewPicker() {
        array = SharedPreference.COMPANY_LOCATION
        // loactionArray = locationPicker
        locationArray = []

        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            locationArray.push({
                label: element.value,
                value: element.key
            })
            console.log("setNewPicker index ==>  : ", locationArray[index])
        }
        console.log("setNewPicker locationArray : ", locationArray)
        this.state.locationPicker = locationArray
    }

    async componentDidMount() {
        this.getYearSelect()
        this.getYearView(this.state.selectYear, this.state.dataResponse)


        console.log("SharedPreference.calendarAutoSync : ", SharedPreference.calendarAutoSync)

        if (SharedPreference.calendarAutoSync == true) {
            await this.onSynWithCalendar()
        }
    }

    getYearSelect() {
        let yearCount = 3 //user can choose  3 year ==>last year ,current year ,next year
        let lastYear = this.state.today.getFullYear() - 1
        for (let index = 0; index < yearCount; index++) {
            let year = lastYear + index
            this.state.yearsPickerArray[index] = {
                label: "" + year + "",
                value: "" + year + "",
            };
        }//copy 3 years to yearsPickerArray
    }

    loadDataFromAPI = async (year, location) => {
        console.log("loadDataFromAPI year ==>: ", year)
        console.log("loadDataFromAPI location ==>: ", location)

        // reset api
        this.setState({
            countDay: [],
            yearObject: [],
            isLoading: true,
            yearviewPicker: false,
        })

        this.setState({ isLoading: true })
        await this.onLoadCalendarAPI(year, location)

    }

    onLoadCalendarAPI = async (year, location) => {
        console.log("onLoadCalendarAPI ====> start")
        let data = await RestAPI(SharedPreference.CALENDER_YEAR_API + year + '&company=' + location, SharedPreference.FUNCTIONID_WORKING_CALENDAR)
        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {
            console.log("onLoadCalendarAPI ====> SUCCESS")
            this.getYearView(this.state.selectYear, data)

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

    getLocalYearView(year) {
        let calendarEventData
        if (year == '2017') {
            calendarEventData = _calendarEventData2017
        } else if (year == '2018') {
            calendarEventData = _calendarEventData2018
        }
        this.getYearView(year, calendarEventData)
    }

    getYearView = async (year, calendarEventData) => {
        console.log("getYearView : year ==> ", year)
        console.log("getYearView : calendarEventData ==> ", calendarEventData)

        let monthYear = 12
        const original = [];

        if (calendarEventData.code == 200) {
            for (let index = 0; index < monthYear; index++) {
                let object = this.getMonthEvent((index + 1), calendarEventData)
                original[index] = object
            }
        } else {

            // console.log("this.state.selectLocation : ", this.state.selectLocation)
            // showLocation = "Company"
            year = new Date().getFullYear()
        }

        if (this.state.selectLocation == null) {
            showLocation = await this.getFullLocation("TA")
        } else {

            showLocation = await this.getFullLocation(this.state.selectLocation)
        }

        console.log("getYearView : showLocation ==> ", showLocation)
        console.log("getYearView : year ==> ", year)

        this.showAllMonthView()
        this.setState({
            yearObject: original,
            showYear: year,
            isLoading: false,
            calendarEventData: calendarEventData,
            showLocation: showLocation,
            dataResponse: calendarEventData,
        })
    }

    getMonthEvent(month, calendarEventData) {
        yearObject = calendarEventData.data.holidays
        for (let index = 0; index < yearObject.length; index++) {
            const element = yearObject[index];
            if (element.month == month) {
                //////console.log("getMonthEvent yearObject ==> ", yearObject[index])
                return yearObject[index]
            }
        }
        return {
            "month": month,
            "days": []
        }
    }

    showAllMonthView() {
        console.log("Calendar ==> showAllMonthView")
        monthView = []
        monthView1 = []
        monthView2 = []
        monthView3 = []
        monthView4 = []
        month = 12 //month count


        for (let f = 0; f < month; f++) {

            let selectMonth = (f + 1)
            console.log("Calendar ==> selectMonth : ", selectMonth)

            let monthText = this.state.showYear + '-' + selectMonth + '-01'
            if (selectMonth < 10) {
                monthText = this.state.showYear + '-0' + selectMonth + '-01'
            }
            console.log("Calendar ==> monthText : ", monthText)
            this.state.countDay = []

            monthView.push(
                <TouchableOpacity key={f} style={styles.container}
                    onPress={() => this.onPressCalendar(monthText)} >
                    <Calendar
                        current={monthText}
                        hideArrows={true}
                        hideExtraDays={false}
                        disableMonthChange={true}
                        monthFormat={'MMMM'}
                        hideDayNames={false}
                        theme={{
                            dayTextColor: 'white',
                            todayTextColor: 'white',
                            monthTextColor: 'white',
                            selectedDayBackgroundColor: '#333248',
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 0,
                                    flexDirection: 'row',
                                },
                                header: {
                                    justifyContent: 'space-between',
                                },
                                monthText: {
                                    fontSize: 12,
                                    textAlign: 'left',
                                    color: Colors.calendarRedText,
                                }
                            }
                        }}

                        dayComponent={({ date, state }) => {
                            this.state.countDay.push(date.day);
                            const selectedDateMonth = moment(date.dateString).format(_format);
                            let checkSpecialHoliday = this.checkSpecialHoliday(selectedDateMonth);
                            console.log("selectedDateMonth =====> : ", selectedDateMonth)
                            console.log("checkSpecialHoliday =====> ", checkSpecialHoliday)

                            if (checkSpecialHoliday == 'Y') {
                                return <View style={styles.calendarDayContainer}>
                                    <Text style={{ fontSize: 10, textAlign: 'right', color: state === 'disabled' ? 'white' : Colors.calendarBlueText }}>
                                        {date.day}</Text>
                                </View>
                            } else if (checkSpecialHoliday == 'N') {
                                return <View style={styles.calendarDayContainer}>
                                    <Text style={{ fontSize: 10, textAlign: 'right', color: state === 'disabled' ? 'white' : Colors.calendarRedText }}>
                                        {date.day}</Text>
                                </View>
                            } else if (checkSpecialHoliday == 'W') {
                                return <View style={styles.calendarDayContainer}>
                                    <Text style={{ fontSize: 10, textAlign: 'right', color: state === 'disabled' ? 'white' : Colors.calendarGrayText }}>
                                        {date.day}</Text>
                                </View>
                            } else if ((this.state.today.getDate() == date.day) && ((this.state.today.getMonth() + 1) == date.month)
                                && (this.state.today.getFullYear() == date.year)) {
                                return <View style={styles.calendarCurrentDayCicleContainer}>
                                    <View style={styles.calendarCurrentDayCircle} />
                                    <Text style={styles.calendarCurrentDayText}>
                                        {date.day}</Text>
                                </View>
                            } else if ((this.state.countDay.length % 7) == 0 || (this.state.countDay.length % 7) == 1) {//Holiday
                                return <View style={styles.calendarDayContainer}>
                                    <Text style={{ fontSize: 10, textAlign: 'right', color: state === 'disabled' ? 'white' : Colors.redTextColor }}>
                                        {date.day}</Text>
                                </View>
                            } else {
                                return <View style={styles.calendarDayContainer}>
                                    <Text style={{ fontSize: 10, textAlign: 'right', color: state === 'disabled' ? 'white' : 'black' }}>
                                        {date.day}</Text>
                                </View>
                            }
                        }}
                    />
                </TouchableOpacity>
            )
            if (selectMonth == 3) {
                monthView1 = monthView
                monthView = []
            } else if (selectMonth == 6) {
                monthView2 = monthView
                monthView = []
            } else if (selectMonth == 9) {
                monthView3 = monthView
                monthView = []
            } else if (selectMonth == 12) {
                monthView4 = monthView
                monthView = []
            }

        }

        return (<View style={styles.detailContainer} >
            <View style={styles.calendarRowBox} >
                {monthView1}
            </View>
            <View style={styles.calendarRowBox} >
                {monthView2}
            </View>
            <View style={styles.calendarRowBox} >
                {monthView3}
            </View>
            <View style={styles.calendarRowBox} >
                {monthView4}
            </View>
        </View>)

    }

    checkSpecialHoliday(selectedDateMonth) {
        //console.log("selectedDateMonth : ", selectedDateMonth)
        try {
            const month = moment(selectedDateMonth).format('M');
            //console.log("month : ", month)
            let checkObject = this.state.yearObject[(month - 1)]
            //console.log("checkObject : ", checkObject)

            if (checkObject == []) {
                return false
            }
            let objectMonth = checkObject.days
            //console.log("objectMonth : ", objectMonth)

            for (let index = 0; index < objectMonth.length; index++) {
                let date = objectMonth[index].date

                if (date == selectedDateMonth) {
                    let data = objectMonth[index]
                    if (data.special_holiday == 'Y') {
                        return 'Y'
                    } else if (data.special_holiday == 'N') {
                        return 'N'
                    } else { //W
                        return false
                    }

                }
            }
            return false

        } catch (e) {
            return false
        }

    }

    LocaleConfig() {
        LocaleConfig.locales['en'] = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['JAN.', 'FEB.', 'MAR', 'APR', 'MAY', 'JUN', 'JULY.', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['S', 'M', 'T', 'W', 'R', 'F', 'S']
        };
        LocaleConfig.defaultLocale = 'en';
    }

    resetCalendar() {
        console.log("resetCalendar ==> this.state.selectYear : ", this.state.selectYear);
        console.log("resetCalendar ==> this.state.selectLocation : ", this.state.selectLocation);
        //console.log("resetCalendar ==> this.state.showYear : ", this.state.showYear);

        if (this.state.connectWithServer == true) {
            this.loadDataFromAPI(this.state.selectYear, this.state.selectLocation)
        } else {
            this.getLocalYearView(this.state.selectYear)
        }
    }

    onPressCalendar(datetime) {
        //console.log("datetime : ", datetime)
        const month = moment(datetime).format('M');
        let monthObject = this.state.yearObject[(month - 1)]
        console.log("onPressCalendar ==> ", monthObject)
        this.props.navigation.navigate('calendarMonthView',
            {
                month: datetime,
                monthObject: monthObject,
                dataResponse: this.state.dataResponse,
                location: this.state.selectLocation
            });
    }

    onPressSelectYear(year) {
        console.log("onPressSelectYear index : ", year)
        this.setState({
            selectYear: year
        })
    }

    onPressLocation(locationFull, locationShort) {
        this.setState({
            selectLocation: locationShort
        })
    }

    getShortLocation = async (fullLocation) => {
        array = this.state.locationPicker
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (fullLocation == element.label) {
                return element.value
            }
        }
        return
    }

    getFullLocation = async (shortLocation) => {
        array = this.state.locationPicker
        console.log("getFullLocation ==> array : ", array)
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            console.log("getFullLocation ==> shortLocation : ", shortLocation)
            console.log("getFullLocation ==> element label : ", element.value)
            if (shortLocation == element.value) {
                console.log("getFullLocation  ==> return : ", element.value)
                return element.label
            }
        }
        return
    }

    getLocation = async () => {
        console.log("getLocation ==> this.state.selectLocation : ", this.state.selectLocation)

        this.setState({
            locationPickerView: false,
            isLoading: true
        })

        await this.openNewPage(this.state.selectLocation)
    }

    openNewPage = async (location) => {
        // console.log("openNewPage : RestAPI ")
        // console.log("openNewPage selectLocation : ", location)

        let data = await RestAPI(SharedPreference.CALENDER_YEAR_API + this.state.selectYear + '&company=' + location, SharedPreference.FUNCTIONID_WORKING_CALENDAR)
        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {
            // console.log("onLoadCalendarAPI ====> SUCCESS")
            this.props.navigation.navigate('calendarYearView', {
                dataResponse: data,
                selectYear: this.state.selectYear,
                location: this.state.selectLocation
            });
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

    renderDialog() {
        if (this.state.yearviewPicker) {
            if (Platform.OS === 'android') {
                // console.log("this.state.yearsPickerArray : ", this.state.yearsPickerArray)
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, {
                                    style: Text,
                                }]}>{StringText.CALENDER_YEARVIEW_SELECT_YEAR_TITLE}</Text>
                                <ScrollView style={{ height: '40%' }}>
                                    {
                                        this.state.yearsPickerArray.map((i, index) => (
                                            <TouchableOpacity style={styles.button}
                                                onPress={() => { this.onPressSelectYear(i.label) }}
                                                key={index + 100}>
                                                <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                                                    <Text style={{ textAlign: 'center', fontSize: 18, width: '100%', height: 30, alignItems: 'center' }}> {i.label}</Text>
                                                </View>
                                            </TouchableOpacity>))}
                                </ScrollView>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            this.setState({ yearviewPicker: false }),
                                                this.resetCalendar()
                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_SELECT_YEAR_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            } else {
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_SELECT_YEAR_TITLE}</Text>
                                <Picker
                                    selectedValue={this.state.selectYear}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ selectYear: itemValue })}>
                                    {this.state.yearsPickerArray.map((i, index) => (
                                        <Picker.Item key={index} color={Colors.redTextColor} label={i.label} value={i.value} />
                                    ))}
                                </Picker>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            this.setState({ yearviewPicker: false }),
                                                this.resetCalendar()
                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_SELECT_YEAR_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            }
        }

        if (this.state.yearPickerForDownloadPDFFileView) {
            if (Platform.OS === 'android') {
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, {
                                    style: Text,
                                }]}>{StringText.CALENDER_YEARVIEW_DOWNLOAD_PDF_TITLE}</Text>
                                <ScrollView style={{ height: '40%' }}>
                                    {
                                        this.state.yearsPickerArray.map((i, index) => (
                                            <TouchableOpacity style={styles.button}
                                                onPress={() => { this.onPressSelectYear(i.label) }}
                                                key={index + 100}>
                                                <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                                                    <Text style={{ textAlign: 'center', fontSize: 18, width: '100%', height: 30, alignItems: 'center' }}> {i.label}</Text>
                                                </View>
                                            </TouchableOpacity>))}
                                </ScrollView>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            this.setState({
                                                yearPickerForDownloadPDFFileView: false,
                                                isLoadingPDF: true
                                            })
                                            this.onloadPDFFile();
                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_SELECT_YEAR_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            } else {
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_DOWNLOAD_PDF_TITLE}</Text>
                                <Picker
                                    selectedValue={this.state.selectYear}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ selectYear: itemValue })}>
                                    {this.state.yearsPickerArray.map((i, index) => (
                                        <Picker.Item key={index} color={Colors.redTextColor} selec label={i.label} value={i.value} />
                                    ))}
                                </Picker>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            this.setState({
                                                yearPickerForDownloadPDFFileView: false,
                                                isLoadingPDF: true
                                            })
                                            this.onloadPDFFile();
                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_DOWNLOAD_PDF_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            }

        }

        if (this.state.locationPickerView) {
            if (Platform.OS === 'android') {
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, {
                                    style: Text,
                                }]}>{StringText.CALENDER_YEARVIEW_LOCATION_TITLE}</Text>
                                <ScrollView style={{ height: '40%' }}>
                                    {
                                        this.state.locationPicker.map((i, index) => (
                                            <TouchableOpacity style={styles.button}
                                                onPress={() => { this.onPressLocation(i.label, i.value) }}
                                                key={index + 100}>
                                                <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                                                    <Text style={{ textAlign: 'center', fontSize: 18, width: '100%', height: 30, alignItems: 'center' }}> {i.label}</Text>
                                                </View>
                                            </TouchableOpacity>))}
                                </ScrollView>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            this.getLocation()
                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_ALERT_LOCATION_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            } else {
                return (
                    <View style={styles.alertDialogContainer}>
                        {/* bg */}
                        <View style={styles.alertDialogBackgroudAlpha} />
                        {/* bg */}
                        <View style={styles.alertDialogContainer}>
                            <View style={styles.alertDialogBoxContainer}>
                                <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_LOCATION_TITLE}</Text>
                                <Picker
                                    selectedValue={this.state.selectLocation}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ selectLocation: itemValue })}>
                                    {this.state.locationPicker.map((i, index) => (
                                        <Picker.Item key={index} numberOfLines={1} color={Colors.redTextColor} label={i.label} value={i.label} />
                                    ))}
                                </Picker>
                                <View style={styles.alertDialogBox}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => {
                                            // location = this.getFullLocation(this.state.selectLocation)
                                            // this.setState({
                                            //     locationPickerView: false,
                                            //     showLocation: location
                                            // })
                                            // this.resetCalendar()
                                            // shortLocation = await this.getShortLocation(this.state.selectLocation)
                                            // // console.log("this.state.selectLocation ==> ",this.getShortLocation(this.state.selectLocation))
                                            // this.setState({
                                            //     selectLocation : shortLocation
                                            // })
                                            this.getLocation()

                                        }}>
                                        <Text style={[styles.alertDialogBoxText, { style: Text }]}>{StringText.CALENDER_YEARVIEW_ALERT_LOCATION_BUTTON}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View >
                )
            }
        }
    }

    onBack() {
        this.props.navigation.navigate('HomeScreen');
    }

    onloadPDFFile = async () => {

        console.log("onloadPDFFile")

        // let url = SharedPreference.HOST_API + '/api/v1/calendar/file?year=' + this.state.selectYear + "&company=" + this.state.selectLocation
        let data = await CalendarPDFAPI(this.state.selectYear, this.state.selectLocation)
        code = data[0]
        data = data[1]

        console.log("onLoadPDFFIle : ", data)
        if (code.SUCCESS == data.code) {

            // console.log("responseJson filename : ", responseJson.data[0].filename)
            console.log("onLoadPDFFIle ==> responseJson : ", data.data[0].link)
            console.log("onLoadPDFFIle ==> responseJson : ", data.data[0].filename)

            if (data.data[0].filename == null || data.data[0].filename == 'undefined') {
                this.onLoadAlertDialog()
            } else {
                let pdfPath = data.data[0].link
                let filename = data.data[0].filename


                this.onDownloadPDFFile(pdfPath, filename)
            }
        } else {
            this.onLoadAlertDialog()
        }

    }

    onLoadAlertDialog() {
        //console.log("onLoadAlertDialog")
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

    onDownloadPDFFile = async (pdfPath, filename) => {
        filename = "calendar_" + this.state.selectYear + '.pdf'
        console.log("onDownloadPDFFile: ", SharedPreference.HOST + pdfPath)

        FUNCTION_TOKEN = await Authorization.convert(SharedPreference.profileObject.client_id, SharedPreference.FUNCTIONID_WORKING_CALENDAR, SharedPreference.profileObject.client_token)
        console.log("calendarPDFAPI ==> FUNCTION_TOKEN  : ", FUNCTION_TOKEN)

        if (Platform.OS === 'android') {
            RNFetchBlob
                .config({
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: false,
                        path: RNFetchBlob.fs.dirs.DownloadDir + '/' + filename,
                        mime: 'application/pdf',
                        title: filename,
                        description: 'shippingForm'
                    }
                })
                .fetch('GET', SharedPreference.HOST + pdfPath, {
                    'Content-Type': 'application/pdf;base64',
                    Authorization: FUNCTION_TOKEN
                })
                .then((resp) => {
                    console.log("Android ==> LoadPDFFile ==> Load Success  : ", resp);
                    this.setState({ isLoadingPDF: false })
                    Alert.alert(
                        StringText.CALENDAR_ALERT_PDF_TITLE_SUCCESS,
                        StringText.CALENDAR_ALERT_PDF_DESC_SUCCESS_1 + filename + StringText.CALENDAR_ALERT_PDF_DESC_SUCCESS_2,
                        [{
                            text: 'OK', onPress: () => {
                                RNFetchBlob.android.actionViewIntent(resp.data, 'application/pdf')
                            }
                        },
                        {
                            text: 'Cancel', onPress: () => {
                            }, style: 'cancel'
                        }
                        ],
                        { cancelable: false }
                    )
                })
                .catch((errorCode, errorMessage) => {
                    this.setState({ isLoadingPDF: false })
                    console.log("Android ==> LoadPDFFile ==> Load errorCode  : ", errorCode);
                    Alert.alert(
                        errorCode,
                        errorMessage,
                        [{
                            text: 'OK', onPress: () => {
                                // this.addEventOnCalendar()
                            }
                        }],
                        { cancelable: false }
                    )
                })
        } else {//iOS
            console.log("loadPdf pdfPath : ", pdfPath)
            console.log("loadPdf filename : ", filename)
            RNFetchBlob
                .config({
                    fileCache: true,
                    appendExt: 'pdf',
                    filename: filename
                })
                .fetch('GET', pdfPath, {
                    'Content-Type': 'application/pdf;base64',
                    Authorization: FUNCTION_TOKEN
                })
                .then((resp) => {

                    console.log("Android ==> LoadPDFFile ==> Load Success  : ", resp);
                    // RNFetchBlob.android.actionViewIntent(resp.data, 'application/pdf')
                    this.setState({ isLoadingPDF: false })

                    Alert.alert(
                        StringText.CALENDAR_ALERT_PDF_TITLE_SUCCESS,
                        StringText.CALENDAR_ALERT_PDF_DESC_SUCCESS_1 + filename + StringText.CALENDAR_ALERT_PDF_DESC_SUCCESS_2,
                        [
                            {
                                text: 'OK', onPress: () => {
                                    // this.addEventOnCalendar()
                                    RNFetchBlob.ios.openDocument(resp.path());
                                    // RNFetchBlob.android.actionViewIntent(resp.data, 'application/pdf')
                                }
                            },
                            {
                                text: 'Cancel', onPress: () => {
                                }, style: 'cancel'
                            }
                        ],
                        { cancelable: false }
                    )
                    // console.log("WorkingCalendarYear pdf1 : ", resp);
                    // console.log("WorkingCalendarYear pdf2 : ", resp.path());
                    // RNFetchBlob.ios.openDocument(resp.path());
                })
                .catch((errorMessage, statusCode) => {
                    Alert.alert(
                        errorCode,
                        statusCode,
                        [{
                            text: 'OK', onPress: () => {
                            }
                        }],
                        { cancelable: false }
                    )
                });
        }
    }

    onSynWithCalendar = async () => {
        //TODO Alert
        Alert.alert(
            StringText.CALENDER_YEARVIEW_SYNC_CALENDAR_TITLE,
            StringText.CALENDER_YEARVIEW_SYNC_CALENDAR_BUTTON,
            [
                {
                    text: 'Cancel', onPress: () => {
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        this.addEventOnCalendar()
                    }
                },
            ],
            { cancelable: false }
        )
    }

    addEventOnCalendar = async () => {
        await this.eventCalendar._deleteEventCalendar()

        this.setState({
            isLoading: true
        })
        // console.log("this.state.calendarEventData 1 : ", this.state.calendarEventData)
        if (this.state.calendarEventData.code == 200) {
            let holidayArray = this.state.calendarEventData.data.holidays;
            // console.log("this.state.calendarEventData 2 : ", this.state.calendarEventData.data.holidays)
            for (let index = 0; index < holidayArray.length; index++) {
                const daysArray = holidayArray[index].days
                for (let f = 0; f < daysArray.length; f++) {
                    const eventDetailArray = daysArray[f].events;
                    for (let k = 0; k < eventDetailArray.length; k++) {
                        let eventObject = eventDetailArray[k]
                        if (eventObject.date == null) {
                            const copy = {
                                ...eventObject, date: daysArray[f].date
                            };
                            eventObject = copy
                        }

                        if (eventObject.time_start == null) {
                            let timeStart = daysArray[f].date + ' 00:00:01'
                            const copy = {
                                ...eventObject, time_start: timeStart
                            };
                            eventObject = copy
                        }

                        if (eventObject.time_end == null) {
                            let timeEnd = daysArray[f].date + ' 23:59:00'
                            const copy = {
                                ...eventObject, time_end: timeEnd
                            };
                            eventObject = copy
                        }

                        if (eventObject.description == null) {
                            const copy = {
                                ...eventObject, description: "description"
                            };
                            eventObject = copy
                        }

                        //console.log("addEventOnCalendar ==> eventObject : ", eventObject);
                        await this.eventCalendar.synchronizeCalendar(eventObject, 'EDEM');
                        //console.log("==============Success==============")
                    }
                }
            }

            console.log("==============Success==============")
            this.setState({
                isLoading: false
            })

            //TODO Alert
            Alert.alert(
                StringText.CALENDAR_ALERT_SYNC_CALENDAR_TITLE_SUCCESS,
                StringText.CALENDAR_ALERT_SYNC_CALENDAR_DESC_SUCCESS,
                [
                    {
                        text: StringText.CALENDAR_ALERT_SYNC_CALENDAR_BUTTON_SUCCESS, onPress: () => {
                            this.setState({
                                isLoading: false
                            })
                        }
                    },
                ],
                { cancelable: false }
            )
        } else {

            Alert.alert(
                StringText.CALENDAR_ALERT_SYNC_CALENDAR_TITLE_SUCCESS,
                StringText.CALENDAR_ALERT_SYNC_CALENDAR_DESC_SUCCESS,
                [
                    {
                        text: StringText.CALENDAR_ALERT_SYNC_CALENDAR_BUTTON_SUCCESS, onPress: () => {
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

    renderDownloadProgressView() {
        if (this.state.isLoadingPDF) {
            return (
                <View style={styles.alertDialogContainer}>
                    <View style={styles.alertDialogBackgroudAlpha} />
                    {/* bg */}
                    <View style={styles.alertDialogContainer}>
                        <View style={{
                            width: "80%",
                            height: 50,
                            borderRadius: 10,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator />
                        </View>
                    </View>
                </View >
            )
        }
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.container} >
                    <View style={styles.navContainer}>
                        <TouchableOpacity style={styles.navLeftContainer} onPress={(this.onBack.bind(this))}>
                            <Image
                                style={styles.navBackButton}
                                source={require('../resource/images/Back.png')}
                            />
                        </TouchableOpacity>
                        <Text style={styles.navTitleText}>Calendar</Text>
                        <View style={styles.navRightContainer}>
                            <TouchableOpacity onPress={this.onSynWithCalendar.bind(this)}>
                                <Image
                                    style={styles.navRightButton}
                                    source={require('../resource/images/calendar_sync.png')}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                ////////console.log("yearPickerForDownloadPDFFileView");
                                this.setState({
                                    yearPickerForDownloadPDFFileView: true
                                })
                                //TODO Bell
                                // this.loadPdfFile()
                            }}>
                                <Image
                                    style={styles.navRightButton}
                                    source={require('../resource/images/calendar_download.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.detailContainer} >
                        <View style={styles.calendarTitleBox} >
                            <TouchableOpacity style={styles.calendarMonthTextLeftContainer} onPress={() => {
                                this.setState({
                                    yearviewPicker: true
                                })
                            }}>
                                <Text style={styles.calendarYearText}>{this.state.showYear}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.calendarMonthTextRightContainer} onPress={() => {
                                this.setState({
                                    locationPickerView: true
                                })
                            }}>
                                <View style={styles.calendarCoverTitleBox}>
                                    <Text style={styles.calendarLocationText}>{this.state.showLocation}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.showAllMonthView()}
                    </View>
                    {/* {dialogview} */}
                </View >
                {this.renderDialog()}
                {this.renderProgressView()}
                {this.renderDownloadProgressView()}
            </View>
        );
    }
}


