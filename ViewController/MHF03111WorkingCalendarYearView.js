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
    FlatList,
    SectionList,
    ScrollView
} from 'react-native';

import { Calendar, LocaleConfig } from 'react-native-calendars';

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"

import moment from 'moment'
const _format = 'YYYY-MM-DD'


// import _calendarEventData2018 from '../../jsonfile/calendar-event-data-2018.json';
// import _calendarEventData2017 from '../../jsonfile/calendar-event-data-2017.json';

import SharedPreference from '../SharedObject/SharedPreference'
import StringText from '../SharedObject/StringText'

import RestAPI from "../constants/RestAPI"
import EventCalendar from "../constants/EventCalendar"

export default class calendarYearView extends Component {

    eventCalendar = new EventCalendar()

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
            selectLocation: this.props.navigation.getParam("location","TA"),

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

            havePermission: false

        }
        console.log("setNewPicker index ==>  SharedPreference.COMPANY_LOCATION  ")

        this.LocaleConfig()
        this.onPressCalendar = this.onPressCalendar.bind(this)
        this.getYearSelect()
        this.setNewPicker()
    }

    setNewPicker() {

        // console.log(" SharedPreference.COMPANY_LOCATION  : " + SharedPreference.COMPANY_LOCATION)
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

    componentDidMount() {
        this.getYearSelect()
        // if (this.state.connectWithServer == true) {
        //     if (this.state.selectYear == '') {
        //         this.loadDataFromAPI(this.state.today.getFullYear(), this.state.selectLocation)
        //     } else {
        //         this.loadDataFromAPI(this.state.selectYear, this.state.selectLocation)
        //     }
        // } else {
        //     this.getLocalYearView("2018")
        // }
        //TODO Bell
        this.getYearView(this.state.selectYear, this.state.dataResponse)

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

        let data = await RestAPI(SharedPreference.CALENDER_YEAR_API + year + '&location=' + location)
        code = data[0]
        data = data[1]

        console.log("calendarCallback1111 : ", data.code)
        // this.props.navigation.navigate('calendarYearView', {
        //     dataResponse: data,
        //     selectYear: new Date().getFullYear()
        // });

        if (code.SUCCESS == data.code) {
            console.log("11111111")
            this.getYearView(this.state.selectYear, data)
        } else {
            console.log("2222222")
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

    getYearView = async (year, calendarEventData) =>  {

        console.log("getYearView : year ==> ", year)
        console.log("getYearView : calendarEventData ==> ", calendarEventData)

        let monthYear = 12
        const original = [];

        if (calendarEventData.code == 200) {
            for (let index = 0; index < monthYear; index++) {
                let object = this.getMonthEvent((index + 1), calendarEventData)
                original[index] = object
            }
        }
        showLocation = await this.getFullLocation(this.state.selectLocation)

        this.setState({
            yearObject: original,
            showYear: year,
            isLoading: false,
            calendarEventData: calendarEventData,
            showLocation: showLocation
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

        monthView = []
        monthView1 = []
        monthView2 = []
        monthView3 = []
        monthView4 = []
        month = 12 //month count

        for (let f = 0; f < month; f++) {
            let selectMonth = (f + 1)
            let monthText = this.state.showYear + '-' + selectMonth + '-01'
            if (selectMonth < 10) {
                monthText = this.state.showYear + '-0' + selectMonth + '-01'
            }
            //////////console.log("monthText : ", monthText)

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
                            ////console.log("selectedDateMonth =====> : ", selectedDateMonth)
                            let checkSpecialHoliday = this.checkSpecialHoliday(selectedDateMonth);
                            ////console.log("checkSpecialHoliday =====> ", checkSpecialHoliday)
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
        // }
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
        console.log("onPressSelectLocation location : ", locationFull)
        console.log("onPressSelectLocation locationS : ", locationShort)

        this.setState({
            selectLocation: locationShort
        })
    }

    getShortLocation = async (fullLocation) => {
        array = this.state.locationPicker
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            console.log("fullLocation fullLocation : ", fullLocation)
            console.log("fullLocation element label : ", element.label)
            if (fullLocation == element.label) {
                return element.value
            }
        }
        return
    }

    getFullLocation = async (shortLocation) => {
        array = this.state.locationPicker
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            console.log("shortLocation shortLocation : ", shortLocation)
            console.log("shortLocation element label : ", element.label)
            if (shortLocation == element.value) {
                return element.label
            }
        }
        return
    }

    getLocation = async () => {
        let location = await this.getFullLocation(this.state.selectLocation)
        console.log("getLocation ==> location : ", location)
        this.setState({
            locationPickerView: false,
            showLocation: location
        })

        this.resetCalendar()
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
                                            this.setState({
                                                yearPickerForDownloadPDFFileView: false,
                                                isLoading: true
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
                                                isLoading: true
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
                                            location = this.getFullLocation(this.state.selectLocation)
                                            this.setState({
                                                locationPickerView: false,
                                                showLocation: location
                                            })
                                            // this.resetCalendar()
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

    onloadPDFFile() {

        //console.log("onloadPDFFile")
        if (this.state.selectYear == "") {
            return
        }

        let url = SharedPreference.HOST_API + '/api/v1/calendar/file?year=' + this.state.selectYear + "&company=TA"
        // //console.log("url : ", url)

        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {


                if (responseJson.status == 200) {
                    //console.log("responseJson filename : ", responseJson.data[0].filename)
                    //console.log("responseJson : ", responseJson.data[0].link)
                    //console.log("responseJson : ", responseJson.data[0].filename)

                    if (responseJson.data[0].filename == null || responseJson.data[0].filename == 'undefined') {
                        //console.log("responseJson filename  null")
                        this.onLoadAlertDialog()
                    } else {

                        let pdfPath = responseJson.data[0].link
                        let filename = responseJson.data[0].filename

                        //console.log("responseJson filename  pdfPath : ", pdfPath, " , filename : ", filename)
                        this.loadPdfFile(pdfPath, filename)
                    }

                } else {
                    //console.log("state : ", responseJson.state)

                }
                // return responseJson
            })
            .catch((error) => {
                this.onLoadAlertDialog()
            });

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

    loadPdfFile(pdfPath, filename) {

        if (Platform.OS === 'android') {
            //console.log("Platform.OS : android havePermission : ", this.state.havePermission);
            //console.log("Platform.OS : DownloadDir : ", RNFetchBlob.fs.dirs.DownloadDir + file);

            if (this.state.havePermission) {
                RNFetchBlob
                    .config({
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: false,
                            path: RNFetchBlob.fs.dirs.DownloadDir + file,
                            mime: 'application/pdf;base64',
                            title: 'appTitle',
                            description: 'shippingForm'
                        }
                    })
                    .fetch('GET', url, {
                        'Content-Type': 'application/pdf;base64'
                    })
                    .then((resp) => {
                        // //console.log("resp : ", resp)
                        RNFetchBlob.android.actionViewIntent(resp.data, 'application/pdf')
                    })
                    .catch((errorCode, errorMessage) => {
                        // console.error({ error: errorCode, message: errorMessage })
                    })
            } else {
                // //console.log('noWritePermission')
                this.requestPDFPermission()
            }
        } else {
            // //console.log("downloadDelivery ==> RNFetchBlob ")
            let dirs = RNFetchBlob.fs.dirs
            RNFetchBlob
                .config({
                    path: dirs.DocumentDir + '/path-to-file.anything'
                })
                .fetch('GET', url, {
                })
                .then((res) => {
                    // //console.log('The file saved to ', res.path())
                })
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
        console.log("addEventOnCalendar")

        await this.eventCalendar._deleteEventCalendar()
        console.log("deleteEventCalendar")

        // await this.eventCalendar._removeEventCalendar()
        console.log("removeEventCalendar")

        this.setState({
            isLoading: true
        })


        //console.log("this.state.calendarEventData : ", this.state.calendarEventData)

        let holidayArray = this.state.calendarEventData.data.holidays;
        console.log("this.state.calendarEventData : ", holidayArray.length)

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
                                //////////console.log("yearPickerForDownloadPDFFileView");
                                this.setState({
                                    yearPickerForDownloadPDFFileView: true
                                })
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
            </View>
        );
    }
}


