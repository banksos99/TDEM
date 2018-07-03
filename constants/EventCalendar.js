import { AsyncStorage } from 'react-native';

import RNCalendarEvents from 'react-native-calendar-events';

import moment from 'moment'
import SharedPreference from '../SharedObject/SharedPreference';

export default class EventCalendar {

    state = {
        calendarName: SharedPreference.CALENDAR_NAME,
    }

    _removeEventCalendar = async () => {
        await AsyncStorage.removeItem(this.state.calendarName);
        const value = await AsyncStorage.getItem(this.state.calendarName);
        ////console.log("value : ", value)
    }

    _deleteEventCalendar = async () => {
        //console.log("deleteEventCalendar ");
        let array = await this.getEventIDFromDevice()
        //console.log("deleteEventCalendar : array1 ==> ", array);

        if (array != null) {
            array = JSON.parse(array)
            //console.log("deleteEventCalendar : array2 ==> ", array);
            //console.log("deleteEventCalendar != array ");
            for (let index = 0; index < array.length; index++) {
                const eventID = array[index];
                await RNCalendarEvents.removeEvent(eventID).then(event => {
                    //console.log("deleteEvent Success : ", event);
                })
                    .catch(error => {
                        //console.log("deleteEvent Error ");
                    });
            }
        }


    }

    _askForCalendarPermissions = async () => {
    }


    _addEventsToCalendar = async (eventObject, location) => {

        let format = 'YYYY-MM-DDTHH:mm:ss.sss'
        // 2018-06-23T12:00:00.000Z
        let momentStart = moment(eventObject.time_start).format(format);
        let momentEnd = moment(eventObject.time_end).format(format);

        let alldayBool = false

        ////console.log("momentStart : ", momentStart, " , momentEnd : ", momentEnd);

        if (eventObject.all_day == 'Y') {
            alldayBool = true
        }

        // let title = eventObject.title
        // let event = {
        //     location: location,
        //     startDate: momentStart + "Z",
        //     endDate: momentEnd + "Z",
        //     timeZone: 'Asia/Bangkok',
        //     notes: eventObject.description,
        //     allDay: alldayBool
        // }


        title = eventObject.title

        let event = {
            startDate: momentStart + "Z",
            endDate: momentEnd + "Z",
            location: location,
            timeZone: 'Asia/Bangkok',
            allDay: alldayBool
        }


        //console.log("_addEventsToCalendar ==> title : ", title);
        //console.log("_addEventsToCalendar ==> location : ", event.location);
        //console.log("_addEventsToCalendar ==> startDate : ", event.startDate);
        //console.log("_addEventsToCalendar ==> endDate : ", event.endDate);
        //console.log("_addEventsToCalendar ==> notes : ", event.notes);

        await RNCalendarEvents.authorizationStatus().then(fulfilled => {
            if (fulfilled !== 'authorized') {
                RNCalendarEvents.authorizeEventStore().then(fulfilled => {
                    if (fulfilled === 'authorized') {
                        RNCalendarEvents.saveEvent(title, event).then(id => {
                            this.addDataToEventID(id)
                            //console.log("success ========> ID  : ", id);
                        },
                            error => {
                                //console.log("error ========> error  : ", error);
                            }).catch(error => {
                                console.warn(error);
                            });
                    }
                });
            }
            else {
                RNCalendarEvents.saveEvent(title, event)
                    .then(id => {
                        this.addDataToEventID(id)
                        //console.log("success ========> ID : ", id);
                    },
                        error => {
                            //console.log("error ========> error  : ", error);
                        }).catch(error => {
                            console.warn(error);
                        });
            }
        });
    }

    addDataToEventID = async (id) => {
        try {
            const value = await this.getEventIDFromDevice()
            ////console.log("getItem : ", value)
            if (value == null) {
                ////console.log("getItem : null")
                value = []
                value.push(id)
            } else {
                ////console.log("getItem : unnull")
                value = JSON.parse(value)
                value = [...value, id]; // --> [1,2,3,4]
            }
            ////console.log("getItem value : ", value)
            ////console.log("=============================================")

            let save = await AsyncStorage.setItem(this.state.calendarName, JSON.stringify(value));
            ////console.log("addData Success ============================================= : ", save)

        } catch (error) {
            ////console.log("addData Fail ============================================= : " + error);
        }
    }

    getEventIDFromDevice = async () => {
        return await AsyncStorage.getItem(this.state.calendarName);
    }

    setEventIDFromDevice(eventArray) {
        return AsyncStorage.setItem(this.state.calendarName, JSON.stringify(eventArray))
            .then(json => console.log('success!'))
            .catch(error => console.log('error!'));
    }


    deleteAllCalendarId = async (calendars) => {
        ////console.log("deleteAllCalendarId")
    }


    synchronizeCalendar = async (eventObject, location) => {
        // let calendars = await this._findCalendars()
        try {
            await this._addEventsToCalendar(eventObject, location)
            ////console.log("synchronizeCalendar =============>  success  ==> status ")
        } catch (e) {
            ////console.log("synchronizeCalendar  erroe ", e)
        }
    }
}
