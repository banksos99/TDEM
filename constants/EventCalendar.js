import { AsyncStorage } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

import moment from 'moment'
import SharedPreference from '../SharedObject/SharedPreference';
import Authorization from "../SharedObject/Authorization";

export default class EventCalendar {

    state = {
        calendarName: SharedPreference.CALENDAR_NAME,
    }

    _removeEventCalendar = async () => {
        await AsyncStorage.removeItem(this.state.calendarName);
    }

    _deleteEventCalendar = async () => {
        let array = await this.getEventIDFromDevice()
        if (array != null) {
            array = JSON.parse(array)
            for (let index = 0; index < array.length; index++) {
                const eventID = array[index];
                await RNCalendarEvents.removeEvent(eventID).then(event => {
                    //console.log("deleteEventCalendar ==> Success : ", eventID);
                })
                    .catch(error => {
                        //console.log("deleteEventCalendar ==> Error ");
                    });
            }
        }
    }
    _findEventCalendar = async () => {
        calendarEvent = await RNCalendarEvents.findCalendars()
        console.log("calendarEvent ==> findEventCalendar ==> ", calendarEvent)
    }

    _addEventsToCalendar = async (eventObject, location) => {
        console.log("AddEventsToCalendar ==> eventObject ==> ", eventObject)
        let format = 'YYYY-MM-DDTHH:mm:ss.sss'
        let momentStart = moment(eventObject.time_start).format(format);
        let momentEnd = moment(eventObject.time_end).format(format);
        let alldayBool = false

        if (eventObject.all_day == 'Y') {
            alldayBool = true
        }

        title = eventObject.title
        let event = {
            startDate: momentStart + "Z",
            endDate: momentEnd + "Z",
            location: location,
            timeZone: 'Asia/Bangkok',
            allDay: alldayBool,
            notes: eventObject.description
        }

        await RNCalendarEvents.authorizationStatus().then(fulfilled => {
            if (fulfilled !== 'authorized') {
                RNCalendarEvents.authorizeEventStore().then(fulfilled => {
                    if (fulfilled === 'authorized') {
                        RNCalendarEvents.saveEvent(title, event).then(id => {
                            this.addDataToEventID(id)
                            //console.log("addEventsToCalendar ==> success ==> ID  : ", id);
                        }, error => {
                            //console.log("addEventsToCalendar ==> error ==> error  : ", error);
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
                        //console.log("addEventsToCalendar ==> ID : ", id);
                    },
                        error => {
                            //console.log("addEventsToCalendar ==> error : ", error);
                        }).catch(error => {
                            console.warn(error);
                        });
            }
        });
    }

    addDataToEventID = async (id) => {
        try {
            const value = await this.getEventIDFromDevice()
            //console.log("addDataToEventID ==> value : ", value);
            if (value == null) {
                value = []
                value.push(id)
            } else {
                value = JSON.parse(value)
                value = [...value, id]; // --> [1,2,3,4]
            }
            ////console.log("=============================================")
            await AsyncStorage.setItem(this.state.calendarName, JSON.stringify(value));
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

    synchronizeCalendar = async (eventObject, location) => {
        try {
            await this._addEventsToCalendar(eventObject, location)
        } catch (e) {
            ////console.log("synchronizeCalendar  error ", e)
        }
    }
}
