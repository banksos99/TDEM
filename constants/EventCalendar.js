import { AsyncStorage } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

import moment from 'moment'
import SharedPreference from '../SharedObject/SharedPreference';

export default class EventCalendar {

    state = {
        calendarName: SharedPreference.CALENDAR_NAME,
        cEvents: ''
    }

    _removeEventCalendar = async () => {
        await AsyncStorage.removeItem(this.state.calendarName);
    }

    _deleteEventCalendar = async () => {
        let array = await this.getEventIDFromDevice()
        console.log("DeleteEventCalendar : ", array)

        if (array != null) {
            array = JSON.parse(array)
            // console.log("DeleteEventCalendar ==> if array : ", array)
            for (let index = 0; index < array.length; index++) {
                const eventID = array[index];
                // console.log("DeleteEventCalendar ==> eventID : ", eventID)
                await RNCalendarEvents.removeEvent(eventID).then(event => {
                    console.log("deleteEventCalendar ==> Success : ", eventID);
                })
                    .catch(error => {
                        console.log("deleteEventCalendar ==> Error ");
                    });
            }
        }

        try {
            console.log("DeleteEventCalendar ==> 1 ==> ", this.state.calendarName)

            let emptyUser = []
            await AsyncStorage.setItem(this.state.calendarName, JSON.stringify(emptyUser));

            // await AsyncStorage.setItem(this.state.calendarName, JSON.stringify(value));

            console.log("DeleteEventCalendar ==> 2")

            let arrayTest = await this.getEventIDFromDevice()
            console.log("DeleteEventCalendar ==> 3 ==> ", arrayTest)

        } catch (error) {
            console.log("DeleteEventCalendar ==> error ==> ", error)

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
            // console.log("fulfilled ==> ",fulfilled)
            if (fulfilled !== 'authorized') {
                // console.log("RNCalendarEvents ==> if")
                RNCalendarEvents.authorizeEventStore().then(fulfilled => {
                    if (fulfilled === 'authorized') {
                        RNCalendarEvents.saveEvent(title, event).then(id => {
                             this.addDataToEventID(id)
                            // console.log("addEventsToCalendar ==> success ==> ID  : ", id);
                        }, error => {
                            // console.log("addEventsToCalendar ==> error ==> error  : ", error);
                        }).catch(error => {
                            // console.warn(error);
                        });
                    }
                });
            }
            else {
                console.log("RNCalendarEvents ==> else")

                RNCalendarEvents.saveEvent(title, event)
                    .then(id => {
                         this.addDataToEventID(id)
                        // console.log("addEventsToCalendar ==> ID : ", id);
                    },
                        error => {
                            // console.log("addEventsToCalendar ==> error : ", error);
                        }).catch(error => {
                            console.warn(error);
                        });
            }


        });
    }

    addDataToEventID = async (id) => {
        console.log("addDataToEventID ==> ", id)
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

    fetchData() {
        RNCalendarEvents
            .fetchAllEvents(
                '2016-01-01T00:00:00.000Z',
                '2016-12-30T23:00:00.000Z',
                events => this.setState({ cEvents: events })
            )

    }

    synchronizeCalendar = async (eventObject, location) => {
        try {
            await this._addEventsToCalendar(eventObject, location)

        } catch (e) {
            console.log("syn/chronizeCalendar  error ", e)
        }
    }
}
