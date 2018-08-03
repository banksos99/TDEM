import React, { Component } from 'react';


import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    ListView,
    Image, Picker,
    Platform,
    ActivityIndicator,
    Alert,
    BackHandler
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"
// import AnnounceTable from "../../components/TableviewCell"
import BarChartCompare from "./BarChartCompare";
import BarChartIndiv from "./BarChartIndividual";
import SharedPreference from "./../SharedObject/SharedPreference"
import RestAPI from "../constants/RestAPI"
import firebase from 'react-native-firebase';

let MONTH_LIST = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let monthstr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class OTSummaryBarChart extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

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
            tdataSource: {},
            initialyear: 0,
            initialmonth: 0,

            dateselected: 0,
            org_name: this.props.navigation.getParam("org_name", ""),
            org_code: this.props.navigation.getParam("org_code", "")

        }

        this.checkDataFormat(this.props.navigation.getParam("DataResponse", ""));
        firebase.analytics().setCurrentScreen(SharedPreference.FUNCTIONID_OT_SUMMARY)

    }

    checkDataFormat(DataResponse) {

        if (DataResponse) {

            let today = new Date();
            date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
            this.state.initialyear = today.getFullYear();
            this.state.initialmonth = parseInt(today.getMonth() - 1);
            this.state.announcementTypetext = MONTH_LIST[this.state.initialmonth + 1] + ' ' + this.state.initialyear;
            for (let i = this.state.initialmonth + 13; i > this.state.initialmonth; i--) {

                if (i === 11) {

                    this.state.initialyear--;
                }
                this.state.months.push(MONTH_LIST[i % 12] + ' ' + this.state.initialyear)
            }

            this.state.tdataSource = DataResponse;


        }
        initannouncementType = this.state.months[0]
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
 
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
 
    handleBackButtonClick() {
        this.onBack()
        return true;
    }
 

    _onRefresh() {
        if (this.state.refreshing) {
            return;
        }

        //console.log('refreshing');

        this.setState({ refreshing: true, page: 1 });
        let promise = this._fetchMore(1);
        if (!promise) {
            return;
        }

        promise.then(() => this.setState({ refreshing: false }));
    }

    _fetchMore(page) {
        if (this.state.fetching) {
            return;
        }

        this.setState({ fetching: true });

        let promise = this._generateRows(page);

        promise.then((rows) => {
            var data;
            if (this.state.refreshing) {
                data = rows;
            } else {
                data = [...this.state.data, ...rows];
            }

            this.setState({
                page: page + 1,
                dataSource: this.state.dataSource.cloneWithRows(data),
                data: data,
                fetching: false
            });
        });

        return promise;
    }

    onOrgStruct(item, index) {

        console.log('item :', item)

        console.log('load empinfo  :', item.emp_id)
        this.setState({

            isscreenloading: true,
            loadingtype: 3,

        }, function () {

            this.loadOTBarChartfromAPI()
        });

    }

    loadOTSummarySelffromAPI = async (omonth, oyear) => {
        let tmonth = omonth.toString();
        if (omonth < 10) {
            tmonth = '0' + omonth
        }
        let url = SharedPreference.OTSUMMARY_BAR_CHART + this.state.org_code + '&month=' + tmonth + '&year=' + oyear
        console.log('OT summary url  :', url)
        this.APIDetailCallback(await RestAPI(url, SharedPreference.FUNCTIONID_OT_SUMMARY), 'OTBarChartView')
    }


    APIDetailCallback(data, path) {

        code = data[0]
        data = data[1]

        if (code.SUCCESS == data.code) {

            console.log('data  :', data.data)
            this.setState({
                isscreenloading: false,
                tdataSource: data.data

            })

            // this.props.navigation.navigate(path, {
            //     DataResponse: data.data,
            //     org_name:this.state.org_name
            // });


        } else {

            this.onLoadErrorAlertDialog(data)
        }

    }


    onLoadErrorAlertDialog(error) {

        this.setState({
            isscreenloading: false,
        })
        if (this.state.isConnected) {
            Alert.alert(
                'MHF00001ACRI',
                'Cannot connect to server. Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => console.log('OK Pressed')
                }],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'MHF00002ACRI',
                'System Error (API). Please contact system administrator.',
                [{
                    text: 'OK', onPress: () => {
                        console.log("onLoadErrorAlertDialog")
                    }
                }],
                { cancelable: false }
            )
        }
        console.log("error : ", error)
    }

    _generateRows(page) {
        //console.log(`loading rows for page ${page}`);

        var rows = [];
        for (var i = 0; i < 100; i++) {
            rows.push('Hello ' + (i + ((page - 1) * 100)));
        }

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(rows);
                //console.log(`resolved for page ${page}`);
            }, 3);
        });

        return promise;
    }

    onBack() {

        this.props.navigation.navigate('OrganizationOTStruct');
    }
    select_month() {

        this.setState({

            loadingtype: 0,
            isscreenloading: true,

        }, function () {

            this.setState(this.renderloadingscreen())
        });
    }
    select_announce_all_type = () => {

        this.setState({

            // announcementType: month,
            loadingtype: 1,
            isscreenloading: true,
            // isscreenloading: false,

        }, function () {

            let tdate = initannouncementType.split(' ')
            let mdate = 0;


            for (let i = 0; i < 12; i++) {
                if (MONTH_LIST[i] === tdate[0]) {

                    mdate = i;
                }
            }
            this.setState(this.renderloadingscreen())

            this.loadOTSummarySelffromAPI(mdate + 1, tdate[1])
        });

    }
    selected_month(monthselected) {

        //console.log('monthselected : ',monthselected)
        initannouncementType = monthselected
        
        this.setState({
            announcementTypetext : monthselected,
            loadingtype: 1,
            isscreenloading: true,

        }, function () {

            let tdate = initannouncementType.split(' ')
            let mdate = 0;

            for (let i = 0; i < 12; i++) {
                if (MONTH_LIST[i] === tdate[0]) {
                    console.log('month : ', i)
                    mdate = i;
                }
            }

            this.setState(this.renderloadingscreen())

            this.loadOTSummarySelffromAPI(mdate+1,tdate[1])
    
        });

    }
    renderpickerview() {

        // if (Platform.OS === 'android') {

        //     return (
        //         <View>
        //         </View>
        //     )

        // } else 
        if (this.state.loadingtype == 0) {

            if (Platform.OS === 'android') {
                //console.log('android selectmonth')
                return (
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                        <View style={{ width: '80%', backgroundColor: 'white' }}>
                            <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                                <Text style={{ marginLeft: 20, marginTop: 10, textAlign: 'left', color: 'black', fontSize: 18, fontWeight: 'bold' }}>Select Month and Year</Text>
                            </View>
                            <ScrollView style={{ height: '40%' }}>
                                {
                                    this.state.months.map((item, index) => (
                                        <TouchableOpacity style={styles.button}
                                            onPress={() => { this.selected_month(item) }}
                                            key={index + 100}>
                                            <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                                                <Text style={{ textAlign: 'center', fontSize: 18, width: '100%', height: 30, alignItems: 'center' }}> {item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </View>
                    </View>
                )

            }
            return (
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                    <View style={{ width: '80%', backgroundColor: 'white' }}>
                        <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 20, marginTop: 10, textAlign: 'left', color: 'black', fontSize: 18, fontWeight: 'bold' }}>Select Month and Year</Text>
                        </View>
                        <Picker
                            selectedValue={this.state.announcementType}
                            onValueChange={(itemValue, itemIndex) => this.setState({
                                announcementType: itemValue,
                                announcementTypetext: this.state.months[itemIndex],
                            }, function () {

                                initannouncementType = itemValue;
                                initannouncementTypetext = itemValue;

                            })}>{
                                this.state.months.map((item, index) => (
                                    <Picker.Item label={item} value={item} key={index} />

                                ))}
                            {/* <Picker.Item label="All" value="All" />
                            <Picker.Item label="Company Announcement" value="Company Announcement" />
                            <Picker.Item label="Emergency Announcement" value="Emergency Announcement" />
                            <Picker.Item label="Event Announcement" value="Event Announcement" />
                            <Picker.Item label="General Announcement" value="General Announcement" /> */}
                        </Picker>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 50, alignItems: 'center', }}>
                            <TouchableOpacity style={styles.button} onPress={(this.select_announce_all_type)}>
                                <Text style={{ textAlign: 'center', color: Colors.redTextColor, fontSize: 18, width: 80, height: 30, alignItems: 'center' }}> OK</Text>
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
        let year = date.substring(2, 4);
        let month = parseInt(date.substring(4, 6));

        let premonth = monthstr[parseInt(this.state.tdataSource.previous_month.month - 1)] + ' - ' + this.state.tdataSource.previous_month.year.substring(2, 4);
        let curmonth = monthstr[parseInt(this.state.tdataSource.request_month.month - 1)] + ' - ' + this.state.tdataSource.request_month.year.substring(2, 4);

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }} />

                    <View style={{ flex: 3, justifyContent: 'center' }}>
                        <Text style={{ color: '#555555', fontFamily: 'Prompt-Regular' }}>Month</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: '#d77c7c', margin: 10 }} />

                    </View>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={{ color: '#555555', fontFamily: 'Prompt-Regular' }}>{premonth}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: '#f20909', margin: 10 }} />
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={{ color: '#555555', fontFamily: 'Prompt-Regular' }}>{curmonth}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }} />

                    <View style={{ flex: 3, justifyContent: 'center' }}>
                        <Text style={{ color: '#555555', fontFamily: 'Prompt-Regular' }}>Man Power</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', color: '#d77c7c', fontFamily: 'Prompt-Regular' }}>{this.state.tdataSource.previous_month.manPower}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', color: '#f20909', fontFamily: 'Prompt-Regular' }}>{this.state.tdataSource.request_month.manPower}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                    </View>
                    <View style={{ flex: 1 }}>
                    </View>
                </View>
            </View>
        );

    }


    render() {

        return (
            // this.state.dataSource.map((item, index) => (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }} >
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
                            <Text style={styles.navTitleTextTop}>Overtime Average</Text>
                        </View>
                        <View style={{ flex: 1, }}>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', }}>

                    <TouchableOpacity style={{ flex: 2, backgroundColor: Colors.calendarLocationBoxColor, margin: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        onPress={(this.select_month.bind(this))}
                    >

                        <Text style={styles.otsummarydatetext}>{this.state.announcementTypetext}</Text>

                    </TouchableOpacity>
                    <View style={{ flex: 3, backgroundColor: Colors.calendarLocationBoxColor }}>
                        {this.renderdetail()}
                    </View>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 8, backgroundColor: Colors.calendarLocationBoxColor }}>

                        <BarChartCompare
                            datalist={this.state.tdataSource}
                        />

                    </View>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 11, backgroundColor: Colors.calendarLocationBoxColor }}>

                        <BarChartIndiv
                            datalist={this.state.tdataSource}
                            org_name={this.state.org_name}
                        />

                    </View>

                </View>
                {this.renderloadingscreen()}
            </View >
            // ))
        );
    }
}