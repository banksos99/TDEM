import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { styles } from "./../SharedObject/MainStyles"
import Colors from "./../SharedObject/Colors"
import moment from 'moment'
const _format = 'ddd, D MMM hh:mm A'
const _formatAllday = 'ddd, D MMM'


export default class calendarMonthView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.navigation.getParam("type", ""),
            eventObject: this.props.navigation.getParam("eventObject", ""),
            monthObject: this.props.navigation.getParam("monthObject", ""),
            monthText: this.props.navigation.getParam("monthText", ""),
            dateTime: this.props.navigation.getParam("dateTime", ""),
            date: this.props.navigation.getParam("date", ""),
            dataResponse: this.props.navigation.getParam("dataResponse", ""),
            location: this.props.navigation.getParam("location", ""),
        }

    }

    onBackPrevious() {
        console.log("calendarMonthView dataResponse : ", this.state.dataResponse)
        this.props.navigation.navigate('calendarMonthView',
            {
                month: this.state.monthText,
                monthObject: this.state.monthObject,
                dataResponse: this.state.dataResponse,
                location : this.state.location
            });
    }

    getAllday() {
        let eventObject = this.state.eventObject

        if (eventObject[0].all_day == 'N') {
            return (<View style={styles.calendarEventContainer}>
                <View style={styles.calendarEventViewContainer}>
                    <View style={{ width: '50%', paddingLeft: 10 }}>
                        <Text style={styles.calendarEventTimeText}>Start</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.calendarEventTimeDetialText}>{moment(eventObject[0].time_start).format(_format)}</Text>
                    </View>
                </View>
                <View style={styles.calendarEventViewContainer}>
                    <View style={{ width: '50%', paddingLeft: 10 }}>
                        <Text style={styles.calendarEventTimeText}>End</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.calendarEventTimeDetialText}>{moment(eventObject[0].time_end).format(_format)}
                        </Text>
                    </View>
                </View>
            </View>)
        } else {
            return (<View style={styles.calendarEventContainer}>
                <View style={styles.calendarEventViewContainer}>
                    <View style={{ width: '70%' }}>
                        <Text style={styles.calendarEventTimeText}>All Day</Text>
                    </View>
                    <View style={{ width: '30%', marginRight: 10 }}>
                        <Text style={styles.calendarEventTimeAlldayDetialText}>{moment(this.state.date).format(_formatAllday)}</Text>
                    </View>
                </View>
            </View>)
        }
    }

    render() {

        let eventObject = this.state.eventObject
        if (eventObject == 'undefined' || eventObject == null) {
            return (<View style={styles.calendarEventItemLeftView}>
                <Text >No Data</Text>
            </View>)
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.navContainer}>
                        <TouchableOpacity style={styles.navLeftContainer} onPress={(this.onBackPrevious.bind(this))}>
                            <Image
                                style={styles.navBackButton}
                                source={require('../resource/images/Back.png')}
                            />
                        </TouchableOpacity>
                        <Text style={styles.navTitleText}>Event Detail</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <View style={styles.calendarEventDetailView}>
                            <Image
                                style={styles.calendarEventDetailIcon}
                                source={require('../resource/images/calendar/calendar_event.png')}
                            />
                            <Text style={styles.calendarEventHeaderText}>{eventObject[0].title}</Text>
                        </View>
                        <View style={styles.calendarEventDetailView}>
                            <Image
                                style={styles.calendarEventDetailIcon}
                                source={require('../resource/images/calendar/calendar_sticky-note.png')}
                            />
                            <Text style={[styles.calendarEventText, { color: Colors.lightGrayTextColor }]}>
                                {eventObject[0].description}
                            </Text>
                        </View>

                        <View style={styles.calendarEventDetailView}>
                            <Image
                                style={styles.calendarEventDetailIcon}
                                source={require('../resource/images/calendar/calendar_clock.png')}
                            />
                            {this.getAllday()}
                        </View>
                        <View style={styles.calendarEventDetailView}>
                            <Image
                                style={styles.calendarEventDetailIcon}
                                source={require('../resource/images/calendar/calendar_location.png')}
                            />
                            <Text style={[styles.calendarEventHeaderText, { color: 'black' }]}>Bang Bo</Text>

                        </View>
                    </View>
                </View>
            );
        }
    }
}